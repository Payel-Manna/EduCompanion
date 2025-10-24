import dotenv from "dotenv";
dotenv.config()
import express from "express";
import connectDB from "./config/db.js";

import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import feedbackRouter from "./routes/feedback.routes.js";
import studyMaterialRouter from "./routes/studyMaterials.routes.js";
import chatRouter from "./routes/chat.routes.js";
import quizRouter from "./routes/quizz.routes.js";

const app=express()
const PORT=8000

connectDB()

app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true, 
}))

app.use(express.json());
app.use("/api/feedback",feedbackRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/material",studyMaterialRouter);
app.use("/api/chat", chatRouter);
app.use("/api/quiz", quizRouter);

app.get('/',(req,res)=>{
    res.send("Hello from server")
})
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
