// pages/EduCompanion.jsx
import React, { useState } from "react";
import StudyDesk3D from "../components/StudyDesk3D";
import AddMaterial from "../components/AddMaterial";
import Quiz from "../components/Quiz";

export default function EduCompanion({ token }) {
  const [topic, setTopic] = useState("");

  return (
    <div className="p-6 space-y-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EduCompanion</h1>

      {/* Add new study material */}
      <div className="border rounded p-4 bg-white dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-2">Add Study Material</h2>
        <AddMaterial token={token} />
      </div>

      {/* Topic selection for StudyDesk3D and Quiz */}
      <div className="border rounded p-4 bg-white dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-2">Select Topic</h2>
        <input
          placeholder="Enter topic"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />
      </div>

      {/* 3D Study Desk */}
      {topic && (
        <div className="border rounded p-4 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-2">Study Desk 3D</h2>
          <StudyDesk3D token={token} />
        </div>
      )}

      {/* Quiz */}
      {topic && (
        <div className="border rounded p-4 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-2">AI Quiz</h2>
          <Quiz token={token} topic={topic} />
        </div>
      )}
    </div>
  );
}
