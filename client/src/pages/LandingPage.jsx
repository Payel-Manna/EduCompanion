// src/pages/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import LandingHero from "../components/LandingHero";
import FeatureCard from "../components/FeatureCard";
import { motion } from "framer-motion";

const features = [
  {
    title: "AI Study Assistant",
    description: "Get instant answers and personalized guidance from AI.",
    icon: "🤖",
  },
  {
    title: "Interactive 3D Desk",
    description: "Visualize your study materials in an immersive 3D environment.",
    icon: "🖥️",
  },
  {
    title: "Quizzes & Progress Tracking",
    description: "Generate quizzes from your notes and track your progress.",
    icon: "📊",
  },
  {
    title: "Gamification & Rewards",
    description: "Earn badges, XP, and maintain streaks to stay motivated.",
    icon: "🏆",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white">
      
      {/* Hero Section */}
      <LandingHero />

      {/* Features Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Start Learning Smarter Today
        </h2>
        <p className="mb-8 text-lg md:text-xl">
          Join EduCompanion and transform your study experience.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/signup"
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-blue-600 transition shadow-lg"
          >
            Login
          </Link>
        </div>
      </section>
    </div>
  );
}
