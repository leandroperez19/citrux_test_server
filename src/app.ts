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
    origin: 'https://citrux-test-client.netlify.app/',
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    credentials: false,
    allowedHeaders: ['Content-Type', 'application/json']
}));
app.use(cookieParser());
app.use('/api', authRoutes);
app.use('/api', summaryRoutes);

export default app;