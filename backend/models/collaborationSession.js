import mongoose from "mongoose";

const collaborationSchema = new mongoose.Schema({
    document: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Active users in session
    lastEdited: { type: Date, default: Date.now }
});

export const CollaborationSession = mongoose.model("CollaborationSession", collaborationSchema);
