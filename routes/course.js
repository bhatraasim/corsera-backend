const { Router } = require("express");
const { userMiddleware } = require("../middleware/user");
const { purchaseModel, courseModel } = require("../db")
const courseRouter = Router();

courseRouter.post("/purchase", userMiddleware, async function(req, res) {
    const userId = req.userId;
    const courseId = req.body.courseId;

    // should check that the user has actually paid the price
    await purchaseModel.create({
        userId,
        courseId
    })

    res.json({
        message: "You have successfully bought the course"
    })
})

// courseRouter.get("/preview", userMiddleware, async function(req, res) {
    
//     const courses = await courseModel.find({});

//     res.json({
//         courses
//     })
// })

courseRouter.get("/preview", async function(req, res) {
    try {
        const courses = await courseModel.find()
        res.status(200).json({ courses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch purchased courses." });
    }
});


module.exports = {
    courseRouter: courseRouter
}