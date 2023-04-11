const express=require('express');
const { cleanUpAndValidate } = require('../Utils/AuthUtils');
const User = require('../Modles/Usermodel');
const { isAuth } = require('../Middlewares/authMidddleware');
const Authrouter=express.Router();



Authrouter.post("/register",async (req,res)=>{
    console.log(req.body);
    const {name,email,username,password}=req.body;
    await cleanUpAndValidate({name,email,username,password})
    .then(async ()=>{
        //here i check is user exist or not:-
        try {
           await User.verifyUserNameAndEmail({email,username});
        } catch (error) {
            return res.send({
                status:400,
                error:error,
            })
        }
      


       const userObj=new User({
        name,email,username,password
       });
       try{
        //here i am saving the data in db with the help of helper functions:-
        const userDb=await userObj.registerUser()
        return res.send({
            status:200,
            message:"user created successfully",
            data:userDb,
        })        
       }catch(error){
        console.log(error);
        return res.send({
            status:500,
            message:"error in database",
            error:error,
        })
       }
      
    }).catch((error)=>{
        return res.send({
            status:400,
            message:"error in cleanUPANDVALIDATE FUNCTION"+error,
        })
    })
})
Authrouter.post("/login",async(req,res)=>{
    // console.log(req.body);
    const {loginId,password}=req.body;
    if(!loginId || !password){
        return res.send({
            status:400,
            message:"Missing credentials"
        })
    }
    
    try {
        const userdb=await User.loginUser({loginId,password})
        //session base authentication:--
        req.session.isAuth=true;
        req.session.user={
            username:userdb.username,
            email:userdb.email,
            userId:userdb._id,
        }
        return res.send({
            status:200,
            message:"Login user successfully",
            data:userdb
        })
    } catch (error) {
        return res.send({
            status:400,
            error:error,
        })
    }
})
Authrouter.post("/logout",isAuth,(req,res)=>{
    const data=req.session.user;
    req.session.destroy((err)=>{
        if(err){
            return res.send({
                status:402,
                message:"logout unsuccessfull",
            })
        }
        return res.send({
            status:200,
            message:"logout successfull",
            data:data,
        })
    })
})


module.exports=Authrouter;