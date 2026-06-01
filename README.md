# DocChat: AI PDF Assistant (RAG Pipeline)

DocChat is a production-ready, RAG-based PDF Chatbot that allows users to upload PDF documents and ask questions grounded strictly in the document's content. It leverages Groq for lightning-fast inference and Hugging Face for high-quality embeddings.

![DocChat UI](/home/codelouds-munmum/.gemini/antigravity/brain/99e844ec-38e0-4601-8941-20c9a957def6/docchat_ui_final_1780319054167.png)

## 🚀 Features
- **Modern Dark UI**: Premium design with sidebar and responsive chat interface.
- **Real-time PDF Preview**: Instantly view your uploaded document in the browser.
- **Context-Aware Chat**: Advanced RAG flow for accurate answers based on PDF content.
- **Fast Inference**: Powered by Groq's Llama 3 models.
- **Persistent Storage**: Uses FAISS vector database for efficient similarity search.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Bootstrap, Vanilla CSS.
- **Backend**: Node.js, Express (ES Modules).
- **AI/ML**:
  - **LLM**: Groq (`llama-3.3-70b-versatile`).
  - **Embeddings**: Hugging Face (`sentence-transformers/all-MiniLM-L6-v2`).
  - **Vector Store**: FAISS (`faiss-node`).
  - **Orchestration**: LangChain JS.

## 📋 Prerequisites
- Node.js (v18 or higher)
- [Groq API Key](https://console.groq.com/)
- [Hugging Face Access Token](https://huggingface.co/settings/tokens)

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd ai-pdf-chat-app
```

### 2. Backend Configuration
Navigate to the `backend` folder and install dependencies:
```bash
cd backend
npm install
```
Create a `.env` file based on `.env.example`:
```env
GROQ_API_KEY=your_groq_api_key
HUGGINGFACE_API_KEY=your_hugging_face_token
PORT=5000
```

### 3. Frontend Configuration
Navigate to the `frontend` folder and install dependencies:
```bash
cd ../frontend
npm install
```

## 🏃 Running the Application

### Start the Backend
```bash
cd backend
npm start
```
*The server will run at http://localhost:5000*

### Start the Frontend
```bash
cd frontend
npm run dev
```
*The app will be available at http://localhost:5173*

## 🧠 The RAG Flow (How it Works)

1. **Upload**: User uploads a PDF via the sidebar.
2. **Parsing**: `pdf-parse` extracts raw text from the document.
3. **Chunking**: `RecursiveCharacterTextSplitter` breaks text into manageable 1000-character overlaps.
4. **Embedding**: Chunks are converted into high-dimensional vectors using Hugging Face.
5. **Indexing**: Vectors are stored in a **FAISS** index for fast searching.
6. **Querying**: When you ask a question, the app finds the **Top 4** most relevant chunks.
7. **Inference**: The context + question are sent to **Groq**, which generates a precise answer.

## 🤝 Support
If you encounter any issues, please check your `.env` keys and ensure the backend is running before using the chat.
