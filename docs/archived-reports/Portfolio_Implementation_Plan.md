# Plan: Professional CV & Analytics Portfolio Web App

This document outlines the strategy, architecture, and implementation steps for Michael Panico's personal CV and professional portfolio. This will be the third major web application in the monorepo ecosystem.

## 1. Concept & Vision
**Theme:** "Data-Driven / High-Tech Analytics"
**Narrative:** Bridging the gap between high-volume hospitality management, scalable business operations, and advanced data analytics/automation.
**Goal:** Create an interactive, visually stunning Web Application (not just a static website) that showcases technical proficiency, highlights complex data projects, and acts as a dynamic resume.

## 2. Technical Architecture
- **Location:** `apps/portfolio-app/`
- **Framework:** Next.js 15+ (App Router, TypeScript)
- **Styling:** Tailwind CSS 4, Framer Motion (for 120Hz smooth animations), Lucide React
- **Theme:** "Dark Analytics" - Deep charcoal/black backgrounds with vibrant cyan/electric blue accents. Glassmorphic elements for data cards.
- **Database:** Supabase (optional initially, but good for storing dynamic project data, recommendations, or contact logs).
- **AI Integration:** Vercel AI SDK v6 for a "Hire Me" Agent (Michael-Bot) that can answer recruiter questions based on the resume.

## 3. Core Features & Pages
1. **Hero Section:** 
   - Terminal/Code typing effect or interactive data visualization background.
   - High-level value proposition.
2. **Interactive Experience Timeline:**
   - Vertical animated timeline tracking from Hospitality to Business Analytics.
   - Expandable nodes for Avnet, Hilton, etc., focusing on quantifiable metrics (e.g., "$280K savings").
3. **The "Command Center" (Project Showcase):**
   - Grid of interactive, tiltable cards for major projects:
     - AI-Assisted Workflow Automation
     - Spotify Popularity Prediction
     - TJIX Net Sales Drivers
     - Ticket Reassignment Prediction
4. **Skills Matrix:**
   - Visual representation of technical (DAX, Python, SQL, Next.js) vs. business skills.
5. **AI Recruiter Assistant:**
   - Chat interface for visitors to ask questions about Michael's experience.

## 4. Execution Phases

### Phase 1: Scaffolding & Setup
- Clone the base Next.js architecture (from `apps/insurance-app`) into `apps/portfolio-app`.
- Clean up `package.json` and remove insurance-specific routes/content.
- Save this implementation document permanently to `docs/archived-reports/Portfolio_Implementation_Plan.md`.
- Update `README.md` and `gemini.md` to reflect the new 3rd application in the monorepo.

### Phase 2: Design System & Structure
- Overhaul the Tailwind configuration for the "Dark Analytics" theme.
- Create the global layout, navigation bar, and footer.

### Phase 3: Content Implementation
- Migrate all the LinkedIn data (Experience, Education, Projects) into custom React components.

### Phase 4: Final Polish
- Add Framer Motion animations.
- Configure the "Hire Me" AI agent system prompt.
