const express=require('express');
const User = require('../Modles/Usermodel');
const {followUser, followingUserList} = require('../Modles/Followmodel');
const FollowRouter=express.Router();

FollowRouter.post("/follow-user",async (req,res)=>{
   const followerUserId=req.session.user.userId;
   const followingUserId=req.body.followingUserId;

   //validate followerUserId
   try {
    await User.verifyUserId({userId:followerUserId});
   } catch (error) {
    return res.send({
        status:400,
        message:"Invalid follower userId",
        error:error,
    })
   }
   //validate following UserId
   try {
    await User.verifyUserId({userId:followingUserId});
   } catch (error) {
    return res.send({
        status:400,
        message:"Invalid following userId",
        error:error,
    })
   }
   //create an entery in followcollection
   try {
    const followDb=await followUser({followerUserId,followingUserId});
    return res.send({
        status:201,
        message:"Entry is created on database",
        data:followDb,
    })
   } catch (error) {
    console.log(error);
    return res.send({
        status:500,
        message:"Error in creating entery at followcollection",
        error:error,
    })
   }
})

FollowRouter.post("/following-list", async (req,res)=>{
    const followerUserId=req.session.user.userId;
    const skip=req.query.skip || 0;

    //validate userId
    try {
        await User.verifyUserId({userId:followerUserId});
    } catch (error) {
        return res.send({
            status:400,
            message:"Invalid following userId",
            error:error,
        })
    }

    //here i am fatching all the followers from db
    try {
        const followingList=await followingUserList({followerUserId,skip});
        return res.send({
            status:200,
            message:"READ SUCCESSFULLY",
            data:followingList
        })
    } catch (error) {
        console.log(error);
        return res.send({
            status:500,
            message:"DATA BASE ERROR TO CONNECT WHEN FETCHING FOLLOWINGlIST",
            error:error,
        })
    }
})

module.exports=FollowRouter;