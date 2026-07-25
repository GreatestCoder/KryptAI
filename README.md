# KryptAI

KryptAI is a full-stack AI assistant built as a project using the MERN stack, LangChain, and LangGraph. It brings multiple AI capabilities into a single, clean chat interface while keeping the overall architecture simple and practical.


## 🚀 Live Demo

**Deployment:** [Add your Render deployment link here](YOUR_DEPLOYMENT_LINK)


## ✨ Features

KryptAI supports multiple specialised AI agents:

- 💬 **Chat Agent** — General-purpose AI conversations.
- 🌐 **Search Agent** — Web-assisted answers using Tavily Search.
- 💻 **Coding Agent** — Generates code and multi-file projects with an interactive Monaco Editor artifact panel.
- 👁️ **Vision Agent** — Upload an image and ask questions about its contents.
- 🎨 **Image Generation Agent** — Generates images using Pollinations AI.
- 📄 **PDF Generation Agent** — Generates downloadable PDF documents.
- 📊 **PPT Generation Agent** — Generates downloadable PowerPoint presentations.
- 📚 **PDF RAG Agent** — Upload a PDF, retrieve relevant information from it, and ask questions about its contents.
- 🧠 **Conversation Memory** — Stores conversation history in MongoDB and loads recent messages for context.
- 🔐 **Authentication** — JWT-based authentication using cookies with Google Login support through Firebase.
- 📎 **File Uploads** — Supports image and PDF uploads directly from the chat interface.
- ⚡ **Auto Routing** — Automatically selects the appropriate agent based on the user's request or uploaded file.
- 🧩 **Artifacts** — Coding responses can produce multi-file projects that can be viewed and edited in Monaco Editor.
- 📱 **Responsive UI** — Clean, minimal chat interface with loading states and polished interaction feedback.

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- Zustand
- Tailwind CSS
- React Markdown
- Monaco Editor
- Framer Motion
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- LangChain
- LangGraph
- Multer
- PDF Parse

### AI & External Services

- Groq
- OpenRouter
- Tavily Search
- Pollinations AI
- Firebase Authentication

## 🏗️ Architecture

KryptAI uses a single Express/Node.js backend rather than a microservice architecture.

```text
                         ┌─────────────────────┐
                         │      React + Vite    │
                         │     KryptAI Client   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Express Backend   │
                         │      API Server     │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┼────────────────┐
                    │               │                │
                    ▼               ▼                ▼
               MongoDB         LangGraph         File Storage
              Conversation      Supervisor       Uploads /
                History          + Agents        Generated Files
                                    │
             ┌──────────┬───────────┼──────────┬──────────┐
             ▼          ▼           ▼          ▼          ▼
           Chat      Search      Coding     Vision    PDF RAG
                                    │
                                    ├──── Image Generation
                                    ├──── PDF Generation
                                    └──── PPT Generation
```

## 🤖 Agent Routing

KryptAI supports both explicit agent selection and automatic routing.

When **Auto** mode is selected:

- Image upload → Vision Agent
- PDF upload → PDF RAG Agent
- Other prompts → Router determines the most suitable agent

Available agents:

```text
Auto
├── Chat
├── Search
├── Coding
├── Vision
├── Image Generation
├── PDF Generation
├── PPT Generation
└── PDF RAG
```

## 💾 Conversation Memory

Conversation history is stored in MongoDB.

Before each graph invocation, KryptAI retrieves the most recent **20 messages** from the conversation and provides them to the agent workflow as context.

No Redis or external memory/cache service is required.

## 🧩 Coding Artifacts

The Coding Agent can generate multi-file projects.

Generated artifacts can be opened in a single Artifact Panel containing:

- File navigation
- Monaco Editor
- Syntax highlighting
- Copy functionality
- HTML/CSS/JavaScript preview

## 📄 PDF RAG

The PDF RAG workflow:

1. User uploads a PDF.
2. Text is extracted using `pdf-parse`.
3. Text is split using `RecursiveCharacterTextSplitter`.
4. Chunks are stored in a temporary `MemoryVectorStore`.
5. Relevant chunks are retrieved using similarity search.
6. The LLM generates an answer using the retrieved context.
7. The uploaded PDF is removed after processing.

This keeps the implementation lightweight without requiring a persistent vector database such as Qdrant.

## 🔐 Authentication

KryptAI uses:

- JWT authentication
- HTTP cookies
- Firebase Google Login

Authentication-related secrets and API keys are stored through environment variables and should never be committed to GitHub.

## 📁 Project Structure

A simplified structure:

```text
KryptAI/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── agents/
│   ├── public/
│   │   ├── uploads/
│   │   └── generated/
│   ├── server.js
│   └── package.json
│
└── README.md
```

> The exact folder structure may vary slightly depending on the current implementation.

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd KryptAI
```

### 2. Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd ../frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file in the backend and add the required server-side variables.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

GROQ_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
TAVILY_API_KEY=your_tavily_api_key
```

Configure Firebase credentials according to the frontend authentication setup.

> Never commit `.env` files or API keys to GitHub.

### 4. Start the backend

```bash
cd backend
npm run dev
```

### 5. Start the frontend

In another terminal:

```bash
cd frontend
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

## 🌍 Deployment

KryptAI is intended to be deployed using **Render**.

Recommended Render setup:

```text
Render
├── Frontend → Static Site
└── Backend  → Web Service

MongoDB Atlas → Database
```

After deployment, update the appropriate frontend/backend environment variables with the deployed URLs.



## 🔒 Security

Before deploying:

- Do not commit `.env` files.
- Do not expose API keys in frontend code.
- Use strong JWT secrets.
- Configure CORS for the deployed frontend URL.
- Use secure cookies in production.
- Keep MongoDB credentials private.

## 🎯 Project Goals

KryptAI was built as a practical full-stack AI project to explore:

- MERN application development
- AI agent orchestration
- LangChain and LangGraph
- LLM integration
- Retrieval-Augmented Generation
- Multi-agent routing
- File processing
- AI-generated artifacts
- Authentication
- Full-stack deployment


## 👨‍💻 Author

**Naman**

Built as a full-stack AI project for learning, experimentation, and portfolio development.
