import express from "express";
const app = express();
import cors from 'cors';
import authRoutes from './routes/auth.routes'
import cookieParser from "cookie-parser";
import { FRONT_URL } from "./config";
// import OpenAI from "openai";

// const openAI = new OpenAI();

// async function main() {
//     const completion = await openAI.chat.completions.create({
//         messages: [{ role: "system", content: "You are a helpful assistant." }],
//         model: "gpt-3.5-turbo",
//       });
    
//       console.log(completion.choices[0]);
// }
// main()

app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cors({
    origin: FRONT_URL,
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    credentials: true
}))
app.use(cookieParser())
app.use('/api', authRoutes)

export default app;