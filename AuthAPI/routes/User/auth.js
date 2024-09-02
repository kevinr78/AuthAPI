import express, { Router } from "express";
import {
  loginController,
  registerController,
} from "../../controllers/User/userController.js";
const userAuthRouter = express.Router();

userAuthRouter.post("/login", loginController);
userAuthRouter.post("/register", registerController);

export default userAuthRouter;
