# particle-effect-for-hero

Original request:
- intended target path: `/components/ui/particle-effect-for-hero.tsx`
- dependency: `lucide-react`

Reference traits:
- anti-gravity particle canvas
- background twinkle field and radial glow
- mouse-repulsion interaction
- hero navigation and call-to-action layered over the canvas

Raw integration cautions:
- collision simulation plus dense particles is not cheap
- debug overlays and continuous canvas updates need trimming for production
- full-screen canvas effects should be gated by viewport size and reduced-motion preferences

Likely production adaptation guidance:
- preserve the atmospheric particle field, but cap density and stop animating offscreen
- keep the interaction subtle and selectively enabled on large viewports only
- treat the mouse-repulsion feel as a hero accent, not a full-screen physics demo
