# 🚀 Production Deployment Guide: Agentflow_AI

This guide provides step-by-step instructions to push your code securely to GitHub, deploy the **Backend on Render**, and deploy the **Frontend on Vercel**.

---

## 📑 Table of Contents
1. [Step 1: Push Code to GitHub](#step-1-push-code-to-github)
2. [Step 2: Deploy Backend to Render](#step-2-deploy-backend-to-render)
3. [Step 3: Deploy Frontend to Vercel](#step-3-deploy-frontend-to-vercel)
4. [Step 4: Connect Vercel and Render (CORS & Socket.IO Sync)](#step-4-connect-vercel-and-render-cors--socketio-sync)
5. [Step 5: Post-Deployment Verification](#step-5-post-deployment-verification)

---

## Step 1: Push Code to GitHub

Your `.gitignore` is already pre-configured to ensure that **`node_modules`**, **`server/.env`**, and **`.next`** build files are **never** committed to Git.

Open your terminal in the project root (`c:\movies\myproject`) and run:

```bash
# 1. Initialize Git repository (if not already done)
git init

# 2. Add all files to staging
git add .

# 3. Check status to ensure server/.env and node_modules are ignored
git status

# 4. Commit files
git commit -m "feat: complete Agentflow_AI full-stack automation platform"

# 5. Rename branch to main
git branch -M main

# 6. Add your GitHub remote (replace with your actual GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# 7. Push to GitHub
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** &rarr; **Web Service**.
2. Select **Build and deploy from a Git repository** and connect your GitHub repo.
3. Configure the Web Service settings:

| Setting | Value |
| :--- | :--- |
| **Name** | `agentflow-backend` *(or your preferred name)* |
| **Region** | Select the region closest to you |
| **Branch** | `main` |
| **Root Directory** | `server` &nbsp;&nbsp;⚠️ *(Must specify `server`)* |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node index.js` |
| **Instance Type** | `Free` (or higher) |

4. Scroll down to **Environment Variables** and add the following keys:

| Environment Variable | Value | Notes |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimizations |
| `MONGO_URI` | `mongodb+srv://aravindkadari186_db_user:<password>@aravindkadari507.vnxjcu9.mongodb.net/agentflow_ai?retryWrites=true&w=majority&appName=aravindkadari507` | Your real MongoDB Atlas URL |
| `JWT_SECRET` | `agentflow_super_secret_jwt_key_2026_change_in_prod` | Secret for signing auth tokens |
| `JWT_EXPIRES_IN` | `7d` | Token expiration time |
| `CREDENTIAL_ENCRYPTION_KEY` | `0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef` | 32-byte AES-256 vault encryption key |
| `GEMINI_API_KEY` | `YOUR_GEMINI_API_KEY` | Google Gemini SDK key |
| `OPENROUTER_API_KEY` | `YOUR_OPENROUTER_KEY` | *(Optional)* OpenRouter LLM key |
| `CLIENT_URL` | `http://localhost:3000` | *(Will be updated to your Vercel URL in Step 4)* |

5. Click **Create Web Service**.
6. Wait for the build to finish. Once live, copy your **Render Backend URL** (e.g. `https://agentflow-backend.onrender.com`).

---

## Step 3: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** &rarr; **Project**.
2. Select and import your GitHub repository.
3. In the **Configure Project** screen:
   - **Framework Preset**: `Next.js` (automatically detected)
   - **Root Directory**: Click **Edit** &rarr; select `client` &rarr; click **Continue** ⚠️ *(Must specify `client`)*
   - **Build Command**: `next build` (Default)
   - **Output Directory**: `.next` (Default)

4. Expand **Environment Variables** and add:

| Environment Variable | Value | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `<YOUR_RENDER_URL>/api` | `https://agentflow-backend.onrender.com/api` |
| `NEXT_PUBLIC_SOCKET_URL` | `<YOUR_RENDER_URL>` | `https://agentflow-backend.onrender.com` |

5. Click **Deploy**.
6. Vercel will build the Next.js frontend and provide your live application URL (e.g. `https://agentflow-ai.vercel.app`).

---

## Step 4: Connect Vercel and Render (CORS & Socket.IO Sync)

Now that you have your live Vercel URL:

1. Return to your [Render Dashboard](https://dashboard.render.com/).
2. Select your `agentflow-backend` Web Service &rarr; navigate to **Environment**.
3. Edit the **`CLIENT_URL`** variable and set it to your real Vercel URL:
   ```env
   CLIENT_URL=https://agentflow-ai.vercel.app
   ```
4. Click **Save Changes**. Render will automatically redeploy the service in seconds.

---

## Step 5: Post-Deployment Verification

1. Open your live Vercel frontend URL in your browser (`https://agentflow-ai.vercel.app`).
2. **Register a new account**: Click **Launch Console** &rarr; **Sign Up** with your name and password.
3. **Generate a workflow**: Go to **AI Builder** &rarr; enter a prompt (e.g., *"When customer email arrives, summarize with AI and send alert to Slack"*).
4. **Inspect & Edit**: Click **Save & Open Canvas** to open the interactive React Flow studio.
5. **Live Multi-Agent Run**: Click **Execute Now** and watch the 5-Agent pipeline (Planner &rarr; Execution &rarr; Validation &rarr; Recovery &rarr; Monitoring) stream live execution events over Socket.IO and persist the run in your MongoDB Atlas database!
