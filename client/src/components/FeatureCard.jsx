// src/components/FeatureCard.jsx
import React from "react";
import { motion } from "framer-motion";

export default function FeatureCard({ title, description, icon }) {
  return (
    <motion.div
      className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer text-center"
      whileHover={{ scale: 1.05 }}
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-700 dark:text-gray-300">{description}</p>
    </motion.div>
  );
}
