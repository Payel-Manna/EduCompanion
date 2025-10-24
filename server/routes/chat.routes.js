
import express from "express";
import { chatWithNotes, clearChatHistory, getChatHistory } from "../controllers/chat.controller.js";

import isAuth from '../middlewares/isAuth.js'

const chatRouter = express.Router();

chatRouter.post("/", isAuth, chatWithNotes);
// Get chat history
chatRouter.get("/history", isAuth, getChatHistory);

// Clear chat history
chatRouter.delete("/history", isAuth, clearChatHistory);


export default chatRouter;
