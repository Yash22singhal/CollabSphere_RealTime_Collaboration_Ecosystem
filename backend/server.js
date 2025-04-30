import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import authRoutes from './routes/auth.routes.js';
import documentRoutes from './routes/document.routes.js';
import Document from './models/document.model.js';
import Delta from 'quill-delta'; // Import quill-delta
import aiRoutes from './routes/ai.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST']
//   }
// });

const io = new Server(server, {
  cors: {
    origin: ['https://collabspherefrontend.vercel.app',
      "http://localhost:5173",
      "https://collabsphere-realtime-collaboration.onrender.com"
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ["Authorization", "Content-Type"], // Allow specific headers
    credentials: true, // If you need to send cookies
  }
});

// Socket.IO Authentication Middleware (Example)
// You might need to adjust this depending on how your frontend sends the token
io.use((socket, next) => {
  const token = socket.handshake.query.token; // Or socket.handshake.headers.authorization
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
      if (err) {
        console.error('Socket.IO Authentication Error:', err);
        return next(new Error('Authentication error'));
      }
      socket.userId = decoded.userId;
      next();
    });
  } else {
    console.error('Socket.IO: No token provided');
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join-document', async (documentId, userId) => {
    socket.join(documentId);
    console.log(`User ${socket.userId || userId} joined document ${documentId}`);

    try {
      const document = await Document.findById(documentId);
      if (document) {
        socket.emit('load-document', document.content); // Send initial content as Delta
      } else {
        console.error(`Error loading document: Document not found with ID ${documentId}`);
        // Consider emitting an error event to the client
      }
    } catch (error) {
      console.error(`Error in join-document event: ${error}`);
    }
  });

  socket.on('text-change', async (documentId, userId, delta) => { // Include userId
    console.log(`Received text-change from ${userId} in ${documentId}:`, delta);

    try {
      const document = await Document.findById(documentId);
      if (document) {
        // Apply the delta to the document's content using quill-delta
        try {
          const oldDelta = new Delta(document.content);
          const newDelta = new Delta(delta);
          const composedDelta = oldDelta.compose(newDelta);
          document.content = composedDelta.ops; // Store the ops array
          await document.save(); // Save the updated content to the database
          socket.broadcast.to(documentId).emit('receive-changes', userId, delta); // Broadcast with userId
        } catch (composeError) {
          console.error('Error composing Deltas:', composeError);
          // Handle the error (e.g., send an error to the client, revert changes)
        }
      } else {
        console.error(`Error handling text-change: Document not found with ID ${documentId}`);
      }
    } catch (error) {
      console.error('Error handling text-change:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User Disconnected ${socket.id}`);
  });
});

// Mount Express routes AFTER Socket.IO setup
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/ai', aiRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

app.get('/', (req, res) => {
  res.send('CollabSphere Backend is running');
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});