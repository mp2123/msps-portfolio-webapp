# 🎯 Workspace Context: Life Insurance & Mixology Monorepo

## 📚 Objectives
1.  **Life Insurance AZ 2026:** Study for the licensing exam using a high-end AI-powered web app.
2.  **Professional Bartender Portfolio:** A creative web app for cocktail recipes, tutorial videos, and affiliate marketing.

## 🛠 Active Tools & Skills
- **Marp Pro:** Generating professional study slide decks.
- **Mermaid Visualizer:** Creating comprehensive insurance and mixology mindmaps.
- **Vercel AI SDK v6:** Powering the "Bring Your Own Key" (BYOK) AI assistants.
- **Supabase & Prisma:** Managing Postgres databases for both applications.

## 📜 Standard Operating Procedures
1.  **Monorepo Management:** 
    - `apps/insurance-app/` contains the Insurance App.
    - `apps/mixology-app/` contains the Mixology Portfolio.
    - `apps/portfolio-app/` contains the Professional CV & Analytics Portfolio.
2.  **Database Connection:** Use the **Session Pooler (Port 5432)** for all Prisma CLI operations (`db push`, `generate`) to avoid IPv6/Transaction pooling hangs.
3.  **Visual Standards:** Use "Gaia" theme for Insurance and "Neutral/Amber" glassmorphism for Bartending.
4.  **AI BYOK:** Ensure the "Settings" button in the chatbot is used to save personal Gemini/OpenAI keys to `localStorage`.

## 🚀 Technical Status & Milestones
- **[x] Portfolio "Final Polish" Complete:** Upgraded the project showcase to a `BentoGrid`, replaced the chatbot with a `GlowingAiAssistant`, and integrated a `SpotlightCard` mouse-follow effect.
- **[x] Portfolio "Immersive Experience" Upgrade:** Implemented a `Scroll-Expanding Hero`, a "Glass Terminal" UI, and a generative `DotShader` background.
- **[x] Portfolio "Salesworthy" Features:** Built and integrated an interactive `ROI Calculator` and a `Recharts` live data dashboard.
- **[x] Portfolio App Scaffolded & Deployed:** New Next.js app created in `apps/portfolio-app` with a custom "Dark Analytics" theme and all build errors resolved.
- **[x] Comprehensive Documentation:** Created and updated READMEs for the root, all three apps, and key subdirectories, explaining architecture, features, and project goals.
- **[x] Insurance Database Live:** 307 verified questions successfully seeded to Supabase.
- **[x] Bartender App Cloned:** Architecture duplicated and themed for Mixology.
- **[x] Vercel Deployments:** All three apps connected to GitHub and hosted on Vercel.

## 📍 Where We Left Off (Next Steps)
1.  **Bartender App Development:**
    - Run `npx prisma db push` using the new Bartender Supabase URL.
    - Run `node prisma/seed-bartender.js` to upload initial cocktail recipes.
    - Embed personal bartending tutorial videos into the landing page.
2.  **Insurance App Development:**
    - Build the interactive testing UI for the Practice Exam feature, using the live `Question` table.
3.  **Portfolio App (Minor Polish):**
    - Build a dedicated "Contact Me" form.
    - Integrate the created `CodeSnippet` and `InteractiveGlobe` components into project detail views (when built).
