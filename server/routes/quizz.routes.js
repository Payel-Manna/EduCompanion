import express from "express";
import { generateQuiz } from "../controllers/quiz.controllers.js";
import isAuth from '../middlewares/isAuth.js';

const quizRouter = express.Router();

quizRouter.post("/", isAuth, generateQuiz);

export default quizRouter;