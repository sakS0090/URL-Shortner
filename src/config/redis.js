const {createClient}=require('redis');
require('dotenv').config();



const redisClient=createClient({
    url:process.env.REDIS_URL
});

//adding event listeners, as the client initiates handshake with the docker container and fires connect/error events, listens to runtime errors
redisClient.on('error',(err)=>{
    console.log("ERR Connecting to redis :", err);
})

redisClient.on('connect',()=>{
    console.log("Redis connected successfully");
})

async function redisConnect(){
    await redisClient.connect();
}

module.exports={
   redisConnect,
   redisClient
}