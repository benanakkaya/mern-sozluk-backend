import express from "express";
import { ConfirmController, ForgotPasswordController, GetUserController, LoginController, RegisterController, ResetPasswordController } from "../controllers/UserController.js";

const route = express.Router();

route.post("/register", RegisterController);
route.post("/login", LoginController);
route.post("/get-user", GetUserController)
route.post("/forgot-password", ForgotPasswordController);
route.get("/reset-password/:token", ResetPasswordController);
route.get("/confirm/:token", ConfirmController);




export default route;