# 🤖 Agentic AI Automation Platform (Agentflow_AI)

Agentflow_AI is a full-stack **AI Operations Automation Platform** that allows operators to describe complex business processes in natural language and transform them into executable visual workflow graphs on a drag-and-drop React Flow canvas.

The platform executes workflows through a cooperative chain of 5 specialized AI agents with live Socket.IO event streaming, automated failure recovery with exponential backoff, background job scheduling, and secure AES-256 encrypted integrations for **Gmail, Slack, Discord, and Google Sheets**.

---

## 🌟 Key Features

- **Natural-Language Prompt-to-Workflow AI Generation**:
  - Automatically synthesizes complete workflow graphs (nodes, positions, edges, and configurations) from plain English prompts.
  - Multi-provider fallback hierarchy: **OpenRouter (Primary) ➔ Google Gemini SDK (Secondary) ➔ Deterministic Rule Engine (Local Fallback)**.
- **Interactive Visual Workflow Studio**:
  - Powered by **React Flow (`@xyflow/react`)** with custom nodes, draggable palette, edge connections, and right-hand parameter inspector.
  - Drag-and-drop support for Triggers, Actions, AI Reasoning Agents, and Third-Party Integrations.
- **5-Agent Autonomous Orchestration Pipeline**:
  - 🧠 **Planner Agent**: Analyzes graph topology, computes DAG topological sort, resolves dependencies, and scores plan confidence.
  - ⚡ **Execution Agent**: Runs node logic against third-party OAuth providers, custom endpoints, and LLM APIs with variable interpolation.
  - 🛡️ **Validation Agent**: Enforces strict output schemas and data integrity at each execution step.
  - 🔄 **Recovery Agent**: Classifies failures (`AUTH_EXPIRED`, `RATE_LIMIT`, `MISSING_FIELDS`, `TRANSIENT`, `API_FAILURE`) and executes exponential backoff or escalation.
  - 📊 **Monitoring Agent**: Streams live telemetry via Socket.IO and writes immutable audit logs to MongoDB.
  - 🧩 **LangGraph Substrate**: Integrated with LangGraph for agentic workflow coordination.
- **Zero-Friction Local Execution (Self-Contained In-Memory Fallbacks)**:
  - Automatically boots an embedded in-memory MongoDB instance via `mongodb-memory-server` if local MongoDB is not running.
  - Automatically switches to an in-memory asynchronous queue if Redis is not running.
- **Enterprise Security & OAuth Vault**:
  - Passwords hashed with `bcryptjs` (Cost factor: 12).
  - JWT session authorization with protected routes and role separation (`admin` vs `operator`).
  - Third-party OAuth tokens encrypted at rest using **AES-256-GCM** application keys.
  - HTTP security headers powered by `helmet`, CORS protection, and rate limiting.

---

## 🏗️ Tech Stack

- **Frontend**: Next.js (Pages Router), React 19, Tailwind CSS, Zustand, Axios, React Flow (`@xyflow/react`), Socket.IO Client, Lucide React Icons.
- **Backend**: Node.js, Express, MongoDB & Mongoose (with `mongodb-memory-server` fallback), BullMQ & ioredis (with in-memory async queue fallback), Socket.IO, Helmet, Morgan, Compression, Express-Validator, Bcryptjs.
- **AI Integration**: OpenRouter API, Google Generative AI SDK (`@google/generative-ai`), Deterministic Graph Synthesizer.

---

## 📁 Repository Structure

```text
myproject/
├── client/                     # Next.js Frontend Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppShell/       # Header, Sidebar & Live Notification Drawer
│   │   │   ├── MetricGrid/     # Dashboard KPI Metrics Cards
│   │   │   ├── NodePalette/    # Draggable Node Toolbox
│   │   │   ├── NodeConfigPanel/# Real-time Node Parameter Inspector
│   │   │   ├── WorkflowCanvas/ # React Flow Studio & Custom Nodes
│   │   │   └── ProtectedRoute/ # Client-side JWT Guard
│   │   ├── pages/
│   │   │   ├── _app.js         # Global Styles & Store Init
│   │   │   ├── index.js        # Landing Page & Agent Showcase
│   │   │   ├── login.js        # Operator Sign In
│   │   │   ├── register.js     # Operator Account Creation
│   │   │   ├── dashboard.js    # Operator Console & Metrics
│   │   │   ├── integrations.js # OAuth Connections & Vault
│   │   │   ├── settings.js     # System Diagnostics & Keys
│   │   │   ├── executions/     # Live Timeline & Audit Logs
│   │   │   └── workflows/      # Workflow List, Studio & AI Builder
│   │   ├── store/              # Zustand Stores (Auth & Canvas)
│   │   ├── services/           # Axios API & Socket.IO Clients
│   │   └── styles/             # Tailwind & Flow Styles
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                     # Express Backend & Agent Orchestrator
│   ├── src/
│   │   ├── config/             # DB, Socket.IO & Env Configs
│   │   ├── models/             # Mongoose Schemas (User, Workflow, Execution, etc.)
│   │   ├── routes/             # Express API Routes
│   │   ├── controllers/        # Thin Controllers
│   │   ├── services/           # Business Logic & Token Encryption
│   │   ├── agents/             # 5-Agent Chain (Planner, Exec, Valid, Recovery, Mon)
│   │   ├── integrations/       # Gmail, Slack, Sheets & Discord Drivers
│   │   ├── queues/             # BullMQ & In-Memory Queue Fallback
│   │   └── middleware/         # Auth & Error Handlers
│   ├── test/                   # Comprehensive Integration Test Suite
│   ├── package.json
│   ├── index.js
│   └── .env
│
├── spec.md                     # Single Source of Truth Specification
├── package.json                # Root Concurrently Orchestrator
└── README.md                   # Complete Documentation & Setup Guide
```

---

## 🚀 Quickstart: Running Locally

### Prerequisites
- **Node.js**: `v18.0.0` or newer (Tested on Node `v20` / `v22` / `v24`)
- **npm**: `v9.0.0` or newer

> **Note**: External MongoDB and Redis instances are **optional**. The platform includes automated in-memory fallbacks so you can run the entire system instantly without installing or configuring local database services!

---

### Step 1: Install Dependencies

Run the one-command installer from the project root:

```bash
npm run install:all
```

Or install separately:
```bash
# In server directory
cd server
npm install

# In client directory
cd ../client
npm install
```

---

### Step 2: Configure Environment Variables

The server comes pre-configured with standard defaults in `server/.env`. If you want to customize secrets or provide API keys, edit `server/.env`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# MongoDB URI (Automatically falls back to in-memory MongoDB if offline)
MONGO_URI=mongodb+srv://aravindkadari186_db_user:<db_password>@aravindkadari507.vnxjcu9.mongodb.net/agentflow_ai?retryWrites=true&w=majority&appName=aravindkadari507

# Security Secrets
JWT_SECRET=agentflow_super_secret_jwt_key_2026_change_in_prod
JWT_EXPIRES_IN=7d
CREDENTIAL_ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef

# Redis & BullMQ (Automatically falls back to In-Memory Queue if offline)
REDIS_URL=redis://127.0.0.1:6379

# AI Providers (Optional - system uses deterministic builder when empty)
OPENROUTER_API_KEY=
GEMINI_API_KEY=

# Third-Party OAuth Configuration (Optional in development)
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REDIRECT_URI=http://localhost:5000/api/integrations/oauth/gmail/callback

SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=
SLACK_REDIRECT_URI=http://localhost:5000/api/integrations/oauth/slack/callback

DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_REDIRECT_URI=http://localhost:5000/api/integrations/oauth/discord/callback
DISCORD_BOT_TOKEN=

GOOGLE_SHEETS_CLIENT_ID=
GOOGLE_SHEETS_CLIENT_SECRET=
GOOGLE_SHEETS_REDIRECT_URI=http://localhost:5000/api/integrations/oauth/google-sheets/callback
```

---

### Step 3: Start the Development Platform

Run the unified start command from the project root:

```bash
npm run dev
```

This concurrently launches:
- 🚀 **Backend Server & Agent Orchestrator**: `http://localhost:5000`
- 💻 **Frontend Web Console**: `http://localhost:3000`

---

## 🖥️ Platform Walkthrough & Testing Guide

### 1. User Registration & Login
1. Open your browser to `http://localhost:3000`.
2. Click **Launch Console** or **Get Started Free**.
3. Register a new operator account with your name, email, and password.
4. You will be redirected to the **Operator Command Center** (`/dashboard`).

### 2. Generate a Workflow with AI
1. Click **AI Builder** in the sidebar (`/workflows/builder`).
2. Type a natural language prompt or click one of the quick prompt chips, e.g.:
   > *"When a high-priority customer invoice is received, summarize it with AI, send an email to the finance team, and alert #operations in Slack."*
3. Click **Generate Workflow Graph**.
4. The system synthesizes a connected graph with triggers, AI reasoning nodes, and integration endpoints.
5. Click **Save & Open Canvas** to open the interactive React Flow studio.

### 3. Visual Workflow Studio
1. In the studio (`/workflows/[id]`), drag nodes from the **Node Palette** on the left onto the canvas.
2. Connect nodes by dragging wires between node handles.
3. Click any node to open the **Node Inspector** on the right and customize parameters (e.g., email recipients, Slack channels, prompts).
4. Click **Save Graph** to persist your changes.

### 4. Execute Workflow & Monitor Live Multi-Agent Stream
1. Click **Execute Now** in the top right corner.
2. You will be redirected to the **Live Execution Timeline** (`/executions/[id]`).
3. Watch the multi-agent orchestration chain execute in real time:
   - 🔵 **Planner Agent**: Performs topological sort and reports confidence score.
   - 🟣 **Execution Agent**: Dispatches actions to third-party endpoints or simulation sandbox.
   - 🟢 **Validation Agent**: Verifies output data structures.
   - 🟡 **Recovery Agent**: Analyzes failure conditions and applies backoff if necessary.
   - 🔵 **Monitoring Agent**: Emits real-time Socket.IO logs and updates the timeline.
4. Use the **Pause**, **Resume**, and **Cancel** controls to manage the active run.

### 5. Third-Party Integrations & Vault
1. Navigate to **Integrations** (`/integrations`).
2. Review connection statuses for **Gmail**, **Slack**, **Google Sheets**, and **Discord**.
3. Click **Connect OAuth** or **Settings** to configure credentials. All tokens are automatically encrypted with **AES-256-GCM**.

---

## 🧪 Running Automated Tests

Run the full end-to-end platform test suite:

```bash
npm test
```

Or within the `server/` directory:
```bash
cd server
npm test
```

---

## 📡 API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Create new operator account.
- `POST /api/auth/login` - Authenticate and issue JWT.
- `GET /api/auth/me` - Fetch profile of currently authenticated user.

### Workflows
- `GET /api/workflows/dashboard` - Aggregated workflow metrics & KPIs.
- `GET /api/workflows` - List user workflows with pagination and filters.
- `POST /api/workflows` - Create a new workflow manually.
- `POST /api/workflows/generate` - Synthesize workflow graph from natural language prompt.
- `GET /api/workflows/:id` - Fetch single workflow details.
- `PUT /api/workflows/:id` - Update existing workflow graph.
- `POST /api/workflows/:id/duplicate` - Clone workflow.
- `POST /api/workflows/:id/execute` - Launch execution run.
- `DELETE /api/workflows/:id` - Delete workflow.

### Executions
- `GET /api/executions` - List execution history.
- `GET /api/executions/:id` - Fetch execution status & snapshot.
- `GET /api/executions/:id/timeline` - Fetch fine-grained multi-agent logs.
- `POST /api/executions/:id/pause` - Pause running execution.
- `POST /api/executions/:id/resume` - Resume paused execution.
- `POST /api/executions/:id/cancel` - Cancel active execution.

### Integrations & Notifications
- `GET /api/integrations` - List connected integrations.
- `GET /api/integrations/status` - Provider health check.
- `POST /api/integrations` - Save encrypted credentials.
- `GET /api/notifications` - Retrieve in-app notifications.
- `PUT /api/notifications/read-all` - Mark notifications as read.

---

## 🛡️ License

MIT License &bull; Created for **Agentflow_AI Multi-Agent Operations Automation Platform**.
#   t o d a y  
 