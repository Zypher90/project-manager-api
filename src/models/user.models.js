import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as crypto from "crypto";
import {JWT_ACCESSTOKEN, JWT_ACCESSEXPIRY, JWT_REFRESHTOKEN, JWT_REFRESHEXPIRY} from "../config/env.js";

const UserSchema = new Schema({
    avatar: {
        type:{
            url: String,
            localUrl: String,
        },
        default:{
            url:"https://placehold.co/200x200",
            localUrl: ""
        }
    },
    username:{
        type:String,
        required:[true, "Username is required"],
        trim: true
    },
    email:{
        type:String,
        unique:[true, "Email is required"],
        required:true,
        trim: true
    },
    password:{
        type:String,
        required:[true, "Password is required"],
        minlength:8,
        maxLength:16,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    refreshToken:{
        type:String,
    },
    forgotPassword:{
        type:String,
    },
    forgotPasswordExpire:{
        type:Date,
    },
    emailVerificationToken:{
        type:String,
    },
    emailVerificationExpire:{
        type:Date,
    }
});

UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')){return next()}

    this.password = await bcrypt.hash(this.password, 10);
    // next()
})

UserSchema.methods.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this.id,
        email: this.email,
    }, JWT_ACCESSTOKEN, {expiresIn: JWT_ACCESSEXPIRY});
}

UserSchema.methods.generateRefreshToken = async function(){
    return jwt.sign({
        _id: this.id,
        email: this.email,
    }, JWT_REFRESHTOKEN, {expiresIn: JWT_REFRESHTOKEN});
}

UserSchema.methods.generateTemporaryToken = function (){
    const unhashedToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto
        .createHash("sha256")
        .update(unhashedToken)
        .digest("hex")

    const expiry = Date.now() + 20*60*1000;
    return {unhashedToken, hashedToken, expiry};
}

const User = mongoose.model('User', UserSchema);
export default User;