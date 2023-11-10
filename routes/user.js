import express from "express";
import { createUser, getUsers, loginUser } from "../controllers/user.js"
import { isAuthenticated } from "../middlewares/jwt.js";

const router = express.Router();

router.get("/", isAuthenticated, getUsers);
router.post("/create", createUser);
router.post("/login", loginUser);



export default router;