# 🎓 EduCompanion - AI Study Platform

An intelligent study companion powered by **RAG (Retrieval Augmented Generation)**, featuring AI chat, automated quiz generation, and interactive 3D visualization.

![Tech Stack](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge\&logo=express\&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=node.js\&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-FF6B35?style=for-the-badge\&logo=ai\&logoColor=white)

---

## ✨ Features

* 🤖 **AI Study Assistant** — Chat with AI about your study materials using RAG
* 📚 **Smart Material Management** — Upload and organize study notes with vector embeddings
* 🎯 **Auto-Generated Quizzes** — AI creates quizzes from your study materials
* 🖥️ **3D Study Desk** — Interactive Three.js visualization of your materials
* 🌙 **Dark Mode** — Eye-friendly dark theme
* 📊 **Progress Tracking** — Monitor your learning journey
* 🔒 **Secure Authentication** — JWT-based auth with bcrypt encryption

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend      │
│   (React + Vite)│
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐
│   Backend       │
│   (Express.js)  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐ ┌───▼──────┐
│MongoDB│ │ Groq API │
│Vector │ │ (LLM)    │
│Search │ └──────────┘
└───────┘
```

---

## 🚀 Quick Start

### Prerequisites

* Node.js v18+
* MongoDB Atlas account
* Groq API key

### Installation

#### 1️⃣ Clone the repository

```bash
git clone <your-repo-url>
cd educompanion
```

#### 2️⃣ Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

#### 3️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

#### 4️⃣ Test Setup (Optional)

```bash
cd server
node test/testSetup.js
```

---

## 📋 Environment Variables

Create `server/.env` file:

```env
MONGODB_URI=your_mongodb_atlas_uri
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_jwt_secret_min_32_chars
PORT=8000
NODE_ENV=development
```

---

## 🗄️ MongoDB Vector Search Index

Create this index in MongoDB Atlas (`studymaterials` collection, name: `vector_index_notes`):

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 384,
      "similarity": "cosine"
    },
    {
      "type": "filter",
      "path": "createdBy"
    }
  ]
}
```

---

## 📖 Usage

1. **Sign Up** — Create your account
2. **Add Materials** — Upload your study notes
3. **Chat with AI** — Ask questions about your materials
4. **Take Quizzes** — Generate and take AI-powered quizzes
5. **Track Progress** — Monitor your learning

---

## 🛠️ Tech Stack

### Frontend

* React 18
* Redux Toolkit
* React Three Fiber
* Framer Motion
* Tailwind CSS
* Axios

### Backend

* Node.js & Express
* MongoDB & Mongoose
* Groq SDK (LLM)
* Xenova Transformers (Embeddings)
* JWT Authentication
* Bcrypt

---

## 📁 Project Structure

```
educompanion/
├── server/
│   ├── config/
│   │   ├── db.js
│   │   └── embeddingHelper.js
│   ├── controllers/
│   │   ├── chat.controller.js
│   │   ├── quiz.controllers.js
│   │   └── studyMaterial.controllers.js
│   ├── models/
│   │   ├── chatSession.models.js
│   │   ├── quiz.models.js
│   │   └── studyMaterials.models.js
│   ├── routes/
│   ├── middlewares/
│   └── server.js
└── client/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── redux/
    │   ├── apicalls/
    │   └── App.jsx
    └── index.html
```

---

## 🔌 API Endpoints

### Authentication

* `POST /api/auth/signup` — Create account
* `POST /api/auth/login` — Login
* `POST /api/auth/signout` — Logout

### Study Materials

* `POST /api/material` — Add material
* `GET /api/material` — Get all materials
* `GET /api/material/:id` — Get specific material
* `PUT /api/material/:id` — Update material
* `DELETE /api/material/:id` — Delete material

### Chat (RAG)

* `POST /api/chat` — Chat with AI
* `GET /api/chat/history` — Get chat history
* `DELETE /api/chat/history` — Clear history

### Quiz

* `POST /api/quiz` — Generate quiz
* `GET /api/quiz` — Get saved quizzes
* `GET /api/quiz/:id` — Get specific quiz
* `DELETE /api/quiz/:id` — Delete quiz

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📝 License

MIT License — free to use for learning and development.

---

## 🙏 Acknowledgments

* [Groq](https://groq.com) — Fast LLM inference
* [MongoDB](https://mongodb.com) — Vector search capabilities
* [Xenova Transformers](https://github.com/xenova/transformers.js) — Embeddings
* [React Three Fiber](https://github.com/pmndrs/react-three-fiber) — 3D visualization

---

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ for students worldwide.
