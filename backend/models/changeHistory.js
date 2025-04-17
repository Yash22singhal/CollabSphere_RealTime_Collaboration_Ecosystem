import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
    document: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    changes: { type: String, required: true }, // Store change details
    timestamp: { type: Date, default: Date.now }
});

export const ChangeHistory = mongoose.model("ChangeHistory", historySchema);
