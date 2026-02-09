import ApiError from "../utils/api-error.js";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import {JWT_ACCESSTOKEN} from "../config/env.js";
import cookieParser from "cookie-parser";
import asyncHandler from "express-async-handler";

export const validateToken = asyncHandler(async (req, res, next) => {
    const signedToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if(!signedToken) {
        throw new ApiError(
            401,
            "Unauthorized access",
        )
    }
    console.log(signedToken);
    const unsignedToken = jwt.verify(signedToken, JWT_ACCESSTOKEN);
    const user = await User.findById(unsignedToken?._id);
    if(!user) {
        throw new ApiError(
            404,
            "User not found",
        )
    }

    req.user = user;
    next();
})