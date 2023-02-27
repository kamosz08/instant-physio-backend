import express from "express";
import {usersController} from "../controllers/users";
const usersRouter = express.Router();

usersRouter.post("/signup", usersController.handleSignup);
usersRouter.post("/login", usersController.handleLogin);

export default usersRouter;