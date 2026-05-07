const mongoose = require("mongoose")

const connectDb = async(url) =>{
    try{
       
        await mongoose.connect(url)
        console.log("mongodb connected successfulluy")
    }catch(err){
        console.log("mongo db connect krne me error agya", err.message)
    }
}

module.exports = connectDb;