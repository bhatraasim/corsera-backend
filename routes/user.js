const { Router } = require("express");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const { userModel, purchaseModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middleware/user");

const userRouter = Router();

userRouter.post("/signup", async function (req, res) {
  const requireBody = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
    firstName: z.string().min(3).max(10),
    lastName: z.string().min(3).max(10),
  });
  const parsedDataSucess = requireBody.safeParse(req.body);

  if (!parsedDataSucess.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: parsedDataSucess.error.errors,
    });
  }

  const { email, password, firstName, lastName } = parsedDataSucess.data;

  const hasedPassword = await bcrypt.hash(password, 10);

  try {
    await userModel.create({
      email: email,
      password: hasedPassword,
      firstName: firstName,
      lastName: lastName,
    });
    res.json({
      message: "Signup succeeded",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error occurred during signup",
      error: error.message,
    });
  }
});

userRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;

  // TODO: ideally password should be hashed, and hence you cant compare the user provided password and the database password
  const user = await userModel.findOne({
    email: email,
  });
  const passwordMatch = bcrypt.compare(password, user.password);

  if (user && passwordMatch) {
    const token = jwt.sign(
      {
        id: user._id,
      },
      JWT_USER_PASSWORD
    );

    res.json({
      token: token,
    });
  } else {
    res.status(403).json({
      message: "Incorrect credentials",
    });
  }
});

userRouter.get("/purchases", userMiddleware, async function (req, res) {
  try {
    const userId = req.userId;
  
    const purchases = await purchaseModel.find({userId}).select(`courseId -_id`);

    if (purchases.length) {
      return res.status(200).json({
        message: "No purchased courses found.",
        purchases: [],
        coursesData: [],
    })
    }
  
    let purchasedCourseIds = purchases.map(purchases=>purchases.courseId);
  const coursesData = await courseModel.find({
    _id:{ $in:purchasedCourseIds}
  })
  
    res.json({
      purchases,
      coursesData,
    });
  } catch (error) {
    console.error('Error fetching purchased courses:', error);
        return res.status(500).json({
            message: "An error occurred while fetching purchased courses.",
            error: error.message,
          })
    }


});

module.exports = {
  userRouter: userRouter,
};
