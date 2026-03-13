# HelpHive Platform

## Project Structure

```text
helphive-platform/
├─ landing-site/
├─ admin-dashboard/
├─ volunteer-dashboard/
├─ backend-api/
└─ README.md
```

## Git Tracking Fix Commands

```bash
git rm -r --cached .
git add .
git commit -m "Fix project structure"
git push origin main
```

## Deployment Targets

### Vercel (Frontend)
Create three separate Vercel projects from this same repository:

1. **landing-site**
   - Root Directory: `landing-site`
2. **admin-dashboard**
   - Root Directory: `admin-dashboard`
   - Environment Variable: `VITE_API_URL=https://<render-backend-domain>/api`
3. **volunteer-dashboard**
   - Root Directory: `volunteer-dashboard`
   - Environment Variable: `VITE_API_URL=https://<render-backend-domain>/api`

### Render (Backend)
Create a Web Service for **backend-api**:

- Root Directory: `backend-api`
- Build Command: `npm install`
- Start Command: `npm run start`
- Required Environment Variables:
  - `MONGO_URI` (or `MONGODB_URI` / `DATABASE_URL`)
    - Use a full MongoDB URI (example: `mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority`)
  - `JWT_SECRET`
  - `PORT`
  - `GROQ_API_KEY`

Server startup is configured in `backend-api/src/index.js` with dotenv and default `PORT=10000`.
