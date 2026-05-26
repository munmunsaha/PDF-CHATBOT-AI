# AI PDF Chat App

Production-ready full-stack app to chat with Groq, with optional PDF upload support for context-aware answers.

## Highlights

- Optional PDF upload with drag/drop, validation, and preview
- AI chat (`/ask-question`) powered by Groq, with PDF context used when available
- Typing animation, loading skeletons, smooth scroll chat
- Light/Dark mode toggle and mobile responsive UI
- Backend security middleware, rate limiting, and global error handling
- Reusable Axios API layer with toast notifications

## Project Structure

- `frontend/` React + Vite + Bootstrap
- `backend/` Express + Groq + PDF context retrieval

## API Endpoints

- `POST /upload-pdf` upload and store PDF context
- `POST /ask-question` ask a question using Groq, with PDF context when available
- `GET /health` health check

## Local Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Environment Variables

### Backend (`backend/.env`)

- `NODE_ENV=development|production`
- `PORT=4000`
- `FRONTEND_URL=http://localhost:5173`
- `GROQ_API_KEY=...`
- `GROQ_MODEL=llama-3.3-70b-versatile`
- `RATE_LIMIT_MAX=150`

### Frontend (`frontend/.env`)

- `VITE_API_URL=http://localhost:4000`

## Production Best Practices Implemented

- `helmet` for HTTP hardening
- `compression` for response compression
- `express-rate-limit` for abuse protection
- Global error middleware with request IDs
- Centralized Axios error normalization
- Graceful shutdown signal handling
- UI feedback through toasts, skeletons, and status messaging

## Deployment

See [DEPLOYMENT.md](/var/www/html/chatBot/ai-pdf-chat-app/DEPLOYMENT.md).
