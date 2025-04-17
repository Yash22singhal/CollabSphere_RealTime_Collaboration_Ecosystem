import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, default: "" }, // Initial empty content
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Document creator
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who can edit
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const Document = mongoose.model("Document", documentSchema);
