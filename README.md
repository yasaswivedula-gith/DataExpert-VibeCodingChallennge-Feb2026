# TaskFlow AI - AI-Powered Workflow Automation

A Next.js SaaS application for AI-powered workflow automation for small teams and freelancers.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **UI**: React 18+, Tailwind CSS
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth (synced with Prisma)
- **Deployment**: Vercel

## Live Demo

- **Production URL**: https://data-expert-vibe-coding-challennge.vercel.app/

## Demo Credentials

- **Email**: demo@taskflow.ai
- **Password**: Demo123!

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+
- Supabase account (for database)

### Installation

```bash
# Clone the repository
git clone https://github.com/yasaswivedula-gith/DataExpert-VibeCodingChallennge-Feb2026.git
cd webapp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Update .env with your Supabase credentials

# Run database migrations (if needed)
npx prisma migrate deploy

# Run development server
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

## Features

### Landing Page
- Hero section with clear value proposition
- Problem/Solution section
- Features overview (Workflow Builder, AI Assistant, Team Collaboration, Reporting)
- How It Works (4-step process)
- Pricing (Free, Pro $19/mo, Enterprise)
- Testimonials
- Call-to-action sections

### Authentication
- Login page (/auth/login)
- Signup page (/auth/signup)
- Plan selection (free/pro)
- Route protection via middleware

### Dashboard (/dashboard)
- **Tasks Tab**: Create, manage, and track tasks with priorities
- **Workflows Tab**: View and manage automated workflows
- **AI Suggestions Tab**: AI-powered recommendations for workflow optimization

### Technical Highlights
- Server Actions for data mutations
- Prisma ORM with PostgreSQL
- Supabase Auth integration with automatic user sync
- Middleware-based route protection
- Loading and error states for all routes

## Project Structure

```
webapp/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed script
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   ├── auth/
│   │   │   ├── login/         # Login page
│   │   │   ├── signup/        # Signup page
│   │   │   └── error/         # Error page
│   │   └── dashboard/         # Protected dashboard
│   │       ├── page.tsx       # Main dashboard
│   │       ├── loading.tsx    # Loading state
│   │       └── error.tsx      # Error boundary
│   ├── components/            # Reusable components
│   │   └── EmptyState.tsx     # Empty state component
│   └── lib/
│       ├── actions/           # Server Actions
│       │   ├── tasks.ts       # Task CRUD
│       │   └── ai-suggestions.ts  # AI suggestions
│       ├── supabase/          # Supabase integration
│       │   └── middleware.ts  # Auth middleware
│       └── prisma.ts          # Prisma client
├── package.json
└── next.config.ts
```

## Routes

- `/` - Landing page (public)
- `/auth/login` - Login (public)
- `/auth/signup` - Signup (public)
- `/dashboard` - Dashboard (protected, requires login)
- `/dashboard/tasks` - Tasks management
- `/dashboard/workflows` - Workflows management
- `/dashboard/ai-suggestions` - AI Suggestions

## Happy Path Demo Instructions

1. Visit https://data-expert-vibe-coding-challennge.vercel.app/
2. Click "Get Started Free" or go to /auth/signup
3. Sign up with any email/password
4. You'll be redirected to /dashboard
5. Try creating a task in the Tasks tab
6. Check the AI Suggestions tab for workflow recommendations
7. View the Workflows tab to see sample workflows

## Environment Variables

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
OPENAI_API_KEY=sk-...  # Optional
```

## License

MIT
