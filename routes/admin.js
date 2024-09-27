const { Router } = require("express");
const adminRouter = Router()
const {adminModel, courseModel} = require("../db")
const jwt = require("jsonwebtoken")
const {JWT_ADMIN_PASSWORD} = require("../config");
const { adminMiddleware } = require("../middleware/admin");


adminRouter.post('/signup', async (req, res) => {
    const {email,password,firstName,lastName} = req.body //adding zod validation
    //ading the jsonwebtoken
 
    //put inside a try catch block
    await adminModel.create({
        email,
        password,
        firstName,
        lastName
    })
    res.json({
        message:"you are signed up"
    })
})


adminRouter.post('/signin', async (req, res) => {
    const {email,password} = req.body

    //here use the bycrpt library to hash the password that will be stored in the db.
    const admin = await adminModel.findOne({
        email:email,
        password:password
    })
    if(admin){
        const token = jwt.sign({
            id:admin._id,
        },JWT_ADMIN_PASSWORD)

        res.json({
            token:token
        })
    }else{
        res.status(403).json({
            message:"inncorect creds"
        })
    }
})


adminRouter.post('/course',adminMiddleware, async (req, res) => {
    const adminId = req.userId

    const {tittle,discription,imageUrl,price} = req.body

    const course = await courseModel.create({
        tittle: tittle, 
        discription: discription, 
        imageUrl: imageUrl, 
        price: price, 
        creatorId: adminId
    })

    res.json({
        message:"course created",
        courseId : course._id
    })

})

adminRouter.put('/course',adminMiddleware, async (req, res) => {

    const adminId = req.userId

    const {tittle,discription,imageUrl,price,courseId
    } = req.body

    const course = await courseModel.updateOne({
        _id:courseId,
        creatorId :adminId
    },
        {
        tittle: tittle, 
        discription: discription, 
        imageUrl: imageUrl, 
        price: price
       
    })

    res.json({
        message:"course updated",
        course:course._id
    })
})

adminRouter.get('/course/bulk',adminMiddleware, async (req,res) =>{
    const adminId = req.userId;
    const course = await courseModel.findOne({
        creatorId:adminId})

    res.json({
        message:"course updated",
        course
    })
})


module.exports = {
    adminRouter:adminRouter
}