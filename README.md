# TaskFlow AI - AI-Powered Workflow Automation

A Next.js SaaS application for AI-powered workflow automation for small teams and freelancers.

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **UI**: React 19.2.3, Tailwind CSS 4
- **Language**: TypeScript 5
- **Deployment**: Vercel

## Live Demo

- **Production URL**: https://webapp-black-rho-32.vercel.app

## Demo Credentials

- **Email**: demo@taskflow.ai
- **Password**: Demo123!

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/yasaswivedula-gith/DataExpert-VibeCodingChallennge-Feb2026.git
cd webapp

# Install dependencies
npm install

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

### Dashboard (/dashboard)
- **Tasks Tab**: Create, manage, and track tasks with priorities
- **Workflows Tab**: View and manage automated workflows
- **AI Suggestions Tab**: AI-powered recommendations for workflow optimization

## Project Structure

```
webapp/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx        # Root layout
│   │   ├── globals.css       # Global styles
│   │   ├── auth/
│   │   │   ├── login/       # Login page
│   │   │   ├── signup/      # Signup page
│   │   │   └── error/       # Error page
│   │   └── dashboard/       # Dashboard
│   └── components/          # Reusable components
├── package.json
└── next.config.ts
```

## Routes

- `/` - Landing page (public)
- `/auth/login` - Login (public)
- `/auth/signup` - Signup (public)
- `/dashboard` - Dashboard (protected, requires login)

## Happy Path Demo Instructions

1. Visit https://webapp-black-rho-32.vercel.app
2. Click "Get Started Free" or go to /auth/signup
3. Sign up with any email/password
4. You'll be redirected to /dashboard
5. Try creating a task in the Tasks tab
6. Check the AI Suggestions tab for workflow recommendations
7. View the Workflows tab to see sample workflows

## License

MIT
