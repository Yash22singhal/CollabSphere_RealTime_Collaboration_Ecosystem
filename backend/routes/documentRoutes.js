import express from "express";
import { Document } from "../models/document.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new document
router.post("/", authenticateUser, async (req, res) => {
    try {
        const { title, content } = req.body;
        const document = new Document({ title, content, owner: req.user.userId });
        await document.save();
        res.status(201).json(document);
    } catch (error) {
        res.status(500).json({ error: "Document creation failed" });
    }
});

// Get all documents of a user
router.get("/", authenticateUser, async (req, res) => {
    try {
        const documents = await Document.find({ owner: req.user.userId });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch documents" });
    }
});

// Get a specific document by ID
router.get("/:id", authenticateUser, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) return res.status(404).json({ error: "Document not found" });
        res.json(document);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving document" });
    }
});

// Update a document
router.put("/:id", authenticateUser, async (req, res) => {
    try {
        const { content } = req.body;
        const document = await Document.findByIdAndUpdate(req.params.id, { content }, { new: true });
        res.json(document);
    } catch (error) {
        res.status(500).json({ error: "Document update failed" });
    }
});

// Delete a document
router.delete("/:id", authenticateUser, async (req, res) => {
    try {
        await Document.findByIdAndDelete(req.params.id);
        res.json({ message: "Document deleted" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting document" });
    }
});

export default router;
