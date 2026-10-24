const mongoose=require('mongoose');
require('dotenv').config();


async function makeConn(){
    
    const connUrl=process.env.MONGO_URL;
    await mongoose.connect(connUrl);

}

module.exports={
    makeConn
}