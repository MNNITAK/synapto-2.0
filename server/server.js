import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import attendanceRoutes from "./routes/attendanceRoutes.js";
import chatBotRoutes from "./routes/chatBotRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import twilioRoutes from "./routes/twilioRoutes.js"
import  MassBunkRoutes from "./routes/MassBunkRoutes.js"
import http from 'http';
import { Server } from 'socket.io';
import { setupChatSocket } from './sockets/chatSocket.js';
import userSettingsRoutes from './routes/userSettingsRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import deadlineRoutes from './routes/DeadlineRoutes.js';





connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// app.use(cors()); // Enable CORS
const corsOptions = {
  origin: ['http://localhost:5173','http://localhost:5050'], // Allowed 

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed HTTP methods
  credentials: true, // Allow cookies and credentials


};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use("/api/chatbot", chatBotRoutes);
app.use('/api/chat', chatRoutes); 


// Socket.io
setupChatSocket(io);
// app.use("/api/videos",videoRoutes);
app.use("/api/user", userSettingsRoutes);
app.use('/api/deadlines', deadlineRoutes);
app.use('/api/notes', noteRoutes);

app.use("/api/chat", chatRoutes);
app.use("/api/alert",twilioRoutes);
app.use("/api/massbunk",MassBunkRoutes)


app.get("/", (req, res) => {
  res.send("EduHub API is running 🚀");
});
const PORT = process.env.PORT || 5050;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});