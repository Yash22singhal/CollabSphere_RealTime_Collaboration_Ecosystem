import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    document: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

export const Comment = mongoose.model("Comment", commentSchema);
