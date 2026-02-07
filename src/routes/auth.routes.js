import {Router} from "express";
import {registerUser, checkAuth} from "../controllers/auth.controllers.js";
import {validate} from "../middleware/validator.middleware.js";
import {registerValidator} from "../validators/index.js";

const authRouter = Router();

authRouter.route("/register").post(registerValidator(), validate, registerUser);
authRouter.route("/check").get(checkAuth);

export default authRouter;