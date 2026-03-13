# HelpHive Platform

Smart Volunteer & Resource Coordination Platform for NGOs.

## Monorepo Structure

```
helphive-platform/
├── landing-site/          # Public landing page (Vercel)
├── admin-dashboard/       # Admin React frontend (Vercel)
├── volunteer-dashboard/   # Volunteer React frontend (Vercel)
├── backend-api/           # Node.js + Express API (Render)
└── README.md
```

## Quick Start

### 1. Backend API (Render)

```bash
cd backend-api
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, etc.
npm install
npm start
```

### 2. Admin Dashboard (Vercel)

```bash
cd admin-dashboard
cp .env.example .env
# Set VITE_API_URL to your backend URL
npm install
npm run dev
```

### 3. Volunteer Dashboard (Vercel)

```bash
cd volunteer-dashboard
cp .env.example .env
# Set VITE_API_URL to your backend URL
npm install
npm run dev
```

### 4. Landing Site (Vercel)

```bash
cd landing-site
cp .env.example .env
# Set VITE_ADMIN_DASHBOARD_URL and VITE_VOLUNTEER_DASHBOARD_URL
npm install
npm run dev
```

## Deployment

### Backend → Render

1. Connect this GitHub repo to Render
2. Set **Root Directory** to `backend-api`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables:
   - `MONGO_URI` — MongoDB Atlas connection string
   - `JWT_SECRET` — Strong secret key
   - `CLIENT_URLS` — Comma-separated frontend URLs
   - `GROQ_API_KEY` — Groq API key

### Frontends → Vercel

For each frontend app (`landing-site`, `admin-dashboard`, `volunteer-dashboard`):

1. Import this GitHub repo into Vercel
2. Set **Root Directory** to the respective folder
3. Framework: Vite
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add the required environment variables (see `.env.example` in each folder)

## Environment Variables

### backend-api/.env

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 10000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT signing secret |
| `CLIENT_URLS` | Comma-separated frontend URLs |
| `GROQ_API_KEY` | Groq AI API key |

### admin-dashboard/.env / volunteer-dashboard/.env

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

### landing-site/.env

| Variable | Description |
|----------|-------------|
| `VITE_ADMIN_DASHBOARD_URL` | Admin dashboard URL |
| `VITE_VOLUNTEER_DASHBOARD_URL` | Volunteer dashboard URL |

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io
- **Auth**: JWT + bcryptjs
- **AI**: Groq SDK
- **Maps**: Leaflet + OpenStreetMap
- **Charts**: Recharts
