// controllers/gamification.controllers.js
import User from "../models/user.models.js";
import StudyMaterial from "../models/studyMaterials.models.js";
import Quiz from "../models/quiz.models.js";
import ChatSession from "../models/chatSession.models.js";

/**
 * Get user statistics
 */
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [materialsCount, quizzesCompleted, topics, chatSession] = await Promise.all([
      StudyMaterial.countDocuments({ createdBy: userId }),
      Quiz.countDocuments({ createdBy: userId }),
      StudyMaterial.distinct("topic", { createdBy: userId }),
      ChatSession.findOne({ user: userId }),
    ]);

    const user = await User.findById(userId);

    // Calculate average quiz score (you'll need to add quizScores to user model)
    const avgQuizScore = user.quizScores?.length > 0
      ? user.quizScores.reduce((a, b) => a + b, 0) / user.quizScores.length
      : 0;

    const bestScore = user.quizScores?.length > 0
      ? Math.max(...user.quizScores)
      : 0;

    // Calculate average difficulty
    const materials = await StudyMaterial.find({ createdBy: userId });
    const difficultyMap = { beginner: 1, intermediate: 2, advanced: 3 };
    const avgDiff = materials.length > 0
      ? materials.reduce((sum, m) => sum + (difficultyMap[m.difficulty] || 1), 0) / materials.length
      : 0;
    const avgDifficulty = avgDiff < 1.5 ? "Beginner" : avgDiff < 2.5 ? "Intermediate" : "Advanced";

    res.status(200).json({
      xp: user.xp || 0,
      totalPoints: user.totalPoints || 0,
      streak: user.streak || 0,
      materialsCount,
      quizzesCompleted,
      topicsCount: topics.length,
      avgQuizScore: Math.round(avgQuizScore),
      bestScore,
      avgDifficulty,
      chatCount: chatSession?.messages.length || 0,
      recentActivity: user.recentActivity || [],
    });
  } catch (err) {
    console.error("Get Stats Error:", err);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
};

/**
 * Get user badges
 */
export const getUserBadges = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    res.status(200).json({
      badges: user.badges || [],
      unlockedCount: user.badges?.length || 0,
    });
  } catch (err) {
    console.error("Get Badges Error:", err);
    res.status(500).json({ error: "Failed to fetch badges" });
  }
};

/**
 * Get leaderboard
 */
export const getLeaderboard = async (req, res) => {
  try {
    const { timeframe = "all", category = "points" } = req.query;
    const currentUserId = req.user._id;

    let sortField = "totalPoints";
    if (category === "quizzes") sortField = "quizzesCompleted";
    if (category === "streak") sortField = "streak";

    // For timeframe filtering, you'd need to add timestamps to activities
    const users = await User.find()
      .select("name email totalPoints xp streak quizzesCompleted")
      .sort({ [sortField]: -1 })
      .limit(50);

    // Get additional stats for each user
    const leaderboard = await Promise.all(
      users.map(async (user) => {
        const materialsCount = await StudyMaterial.countDocuments({
          createdBy: user._id,
        });

        return {
          _id: user._id,
          name: user.name,
          totalPoints: user.totalPoints || 0,
          xp: user.xp || 0,
          streak: user.streak || 0,
          quizzesCompleted: user.quizzesCompleted || 0,
          materialsCount,
          isCurrentUser: user._id.toString() === currentUserId.toString(),
        };
      })
    );

    res.status(200).json({ leaderboard });
  } catch (err) {
    console.error("Get Leaderboard Error:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};

/**
 * Award XP and update streak
 */
export const awardXP = async (userId, xpAmount, activity) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // Award XP
    user.xp = (user.xp || 0) + xpAmount;
    user.totalPoints = (user.totalPoints || 0) + xpAmount;

    // Update streak
    const today = new Date().setHours(0, 0, 0, 0);
    const lastActive = user.lastActiveDate
      ? new Date(user.lastActiveDate).setHours(0, 0, 0, 0)
      : 0;

    if (lastActive === today) {
      // Same day, no change
    } else if (lastActive === today - 86400000) {
      // Yesterday, increment streak
      user.streak = (user.streak || 0) + 1;
    } else {
      // Streak broken
      user.streak = 1;
    }

    user.lastActiveDate = new Date();

    // Add to recent activity
    if (!user.recentActivity) user.recentActivity = [];
    user.recentActivity.unshift({
      icon: activity.icon || "⭐",
      title: activity.title,
      timestamp: new Date().toISOString(),
      xp: xpAmount,
    });
    user.recentActivity = user.recentActivity.slice(0, 10); // Keep last 10

    // Check and award badges
    await checkAndAwardBadges(user);

    await user.save();
    return user;
  } catch (err) {
    console.error("Award XP Error:", err);
  }
};

/**
 * Check and award badges
 */
async function checkAndAwardBadges(user) {
  if (!user.badges) user.badges = [];

  const materialsCount = await StudyMaterial.countDocuments({
    createdBy: user._id,
  });
  const quizzesCount = await Quiz.countDocuments({ createdBy: user._id });

  const badgeChecks = [
    { id: "first_material", name: "Getting Started", check: materialsCount >= 1 },
    { id: "book_worm", name: "Book Worm", check: materialsCount >= 10 },
    { id: "quiz_master", name: "Quiz Master", check: quizzesCount >= 5 },
    { id: "on_fire", name: "On Fire", check: user.streak >= 7 },
    { id: "diamond", name: "Diamond", check: Math.floor((user.xp || 0) / 1000) >= 10 },
    { id: "star_student", name: "Star Student", check: user.totalPoints >= 5000 },
    { id: "conversationalist", name: "Conversationalist", check: user.chatCount >= 50 },
    { id: "creator", name: "Creator", check: materialsCount >= 20 },
  ];

  for (const badge of badgeChecks) {
    if (badge.check && !user.badges.includes(badge.id)) {
      user.badges.push(badge.id);
      // Could send notification here
    }
  }
}

/**
 * Record quiz completion and award XP
 */
export const recordQuizCompletion = async (req, res) => {
  try {
    const userId = req.user._id;
    const { score, totalQuestions, topic } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Award XP based on score
    const percentage = (score / totalQuestions) * 100;
    let xpAwarded = score * 10; // Base 10 XP per correct answer

    if (percentage === 100) xpAwarded += 50; // Perfect bonus
    if (percentage >= 80) xpAwarded += 25; // Excellence bonus

    // Update user stats
    user.quizzesCompleted = (user.quizzesCompleted || 0) + 1;
    if (!user.quizScores) user.quizScores = [];
    user.quizScores.push(percentage);

    // Award XP
    await awardXP(userId, xpAwarded, {
      icon: "🎯",
      title: `Completed ${topic} quiz - ${score}/${totalQuestions}`,
    });

    res.status(200).json({
      message: "Quiz completion recorded",
      xpAwarded,
      newTotalXP: user.xp,
      newLevel: Math.floor(user.xp / 1000) + 1,
    });
  } catch (err) {
    console.error("Record Quiz Error:", err);
    res.status(500).json({ error: "Failed to record quiz completion" });
  }
};