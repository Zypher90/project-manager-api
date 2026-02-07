import {body} from "express-validator";

const registerValidator = () => {
    return [
        body("email").trim().isEmpty().withMessage("Email is required")
            .isEmail().withMessage("Invalid email address"),
        body("password").isEmpty().withMessage("Password is required")
            .isLength({min: 8}).withMessage("Password must be at least 8 characters")
            .isLength({max: 16}).withMessage("Password must not be greater than 16 characters long"),
        body("username").trim().isEmpty().withMessage("Username is required"),
    ]
}

export {
    registerValidator,
}