# ChatbotCanvas - Build your own chatbot in minutes

ChatbotCanvas is a platform that allows you to extract FAQs from websites or documents, transform them into structured data, and store them in a vector database for semantic search. It integrates with modern LLMs to let you build and deploy your own intelligent chatbots quickly and easily.

---

## 🎥 Demo

[Watch Demo](https://github.com/icebear-py/chatbotcanvas/blob/main/demo.mp4?raw=true)

---

## 🚀 Features

- Extract dynamic content from URLs using Playwright or BeautifulSoup.
- Parse and structure FAQs into clean JSON.
- Store embeddings in Qdrant VectorDB for semantic search.
- Use RAG pipelines with OpenRouter LLMs to generate natural, context-aware responses.
- Multi-tenant API key access for users.
- Frontend: React + Vite + TailwindCSS.
- Backend: FastAPI.

---

## 🧩 Architecture Overview

- Crawler/Parser: Fetches and processes pages or documents; outputs normalized FAQ JSON.
- Embeddings + Storage: Generates embeddings and stores them in Qdrant collections.
- API (FastAPI): Endpoints for ingestion, search, and chat.
- Client (React): UI for managing sources and chatting with the model.

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/chatbotcanvas.git
cd chatbotcanvas
```

### 2. Backend setup (FastAPI)

```bash
cd backend
python -m venv venv
# Linux/Mac
source venv/bin/activate
# Windows
venv\Scripts\activate
pip install -r requirements.txt
```

Run locally:

```bash
uvicorn app.main:app --reload
```

This starts the API at http://127.0.0.1:8000 by default (or PORT from env).

### 3. Frontend setup (React + Vite + TailwindCSS)

```bash
cd frontend
npm install
npm run dev
```

This starts the app at http://localhost:5173.

---

## ⚙️ Environment Variables

### Get free Api keys for env

Free LLMs via Openrouter : https://openrouter.ai/

Free tier vectordb via Qdrant : https://qdrant.tech/pricing/

### Backend .env

Create `backend/.env`:

```env
# LLM via OpenRouter
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_LLM_MODEL=meta-llama/llama-3-70b-instruct

# Qdrant Vector Database
QDRANT_URL=https://your-qdrant-instance.up.railway.app
QDRANT_API_KEY=your_qdrant_api_key

# Backend
PORT=8000
```

Notes:
- Ensure your Qdrant instance is reachable from the backend.
- You may add collection names, namespace, or embedding model configs as needed.

### Frontend .env

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

When deploying, update this to your backend URL.

---

## 📦 Deployment (Railway)

Create two Railway services from this repo:

- Backend (root: `backend`) — start command:
  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port $PORT
  ```

- Frontend (root: `frontend`) — start command:
  ```bash
  npm run start
  ```

Add environment variables in the Railway dashboard. Railway will provide URLs, e.g.:

- Backend → `https://your-backend.up.railway.app`
- Frontend → `https://your-frontend.up.railway.app`

Update the frontend `VITE_API_BASE_URL` to point to the backend URL.

---

## 📄 License

MIT License © 2025 ChatbotCanvas

---

## Authors
- **Ansh**
