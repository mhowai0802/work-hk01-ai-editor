# HK01 AI Editor

AI-powered editorial tools for HK01. Two features:

1. **Topic Generator** - Extract key topics from Chinese news passages using Qwen LLM
2. **News Image Generator** - Generate editorial images from Chinese news headlines

## Architecture

Clean architecture with 4 layers (Domain → Application → Infrastructure → Presentation).
Dependencies always point inward.

## Quick Start

### Backend

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Ant Design
- **Backend**: Python + FastAPI
- **LLM**: Qwen (via HKBU GenAI API)
- **Image Gen**: Pollinations AI (free, no API key needed)
