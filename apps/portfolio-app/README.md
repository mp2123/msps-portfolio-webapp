# 📊 Michael Panico: Professional CV & Analytics Portfolio

This application is an interactive, "sales-worthy" professional portfolio designed to showcase Michael Panico's unique background in both high-volume hospitality management and high-impact data analytics.

---

## ✨ Core Features

- **Interactive ROI Calculator:** An engaging tool that allows recruiters to estimate the time and cost savings Michael can bring to their team, based on his real-world automation metrics from Avnet.
- **Live Data Dashboard:** A mock "Command Center" built with `recharts` that visualizes the financial impact of his key projects, turning abstract metrics into tangible, interactive data points.
- **The "Hospitality to Quant" Story Map:** A dedicated visual narrative that bridges the gap between his operational experience in hospitality and his technical skills in data science, highlighting the unique advantages this dual background provides.
- **AI Recruiter Assistant (Michael-Bot):** An enhanced AI chatbot trained on his resume and projects, featuring guided prompt suggestions to help visitors quickly find his most impressive accomplishments.
- **Dark Analytics Theme:** A custom, high-contrast dark theme with neon cyan accents, designed to evoke a modern, data-centric aesthetic.
- **Framer Motion Animations:** Fluid, 120Hz-ready animations on all interactive elements, from the Experience Timeline to the Project Showcase cards.

## 🤔 Why a Web App, Not a Website?

A standard, static website is like a digital brochure—it presents information. This project, however, is an **interactive experience** designed to *demonstrate* skill, not just list it. We chose a Web App architecture for several key reasons:

1.  **Interactivity:** Features like the ROI Calculator, the live Recharts dashboard, and the AI chatbot require a stateful, client-side application structure that a static HTML/CSS site cannot support.
2.  **Dynamic Content:** While the content is currently hard-coded, the architecture is built to easily pull data from a CMS or a database (like our Supabase instances) in the future.
3.  **Performance & Animations:** Using Next.js and Framer Motion allows for complex, hardware-accelerated animations and page transitions that create a premium, "buttery-smooth" user experience.
4.  **Scalability:** As a full-fledged application within our monorepo, it can share components, types, and logic with the other apps, making future feature development (like a blog or more complex case studies) much more efficient.

In short, this isn't just a resume—it's a product, and the product is Michael's expertise.

## 🚀 Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Environment Setup:**
    Create a `.env` file and populate it with your Supabase and AI provider keys (see `.env.template`).
3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
---
*Part of the Michael Panico Web-App Ecosystem*
