import express from "express";
import { createTransaction, getTransactionFamilies } from "../controllers/transactions.js";

const router = express.Router();

router.post("/create", createTransaction);
router.get("/get", getTransactionFamilies);

export default router;