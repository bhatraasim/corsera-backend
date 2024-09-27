const jwt = require("jsonwebtoken")
const { JWT_USER_PASSWORD } = require("../config") 

function userMiddleware(req,res,next){
    const token = req.header.token
    const decode = jwt.verify(token, JWT_USER_PASSWORD)
    
    if(decode){
        req.userId = decode.id;
        next()
    }else{
        res.status(403).json({
            Message:"invalid creds"
        })
    }

}

module.exports ={
    userMiddleware:userMiddleware
}