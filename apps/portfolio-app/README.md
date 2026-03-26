# 🏥 Life Insurance AZ 2026 Study Engine

A high-performance, AI-powered web application designed to help students master the Arizona 2026 Life Insurance licensing exam.

---

## ✨ Features & Technical Highlights

### 🚀 High-Performance Visuals
- **120Hz Card Scanner:** Optimized `CardScanner` component using Framer Motion's `useAnimationFrame` and `useMotionValue` for sub-pixel smooth motion, perfectly synced with high-refresh-rate displays.
- **Gaia Theme:** A professional, calm aesthetic designed for focused study, using a soft palette and modern typography.
- **Interactive Scroller:** Rapid content review via a hardware-accelerated scroller interface.

### 📚 Data-Driven Mastery
- **307 Verified Questions:** A comprehensive database of state-specific exam questions, seeded and ready for practice.
- **Interactive Practice Exams:** Simulate real testing environments with real-time feedback and progress tracking.

### 🤖 AI Study Assistant (BYOK)
- **Vercel AI SDK v6:** Integrated context-aware tutoring for deep dives into insurance concepts.
- **Privacy First:** Bring Your Own Key (BYOK) model stores API keys locally in the browser, ensuring cost-free hosting and maximum privacy.

---

## 🛠 Tech Stack

- **Framework:** Next.js 15+ (App Router, Server Actions)
- **Styling:** Tailwind CSS 4, Framer Motion, Radix UI (Shadcn/UI)
- **Database:** Supabase (PostgreSQL), Prisma ORM
- **AI Integration:** Vercel AI SDK v6 (Streaming)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file with your `DATABASE_URL` (Port 5432 for Prisma), `DIRECT_URL`, and AI provider keys.

### 3. Database Sync & Seeding
```bash
# Sync schema
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed 307 questions (via scripts)
node prisma/scripts/seed-questions.js
```

### 4. Run Development Server
```bash
npm run dev
```

---
*Part of the Michael Panico Web-App Ecosystem*
