// import express from 'express';
// import dotenv from "dotenv";
// import connectDB from './config/db.js';
// import authRoutes from './routes/auth.route.js';
// import userRoutes from './routes/user.route.js';
// import videoRoutes from "./routes/video.route.js";
// import commentRoutes from "./routes/comment.route.js";
// import fileUpload from 'express-fileupload';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import fs from 'fs';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 4000;

// // Connect to DB
// connectDB();

// const tempDir = path.join(__dirname, 'temp');
// if (!fs.existsSync(tempDir)) {
//     fs.mkdirSync(tempDir);
// }

// // Configure file upload
// app.use(fileUpload({
//     useTempFiles: true,
//     tempFileDir: tempDir,
//     createParentPath: true,
//     limits: { 
//         fileSize: 100 * 1024 * 1024 
//     },
//     abortOnLimit: true
// }));

// // Parse JSON bodies
// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/videos", videoRoutes);
// app.use("/api/comments", commentRoutes);



// ================== Module Imports ==================
import express from 'express';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// ================== Route Imports ===================
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import videoRoutes from './routes/video.route.js';
import commentRoutes from './routes/comment.route.js';

// ================== Configs and DB ==================
import connectDB from './config/db.js';

// ================== Init & Environment ==============
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// ================== Directory Setup =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tempDir = path.join(__dirname, 'temp');

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// ================== Connect to DB ===================
connectDB();

// ================== Global Middlewares ==============
app.use(express.json()); // For parsing JSON
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: tempDir,
  createParentPath: true,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  abortOnLimit: true
}));

// ================== Routes ==========================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

// ================== Server Start ====================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


// // Start server
// app.listen(PORT, () => {
//   console.log(`Server is running on port: ${PORT}`);
// });
