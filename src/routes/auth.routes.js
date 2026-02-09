import {Router} from "express";
import {
    registerUser,
    checkAuth,
    login,
    logout,
    getCurrentUser,
    refreshAccessToken
} from "../controllers/auth.controllers.js";
import {validate} from "../middleware/validator.middleware.js";
import {registerValidator, loginValidator} from "../validators/index.js";
import { validateToken } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.route("/register").post(registerValidator(), registerUser);
authRouter.route("/login").post(loginValidator(), validate, login);
authRouter.route("/logout").post(validateToken, logout);
authRouter.route("/get-user").get(validateToken, getCurrentUser);
authRouter.route("/refresh-token").get(validateToken, refreshAccessToken)
authRouter.route("/check").get(checkAuth);

export default authRouter;