const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");

function adminMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  try {
    const decoded = jwt.verify(token,  JWT_ADMIN_PASSWORD  );
    req.userId = decoded.id; // Adjust according to your JWT payload
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}


module.exports = {
    adminMiddleware: adminMiddleware
}