# HelpHive Backend API

Node.js / Express REST + Socket.io server for the HelpHive NGO coordination platform.

## Local development

```bash
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm install
npm run dev
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | ✅ | MongoDB Atlas connection string. Get it from Atlas → Clusters → Connect → Drivers. |
| `JWT_SECRET` | ✅ | Long random string. Generate with `openssl rand -hex 32`. |
| `PORT` | no (default 10000) | Port the server listens on. |
| `CLIENT_URLS` | no | Comma-separated list of allowed CORS origins. |
| `GROQ_API_KEY` | no | Groq AI key for AI-insight endpoints. |

## Deploying to Render

1. Connect your GitHub repo in the Render dashboard.
2. Render will detect `backend-api/render.yaml` automatically.
3. **Before the first deploy**, go to your service → **Environment** and add:
   - `MONGO_URI` — your Atlas connection string
   - `JWT_SECRET` — a strong random secret
4. Click **Manual Deploy** (or push a commit) to trigger the deploy.

> **If you see `MONGO_URI is not configured`** in the logs, the environment variable is not set in the Render dashboard. Follow step 3 above, then redeploy.
