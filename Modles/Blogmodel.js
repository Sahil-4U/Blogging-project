const BlogSchema = require("../Schemas/BlogSchema");
const { BLOGLIMIT } = require("../privatevariables");
const ObjectId=require('mongodb').ObjectId;
const Blogs=class{
    title;
    textBody;
    userId;
    creationDateTime;
    blogId;

    constructor({title,textBody,userId,creationDateTime,blogId}){
        this.title=title;
        this.textBody=textBody;
        this.userId=userId;
        this.creationDateTime=creationDateTime;
        this.blogId=blogId;
    }

    creatBlog(){
        return new Promise(async(res,rej)=>{
            this.title.trim();
            this.textBody.trim();
            const blog=new BlogSchema({
                title:this.title,
                textBody:this.textBody,
                creationDateTime:this.creationDateTime,
                userId:this.userId
            })
            // console.log(blog);
            try {
                const blogdb=await blog.save();
                res(blogdb);
            } catch (error) {
                rej(error);
            }
        })
    }

    static getBlogs({skip}){
        return new Promise(async (res,rej)=>{
           try {
            const blogsDb=await BlogSchema.aggregate([
                {$sort:{creationDateTime:-1}},
                {
                    $facet:{
                        data:[{$skip:parseInt(skip)},{$limit:BLOGLIMIT}],
                    },
                },
            ]);
            console.log(blogsDb[0].data);
            res(blogsDb[0].data);
           } catch (error) {
            rej(error);
           }
        })
    }

    static myblogs({skip,userId}){
        //match the userId
        //sort
        //pagination
        return new Promise(async(res,rej)=>{
           try {
            const myblogsDb=await BlogSchema.aggregate([
                {
                    $match:{userId:new ObjectId(userId)}
                }, {$sort:{creationDateTime:1}},
                {
                    $facet:{
                        data:[{$skip:parseInt(skip)},{$limit:BLOGLIMIT}],
                    },
                },
            ])
            console.log(myblogsDb[0].data);
            res(myblogsDb[0].data);
           } catch (error) {
            rej(error);
           }
        })
    }

    getBlogDataFromId(){
        return new Promise(async(res,rej)=>{
            try {
                const blogDb=await BlogSchema.findOne({
                    _id:this.blogId,
                })
               if(!blogDb){
                rej('user is not found in db');
               }
                res(blogDb);
            } catch (error) {
                rej(error);
            }
            
        })
    }
    updatelBlog(){
        return new Promise(async(resolve,reject)=>{
            let newBlogData={};
           try {
            if(this.title){
                newBlogData.title=this.title;
            }
            if(this.textBody){
                newBlogData.textBody=this.textBody;
            }
            const oldData=await BlogSchema.findOneAndUpdate({_id:this.blogId},newBlogData);
            resolve(oldData);
           } catch (error) {
            reject(error);
           }
        })
    }
    deleteBlog(){
        // console.log("hlo")
        return new Promise(async(resolve,reject)=>{
            try {
                const oldData=await BlogSchema.findOneAndDelete({_id:this.blogId,});
                console.log(oldData);
                resolve(oldData);
            } catch (error) {
                reject(error);
            }
        })
    }
}
module.exports=Blogs;