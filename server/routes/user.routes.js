// routes/user.routes.js

import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import {
  addBadges,
  editProfile,
  getBadges,
  getProfile,
  getUser,
  trackStudySession,
  updatePreferences
} from '../controllers/user.controllers.js';

import {
  getUserStats,
  getUserBadges,
  getLeaderboard,
  recordQuizCompletion,
} from "../controllers/gamification.controllers.js";

const userRouter = express.Router();

// User profile and badges
userRouter.get('/me', isAuth, getUser);
userRouter.get('/profile/:userName', isAuth, getProfile);
userRouter.put('/edit', isAuth, editProfile);
userRouter.put('/preferences', isAuth, updatePreferences);
userRouter.get('/badges', isAuth, getBadges);  // ✅ User’s personal badges
userRouter.post('/badges', isAuth, addBadges);
userRouter.post('/study', isAuth, trackStudySession);

// Gamification stats
userRouter.get("/gamification/badges", isAuth, getUserBadges); // ✅ renamed
userRouter.get("/gamification/stats", isAuth, getUserStats);
userRouter.get("/leaderboard", isAuth, getLeaderboard);
userRouter.post("/quiz-complete", isAuth, recordQuizCompletion);

export default userRouter;
