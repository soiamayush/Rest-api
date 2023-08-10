import jwt from "jsonwebtoken";
import User from "../model/user.js"
import dotenv from "dotenv";

dotenv.config();

let checkAuth = async(req, res, next) => {
    let token;
    const {authorization} = req.headers;
    if(authorization && authorization.startsWith("Bearer")){
        try {
            //get token form header
            token = authorization.split(" ")[1];
            // console.log("token", token);

            //verify token
            const { userId } = jwt.verify(token, process.env.SECRET_KEY);
            req.user = await User.findById(userId).select("-password");

        

            // get user from token
        } catch (err) {
                 console.log(err)       
        }
        next();
    }else{
        res.send({"status" : "failed", "message" : "didn't get bearer token"});
    }

    if(!token){
        res.send({"status" : "failed", "message" : "Token not found"})
    }

}

export default checkAuth;