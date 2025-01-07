const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");

function userMiddleware(req, res, next) {
    try {
        // Get token from Authorization header
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token not provided or malformed.' });
        }

        const token = authHeader.split(' ')[1]; // Extract token after 'Bearer'
        const decoded = jwt.verify(token, JWT_USER_PASSWORD); // Verify token

        req.userId = decoded.userId; // Attach userId to request object
        next(); // Move to next middleware
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }

}

module.exports = {
    userMiddleware: userMiddleware
}