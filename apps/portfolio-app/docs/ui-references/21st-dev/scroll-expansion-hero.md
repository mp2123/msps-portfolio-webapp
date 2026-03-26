# scroll-expansion-hero

Original request:
- intended target path: `/components/ui/scroll-expansion-hero.tsx`
- dependency: `framer-motion`

Reference traits:
- full-screen sticky hero with scroll-driven media expansion
- background image layer with fading overlay
- expanding video or image frame
- split heading text that drifts horizontally as the user scrolls
- delayed reveal of below-the-fold content

Raw integration cautions:
- the original version globally intercepts wheel and touch behavior
- it can fight natural page scroll and create jank on mobile
- it is visually strong but too invasive as-is for a recruiter-facing homepage

Production adaptation in this repo:
- `src/components/ui/scroll-expansion-hero.tsx`

Why it was adapted:
- preserve the cinematic expansion effect
- avoid global scroll hijacking
- keep the hero performant enough for real portfolio use

