import express from "express";
import { createTransaction, getBalanceData, getTransactionFamilies, getTransactions } from "../controllers/transactions.js";

const router = express.Router();

router.post("/create", createTransaction);
router.get("/transactionfamilies", getTransactionFamilies);
router.get("/transactions", getTransactions);
router.get("/balancedata", getBalanceData);

export default router;