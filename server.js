import express from 'express';
import dotenv from  "dotenv";
import connectDB from './config/db.js';
dotenv.config();
const app = express();


const PORT = 4000 || process.env.PORT;


connectDB();
app.use(express.json());
// app.use(bodyParser.json())

//Routes


app.listen(PORT, () => {
    console.log(`Server is running on :${PORT}`);
});