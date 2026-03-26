# 🌐 Michael Panico's Web-App Ecosystem

Welcome to the central hub of a high-performance, AI-driven monorepo. This repository houses a collection of sophisticated web applications, ranging from professional licensing study platforms to creative mixology portfolios.

---

## 🎯 Project Vision & Philosophy

This ecosystem is designed to push the boundaries of modern web development by combining **high-end performance visuals**, **AI-first workflows**, and **data-driven architectures**. 

### 💡 Core Principles
- **BYOK (Bring Your Own Key):** All AI integrations use the "Bring Your Own Key" model. This ensures zero API costs for the host while providing users with privacy and the choice of their preferred AI models (Gemini, OpenAI, etc.).
- **120Hz Visual Mastery:** UI components like the `CardScanner` are optimized with `useAnimationFrame` and `useMotionValue` to achieve sub-pixel smooth motion, perfectly synced with high-refresh-rate displays.
- **Privacy & Portability:** User preferences and AI keys are stored locally in the browser's `localStorage`, ensuring a "lite" backend and maximum user control.
- **Professional Precision:** Whether studying for a state licensing exam or mastering a complex cocktail, the apps provide high-fidelity content and intuitive interactive tools.

---

## 🚀 Active Applications

### 📊 [Professional CV & Analytics Portfolio](./apps/portfolio-app)
A high-tech, interactive portfolio web app bridging hospitality management with advanced data analytics and automation.
- **Status:** Development (Phase 1).
- **Key Features:**
  - **"Dark Analytics" Theme:** A clean, deep-charcoal aesthetic with vibrant cyan data-stream accents.
  - **Command Center Showcase:** Interactive, Framer Motion-powered cards highlighting ML/regression models and workflow automations.
  - **AI Recruiter Assistant:** "Michael-Bot" agent trained on Michael's resume and experiences.

### 📋 [Life Insurance AZ 2026 Study Platform](./apps/insurance-app)
A high-performance study engine designed to master the Arizona 2026 Life Insurance Exam.
- **Status:** Production-Ready & Deployed.
- **Key Features:**
  - **307 Verified Questions:** A comprehensive database of state-specific exam questions.
  - **AI Study Assistant:** Context-aware tutoring using the Vercel AI SDK v6.
  - **"Gaia" Theme:** A professional, focused aesthetic designed for long study sessions.
  - **Smooth Card Scanner:** 120Hz hardware-accelerated scroller for rapid content review.

### 🍸 [Mixology Lab & Portfolio](./apps/mixology-app)
A premium digital destination for cocktail education, professional networking, and affiliate marketing.
- **Status:** Development (V2 Implementation).
- **Key Features:**
  - **"Neutral/Amber" Glassmorphism:** A high-end, sophisticated UI inspired by modern luxury brands.
  - **AI Master Mixologist:** A specialized AI agent for recipe creation and ingredient pairing.
  - **Affiliate Shop:** Curated professional-grade bar tool links managed directly via Supabase.
  - **Tutorial Integration:** Embedded high-quality video content for hands-on learning.

---

## 🛠 Advanced Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 15+ (App Router, Server Actions, TypeScript) |
| **Styling** | Tailwind CSS 4, Framer Motion, Radix UI (Shadcn/UI) |
| **Database** | Supabase (PostgreSQL), Prisma ORM |
| **AI SDK** | Vercel AI SDK v6 (Streaming, BYOK Logic) |
| **Visuals** | Three.js / @react-three/fiber (Topographical maps, liquid mercury effects) |
| **Docs/Viz** | Mermaid.js (Diagrams), Marp Pro (Slide Deck Generation) |

---

## 📁 Repository Structure

```text
.
├── apps/
│   ├── insurance-app/      # AZ 2026 Insurance Study Engine (Gaia Theme)
│   └── mixology-app/       # Professional Bartender Portfolio (Amber Theme)
├── docs/                   # The "Brain" of the project
│   ├── archived-reports/   # System architecture and implementation plans
│   ├── diagrams/           # Mermaid source files and PNG exports
│   └── study-material/     # Master guides, OCR data, and Marp slides
├── onboarding/             # Affiliate marketing and business documentation
├── scripts/                # Data processing, migration, and seeding tools
├── gemini.md               # Active session context and workspace status
└── README.md               # You are here (Ecosystem Overview)
```

---

## ⚙️ Standard Operating Procedures (SOPs)

### 1. Database Operations (Prisma)
To avoid IPv6/Transaction pooling hangs with Supabase, **ALWAYS** use the **Session Pooler (Port 5432)** for CLI commands:
```bash
# In an app directory:
npx prisma db push
npx prisma generate
```

### 2. Seeding Data
- **Insurance:** Seeding is managed via custom direct-access scripts in `prisma/scripts/`.
- **Mixology:** Use `node prisma/seed-bartender.js` to populate the recipe and product tables.

### 3. AI Key Configuration
Users must provide their own API keys via the **Settings** button in the AI chat interface. These are stored in `localStorage` and never touch the server.

---

## 🚀 Getting Started

1. **Clone & Install:**
   ```bash
   git clone <repo-url>
   npm install
   ```
2. **Set Environment Variables:**
   Navigate to an app (e.g., `cd apps/insurance-app`) and create a `.env` file following the provided `.env.template` or the app's README.
3. **Database Sync:**
   ```bash
   npx prisma db push
   ```
4. **Launch:**
   ```bash
   npm run dev
   ```

---
*Built with precision by Michael Panico. Leveraging AI to empower mastery and creativity.*
