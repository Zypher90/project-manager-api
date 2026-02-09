import {Router} from "express";
import {registerUser, checkAuth, login} from "../controllers/auth.controllers.js";
import {validate} from "../middleware/validator.middleware.js";
import {registerValidator, loginValidator} from "../validators/index.js";

const authRouter = Router();

authRouter.route("/register").post(registerValidator(), validate, registerUser);
authRouter.route("/login").post(loginValidator(), validate, login);
authRouter.route("/check").get(checkAuth);

export default authRouter;