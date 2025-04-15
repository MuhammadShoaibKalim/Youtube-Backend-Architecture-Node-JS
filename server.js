import express from 'express';
import dotenv from "dotenv";
import connectDB from './config/db.js';
import authRoutes from './routes/auth.route.js';
import videoRoutes from "./routes/video.route.js";
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to DB
connectDB();

const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

// Configure file upload
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: tempDir,
    createParentPath: true,
    limits: { 
        fileSize: 100 * 1024 * 1024 
    },
    abortOnLimit: true
}));

// Parse JSON bodies
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
