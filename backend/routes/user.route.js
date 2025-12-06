import express from "express";
import {
  userLogin,
  userLogout,
  userPageGotRefreshed,
} from "../controllers/user.controller.js";
import { authmiddleware } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/login", userLogin);
userRouter.post("/logout", authmiddleware, userLogout); // authmiddleware
userRouter.get("/pageGotRefreshed", authmiddleware, userPageGotRefreshed); // authmiddleware

export { userRouter };
