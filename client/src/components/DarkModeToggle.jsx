// components/DarkModeToggle.jsx
import React, { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  return (
    <button
      className="p-2 rounded-full border hover:bg-gray-200 dark:hover:bg-gray-700"
      onClick={() => setDark(!dark)}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
