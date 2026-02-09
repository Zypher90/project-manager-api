import User from "../models/user.models.js"
import ApiError from "../utils/api-error.js"
import asyncHandler from 'express-async-handler'
import {sendMail} from "../utils/send-email.js";
import {verificationMail, forgotPasswordMail} from "../utils/generate-mail.js";
import ApiResponse from "../utils/api-response.js";
import {json} from "express";
import {JWT_ACCESSTOKEN} from "../config/env.js";
import jwt from "jsonwebtoken";

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

const registerUser = asyncHandler(async (req, res) => {
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
})

const login = asyncHandler(async (req, res, next) => {
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

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false});

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
                    data: user,
                },
                "User logged in successfully"
            )
        )
})

const logout = asyncHandler(async (req, res) => {
    const loggedOut = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {"refreshToken": ""}
        },
        {
            new: true
        }
    );
    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "Logged out successfully"
            )
        )
})

const getCurrentUser = async (req, res, next) => {
    try {
        return req.
            status(200),
            json(
                new ApiResponse(
                    200,
                    req.user,
                    "User fetched successfully"
                )
            )
    }catch(err){
        throw new ApiError(500, "Unable to get current user");
    }
}

const verifyEmail = asyncHandler(async (req, res) => {
    const {verificationToken} = req.params;

    if(!verificationToken){
        throw new ApiError(403, `Token does not exist`);
    }

    let hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

    const user = await User.findOne(
        {
            emailVerificationToken: hashedToken,
            emailVerificationExpire: {$gt: Date.now()},
        }
    )

    if(!user){
        throw new ApiError(403, `User does not exist`);
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    isVerified: true,
                },
                "Email has been verified"
            )
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies("refreshToken") || req.body.refreshToken;
    if(!refreshToken){
        throw new ApiError(403, `Unauthorized refresh token`);
    }

    const decodedToken = jwt.verify(refreshToken, JWT_ACCESSTOKEN);
    const user = await User.findById(decodedToken._id);
    if(!user){
        throw new ApiError(403, `User does not exist`);
    }
    if(user.refreshToken!==decodedToken){
        throw new ApiError(403, `Refresh token expired`);
    }

    const {accessToken, refreshToken: newRefreshToken} = generateAccessAndRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save({validateBeforeSave: false});

    const options =  {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken: accessToken,
                    refreshToken: newRefreshToken,
                },
                "Access Token refreshed"
            )
        )
})

export {registerUser, checkAuth, login, logout, getCurrentUser, refreshAccessToken};