const {rateLimit}=require('express-rate-limit');

const urlRateLimit=rateLimit({

    windowMs: 60*1000, //1 min
    limit: 10,
    standardHeaders:true,
    legacyHeaders:false,

    message:{
        success:false,
        message:"URL generation rate limit exceeded! Try after 1 min!"
    }
});


module.exports={
    urlRateLimit
}