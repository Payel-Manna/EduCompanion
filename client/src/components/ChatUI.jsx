// src/components/ChatUI.jsx
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, clearChat, loadChatHistory } from "../redux/chatSlice";

export default function ChatUI({ token }) {
  const dispatch = useDispatch();
  const { messages, sources, loading, error } = useSelector(state => state.chat);
  const [query, setQuery] = useState("");
  const [showSources, setShowSources] = useState(true);
  const messagesEndRef = useRef(null);

  // Load chat history on mount
  useEffect(() => {
    if (token) {
      dispatch(loadChatHistory({ token }));
    }
  }, [dispatch, token]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;
    
    const userQuery = query;
    setQuery("");
    dispatch(sendMessage({ query: userQuery, token }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const handleClear = () => {
    if (window.confirm("Clear all chat history?")) {
      dispatch(clearChat());
    }
  };

  return (
    <div className="flex h-full gap-4">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded shadow">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              AI Study Assistant
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ask questions about your study materials
            </p>
          </div>
          <button
            onClick={handleClear}
            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Clear Chat
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Start a Conversation
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
                Ask me anything about your study materials!
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question..."
              className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Sources Sidebar */}
      {sources && sources.length > 0 && showSources && (
        <div className="w-80 bg-white dark:bg-gray-800 rounded shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Sources Used
            </h3>
            <button
              onClick={() => setShowSources(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="space-y-3">
            {sources.map((source, idx) => (
              <div
                key={idx}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                  {source.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {source.topic}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}// // components/ChatUI.jsx
// import React, { useState, useRef, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { sendMessage, clearChat, loadChatHistory } from "../redux/chatSlice";

// export default function ChatUI({ token }) {
//   const dispatch = useDispatch();
//   const { messages, sources, loading, error } = useSelector(state => state.chat);
//   const [query, setQuery] = useState("");
//   const [showSources, setShowSources] = useState(true);
//   const messagesEndRef = useRef(null);

//   // Load chat history on mount
//   useEffect(() => {
//     if (token) {
//       dispatch(loadChatHistory({ token }));
//     }
//   }, [dispatch, token]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!query.trim() || loading) return;
    
//     const userQuery = query;
//     setQuery("");
//     dispatch(sendMessage({ query: userQuery, token }));
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend(e);
//     }
//   };

//   const handleClear = () => {
//     if (window.confirm("Clear all chat history?")) {
//       dispatch(clearChat());
//     }
//   };

//   return (
//     <div className="flex h-full gap-4">
//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded shadow">
//         {/* Header */}
//         <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
//           <div>
//             <h2 className="text-xl font-bold text-gray-900 dark:text-white">
//               AI Study Assistant
//             </h2>
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               Ask questions about your study materials
//             </p>
//           </div>
//           <button
//             onClick={handleClear}
//             className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
//           >
//             Clear Chat
//           </button>
//         </div>

//         {/* Messages Area */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-4">
//           {messages.length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-4xl mb-4">💡</div>
//               <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                 Start a Conversation
//               </h3>
//               <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
//                 Ask me anything about your study materials. I'll use your notes to provide accurate answers!
//               </p>
//               <div className="mt-6 space-y-2">
//                 <button
//                   onClick={() => setQuery("Summarize my React notes")}
//                   className="block w-full max-w-xs mx-auto px-4 py-2 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
//                 >
//                   "Summarize my React notes"
//                 </button>
//                 <button
//                   onClick={() => setQuery("What are the key concepts in my materials?")}
//                   className="block w-full max-w-xs mx-auto px-4 py-2 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
//                 >
//                   "What are the key concepts?"
//                 </button>
//               </div>
//             </div>
//           )}

//           {messages.map((msg, idx) => (
//             <div
//               key={idx}
//               className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className={`max-w-[80%] rounded-lg px-4 py-3 ${
//                   msg.role === "user"
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//                 }`}
//               >
//                 <div className="flex items-start gap-2">
//                   <div className="text-lg">
//                     {msg.role === "user" ? "👤" : "🤖"}
//                   </div>
//                   <div className="flex-1">
//                     <div className="text-xs font-semibold mb-1 opacity-70">
//                       {msg.role === "user" ? "You" : "AI Assistant"}
//                     </div>
//                     <div className="whitespace-pre-wrap">{msg.content}</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}

//           {loading && (
//             <div className="flex justify-start">
//               <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 max-w-[80%]">
//                 <div className="flex items-center gap-2">
//                   <div className="text-lg">🤖</div>
//                   <div className="flex gap-1">
//                     <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
//                     <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
//                     <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {error && (
//             <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded">
//               <strong className="font-semibold">Error:</strong> {error}
//             </div>
//           )}

//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input Area */}
//         <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//           <form onSubmit={handleSend} className="flex gap-2">
//             <textarea
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Ask a question about your study materials..."
//               rows={1}
//               className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//               style={{ minHeight: '44px', maxHeight: '120px' }}
//             />
//             <button
//               type="submit"
//               disabled={loading || !query.trim()}
//               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
//             >
//               {loading ? "..." : "Send"}
//             </button>
//           </form>
//           <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
//             Press Enter to send, Shift+Enter for new line
//           </p>
//         </div>
//       </div>

//       {/* Sources Sidebar */}
//       {sources && sources.length > 0 && (
//         <div className={`${showSources ? 'w-80' : 'w-12'} transition-all duration-300 bg-white dark:bg-gray-800 rounded shadow`}>
//           <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
//             {showSources ? (
//               <>
//                 <h3 className="font-semibold text-gray-900 dark:text-white">
//                   Sources Used
//                 </h3>
//                 <button
//                   onClick={() => setShowSources(false)}
//                   className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//                 >
//                   ✕
//                 </button>
//               </>
//             ) : (
//               <button
//                 onClick={() => setShowSources(true)}
//                 className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rotate-90"
//               >
//                 📚
//               </button>
//             )}
//           </div>
          
//           {showSources && (
//             <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100% - 60px)' }}>
//               {sources.map((source, idx) => (
//                 <div
//                   key={idx}
//                   className="p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
//                 >
//                   <div className="flex items-start justify-between mb-1">
//                     <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
//                       Source {idx + 1}
//                     </span>
//                     <span className="text-xs text-gray-500 dark:text-gray-400">
//                       {Math.round(source.relevanceScore * 100)}% match
//                     </span>
//                   </div>
//                   <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-1">
//                     {source.title}
//                   </h4>
//                   <div className="flex gap-2">
//                     <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded">
//                       {source.topic}
//                     </span>
//                     {source.type && (
//                       <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
//                         {source.type}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }