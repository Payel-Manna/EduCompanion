// src/components/Leaderboard.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../apicalls/axiosInstance";
import { motion } from "framer-motion";

export default function Leaderboard({ token }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("all");
  const [category, setCategory] = useState("points");

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe, category]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/user/leaderboard", {
        headers: { Authorization: `Bearer ${token}` },
        params: { timeframe, category },
      });
      setLeaderboard(res.data.leaderboard || []);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "text-yellow-500";
    if (rank === 2) return "text-gray-400";
    if (rank === 3) return "text-orange-500";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-lg shadow-lg p-8 mb-6 text-white text-center">
        <h2 className="text-4xl font-bold mb-2">🏆 Leaderboard</h2>
        <p className="text-lg opacity-90">Compete with fellow learners worldwide!</p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Timeframe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Timeframe
            </label>
            <div className="flex gap-2">
              {["all", "week", "month"].map((time) => (
                <button
                  key={time}
                  onClick={() => setTimeframe(time)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                    timeframe === time
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {time === "all" ? "All Time" : time === "week" ? "This Week" : "This Month"}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <div className="flex gap-2">
              {["points", "quizzes", "streak"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                    category === cat
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {cat === "points" ? "⭐ Points" : cat === "quizzes" ? "🎯 Quizzes" : "🔥 Streak"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <p className="text-gray-500 dark:text-gray-400">
              No data available yet. Start studying to appear on the leaderboard!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {leaderboard.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                  user.isCurrentUser ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className={`text-2xl font-bold ${getRankColor(index + 1)} min-w-[50px] text-center`}>
                    {getRankIcon(index + 1)}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </h3>
                      {user.isCurrentUser && (
                        <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded-full">
                          You
                        </span>
                      )}
                      {index < 3 && (
                        <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full">
                          Top {index + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                      <span>📚 {user.materialsCount || 0} materials</span>
                      <span>🎯 {user.quizzesCompleted || 0} quizzes</span>
                      <span>🔥 {user.streak || 0} day streak</span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {category === "points" && `${user.totalPoints || 0}`}
                      {category === "quizzes" && `${user.quizzesCompleted || 0}`}
                      {category === "streak" && `${user.streak || 0}`}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {category === "points" && "points"}
                      {category === "quizzes" && "completed"}
                      {category === "streak" && "days"}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          🎖️ Top Achievements
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "🔥", label: "Longest Streak", value: "15 days" },
            { icon: "⚡", label: "Fastest Learner", value: "UserX" },
            { icon: "🎯", label: "Quiz Master", value: "UserY" },
            { icon: "📚", label: "Most Materials", value: "50+" },
          ].map((achievement, index) => (
            <div
              key={index}
              className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg"
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                {achievement.label}
              </div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {achievement.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}// // src/components/Leaderboard.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import axiosInstance from "../apicalls/axiosInstance";
// export default function Leaderboard({ token }) {
//   const [leaderboard, setLeaderboard] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [timeframe, setTimeframe] = useState("all"); // all, week, month
//   const [category, setCategory] = useState("points"); // points, quizzes, streak

//   useEffect(() => {
//     fetchLeaderboard();
//   }, [timeframe, category]);

//   const fetchLeaderboard = async () => {
//     setLoading(true);
//     try {
//       const res = await axiosInstance.get("/api/user/leaderboard", {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { timeframe, category },
//       });
//       setLeaderboard(res.data.leaderboard || []);
//     } catch (err) {
//       console.error("Failed to fetch leaderboard:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getRankIcon = (rank) => {
//     if (rank === 1) return "🥇";
//     if (rank === 2) return "🥈";
//     if (rank === 3) return "🥉";
//     return `#${rank}`;
//   };

//   const getRankColor = (rank) => {
//     if (rank === 1) return "text-yellow-500";
//     if (rank === 2) return "text-gray-400";
//     if (rank === 3) return "text-orange-500";
//     return "text-gray-600 dark:text-gray-400";
//   };

//   return (
//     <div className="max-w-4xl mx-auto">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-lg shadow-lg p-8 mb-6 text-white text-center">
//         <h2 className="text-4xl font-bold mb-2">🏆 Leaderboard</h2>
//         <p className="text-lg opacity-90">Compete with fellow learners worldwide!</p>
//       </div>

//       {/* Filters */}
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Timeframe */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Timeframe
//             </label>
//             <div className="flex gap-2">
//               {["all", "week", "month"].map((time) => (
//                 <button
//                   key={time}
//                   onClick={() => setTimeframe(time)}
//                   className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
//                     timeframe === time
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
//                   }`}
//                 >
//                   {time === "all" ? "All Time" : time === "week" ? "This Week" : "This Month"}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Category */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Category
//             </label>
//             <div className="flex gap-2">
//               {["points", "quizzes", "streak"].map((cat) => (
//                 <button
//                   key={cat}
//                   onClick={() => setCategory(cat)}
//                   className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
//                     category === cat
//                       ? "bg-purple-600 text-white"
//                       : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
//                   }`}
//                 >
//                   {cat === "points" ? "⭐ Points" : cat === "quizzes" ? "🎯 Quizzes" : "🔥 Streak"}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Leaderboard List */}
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
//         {loading ? (
//           <div className="flex items-center justify-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           </div>
//         ) : leaderboard.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="text-6xl mb-4">🏆</div>
//             <p className="text-gray-500 dark:text-gray-400">
//               No data available yet. Start studying to appear on the leaderboard!
//             </p>
//           </div>
//         ) : (
//           <div className="divide-y divide-gray-200 dark:divide-gray-700">
//             {leaderboard.map((user, index) => (
//               <motion.div
//                 key={user._id}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: index * 0.05 }}
//                 className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
//                   user.isCurrentUser ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600" : ""
//                 }`}
//               >
//                 <div className="flex items-center gap-4">
//                   {/* Rank */}
//                   <div className={`text-2xl font-bold ${getRankColor(index + 1)} min-w-[50px] text-center`}>
//                     {getRankIcon(index + 1)}
//                   </div>

//                   {/* Avatar */}
//                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
//                     {user.name.charAt(0).toUpperCase()}
//                   </div>

//                   {/* User Info */}
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2">
//                       <h3 className="font-semibold text-gray-900 dark:text-white">
//                         {user.name}
//                       </h3>
//                       {user.isCurrentUser && (
//                         <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded-full">
//                           You
//                         </span>
//                       )}
//                       {index < 3 && (
//                         <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full">
//                           Top {index + 1}
//                         </span>
//                       )}
//                     </div>
//                     <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
//                       <span>📚 {user.materialsCount || 0} materials</span>
//                       <span>🎯 {user.quizzesCompleted || 0} quizzes</span>
//                       <span>🔥 {user.streak || 0} day streak</span>
//                     </div>
//                   </div>

//                   {/* Score */}
//                   <div className="text-right">
//                     <div className="text-2xl font-bold text-gray-900 dark:text-white">
//                       {category === "points" && `${user.totalPoints || 0}`}
//                       {category === "quizzes" && `${user.quizzesCompleted || 0}`}
//                       {category === "streak" && `${user.streak || 0}`}
//                     </div>
//                     <div className="text-xs text-gray-500 dark:text-gray-400">
//                       {category === "points" && "points"}
//                       {category === "quizzes" && "completed"}
//                       {category === "streak" && "days"}
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Achievements */}
//       <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
//         <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
//           🎖️ Top Achievements
//         </h3>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {[
//             { icon: "🔥", label: "Longest Streak", value: "15 days" },
//             { icon: "⚡", label: "Fastest Learner", value: "UserX" },
//             { icon: "🎯", label: "Quiz Master", value: "UserY" },
//             { icon: "📚", label: "Most Materials", value: "50+" },
//           ].map((achievement, index) => (
//             <div
//               key={index}
//               className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg"
//             >
//               <div className="text-3xl mb-2">{achievement.icon}</div>
//               <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
//                 {achievement.label}
//               </div>
//               <div className="font-semibold text-gray-900 dark:text-white">
//                 {achievement.value}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }