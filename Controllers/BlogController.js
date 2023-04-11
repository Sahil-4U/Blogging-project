const express = require('express');
const { BlogDataValidate } = require('../Utils/BlogUtils');
const User = require('../Modles/Usermodel');
const Blogs = require('../Modles/Blogmodel');
const Blogrouter = express.Router();

//here i am creating blogs 
Blogrouter.post('/create-blog', async (req, res) => {
    // console.log(req.session);
    const { title, textBody } = req.body;
    const userId = req.session.user.userId;
    const creationDateTime = new Date();

    //data validate
    try {
        //here i validate the data is correct or not:-
        await BlogDataValidate({ title, textBody, userId });
        await User.verifyUserId({ userId });

        //here i am creating a new schema for creation blogs:-
        const blogObj = new Blogs({ title, textBody, creationDateTime, userId });
        try {
            const blogsdb = await blogObj.creatBlog();
            console.log(blogsdb);
            return res.send({
                status: 201,
                message: "Blog is created on db",
                data: blogsdb
            })
        } catch (error) {
            console.log(error);
            return res.send({
                status: 500,
                message: "error with blog creation in db",
                error: error,
            })
        }
    } catch (error) {
        console.log(error);
        return res.send({
            status: 400,
            error: error,
        })
    }

})

//here i am reading all the blogs which is in database
Blogrouter.get("/get-blogs", async (req, res) => {
    const skip = req.query.skip || 0;
    try {
        const blogDb = await Blogs.getBlogs({ skip });
        return res.send({
            status: 200,
            message: "Read Successfull",
            data: blogDb
        })
    } catch (error) {
        return res.send({
            status: 501,
            message: "read unsuccessful Database error",
            error: error
        })

    }
})

//here i am creating myblogs to read the specific user blogs
Blogrouter.get('/my-blogs', async (req, res) => {
    const skip = req.query.skip || 0;
    const userId = req.session.user.userId;

    try {
        const myblogsDb = await Blogs.myblogs({ skip, userId })
        console.log(myblogsDb);
        return res.send({
            status: 200,
            message: "Read Successfull",
            data: myblogsDb
        })
    } catch (error) {
        console.log(error);
        return res.send({
            status: 501,
            message: "read unsuccessful Database error",
            error: error
        })
    }
})

//here i am creating route for edit a users blog
Blogrouter.post("/edit-blogs", async (req, res) => {
    const { title, textBody } = req.body.data;
    const blogId = req.body.blogId;
    const userId = req.session.user.userId;
    //data validate

    try {
        const blogObj = new Blogs({ title, textBody, blogId, userId });
        const blogDb = await blogObj.getBlogDataFromId();

        //compare the owner and user making the request is same or not
        if (!blogDb.userId.equals(userId)) {
            return res.send({
                status: 404,
                message: "Not allow to edit, authorization failed",
            })
        }
        //compare the time with in 30minutes
        const creationDateTime = new Date(blogDb.creationDateTime).getTime();
        const currentDateTime = Date.now();

        const diff = ((currentDateTime - creationDateTime) / (1000 * 60));
        if (diff > 30) {
            return res.send({
                status: 404,
                message: "Not allow to edit, after 30 minutes of creation",
            })
        }
        //if time is less from 30 minutes we can edit-blog
        const oldDataDb=await blogObj.updatelBlog();

        return res.send({
            status:200,
            message:"Update Successfully",
            data:oldDataDb
        });
    }
    catch (error) {
        console.log(error);
        return res.send({
            status: 500,
            message: "error with blog creation in db",
            error: error,
        })
    };
})

//here i am deleting the blogs with the help of blogId and userId;
Blogrouter.post("/delete-blogs",async(req,res)=>{
    const blogId=req.body.blogId;
    const userId=req.session.user.userId;

    try{
        const blogObj = new Blogs({  blogId, userId });
        const blogDb = await blogObj.getBlogDataFromId();

         //compare the owner and user making the request is same or not
         if (!blogDb.userId.equals(userId)) {
            return res.send({
                status: 404,
                message: "Not allow to delete authorization failed",
            })
        }
        const oldDataDb=await blogObj.deleteBlog();
        return res.send({
            status:200,
            message:"Delete Successfully",
            data:oldDataDb
        });
    }catch(error){
        console.log(error);
        return res.send({
            status: 500,
            error: error
        })
    }
})

module.exports = Blogrouter;