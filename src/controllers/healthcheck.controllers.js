import ApiResponse from "../utils/api-response.js";
import asyncHandler from "express-async-handler"
import ApiError from "../utils/api-error.js";

export const healthCheck = async (req, res, next) => {
    try{
        res.status(200).json(
            new ApiResponse(200, {
                status: 200,
                message: 'Welcome to Project Tracker'
            }, "Server is running")
        );
    }catch(err){
        throw err;
    }
}