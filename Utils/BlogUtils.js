const BlogDataValidate=({title,textBody,userId})=>{
    return new Promise((res,rej)=>{
        if(!title || !textBody || !userId){
            rej('Missing credentials');
        }
        if(typeof title !== 'string' || typeof textBody !== 'string'){
            rej('Invalid Data format');
        }
        if(title.length>100){
            rej('Title length must be in the range 0 to 100');
        }
        if(textBody.length>1000){
            rej('TextBody length must be the range 0 to 1000');
        }
        res();
    })
}
module.exports={BlogDataValidate};