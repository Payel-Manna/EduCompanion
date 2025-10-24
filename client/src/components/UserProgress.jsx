// src/components/UserProgress.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function UserProgress({ token }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const [statsRes, badgesRes] = await Promise.all([
        axios.get("/api/user/gamification/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/user/gamification/badges", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setStats(statsRes.data);
      setBadges(badgesRes.data.badges || []);
    } catch (err) {
      console.error("Failed to fetch progress:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const levelProgress = ((stats?.xp || 0) % 1000) / 1000 * 100;
  const currentLevel = Math.floor((stats?.xp || 0) / 1000) + 1;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hero Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-2">🎓</div>
            <div className="text-3xl font-bold">{currentLevel}</div>
            <div className="text-sm opacity-90">Level</div>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-3xl font-bold">{stats?.totalPoints || 0}</div>
            <div className="text-sm opacity-90">Total Points</div>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🔥</div>
            <div className="text-3xl font-bold">{stats?.streak || 0}</div>
            <div className="text-sm opacity-90">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-3xl font-bold">{stats?.quizzesCompleted || 0}</div>
            <div className="text-sm opacity-90">Quizzes Done</div>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Level {currentLevel}</span>
            <span>{stats?.xp || 0} / {currentLevel * 1000} XP</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-white h-3 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          🏅 Your Badges & Achievements
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { id: 1, icon: "🚀", name: "Getting Started", desc: "Add first material", unlocked: stats?.materialsCount > 0 },
            { id: 2, icon: "📚", name: "Book Worm", desc: "10+ materials", unlocked: stats?.materialsCount >= 10 },
            { id: 3, icon: "🎯", name: "Quiz Master", desc: "Complete 5 quizzes", unlocked: stats?.quizzesCompleted >= 5 },
            { id: 4, icon: "🔥", name: "On Fire", desc: "7 day streak", unlocked: stats?.streak >= 7 },
            { id: 5, icon: "💎", name: "Diamond", desc: "Reach level 10", unlocked: currentLevel >= 10 },
            { id: 6, icon: "🌟", name: "Star Student", desc: "5000+ points", unlocked: stats?.totalPoints >= 5000 },
            { id: 7, icon: "💬", name: "Conversationalist", desc: "50+ AI chats", unlocked: stats?.chatCount >= 50 },
            { id: 8, icon: "🎨", name: "Creator", desc: "Create 20 materials", unlocked: stats?.materialsCount >= 20 },
          ].map((badge) => (
            <motion.div
              key={badge.id}
              whileHover={{ scale: badge.unlocked ? 1.05 : 1 }}
              className={`relative p-4 rounded-lg text-center transition ${
                badge.unlocked
                  ? "bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border-2 border-yellow-400"
                  : "bg-gray-100 dark:bg-gray-700 opacity-50 grayscale"
              }`}
            >
              <div className="text-4xl mb-2">{badge.icon}</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {badge.name}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {badge.desc}
              </div>
              {badge.unlocked && (
                <div className="absolute top-1 right-1 text-green-500">✓</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Study Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Materials Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            📊 Study Materials
          </h3>
          <div className="space-y-3">
            {[
              { label: "Total Materials", value: stats?.materialsCount || 0, icon: "📚" },
              { label: "Topics Covered", value: stats?.topicsCount || 0, icon: "🏷️" },
              { label: "Average Difficulty", value: stats?.avgDifficulty || "N/A", icon: "📈" },
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span>{item.icon}</span>
                  {item.label}
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            🎯 Quiz Performance
          </h3>
          <div className="space-y-3">
            {[
              { label: "Quizzes Completed", value: stats?.quizzesCompleted || 0, icon: "✅" },
              { label: "Average Score", value: `${stats?.avgQuizScore || 0}%`, icon: "📊" },
              { label: "Best Score", value: `${stats?.bestScore || 0}%`, icon: "🏆" },
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span>{item.icon}</span>
                  {item.label}
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          📅 Recent Activity
        </h3>
        <div className="space-y-3">
          {(stats?.recentActivity || []).length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No recent activity yet. Start studying to see your progress!
            </p>
          ) : (
            stats?.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="text-2xl">{activity.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.timestamp}
                  </div>
                </div>
                <div className="text-green-600 dark:text-green-400 font-bold">
                  +{activity.xp} XP
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}