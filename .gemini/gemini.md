# Outreach Machine — Uprising Studio

## Project Overview
Outreach Machine is a B2B prospecting and email outreach platform built by Uprising Studio. It enables automated prospect research, AI-powered email generation, campaign planning, and team collaboration.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4 with oklch color system
- **Auth**: NextAuth.js with Supabase backend
- **Database**: Supabase (PostgreSQL)
- **AI**: Kimi K-2.5 via Ollama (local)
- **Icons**: @tabler/icons-react
- **Monitoring**: Sentry
- **Deployment**: Vercel + Cloudflare

## Key Commands
- `pnpm run dev` — Start development server
- `pnpm run build` — Build for production
- `npx tsx scripts/test-all.ts` — Run comprehensive tests

## Brand Colors
- Primary: `#08345B` (Navy)
- All CSS variables use oklch with hue 250

## Architecture
```
app/
├── dashboard/          # Main app (protected)
│   ├── assistant/      # AI Chat (Kimi K-2.5)
│   ├── planification/  # Mass email planning
│   ├── leads/          # Lead management + CSV import
│   ├── generate/       # Email generation
│   ├── review/         # Email review & approval
│   ├── campaigns/      # Campaign management
│   ├── analytics/      # Analytics dashboard
│   ├── settings/       # User settings
│   └── team/           # Team collaboration
├── api/
│   ├── ai/             # AI endpoints (generate, chat)
│   ├── agent/          # Web scraper agent
│   ├── tasks/          # Task/campaign scheduler
│   ├── leads/          # Lead CRUD
│   ├── emails/         # Email CRUD
│   └── auth/           # NextAuth
lib/
├── ai/kimi.ts          # Ollama Kimi K-2.5 client
├── agent/web-scraper.ts # Prospect research
└── supabase.ts         # Database client
```
