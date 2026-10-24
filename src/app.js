const express=require('express');
const mongoose=require('mongoose');
const {redisClient}=require('./config/redis');
const{url}=require('./models/url');
const {encodingToString}=require('./utils/encoding');
const{Counter}=require('./models/counter');
const {urlRateLimit}=require('./middlewares/rateLimiter');

require('dotenv').config('');

const app=express();

app.use(express.json());

app.post('/api/genShortURL',urlRateLimit, async (req,res)=>{
    try{
        
            const originalUrl=req.body.originalURL;

            if(!originalUrl)
            {
                res.status(400).json({
                    success:false,
                    message:"URL is required"
                })
            }

        const counter = await Counter.findByIdAndUpdate(
            { _id: 'url_counter' },         // Unique identifier for our URL sequence tracker
            { $inc: { seq: 1 } },          // Atomically increments seq by 1
            { new: true, upsert: true }    // Returns updated doc; creates it if it doesn't exist
        );
            
        let nextNum=counter.seq;

        let shortcode=encodingToString(nextNum);

        let newUrlEntry=new url({
            numId:nextNum,
            shortCode:shortcode,
            originalURL:originalUrl
        });

       await newUrlEntry.save();

       return res.status(200).json({
        status:'success',
        numId: nextNum,
        shortCode: shortcode,
        shortUrl: `http://localhost:5000/${shortcode}`

       })

    }

    catch(err){
        console.log("error",err);

        return res.status(500).json({
            status:'failure',
            message:'Internal Server Error'
        });
    }
});

app.get("/:shortcode", async (req, res) => {
  try {
    const { shortcode } = req.params;

    const cachedUrl = await redisClient.get(`url:${shortcode}`);
    console.log('Cached URL from Redis',cachedUrl);

    if (cachedUrl) {
      console.log("Cache Hit");
      return res.redirect(cachedUrl);
    }

    console.log("Cache Miss, querying from DB");

    const orgUrl = await url.findOne({ shortCode: shortcode });
    console.log('original url from db',orgUrl);

    if (!orgUrl) {
      return res.status(404).json({ status: false, message: "URL not found" });
    }

    await redisClient.set(`url:${shortcode}`, orgUrl.originalURL, { EX: 3600 });

    return res.redirect(orgUrl.originalURL);
  } catch (err) {
    console.error("Error during redirection:", err);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
});



module.exports={
    app
}