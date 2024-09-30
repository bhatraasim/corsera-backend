const mongoose = require("mongoose"); 
// const admin = require("./routes/admin");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
     email: {type : String , unique:true},
     password: String,
     firstName:String,
     lastName : String

})
const adminSchema = new Schema({
    email: {type : String , unique:true},
    password: String,
    firstName:String,
    lastName : String
    
})
const courseSchema = new Schema({
    tittle:String,
    description:String,
    price:String,
    imageUrl: String,
    creatorId:String
})
const purchaseSchema = new Schema({
    userId:ObjectId,
    courseId:ObjectId

})

const userModel = mongoose.model("user",userSchema)
const adminModel = mongoose.model("admin",adminSchema)
const courseModel = mongoose.model("course",courseSchema)
const purchaserModel = mongoose.model("purchase",purchaseSchema)

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaserModel
}