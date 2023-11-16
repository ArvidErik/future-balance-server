import mongoose from "mongoose"
import { Schema } from "mongoose"


const TransactionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        dueDate: {
            type: Date,
            required: true,
            min: Date.now()
        },
        type: {
            type: String,
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId, ref: "User"
        }
    },
    { timestamps: true}
)

const Transaction = mongoose.model("Transaction", TransactionSchema)

export default Transaction