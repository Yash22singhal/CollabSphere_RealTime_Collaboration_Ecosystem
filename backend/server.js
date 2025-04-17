import express from "express";
import cors from "cors";
import "dotenv/config";
import { Server } from "socket.io";
import { createServer } from "http";
import { connectDB } from "./config/db.js";
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';

// Initialize Express app
const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

// Connect to MongoDB
connectDB();

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Basic route to check server status
app.get("/", (req, res) => {
  res.send("CollabSphere API is running...");
});

// Start the server
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
