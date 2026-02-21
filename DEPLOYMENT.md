# Deployment Plan

## Overview

| Component | Platform | URL | Tier |
|-----------|----------|-----|------|
| Frontend | Vercel | https://hk01-ai-editor-mhowai0802s-projects.vercel.app | Free |
| Backend | Render | https://hk01-ai-editor-api.onrender.com | Free |

Both platforms auto-deploy from the `main` branch on GitHub.

## Architecture

```
┌─────────────────────┐      HTTPS      ┌──────────────────────┐
│  Vercel (Frontend)   │ ──────────────▶ │  Render (Backend)    │
│  React + TypeScript  │                 │  FastAPI + Python    │
│  /frontend           │                 │  /backend            │
└─────────────────────┘                  └──────┬───────┬───────┘
                                                │       │
                                    ┌───────────┘       └───────────┐
                                    ▼                               ▼
                          ┌──────────────────┐          ┌───────────────────┐
                          │ HKBU GenAI API   │          │ Airforce API      │
                          │ (Qwen LLM)       │          │ (Flux-2-Klein)    │
                          └──────────────────┘          └───────────────────┘
```

## Environment Variables

### Render (Backend)

Set these in Render Dashboard > Service > Environment:

| Variable | Value | Notes |
|----------|-------|-------|
| `HKBU_API_KEY` | `811a345f-...` | HKBU GenAI API key (keep secret) |
| `HKBU_BASE_URL` | `https://genai.hkbu.edu.hk/api/v0/rest` | API base URL |
| `LLM_MODEL` | `qwen-plus` | Qwen model name |
| `LLM_API_VERSION` | `v1` | API version |
| `ALLOWED_ORIGINS` | `https://hk01-ai-editor-mhowai0802s-projects.vercel.app` | Vercel frontend URL for CORS |

### Vercel (Frontend)

Set in Vercel Dashboard > Project > Settings > Environment Variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_API_URL` | `https://hk01-ai-editor-api.onrender.com` | Render backend URL |

## Deploy from Scratch

### Step 1: Push code to GitHub

```bash
git push origin main
```

### Step 2: Deploy Backend on Render

1. Go to https://dashboard.render.com/new/web-service
2. Connect GitHub repo: `mhowai0802/work-hk01-ai-editor`
3. Settings:
   - **Name**: `hk01-ai-editor-api`
   - **Root Directory**: `backend`
   - **Runtime**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free
4. Add environment variables (see table above)
5. Click "Create Web Service"
6. Wait for deploy, note the URL

### Step 3: Deploy Frontend on Vercel

1. Go to https://vercel.com/new
2. Import GitHub repo: `mhowai0802/work-hk01-ai-editor`
3. Settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
4. Add environment variable: `VITE_API_URL` = Render backend URL from Step 2
5. Click "Deploy"
6. Note the production URL

### Step 4: Wire CORS

1. Go to Render Dashboard > `hk01-ai-editor-api` > Environment
2. Set `ALLOWED_ORIGINS` = Vercel production URL from Step 3
3. Render auto-redeploys on env var change

## CI/CD

Both platforms are configured for auto-deploy:

- **Push to `main`** triggers both Vercel and Render to rebuild and redeploy
- No GitHub Actions needed -- both platforms handle builds natively

## Free Tier Limits

### Vercel
- 100 GB bandwidth / month
- Unlimited deployments
- Auto SSL

### Render
- 750 hours / month
- Spins down after 15 min of inactivity
- Cold start: ~30-60 seconds on first request after idle
- Auto SSL

## Monitoring

- **Backend health**: `curl https://hk01-ai-editor-api.onrender.com/health`
- **Backend API docs**: https://hk01-ai-editor-api.onrender.com/docs
- **Render logs**: https://dashboard.render.com > Service > Logs
- **Vercel logs**: https://vercel.com > Project > Deployments > Logs

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Frontend shows "網絡請求失敗" | Backend cold start on Render free tier | Wait 30-60s, retry |
| CORS error in browser console | `ALLOWED_ORIGINS` missing Vercel URL | Update env var on Render |
| Image generation fails | Airforce API rate limit (1 req/min) | Wait and retry, adapter has 3 retries built in |
| Topic generation returns generic tags | LLM API key expired or invalid | Check `HKBU_API_KEY` on Render |
