import User from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import transporter from "../config/emailconfig.js";

dotenv.config(); 

class userController{
    static userRegistration = async (req, res) => {
        const {name, password, email, cpass, tc} = req.body;
        const user = await User.findOne({email:email});
        if(user){
            res.send({"status" : "failed", "message" : "A user with email already exist"});
        }else{
            if(name && password && email&& cpass && tc){

                try {
                    if(password == cpass){
                        const hpassword = await bcrypt.hash(password, 10);
                        const newUser = new User({
                            name : name,
                            password : hpassword,
                            email : email,
                            tc : tc
                        })
                        await newUser.save();
                        // generate jwt token
                        const savedUser = await User.findOne({email : email});
                        
                        const token = await jwt.sign({userId : savedUser._id}, process.env.SECRET_KEY, {expiresIn : "5d"});

                        res.status(201).send({"status" : "success", "message" : "user registered", "token" : token, "user" : savedUser});
                    }else{
                    res.send({"status" : "failed", "message" : "Password and confirm password doesn't matched"});
                    }
                } catch (err) {
                res.send({"status" : "failed", "message" : "Unable to register"});
                }

                
            }else{
                res.send({"status" : "failed", "message" : "all fields are required", "error" : er});
            }
        }
    }


    static userLogin = async(req, res) => {
        const { email , password } = req.body;
        if(email && password){
            const user = await User.findOne({email : email});
            if(user){
                const isMatch = await bcrypt.compare(password, user.password);
                if(isMatch){
                    const token = await jwt.sign({userId : user._id}, process.env.SECRET_KEY, {expiresIn : "5d"});
                    res.status(201).send({"message" : " success", "token" : token, "user" : user});                  
                }else{
            res.send({"status" : "failed", "message" : "You have entered wrong email or password"});
                }
            }else{
            res.send({"status" : "failed", "message" : "user with this email doesn't exist"});
            }
        }else{
            res.send({"status" : "failed", "message" : "all fields are required"});
        }
    }

    static changePassword = async(req, res) => {
        const {password, cpass} = req.body;
        if(password && cpass){
            if(password !== cpass){
                res.status(400).send({"status" : "failed", "message" : "password and confirmpassword doesn't matched"});
            }else{
                const hashPassword = await bcrypt.hash(password, 10);
                // console.log(req.user._id);
                await User.findByIdAndUpdate(req.user._id, {$set : {password : hashPassword }})
                res.status(401).send({"status" : "success", "message" : "password changed"})
            }
        }else{
            res.send({"status" : "failed", "message" : "all fields are requiredc"});
        }
    }

    static loggedUserInfo = async(req, res) => {
        res.send({"user" : req.user});
    }

    static resetPassEmail = async(req, res) => {
        const { email } = req.body;
        if(email){
            const user = await User.findOne({email : email});
            if(user){
                 const secret =  (user._id + process.env.SECRET_KEY);
                const token = await jwt.sign({userId : user._id}, secret, {expiresIn : "15m"});
                const link = `http://127.0.0.1:8000/api/routes/reset/${user._id}/${token}`;
                console.log(link);
                // let info = await transporter.sendMail({
                //     from : process.env.EMAIL_FROM,
                //     to : user.email,
                //     subject : "password reset link on ayush.com",
                //     html : `<a href=${link}>click here</a> to reset your password.`
                // })

                res.status(200).send({"status" : "failed", "message" : `Email has been successfully sent to ${email}`});

            }else{
            res.send({"status" : "failed", "message" : "User with this email doesn't exist"});            }
        }else{
            res.send({"status" : "failed", "message" : "Email field is required"});
        }
    }

    static passResetUsingLink = async(req, res) => {
        const { password, cpass} = req.body;
        const {id, token} = req.params;

        const user = await User.findById(id);
        if(user){
            const new_secret = user._id + process.env.SECRET_KEY;
            
            try {
                jwt.verify(token, new_secret);
                if(password && cpass){
                    if(password === cpass){
                        const hashPassword = await bcrypt.hash(password, 10);
                        await User.findByIdAndUpdate(user._id, {$set : {password : hashPassword }});
                        res.status(401).send({"status" : "success", "message" : "password changed"})
                    }else{
                        res.send({"status" : "failed", "message": "password doesn't match"});
                    }
                }else{
                    res.send({"status" : "failed", "message" : "all fields are requiredc"});
                }
                
            } catch (err) {
                res.send(err);
            }
        }else{
            res.send({"status" : "failed", "message" : "invalid link"});
        }
    }

};

export default userController;