import express from 'express';
import dotenv from  "dotenv";
import connectDB from './config/db.js';
import authRoutes from './routes/auth.route.js';
import fileUpload from 'express-fileupload';
dotenv.config();
const app = express();


const PORT = 4000 || process.env.PORT;


connectDB();
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
    tempFileDir: '/tmp/',
}));
app.use(fileUpload({useTempFiles: true}));


//Routes
app.use("/api/auth", authRoutes);

//App listen
app.listen(PORT, () => {
    console.log(`Server is running on :${PORT}`);
});