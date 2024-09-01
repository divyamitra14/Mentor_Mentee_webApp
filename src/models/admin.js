const mongoose=require("mongoose")
const adminID =  mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
const adminLogin = new mongoose.model("adminuser",adminID)
module.exports=adminLogin

