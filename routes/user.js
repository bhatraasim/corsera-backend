const { Router } = require("express");
const userRouter = Router()
const {userModel, purchaserModel, courseModel} = require("../db")

const jwt = require("jsonwebtoken")
const {JWT_USER_PASSWORD} = require("../config");
const { userMiddleware } = require("../middleware/user");


userRouter.post('/signup', async (req, res) => {
    const {email,password,firstName,lastName} = req.body //adding zod validation
    //ading the jsonwebtoken
 
    //put inside a try catch block
    await userModel.create({
        email,
        password,
        firstName,
        lastName

    })
    res.json({
        message:"you are signed up"
    })
})


userRouter.post('/signin', async (req, res) => {
    const {email,password} = req.body

    //here use the bycrpt library to hash the password that will be stored in the db.
    const user = await userModel.findOne({
        email:email,
        password:password
    })
    if(user){
        const token = jwt.sign({
            id:user._id,
        },JWT_USER_PASSWORD)

        res.json({
            token:token
        })
    }else{
        res.status(403).json({
            message:"inncorect creds"
        })
    }
    
})


userRouter.get('/pucharses',userMiddleware, async  (req, res) => {
    const userId = req.userId
    const purchases = await courseModel.findOne({
        userId
    })

    const courseData =  await courseMode.find({
        _id :{$in :purchases.map(x=>x.courseId)}
    })
    res.json({
        purchases,
        courseData
    })
})

module.exports = {
    userRouter:userRouter
}