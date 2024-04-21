const mongoose = require("mongoose");
const URL = "mongodb+srv://danielgao6205:hotdog123@studentgradingportal.c5kwj86.mongodb.net/?retryWrites=true&w=majority&appName=studentGradingPortal";

const connectDB = async() =>{
    await mongoose.connect(URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    console.log("Database sucessfully connected");
}

module.exports = connectDB;