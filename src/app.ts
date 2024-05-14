import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import summaryRoutes from "./routes/summaries.routes";
import cookieParser from "cookie-parser";
import { FRONT_URL } from "./config";
import { User } from "./models/user.model";
import axios from "axios";

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
    const request = await axios.post("https://api.restful-api.dev/objects", {
        name: "Apple MacBook Pro 16",
        data: {
            year: 2019,
            price: 1849.99,
            "CPU model": "Intel Core i9",
            "Hard disk size": "1 TB",
        },
    });
    // const { email } = req.body;
    // const userFound = await User.findOne({ email });
    // if (!userFound) return res.status(404).json("this is an error");
    // res.status(200).json(userFound?.userName);
    if(!request) return res.status(400).json("sorry friend");
    return res.status(200).json(JSON.stringify(request))
});

export default app;
