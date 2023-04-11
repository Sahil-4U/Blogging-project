const mongoose=require('mongoose');
const clc=require('cli-color');

mongoose.connect(process.env.MONGO_URI).then((res)=>{
    console.log(clc.white.underline('db is connected now'));
}).catch((error)=>console.log(clc.red("error in db"+error)));