   const UserSchema=require('../Schemas/UserSchema');
   const bcrypt=require('bcrypt');
   const ObjectId=require('mongodb').ObjectId;
   const User=class{
        username;
        name;
        email;
        password;

        constructor({username,email,name,password}){
            this.email=email;
            this.name=name;
            this.password=password;
            this.username=username;
        }

        static verifyUserId({userId}){
            return new Promise(async (res,rej)=>{
                if(!ObjectId.isValid((userId))) rej("Invalid userId format");
                
              try {
               const userdb= await UserSchema.findOne({_id:userId});
               if(!userdb){
                rej(`No user found correspond to this userId ${userId}`);
               }
               console.log(userdb);
               res(userdb);
              } catch (error) {
                rej(error);
              }
            })
        }

        registerUser(){
            return new Promise(async (res,rej)=>{
                const hashedPassword=await bcrypt.hash(this.password,Number(process.env.SALT));
                const user=new UserSchema({
                    username:this.username,
                    email:this.email,
                    password:hashedPassword,
                    name:this.name,
                })

                try{
                    const userdb=await user.save();
                    res(userdb);
                }catch(error){
                    rej(error);
                }
            })
        }
        static verifyUserNameAndEmail({email,username}){
            return new Promise(async(res,rej)=>{
                try{
                   const userdb=await UserSchema.findOne({
                        $or:[{email},{username}]
                    })

                    if(userdb && userdb.email===email){
                        rej("Email already exist");
                    }
                    if(userdb && userdb.username===username){
                        rej("Username already exist");
                    }
                    return res();
                }catch(error){
                    rej(error);
                }
            })
        }
        static loginUser({loginId,password}){
            return new Promise(async (res,rej)=>{
            try {
                
                    const userdb=await UserSchema.findOne({
                        $or:[{email:loginId},{username:loginId}]
                    })
                    if(!userdb){
                        rej('User not exist');
                    }
                    // console.log(userdb);
                    const isMatch=await bcrypt.compare(password,userdb.password);
                    if(!isMatch){
                        rej('Password is not matched');
                    }
                    res(userdb);
                
            } catch (error) {
                console.log(error);
                rej(error);
            }
        })
        }
    }

    module.exports=User;
