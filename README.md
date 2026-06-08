# AI Brand Assistant with Multi-Brand Context

An AI-powered branding consultant that supports multiple brands, each with its own isolated conversation context. Built with React (Vite), Material UI, Node.js, Express, Axios, and the Groq API.

## Features

- **Multi-brand support** — Create and switch between multiple brands
- **Isolated context** — Each brand maintains its own message history; context never leaks between brands
- **AI branding consultant** — Generates brand names, taglines, target audience, and positioning via Groq (llama-3.3-70b-versatile)
- **Responsive MUI frontend** — Brand selector, create dialog, chat window, loading states, and error handling
- **In-memory storage** — No database required; data stored in JavaScript `Map` structures

## Project Structure

```
assignment/
├── backend/
│   ├── src/
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── services/        # Business logic (brand, chat, Groq)
│   │   ├── routes/          # API route definitions
│   │   ├── middleware/      # Validation & error handling
│   │   ├── utils/           # Constants & prompts
│   │   ├── store/
│   │   │   └── brandStore.js  # In-memory brand storage
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios API client
│   │   ├── components/      # MUI components
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── postman/
│   └── AI-Brand-Assistant.postman_collection.json
└── README.md
```

## Prerequisites

- Node.js 18+
- npm
- [Groq API key](https://console.groq.com/)

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set your Groq API key:

```
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
```

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The UI runs at `http://localhost:5173` and proxies `/api` requests to the backend.

## API Endpoints

| Method | Endpoint           | Description                          |
|--------|--------------------|--------------------------------------|
| GET    | `/health`          | Health check                         |
| POST   | `/api/brands`      | Create a brand                       |
| GET    | `/api/brands`      | List all brands                      |
| GET    | `/api/brands/:id`  | Get brand details and message history|
| POST   | `/api/chat`        | Send a chat message                  |

### Create Brand

```bash
POST /api/brands
Content-Type: application/json

{
  "name": "Fitness Brand"
}
```

**Response (201):**

```json
{
  "id": "uuid",
  "name": "Fitness Brand",
  "messages": []
}
```

### List Brands

```bash
GET /api/brands
```

**Response:**

```json
[
  { "id": "uuid", "name": "Fitness Brand" }
]
```

### Get Brand

```bash
GET /api/brands/:id
```

**Response:**

```json
{
  "id": "uuid",
  "name": "Fitness Brand",
  "messages": [
    { "role": "user", "content": "I want a fitness brand" },
    { "role": "assistant", "content": "..." }
  ]
}
```

### Chat

```bash
POST /api/chat
Content-Type: application/json

{
  "brandId": "uuid",
  "message": "Make it more premium"
}
```

**Response:**

```json
{
  "response": "Brand Name:\n..."
}
```

## In-Memory Storage

### Why In-Memory Storage Was Chosen

In-memory storage was chosen for this assignment because:

1. **Simplicity** — No database setup, migrations, or ORM configuration
2. **Focus on core logic** — Demonstrates multi-brand context isolation without infrastructure overhead
3. **Fast prototyping** — Ideal for learning, demos, and local development
4. **Assignment requirement** — Explicitly specified to use JavaScript Maps/Objects only

### Storage Structure

```javascript
// backend/src/store/brandStore.js
const brands = new Map();

// Each entry:
{
  id: "uuid",
  name: "Fitness Brand",
  messages: [
    { role: "user", content: "..." },
    { role: "assistant", content: "..." }
  ]
}
```

### How Context Isolation Works

1. Each brand is stored under a unique UUID in a `Map`.
2. When a chat message arrives, the service loads **only** that brand's `messages` array.
3. The full history for that brand is sent to Groq along with the new user message.
4. User and assistant messages are appended only to that brand's array.
5. Switching brands in the UI fetches a different brand via `GET /api/brands/:id`, loading a completely separate message history.

**Context from Brand A is never included when chatting with Brand B.**

### Limitations of In-Memory Storage

| Limitation | Impact |
|------------|--------|
| **No persistence** | All brands and conversations are lost on server restart |
| **Single process** | Data is not shared across multiple server instances |
| **Memory bounds** | Large conversation histories consume RAM; no automatic pruning |
| **No backup/recovery** | No way to restore data after a crash |

### What Would Be Used in Production

For a production deployment, you would typically use:

| Component | Production Choice | Purpose |
|-----------|-------------------|---------|
| **Primary database** | PostgreSQL or MongoDB | Persist brands and message history |
| **Cache layer** | Redis | Fast context retrieval, session caching |
| **Message queue** | Bull/RabbitMQ | Async LLM calls under load |
| **Object storage** | S3 | Export conversation logs |
| **Context management** | Summarization + sliding window | Keep prompts within token limits |

## Architecture Flow

```
Frontend (React/MUI)
       │
       ▼
Express Routes → Controllers → Services → brandStore (Map)
                      │              │
                      │              └── Groq Service (llama-3.3-70b-versatile)
                      │
                      └── Validation & Error Middleware
```

## Error Handling

The API validates and returns appropriate errors for:

- Empty or missing brand name (400)
- Invalid or missing brand ID (404)
- Empty chat message (400)
- Missing `brandId` in chat request (400)
- Groq API failures (500 with descriptive message)

## Postman Collection

Import `postman/AI-Brand-Assistant.postman_collection.json` into Postman.

The collection includes:

- Health check
- Create brand (auto-saves `brandId` variable)
- List brands
- Get brand by ID
- Send chat message
- Send follow-up message
- Validation error examples

Set the `baseUrl` variable to `http://localhost:5000`.

## Usage Example

1. Start backend and frontend.
2. Open `http://localhost:5173`.
3. Click **Create Brand** and enter a name (e.g. "Fitness Brand").
4. Send: *"I want a fitness brand for young professionals"*
5. Create a second brand (e.g. "Coffee Shop").
6. Chat with the coffee brand — responses will not reference the fitness brand.
7. Switch back to Fitness Brand — previous conversation is restored.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Material UI |
| HTTP Client | Axios |
| Backend | Node.js, Express |
| LLM | Groq API (llama-3.3-70b-versatile) |
| Storage | In-memory JavaScript Map |

## License

MIT
