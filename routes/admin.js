const { Router } = require("express");
const adminRouter = Router();
const bcrypt = require('bcrypt');
const { z } = require('zod');
const { adminModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
// brcypt, zod, jsonwebtoken
const  { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");



adminRouter.post("/signup", async function(req, res) {
    const { email, password, firstName, lastName } = req.body; // TODO: adding zod validation
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Hashed Password:", hashedPassword);
    // TODO: Put inside a try catch block
    await adminModel.create({
        email: email,
        password: hashedPassword,
        firstName: firstName, 
        lastName: lastName
    })
    
    res.json({
        message: "Signup succeeded"
    })
})

// adminRouter.post("/signin", async function(req, res) {
//     const { email, password} = req.body;
//     const passwordMatch = bcrypt.compare(password,admin.password)

//     const admin = await adminModel.findOne({
//         email: email
//     });

//     if (admin && passwordMatch) {
//         const token = jwt.sign({
//             id: admin._id
//         }, JWT_ADMIN_PASSWORD);

//         // Do cookie logic

//         res.json({
//             token: token
//         })
//     } else {
//         res.status(403).json({
//             message: "Incorrect credentials"
//         })
//     }
// })

adminRouter.post("/signin", async function (req, res) {
    try {
      const { email, password } = req.body;
  
      const admin = await adminModel.findOne({ email });
  
      if (!admin) {
        return res.status(403).json({ message: "Incorrect credentials Wrong email " });
      }
  
      const passwordMatch = await bcrypt.compare(password, admin.password);
  
      if (!passwordMatch) {
        return res.status(403).json({ message: "Incorrect credentials wrong Password " });
      }
  
      const token = jwt.sign({ id: admin._id }, JWT_ADMIN_PASSWORD);
  
      res.json({
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

// adminRouter.post("/course", adminMiddleware, async function(req, res) {
//     const adminId = req.userId;

//     const { title, description, price } = req.body;

//     // creating a web3 saas in 6 hours
//     const course = await courseModel.create({
//         title: title, 
//         description: description, 
//         // imageUrl: imageUrl, 
//         price: price, 
//         creatorId: adminId
//     })

//     res.json({
//         message: "Course created",
//         courseId: course._id
//     })
// })



// Create a new course
adminRouter.post("/course", adminMiddleware, async (req, res) => {
    try {
        // Extract adminId from middleware (set by adminMiddleware)
        const adminId = req.userId;

        // Extract data from request body
        const { title, description, imageUrl, price } = req.body;

        // Validate required fields
        if (!title || !description || !price) {
            return res.status(400).json({
                message: "Title, description, and price are required fields.",
            });
        }

        // Create a new course document in the database
        const course = await courseModel.create({
            title,
            description,
            imageUrl, // Optional field
            price,
            creatorId: adminId
        });

        return res.status(201).json({
            message: "Course created successfully!",
            courseId: course._id
        });
    } catch (error) {
        console.error("Error creating course:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});





// Example route to handle course update
adminRouter.put('/api/v1/admin/course/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, price } = req.body;
  
    try {
      const course = await courseModel.findByIdAndUpdate(
        id,
        { title, description, price },
        { new: true } // Return the updated course
      );
  
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      res.json({ message: "Course updated successfully", course });
    } catch (err) {
      res.status(500).json({ message: "Failed to update course", error: err.message });
    }
  });
  

adminRouter.get("/course/bulk", adminMiddleware, async (req, res) => {
    try {
        const adminId = req.userId; // Ensure `req.userId` is set by your middleware

        const courses = await courseModel.find({
            creatorId: adminId 
        });

        res.json({
            message: "Courses fetched successfully",
            courses
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({
            message: "Failed to fetch courses",
            error: error.message
        });
    }
});

module.exports = {
    adminRouter: adminRouter
}