import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import summaryRoutes from "./routes/summaries.routes";
import cookieParser from "cookie-parser";
import { FRONT_URL } from "./config";
import { User } from "./models/user.model";

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

app.post("/api/post", async (req, res) => {
    try {
        const response = await User.findOne({ email: 'perezbarahonaleandro@gmail.com' });
        const request = response;
        if (!request) return res.status(400).json("sorry friend");
        return res.status(200).json(JSON.stringify(request));
    } catch (error) {
        console.error(error);
        res.status(500).json("my bad dog");
    }
});

export default app;
