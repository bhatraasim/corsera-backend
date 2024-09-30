const { Router } = require("express");
const { purchaserModel, courseModel } = require("../db");
const { userMiddleware } = require("../middleware/user");
const courseRouter = Router()


courseRouter.post('/purchase',userMiddleware, async (req, res) => {
    const userId = req.userId
    const courseId = req.body.courseId

    await purchaserModel.create({
        userId,
        courseId
    })

    res.json({
        message:"You have successfully bought the course"
    })
})


courseRouter.get('/perwiev', async (req, res) => {
    const courses = await courseModel.findOne({})

    res.json({
        courses
    })
})

module.exports = {
    courseRouter:courseRouter
}