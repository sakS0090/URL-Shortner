const mongoose=require('mongoose');

const UrlSchema=new mongoose.Schema({

numId:{
    type:Number,
    required:true,
    unique:true
},

shortCode:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    index:true
},

originalURL:{
    type:String,
    required:true,
    trim:true
},

userID:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
},

createdAt:{
    type:Date,
    default:Date.now,
    expires: 2592000 //to auto delete old URL in 30 days
}

});


const url=mongoose.model('url',UrlSchema);

module.exports={
    url
}