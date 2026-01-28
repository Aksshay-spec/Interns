import mongoose from "mongoose";


const userSchema  = new mongoose.Schema({
    userName : {
        type : String,
        required : [true,"Please enter Username"]
    },
    email : {
        type:String,
        required : [true,"Please enter valid email"],
        unique : [true,"This Email is Already Taken"]
    },
    passWord : {
        type:String,
        required : [true,"Please enter Valid PassWord"]
    },
    imageUrl : {
        type:String,
    }
},{
    timestamps : true
})
export const User = mongoose.model("User", userSchema); 