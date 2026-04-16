# 🍸 Professional Bartender Portfolio & Mixology Lab

A premium digital destination for cocktail education, professional networking, and affiliate marketing.

---

## ✨ Features & Technical Highlights

### 🎨 High-End Aesthetics
- **"Neutral/Amber" Glassmorphism:** A sophisticated UI/UX inspired by modern luxury brands, featuring frosted glass effects, amber highlights, and a dark charcoal backdrop.
- **Liquid Shaders:** Interactive backgrounds (e.g., `canvas.tsx`) that simulate cocktail fluidity using `@react-three/fiber` and GLSL shaders.
- **Smooth Interaction:** Leverages the same high-refresh-rate animation patterns as the Insurance App for a buttery-smooth portfolio experience.

### 📚 Mixology Resources
- **Dynamic Recipe Discovery:** A curated database of cocktail recipes with detailed ingredients, instructions, and glassware recommendations.
- **Affiliate Gear Shop:** Integrated recommendations for professional-grade bar tools (shakers, jiggers, syrups), managed directly via Supabase.
- **Video Tutorial Integration:** Embedded high-quality bartending tutorials for visual learning.

### 🤖 AI Master Mixologist (BYOK)
- **Specialized AI Agent:** A customized chatbot configured to act as a Master Mixologist, capable of suggesting recipes based on available ingredients or explaining cocktail history.
- **Privacy First:** Bring Your Own Key (BYOK) model stores API keys locally in the browser.

---

## 🛠 Tech Stack

- **Framework:** Next.js 15+ (App Router, Server Actions)
- **Styling:** Tailwind CSS 4, Framer Motion, Radix UI (Shadcn/UI)
- **Database:** Supabase (PostgreSQL), Prisma ORM (Row Level Security enabled for client protection)
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

# Seed initial cocktails and products
node prisma/seed-bartender.js
```

### 4. Run Development Server
```bash
npm run dev
```

---
*Part of the Michael Panico Web-App Ecosystem*
