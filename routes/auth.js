import express from "express";
import { createUser, getCurrentUser, getUsers, isUserAuth, loginUser } from "../controllers/auth.js"
import { verifyJWT } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/create", createUser);
router.post("/login", loginUser);
router.get("/isauth", verifyJWT, isUserAuth);
router.get("/user", verifyJWT, getCurrentUser);



export default router;