// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logoutUser } from "../redux/authSlice";

import AddMaterial from "../components/AddMaterial";
import StudyDesk3D from "../components/StudyDesk3D";
import ChatUI from "../components/ChatUI";
import QuizUI from "../components/QuizUI";
import FeedbackForm from "../components/FeedbackForm";
import Leaderboard from "../components/Leaderboard";
import UserProgress from "../components/UserProgress";
import DarkModeToggle from "../components/DarkModeToggle";
import axiosInstance from "../apicalls/axiosInstance";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState("desk");
  const [books, setBooks] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Fetch user-specific study materials
  useEffect(() => {
    if (!token) return;

    setLoading(true);
    setError("");

    console.log("Fetching materials with token:", token ? "present" : "missing");

    axiosInstance
      .get("/api/material", { 
        headers: { Authorization: `Bearer ${token}` } 
      })
      .then(res => {
        console.log("Materials response:", res.data);
        // Handle both array and object responses
        const materialsData = Array.isArray(res.data) ? res.data : (res.data.materials || []);
        
        const mappedBooks = materialsData.map(mat => ({
          title: mat.title,
          id: mat._id,
          topic: mat.topic,
          content: mat.content,
          type: mat.type,
          difficulty: mat.difficulty,
          url: mat.url,
          summary: mat.summary || mat.content?.substring(0, 200) + "...",
        }));
        setBooks(mappedBooks);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch study materials:", err);
        console.error("Error response:", err.response?.data);
        setError(err.response?.data?.error || "Failed to load study materials");
        setLoading(false);
      });
  }, [token, refresh]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                🎓 EduCompanion
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {books.length} study materials • Welcome, {user?.name || "Student"}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <DarkModeToggle />
              
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="hidden md:block text-gray-900 dark:text-white font-medium">
                    {user?.name}
                  </span>
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                    <button
                      onClick={() => {
                        setActiveTab("profile");
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      👤 Profile
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("feedback");
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      💬 Feedback
                    </button>
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: "desk", label: "📚 Study Desk", color: "blue" },
            { id: "chat", label: "💬 AI Chat", color: "green" },
            { id: "quiz", label: "🎯 Quiz", color: "purple" },
            { id: "progress", label: "📊 Progress", color: "orange" },
            { id: "leaderboard", label: "🏆 Leaderboard", color: "yellow" },
            { id: "feedback", label: "💭 Feedback", color: "pink" },
          ].map(tab => (
            <button
              key={tab.id}
              className={`px-6 py-2.5 rounded-lg font-medium transition whitespace-nowrap ${
                activeTab === tab.id
                  ? `bg-${tab.color}-600 text-white shadow-lg`
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        <div className="min-h-[calc(100vh-280px)]">
          {activeTab === "desk" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              <div className="lg:col-span-1 overflow-y-auto max-h-[calc(100vh-280px)]">
                <AddMaterial 
                  token={token} 
                  onAdded={() => setRefresh(prev => prev + 1)} 
                />
              </div>
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow min-h-[500px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-500 dark:text-gray-400">Loading materials...</p>
                    </div>
                  </div>
                ) : books.length === 0 ? (
                  <div className="flex items-center justify-center h-full p-8">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📚</div>
                      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        No Study Materials Yet
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Add your first study material to get started
                      </p>
                    </div>
                  </div>
                ) : (
                  <StudyDesk3D books={books} key={books.length} />
                )}
              </div>
            </div>
          )}

          {activeTab === "chat" && (
            <div className="h-[calc(100vh-280px)]">
              {books.length === 0 ? (
                <div className="flex items-center justify-center h-full bg-white dark:bg-gray-800 rounded-lg shadow">
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Add Study Materials First
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      You need to add some study materials before you can chat with the AI
                    </p>
                    <button
                      onClick={() => setActiveTab("desk")}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Go to Study Desk
                    </button>
                  </div>
                </div>
              ) : (
                <ChatUI token={token} />
              )}
            </div>
          )}

          {activeTab === "quiz" && (
            <div className="h-[calc(100vh-280px)]">
              {books.length === 0 ? (
                <div className="flex items-center justify-center h-full bg-white dark:bg-gray-800 rounded-lg shadow">
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Add Study Materials First
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      You need to add some study materials before generating quizzes
                    </p>
                    <button
                      onClick={() => setActiveTab("desk")}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Go to Study Desk
                    </button>
                  </div>
                </div>
              ) : (
                <QuizUI token={token} books={books} />
              )}
            </div>
          )}

          {activeTab === "progress" && <UserProgress token={token} />}
          {activeTab === "leaderboard" && <Leaderboard token={token} />}
          {activeTab === "feedback" && <FeedbackForm token={token} />}
        </div>
      </div>
    </div>
  );
}