import mongoose from "mongoose"
import { Schema } from "mongoose"


const TransactionFamilySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        from: {
            type: String,
            required: true,
        },
        to: {
            type: String,
            required: true,
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

const TransactionFamily = mongoose.model("TransactionFamily", TransactionFamilySchema)

export default TransactionFamily