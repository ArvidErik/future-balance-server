import express from "express";
import { createTransaction } from "../controllers/transactions.js";

const router = express.Router();

router.post("/create", createTransaction);

export default router;