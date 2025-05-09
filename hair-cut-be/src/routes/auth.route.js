import express from "express";
import authController from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", ...authController.registerUser);
authRouter.post("/login", ...authController.loginUser);
authRouter.get("/current", ...authController.getCurrentUser);
authRouter.get("/is-phone-registered", ...authController.isPhoneRegistered);
authRouter.get("/is-email-registered", ...authController.isEmailRegistered);

export default authRouter;
