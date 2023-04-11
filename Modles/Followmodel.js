const FollowSchema = require("../Schemas/FollowSchema");
const { BLOGLIMIT } = require("../privatevariables");

const ObjectId=require('mongodb').ObjectId;

const followUser=({followerUserId,followingUserId})=>{
    return new Promise(async(resolve,reject)=>{
        try {
           const folloExistDb=await FollowSchema.findOne({
                followerUserId,
                followingUserId
            })
            //agar follower or following dono ki userId milti h to hum yhi se return kr denge eska matlb h ki vo
            //phle hi follow krta h else hum ek new entry create kr denge
            if(folloExistDb){
                return reject('user already following...');
            }
            //else case yha hum new entry create kr rhe h 
            const follow=new FollowSchema({
                followerUserId,
                followingUserId,
                creationDateTime:new Date(),
            })

            const followDb=await follow.save();
            resolve(followDb);

        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}

const followingUserList=({followerUserId,skip})=>{
    return new Promise(async (resolve,reject)=>{
        //match
        //sort
        //paginate
       try {
        const followingList=await FollowSchema.aggregate([
            {
                $match:{followerUserId :new ObjectId(followerUserId)}
            },
            {
                $sort:{creationDateTime:-1} //-1 ka matlb jo sbse latest create hua h vo phle aayega
            },
            {
                $facet:{
                    data:[{$skip:Number(skip)},{$limit:BLOGLIMIT}],
                },
            },
        ]);
        console.log(followingList[0].data);
        resolve(followingList[0].data);
       } catch (error) {
        reject(error);
       }
    })
}

module.exports={followUser,followingUserList};