// src/components/FeedbackForm.jsx
import React, { useState } from "react";
import axiosInstance from "../apicalls/axiosInstance";
import { motion } from "framer-motion";

export default function FeedbackForm({ token }) {
  const [formData, setFormData] = useState({
    category: "general",
    rating: 5,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await axiosInstance.post(
        "/api/feedback",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setFormData({ category: "general", rating: 5, message: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          💭 We Value Your Feedback
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Help us improve EduCompanion by sharing your thoughts
        </p>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 rounded-lg"
        >
          ✅ Thank you! Your feedback has been submitted successfully.
        </motion.div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="general">General Feedback</option>
            <option value="bug">Bug Report</option>
            <option value="feature">Feature Request</option>
            <option value="ui">UI/UX Improvement</option>
            <option value="ai">AI Performance</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            How would you rate your experience? ({formData.rating}/5)
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                className="text-3xl transition-transform hover:scale-110"
              >
                {star <= formData.rating ? "⭐" : "☆"}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Feedback *
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
            rows={6}
            placeholder="Tell us what you think, what's working well, and what could be improved..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formData.message.length} / 500 characters
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !formData.message.trim()}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>

      {/* Contact Info */}
      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          Other Ways to Reach Us
        </h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>📧 Email: support@educompanion.com</p>
          <p>💬 Discord: Join our community</p>
          <p>🐦 Twitter: @educompanion</p>
        </div>
      </div>
    </div>
  );
}// // src/components/FeedbackForm.jsx
// import React, { useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import axiosInstance from "../apicalls/axiosInstance";
// export default function FeedbackForm({ token }) {
//   const [formData, setFormData] = useState({
//     category: "general",
//     rating: 5,
//     message: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess(false);

//     try {
//       await axiosInstance.post(
//         "/api/feedback",
//         formData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setSuccess(true);
//       setFormData({ category: "general", rating: 5, message: "" });
//       setTimeout(() => setSuccess(false), 5000);
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to submit feedback");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-8">
//       <div className="text-center mb-8">
//         <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//           💭 We Value Your Feedback
//         </h2>
//         <p className="text-gray-600 dark:text-gray-400">
//           Help us improve EduCompanion by sharing your thoughts
//         </p>
//       </div>

//       {success && (
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 rounded-lg"
//         >
//           ✅ Thank you! Your feedback has been submitted successfully.
//         </motion.div>
//       )}

//       {error && (
//         <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
//           ❌ {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Category */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Category
//           </label>
//           <select
//             value={formData.category}
//             onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//             className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="general">General Feedback</option>
//             <option value="bug">Bug Report</option>
//             <option value="feature">Feature Request</option>
//             <option value="ui">UI/UX Improvement</option>
//             <option value="ai">AI Performance</option>
//             <option value="other">Other</option>
//           </select>
//         </div>

//         {/* Rating */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             How would you rate your experience? ({formData.rating}/5)
//           </label>
//           <div className="flex items-center gap-2">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <button
//                 key={star}
//                 type="button"
//                 onClick={() => setFormData({ ...formData, rating: star })}
//                 className="text-3xl transition-transform hover:scale-110"
//               >
//                 {star <= formData.rating ? "⭐" : "☆"}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Message */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Your Feedback *
//           </label>
//           <textarea
//             value={formData.message}
//             onChange={(e) => setFormData({ ...formData, message: e.target.value })}
//             required
//             rows={6}
//             placeholder="Tell us what you think, what's working well, and what could be improved..."
//             className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//           />
//           <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//             {formData.message.length} / 500 characters
//           </p>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={loading || !formData.message.trim()}
//           className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition"
//         >
//           {loading ? "Submitting..." : "Submit Feedback"}
//         </button>
//       </form>

//       {/* Contact Info */}
//       <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
//         <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
//           Other Ways to Reach Us
//         </h3>
//         <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
//           <p>📧 Email: support@educompanion.com</p>
//           <p>💬 Discord: Join our community</p>
//           <p>🐦 Twitter: @educompanion</p>
//         </div>
//       </div>
//     </div>
//   );
// }