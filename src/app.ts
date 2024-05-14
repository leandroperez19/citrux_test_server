import express from "express";
const app = express();
import cors from 'cors';
import authRoutes from './routes/auth.routes'
import summaryRoutes from './routes/summaries.routes';
import cookieParser from "cookie-parser";
import { FRONT_URL } from "./config";

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors({
    origin: 
    [
        'http://localhost:5173', 
        'http://localhost:5173/sign-up', 
        'http://localhost:5173/sign-in',
        'https://citrux-test-client.netlify.app/sign-up', 
        'https://citrux-test-client.netlify.app/sign-in',
        'https://citrux-test-client.netlify.app',
        'https://summaraizer-client.vercel.app/sign-in',
        'https://summaraizer-client.vercel.app',
        'https://summaraizer-client.vercel.app/sign-up'
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'application/json']
}));
app.use(cookieParser());
app.use('/api', authRoutes);
app.use('/api', summaryRoutes);

export default app;