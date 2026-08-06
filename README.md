# Retail Blog AI

Automated content creation platform for retail websites. Generate SEO-optimized blog posts about trends, product reviews, and shopping tips using Gemini, manage content in a React CMS, and schedule publishing with a Node.js backend.

## Features

- **AI Content Generation** — Gemini creates full SEO-optimized blog posts and topic ideas
- **React CMS** — Dashboard, editor, preview, tags, and SEO tools
- **Node.js Backend** — REST API to save, update, delete, and schedule blog posts
- **Scheduled Publishing** — Cron-based auto-publish when scheduled time arrives

## Project Structure
retail-blog-AI/
├── backend/ # Node.js + Express + Gemini
│ ├── src/
│ │ ├── server.js
│ │ ├── routes/ # /api/blogs, /api/ai
│ │ └── services/ # Gemini, storage, scheduler
│ └── data/blogs.json # Blog storage
├── frontend/ # React + Vite CMS
│ └── src/
│ ├── components/
│ └── services/api.js
└── package.json # Root scripts
## Setup

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure Gemini API key

```bash
cd backend
copy .env.example .env
```

Edit `backend/.env` and add your Gemini API key:
