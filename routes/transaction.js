import express from "express";
import { createTransaction, deleteTransaction, getBalanceData, getCurrentBalance, getTransactionFamilies, getTransactions } from "../controllers/transactions.js";

const router = express.Router();

router.post("/create", createTransaction);
router.get("/transactionfamilies", getTransactionFamilies);
router.get("/transactions", getTransactions);
router.get("/balancedata", getBalanceData);
router.get("/currentBalance", getCurrentBalance);
router.post("/delete", deleteTransaction);

export default router;