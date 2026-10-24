// server.js
const {app} = require("./src/app");
const {makeConn}=require('./src/config/database');
const {redisConnect}=require('./src/config/redis');

require('dotenv').config();


async function connections(){

    try{
        console.log("Connecting to MongoDB");
       await makeConn();
        console.log("Connected to mongo");

        console.log("Connecting to Redis");
       await redisConnect();
        

        console.log("Starting app")
        app.listen(process.env.PORT,()=>{
            console.log("App started!")
        })

    }
    catch(err){
        console.error(" Error: Server failed to boot!", err);
       
    }

}

connections();
