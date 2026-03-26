# 📊 Michael Panico: Professional CV & Analytics Portfolio

This application is an interactive, "sales-worthy" professional portfolio designed to showcase Michael Panico's unique background in both high-volume hospitality management and high-impact data analytics.

---

## ✨ Core Features & Enhancements (Phase 3 & 4)

### Immersive User Experience:
-   **Scroll-Expanding Hero:** A high-impact hero section featuring a dynamic video or image background that expands upon scroll, immediately engaging visitors.
-   **"Glass Terminal" UI:** The main content is wrapped in a sleek, glassmorphic terminal window aesthetic, providing a consistent high-tech feel.
-   **Generative Art Background:** A subtle, mouse-reactive dot shader background integrated into the root layout, adding a layer of dynamic visual polish across the entire site.
-   **Spotlight Card Effect:** Project and information cards now feature an interactive mouse-follow glow effect, enhancing engagement.

### Sales-Focused Content:
-   **Interactive ROI Calculator:** Allows visitors (recruiters) to estimate time and cost savings Michael can bring to their team, based on his real-world automation achievements.
-   **Live Data Dashboard:** A compelling, interactive chart that visualizes the tangible financial impact of Michael's key projects, turning metrics into a dynamic story.
-   **The "Hospitality to Quant" Story Map:** A dedicated section visually bridging his operational management skills with his data analytics expertise, highlighting his unique competitive advantage.
-   **Animated Code Snippets:** Key project descriptions feature animated, typing code blocks, demonstrating practical coding skills.

### Enhanced AI Assistant:
-   **Glowing AI Assistant (Michael-Bot):** A visually upgraded, floating chatbot assistant trained on Michael's resume and projects, featuring guided prompt suggestions for recruiters.

### Presentation & Navigation:
-   **Bento Grid Project Showcase:** A modern, flexible grid layout for displaying key projects, making information digestible and visually appealing.
-   **Clean Header:** A minimalist header with a custom "MP" logo and a direct "Contact Me" call-to-action.

## 🤔 Why a Web App, Not a Website?

A standard, static website is like a digital brochure—it presents information. This project, however, is an **interactive experience** designed to *demonstrate* skill, not just list it. We chose a Web App architecture for several key reasons:

1.  **Interactivity & Engagement:** Features like the ROI Calculator, the live Recharts dashboard, the AI chatbot, and the scroll-expanding hero require a stateful, client-side application structure that a static HTML/CSS site cannot support.
2.  **Dynamic Content:** While the content is currently hard-coded, the architecture is built to easily pull data from a CMS or a database (like our Supabase instances) in the future.
3.  **Performance & Animations:** Using Next.js and Framer Motion allows for complex, hardware-accelerated animations and page transitions that create a premium, "buttery-smooth" user experience.
4.  **Scalability & Maintainability:** As a full-fledged application within our monorepo, it can share components, types, and logic with the other apps, making future feature development (like a blog or more complex case studies) much more efficient.

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
