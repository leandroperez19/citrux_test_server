import express from "express";
import cors from 'cors';
import authRoutes from './routes/auth.routes'
import summaryRoutes from './routes/summaries.routes';
import cookieParser from "cookie-parser";
import { FRONT_URL } from "./config";
import { User } from "./models/user.model";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors({
    origin: FRONT_URL,
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type']
}));
app.use(cookieParser());
app.use('/api', authRoutes);
app.use('/api', summaryRoutes);

app.post('/api/post', async (req, res) => {
    const { email } = req.body;
    const userFound = await User.findOne({ email });
    if(!userFound) return res.status(404).json('this is an error')
    res.status(200).json(userFound?.userName)
})

export default app;