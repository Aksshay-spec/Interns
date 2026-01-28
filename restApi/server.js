import express from 'express';
import cors from 'cors';
import connectDB from './config/dbConnect.js';
import userRoute from './routes/userRoute.js';
import {config} from 'dotenv';
import {connectCloudinary} from './config/cloudinary.js';
import cookieParser from 'cookie-parser';


config();
await connectCloudinary();
connectDB();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors(
  {
    origin: process.env.FRONTEND_URL,
    credentials: true,  
  }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/user', userRoute);


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});