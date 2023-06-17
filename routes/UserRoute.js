import express from "express";
import { ConfirmController, ForgotPasswordController, GetUserController, LoginController, RegisterController, ResetPasswordController,GetProfileController,SetAvatarController } from "../controllers/UserController.js";

const route = express.Router();

route.post("/register", RegisterController);
route.post("/login", LoginController);
route.post("/get-user", GetUserController);
route.post("/set-avatar", SetAvatarController);
route.post("/forgot-password", ForgotPasswordController);
route.post("/get-user-profile", GetProfileController);
route.get("/reset-password/:token", ResetPasswordController);
route.get("/confirm/:token", ConfirmController);




export default route;