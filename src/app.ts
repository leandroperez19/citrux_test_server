import express from "express";
const app = express();
import cors from 'cors';
import authRoutes from './routes/auth.routes'
import cookieParser from "cookie-parser";

app.use(express.json());
app.use(express.urlencoded({extended: false}))
// app.use(cors({
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'PUT', 'POST', 'DELETE'],
//     allowedHeaders: ['Content-Type']
// }))
app.use(cookieParser())
app.use(cors())
app.use('/api', authRoutes)

export default app;