const express=require("express");
const clc=require("cli-color");
require("dotenv").config();
const session=require('express-session');
const mongoDbSession=require('connect-mongodb-session')(session);


//file-exports
const Db=require('./Db');
const Authrouter = require("./Controllers/AuthController");
const Blogrouter = require("./Controllers/BlogController");
const { isAuth } = require("./Middlewares/authMidddleware");
const FollowRouter = require("./Controllers/FollowController");


const server=express(); 
const PORT=process.env.PORT;

//middle-wares
server.use(express.json());
const store=new mongoDbSession({
    uri:process.env.MONGO_URI,
    collection:'sessions',
})
server.use(
    session({
        secret:process.env.SECRET_KEY,
        resave:false,
        saveUninitialized:false,
        store:store,
    })
)

//routes
server.get("/",(req,res)=>{
   return res.send({
        status:200,
        message:"welcome"
    })
})

server.use("/auth",Authrouter);
server.use("/blog",isAuth,Blogrouter);
server.use("/follow",isAuth,FollowRouter);

server.listen(8000,(req,res)=>{
    console.log(clc.yellow.underline(`server is running on ${PORT}`));
})