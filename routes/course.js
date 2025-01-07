const { Router } = require("express");
const { userMiddleware } = require("../middleware/user");
const { purchaseModel, courseModel } = require("../db");
const { date } = require("zod");
const courseRouter = Router();

courseRouter.post("/purchase", userMiddleware, async function(req, res) {
   try {
     const userId = req.userId;
     const courseId = req.body.courseId;

     if (!userId && !courseId ) {
        return res.status(400).json({message:"User ID and Course ID are required."})
     }
     const course = await courseModel.findById(courseId)
     if (!course) {
        return res.status(404).json({ message: "Course not found." });
    }

    const existingPurchase = await purchaseModel.findOne({userId , courseId})
    if (existingPurchase) {
        return res.status(400).json({ message: "You have already purchased this course." });
    }


     await purchaseModel.create({
         userId,
         courseId,
         prcahaseAt:new date()
     })

     return res.status(200).json({
        message: "You have successfully bought the course."
    });

   } catch (error) {
    console.error('Error during purchase:', error);
        return res.status(500).json({
            message: "An error occurred while processing your purchase.",
            error: error.message
        });
   }
})



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