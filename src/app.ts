import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import summaryRoutes from "./routes/summaries.routes";
import cookieParser from "cookie-parser";
import { FRONT_URL, TOKEN_SECRET } from "./config";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    cors({
        origin: FRONT_URL,
        methods: ["GET", "PUT", "POST", "DELETE"],
        credentials: true,
        allowedHeaders: ["Content-Type"],
    })
);
app.use(cookieParser());
app.use("/api", authRoutes);
app.use("/api", summaryRoutes);

export default app;
