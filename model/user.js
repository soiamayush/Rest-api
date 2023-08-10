import mongoose from "mongoose";
import validator from "validator";

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    password : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error("Entered email is not valid");
            }
        }
    },
    tc : {
        type : Boolean,
        // required : true
    }
});

const UserModel = mongoose.model("user", userSchema);

export default UserModel;