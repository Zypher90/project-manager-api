import User from "../models/user.models.js"
import ApiError from "../utils/api-error.js"
import asyncHandler from 'express-async-handler'
import {sendMail} from "../utils/send-email.js";
import {verificationMail, forgotPasswordMail} from "../utils/generate-mail.js";
import ApiResponse from "../utils/api-response.js";

const checkAuth = async (req, res, next) => {
    try{
        res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Auth route online"
            )
        )
    }catch(err){
        throw new ApiError(
            500,
            "Auth route facing issues"
        )
    }
}

const generateAccessAndRefreshToken = async (userID) => {
    try{
        const user = await User.findById(userID);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        // await user.save();
        return {accessToken, refreshToken};
    }catch(err){
        throw new ApiError(
            500,
            "Unable to generate access token",
        )
    }
}

const registerUser = async (req, res, next) => {
    try{
        const {email, username, password, role} = req.body;

        const userExists = await User.findOne({
            $or: [{ email }, { username }]
        })

        if(userExists){
            throw new ApiError(403, `User already exists`)
        }

        const user = await new User(
            {
                email,
                username,
                password,
                isVerified: false,
            }
        );

        const {unhashedToken, hashedToken, expiry} = user.generateTemporaryToken();

        user.emailVerificationToken = hashedToken;
        user.emailVerificationExpiry = expiry;

        await user.save({validateBeforeSave: false});

        await sendMail(
            {
                email: user?.email,
                subject: "Please verify your email",
                content: verificationMail(user.username,
                    `${req.protocol}://${req.get('host')}:${req.get('port')}/api/v1/users/verify-email/${unhashedToken}`
                )
            }
        );

        const createdUser = User.findById(user._id);
        if(!createdUser){
            throw new ApiError(500, "User could not be registered");
        }

        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        // newUser: createdUser,
                    },
                    "User created successfully"
                )
            );
    }catch (err){
        // throw new ApiError(
        //     500,
        //     "User could not be registered"
        // )
        throw err;
    }
}

const login = async (req, res, next) => {
    try{
        const {email, username, password} = req.body;
        if(!email || !username){
            throw new ApiError(500, `Wrong credentials`);
        }
        const user = await User.findOne(
            {
                $or: [{ email }, { username }]
            }
        )

        if(!user){
            throw new ApiError(403, `User does not exist`);
        }

        if(!user.validatePassword(password)){
            throw new ApiError(403, `Wrong password`);
        }

        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: true,
        }

        res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        data: user
                    },
                    "User logged in successfully"
                )
            )


    }catch(err){
        throw new ApiError(500, "Unable to login");
    }
}

const deleteUser = async (req, res, next) => {
    const {email, username, password} = req.body;

}

export {registerUser, checkAuth, login};