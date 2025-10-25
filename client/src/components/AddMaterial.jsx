import React, { useState } from "react";
import axiosInstance from "../apicalls/axiosInstance";

export default function AddMaterial({ token, onAdded }) {
  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    content: "",
    difficulty: "beginner",
    type: "notes",
    url: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return setError("You must be logged in");

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axiosInstance.post("/api/material", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess("Material added successfully!");
      setFormData({
        title: "",
        topic: "",
        content: "",
        difficulty: "beginner",
        type: "notes",
        url: ""
      });
      if (onAdded) onAdded();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add material");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add Study Material</h2>
      {error && <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={formData.title} onChange={handleChange} required placeholder="Title" />
        <input name="topic" value={formData.topic} onChange={handleChange} required placeholder="Topic" />
        <textarea name="content" value={formData.content} onChange={handleChange} required placeholder="Content" rows={4} />
        <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="notes">Notes</option>
          <option value="article">Article</option>
          <option value="summary">Summary</option>
          <option value="video">Video</option>
        </select>
        <input type="url" name="url" value={formData.url} onChange={handleChange} placeholder="URL (Optional)" />
        <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Material"}</button>
      </form>
    </div>
  );
}
// // components/AddMaterial.jsx
// import React, { useState } from "react";
// import axios from "axios";
// import axiosInstance from "../apicalls/axiosInstance";
// export default function AddMaterial({ token, onAdded }) {
//   const [formData, setFormData] = useState({
//     title: "",
//     topic: "",
//     content: "",
//     difficulty: "beginner",
//     type: "notes",
//     url: ""
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     console.log("Submitting material:", formData);
//     console.log("Token:", token ? "present" : "missing");

//     try {
//       const response = await axiosInstance.post(
//         "/api/material",
//         formData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       console.log("Add material response:", response.data);
      
//       setSuccess("Material added successfully!");
//       setFormData({
//         title: "",
//         topic: "",
//         content: "",
//         difficulty: "beginner",
//         type: "notes",
//         url: ""
//       });
      
//       if (onAdded) onAdded();
//     } catch (err) {
//       console.error("Add material error:", err);
//       console.error("Error response:", err.response?.data);
//       setError(err.response?.data?.error || err.response?.data?.details || "Failed to add material");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
//       <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
//         Add Study Material
//       </h2>

//       {error && (
//         <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded">
//           {success}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//             Title *
//           </label>
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="e.g., Introduction to React Hooks"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//             Topic *
//           </label>
//           <input
//             type="text"
//             name="topic"
//             value={formData.topic}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="e.g., React, JavaScript, Math"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//             Content *
//           </label>
//           <textarea
//             name="content"
//             value={formData.content}
//             onChange={handleChange}
//             required
//             rows={6}
//             className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter your study notes here..."
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Difficulty
//             </label>
//             <select
//               name="difficulty"
//               value={formData.difficulty}
//               onChange={handleChange}
//               className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="beginner">Beginner</option>
//               <option value="intermediate">Intermediate</option>
//               <option value="advanced">Advanced</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Type
//             </label>
//             <select
//               name="type"
//               value={formData.type}
//               onChange={handleChange}
//               className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="notes">Notes</option>
//               <option value="article">Article</option>
//               <option value="summary">Summary</option>
//               <option value="video">Video</option>
//             </select>
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//             URL (Optional)
//           </label>
//           <input
//             type="url"
//             name="url"
//             value={formData.url}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="https://example.com/resource"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded font-medium transition"
//         >
//           {loading ? "Adding..." : "Add Material"}
//         </button>
//       </form>
//     </div>
//   );
// }