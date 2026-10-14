# 🎓 CampusIQ — University Student Success Intelligence Platform

> **Modern, deterministic, and explainable student intelligence system powered by React 19, TypeScript, Vite, Tailwind CSS v4, and Supabase PostgreSQL.**

---

## 🌟 Executive Overview & Present Situation

**CampusIQ** is an institutional early-warning and academic acceleration platform. It synthesizes fragmented university data points—Student Information Systems (SIS), biometric attendance logs, LMS engagement metrics, coding benchmarks, and mock interview evaluations—into deterministic, transparent student intelligence.

### 📌 Current Implementation Status
* **Frontend**: Fully built with **React 19**, **TypeScript**, **Vite 8**, and **Tailwind CSS v4**. Responsive, editorial-grade UI with deep emerald accents (`#0B2925`, `#16856B`) and ivory palettes (`#F7F6F1`).
* **Authentication**: **Live Supabase Auth** integration with `signInWithPassword()`, `signUp()`, and `signOut()`. Hardcoded demo credentials removed. Route-level access protection ensures only authenticated users can access institutional portals.
* **Database & Cloud Backend**: Connected to a dedicated **Supabase PostgreSQL 17** cluster (`cxvikyzuwnxczsbcllwh` in `ap-south-1` Mumbai) under organization **Ammu Org**.
* **Live Synchronized Tables**:
  * `public.inquiries` — Website inquiries, contact requests, and admissions questions.
  * `public.interventions` — Mentor-assigned intervention plans and remediation tracking.
  * `public.study_tasks` — Student study planner tasks with priority and deadlines.
  * `public.tutor_inquiries` — Student chat sessions with the AI Study Tutor.
* **Row-Level Security (RLS)**: Enforced across all tables with explicit read/write policies.
* **Database Connections**: Configured for both **Transaction Pooling** (`DATABASE_URL` on port 6543) for serverless deployments and **Direct Connection** (`DIRECT_URL` on port 5432) for migrations and administrative tooling.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19** (`react`, `react-dom`) | Modern hooks, StrictMode compliant, zero deprecated APIs |
| **Language & Build** | **TypeScript 5.8+** & **Vite 8** | Strict typing, instantaneous HMR, optimized tree-shaken chunks |
| **Styling & Design** | **Tailwind CSS v4** (`@tailwindcss/vite`) | Custom design tokens, glassmorphism, micro-animations |
| **Icons & Charts** | **Lucide React** & **Recharts** | Lucide vector glyphs, interactive multi-axis analytic charts |
| **Authentication** | **Supabase Auth** (`@supabase/supabase-js`) | Encrypted bcrypt credentials, JWT access tokens, role metadata |
| **Database** | **Supabase PostgreSQL 17** | Hosted on AWS `ap-south-1` (Mumbai), RLS enabled |
| **Connection Pooler** | **Supavisor** | Port 6543 transaction pooling for serverless auto-scaling |

---

## 👥 Role-Based Portals & Core Modules

### 1. 🏛️ Institutional Administration Portal (`/admin/*`)
* **Institutional Overview (`AdminOverview.tsx`)**: High-level university health metrics, department-wise risk distributions, academic vs. attendance scatter plots, and urgent flag trackers.
* **Student Directory (`StudentDirectory.tsx`)**: Searchable, filterable registry of scholars with CGPA, attendance, LMS completion, coding scores, and risk tiers.
* **Student 360° Profile (`StudentProfile.tsx`)**: In-depth individual dossiers including breakdown of risk factors, historical semester trends, subject grade cards, and intervention histories.
* **Risk Segmentation (`RiskSegmentation.tsx`)**: Multi-vector cohort clustering (Critical Academic Risk, High Placement Deficit, Attendance Disconnect, High-Potential Scholars).
* **Placement Intelligence (`PlacementIntelligence.tsx`)**: Pre-hiring readiness analytics, aptitude vs. coding matrix, tier-1 company qualification odds, and interview logs.
* **AI Success Copilot (`AiInsights.tsx`)**: Natural-language institutional query engine for discovering actionable data insights across student cohorts.
* **Data Ingestion & Live Supabase Console (`DataManagement.tsx`)**:
  * Live status of unified pipelines (SIS, Biometric Attendance, LMS, Placement Assessments).
  * **Supabase Live Inquiries Table**: Real-time explorer for public website inquiries with status updates (*New*, *In Review*, *Resolved*).
  * Client-side CSV batch parser with schema integrity and bounds validation.

### 2. 👨‍🏫 Faculty & Mentor Portal (`/faculty/*`)
* **Mentor Overview (`FacultyOverview.tsx`)**: Personalized dashboard of assigned mentee scholars.
* **Intervention Center (`InterventionCenter.tsx` & `InterventionModal.tsx`)**: Deploy structured academic remedial tutorials, attendance agreements, or placement bootcamps. Syncs immediately to Supabase `interventions` table.

### 3. 🎓 Student Scholar Portal (`/student/*`)
* **Growth Dashboard (`StudentPortal.tsx`)**: Personal progress tracker, weekly study targets, validated skill areas, and recent activity logs.
* **AI Study Tutor (`AiStudyTutor.tsx`)**: Specialized doubt-solving dialog for Computer Science and Engineering topics (DBMS, DSA, OS, Networks, Math). Persists queries into Supabase `tutor_inquiries`.
* **Smart Learning Planner (`LearningPlanner.tsx`)**: Interactive task manager with calendar milestones, priority tags, and study duration tracking. Syncs directly to Supabase `study_tasks`.
* **Quizzes & Flashcards (`QuizPractice.tsx`)**: Interactive self-assessment quizzes with instant scoring, topic mastery meters, and spaced-repetition flashcard decks.
* **Career & Placement Copilot (`CareerCopilot.tsx`)**: Resume optimization feedback, role requirement checklists, and AI Technical Mock Interview Simulator.

### 4. 📬 Public & Inquiry Features
* **Inquiry Modal (`InquiryModal.tsx`)**:
  * Accessible from both the Login Page and the Dashboard Navigation Header.
  * Captures Admissions, Academic Support, Placement Help, and Feedback inquiries directly into Supabase `public.inquiries`.

---

## 🗄️ Database Schema & Tables

```sql
-- 1. Website Inquiries
CREATE TABLE public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    inquiry_type TEXT DEFAULT 'general',
    role TEXT DEFAULT 'visitor',
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new'
);

-- 2. Interventions
CREATE TABLE public.interventions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    department TEXT,
    type TEXT NOT NULL,
    severity TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    trigger_metrics TEXT,
    status TEXT DEFAULT 'Pending',
    assigned_to TEXT,
    due_date TEXT
);

-- 3. Study Tasks
CREATE TABLE public.study_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    due_date TEXT NOT NULL,
    estimated_minutes INTEGER DEFAULT 45,
    priority TEXT DEFAULT 'Medium',
    difficulty TEXT DEFAULT 'Intermediate',
    completed BOOLEAN DEFAULT false
);

-- 4. Tutor Inquiries
CREATE TABLE public.tutor_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    student_name TEXT DEFAULT 'Student',
    subject TEXT,
    query_mode TEXT,
    question TEXT NOT NULL,
    response TEXT
);
```

---

## 🔐 Environment Variables Configuration

The project uses `.env` for local execution and deployment platform configuration:

```env
# Supabase API & Client Configuration (Browser Accessible)
VITE_SUPABASE_URL=https://cxvikyzuwnxczsbcllwh.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

# Supabase Service Role Key (Server-Side / Administrative Scripts Only)
# WARNING: NEVER prefix with VITE_ to prevent bundling into client-side code!
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Supabase PostgreSQL Database URLs
# Transaction Pooler (Port 6543, for serverless APIs, Vercel, Netlify, Render):
DATABASE_URL=postgresql://postgres.cxvikyzuwnxczsbcllwh:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Direct Database URL (Port 5432, for migrations and administrative tools):
DIRECT_URL=postgresql://postgres:[YOUR-PASSWORD]@db.cxvikyzuwnxczsbcllwh.supabase.co:5432/postgres
```

---

## 🚀 Getting Started Locally

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm** / **pnpm** / **yarn**

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone <repository-url>
cd gayuu

# Install dependencies
npm install
```

### 2. Verify `.env` File
Ensure your `.env` file contains the active Supabase project credentials as detailed in the section above.

### 3. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### 4. Build for Production
```bash
npm run build
```
Generates a minified production bundle in the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

---

## 🌐 Production Deployment Guide

### Deploying to Vercel
1. Push your project to GitHub or GitLab.
2. Import the repository in [Vercel](https://vercel.com).
3. Framework Preset: **Vite**.
4. Add the following Environment Variables in Vercel Project Settings:
   * `VITE_SUPABASE_URL`
   * `VITE_SUPABASE_ANON_KEY`
   * `VITE_SUPABASE_PUBLISHABLE_KEY`
   * `DATABASE_URL`
   * `DIRECT_URL`
   * `SUPABASE_SERVICE_ROLE_KEY` *(if deploying backend serverless functions)*
5. Click **Deploy**.

### Deploying to Netlify
1. Connect repository in [Netlify](https://netlify.com).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add Environment Variables under **Site configuration** → **Environment variables**.

---

## 📁 Project Directory Structure

```text
gayuu/
├── .env                         # Live environment configuration
├── .env.example                 # Template environment variables
├── index.html                   # HTML entry point with modern typography
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite & Tailwind CSS plugins
├── public/                      # Static web assets
└── src/
    ├── App.tsx                  # Main router & authentication route guard
    ├── main.tsx                 # React DOM root initialization with AppProvider
    ├── index.css                # Global styles & design system tokens
    ├── components/
    │   ├── inquiry/             # Supabase live Inquiry Modal component
    │   ├── interventions/       # Intervention creation & management modals
    │   ├── layout/              # AppShell navigation header & responsive sidebar
    │   └── ui/                  # Reusable UI primitives
    ├── context/
    │   └── AppContext.tsx       # Global application state & Supabase Auth listeners
    ├── data/
    │   ├── mockData.ts          # Baseline student datasets & mentor directories
    │   └── quizBank.ts          # CS/Engineering question bank & flashcards
    ├── lib/
    │   ├── supabase.ts          # Client-side Supabase client & service APIs
    │   └── supabaseAdmin.ts     # Server-side admin client using service_role key
    ├── pages/
    │   ├── admin/               # Dean & Institutional administrator views
    │   ├── auth/                # Supabase authenticated LoginPage (Sign In & Sign Up)
    │   ├── faculty/             # Mentor & Faculty dashboards
    │   └── student/             # Student growth portal, AI Tutor, & Career Copilot
    ├── types/
    │   └── index.ts             # Comprehensive TypeScript interfaces & types
    └── utils/
        ├── careerEngine.ts      # Resume scoring & mock interview logic
        ├── copilotEngine.ts     # Institutional query intelligence engine
        ├── plannerEngine.ts     # Study plan recommendation generator
        ├── scoring.ts           # Risk calculation & weighted academic indices
        └── tutorEngine.ts       # AI pedagogical study tutor engine
```

---

## 🔒 Security Best Practices Implemented
* **No Plain-Text Passwords**: Supabase Auth handles password encryption via bcrypt hashing on isolated auth servers.
* **No Hardcoded Credentials**: Form inputs require authentic user credentials.
* **Separation of Keys**: Public publishable key (`VITE_SUPABASE_ANON_KEY`) is used client-side; superuser administrative key (`SUPABASE_SERVICE_ROLE_KEY`) is kept private without the `VITE_` prefix.
* **Protected Routes**: Protected pages verify valid session tokens via `supabase.auth.getSession()` and `onAuthStateChange()`.
* **Row-Level Security (RLS)**: Enforced on all tables to prevent unauthorized access.

---

## 📄 License
This project is proprietary and built for university student success intelligence. All rights reserved.
