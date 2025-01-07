const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");

function userMiddleware(req, res, next) {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({message:'token not provided'})
    }


    try {
        const decode = jwt.verify(token,JWT_USER_PASSWORD)
        req.userId = decode.id;
        next()
    } catch (err) {
        return res.status(401).json({msg:"invalid token"})
    }
   

}

module.exports = {
    userMiddleware: userMiddleware
}