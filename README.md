# Outreach Machine

Outreach Machine is a fully-automated, AI-powered B2B prospecting dashboard. It enables you to find leads, generate highly personalized emails using local AI models, send campaigns, and track analytics from a beautifully designed interface.

## 🚀 Features

- **Local AI Generation**: Uses `Ollama` and `llama3.1` (or local Anthropic proxies) to write highly personalized emails using the Vercel AI SDK. No token costs!
- **Email Delivery**: Integrated with `Resend` for high-deliverability transactional campaigns and sending statistical reports.
- **Lead Enrichment**: Integrated with `Apify` to scrape Google Search and LinkedIn to prospect and discover decision-makers.
- **Modern Dashboard**: Built with Next.js 14 App Router, Tailwind CSS v4, and Shadcn/ui. Features a beautiful, responsive sidebar layout, dark-mode styling, and aesthetic data tables.
- **Complete Auth**: Secured via NextAuth.js (Google OAuth & Credentials).
- **Backend & DB**: Powered by `Supabase` (PostgreSQL) with full Row Level Security (RLS) policies.
- **Zero Mock Data**: Fully connected. Leads, Campaigns, Emails, and Notifications are all saved and fetched directly from Supabase.
- **Error Tracking**: Configured with `@sentry/nextjs` for enterprise-grade error reporting.

## 🛠 Prerequisites

1. **Node.js**: v18+ and `pnpm`
2. **Ollama**: Download from [ollama.com](https://ollama.com) and run `ollama pull llama3.1` in your terminal.
3. **Supabase**: A free project with `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
4. **Resend**: A free API key for email sending.
5. **Apify**: A free API token for web scraping.

## 🏁 Quickstart

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Configure Environment Variables**
   Rename `.env.local.example` to `.env.local` (or create it) and fill in your keys:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secure-secret
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   OLLAMA_BASE_URL=http://localhost:11434
   RESEND_API_KEY=...
   APIFY_API_TOKEN=...
   ```

3. **Database Setup**
   Run the SQL script located in `supabase/migration.sql` in your Supabase SQL Editor to create all required tables and RLS policies.

4. **Start the App**
   Use the provided development script (Windows PowerShell):
   ```powershell
   .\dev.ps1
   ```
   This script will verify your environment variables and start the Next.js development server.

## 🗂 Project Structure

- `/app`: Next.js App Router (Pages, Layouts, API Routes).
- `/components`: Shadcn/ui React components and custom UI elements.
- `/lib`: Instances of third-party clients (Supabase, Ollama, Resend, Apify, Zod env validation).
- `/supabase`: SQL migration scripts.
- `/hooks`: React hooks (like toaster notifications).

## 🛡️ Security

- **Middleware guard**: Protects `/dashboard` and `/onboarding` routes from unauthenticated users.
- **Rate limiting**: An in-memory token bucket rate limiter protects all POST/DELETE API routes from abuse.
- **Server Validation**: The `lib/env.ts` file uses Zod to validate all required keys at startup so the app fails gracefully if misconfigured.

## 📝 License
Open Source (MIT)
