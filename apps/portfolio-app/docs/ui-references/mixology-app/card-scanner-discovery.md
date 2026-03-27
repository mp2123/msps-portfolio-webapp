# card-scanner-discovery

Original source:
- component: `/Users/michael_s_panico/Desktop/DevBase/active_projects/MPs_Web-App_Ecosystem/apps/mixology-app/src/components/ui/card-scanner.tsx`
- mounted in: `/Users/michael_s_panico/Desktop/DevBase/active_projects/MPs_Web-App_Ecosystem/apps/mixology-app/src/app/page.tsx`
- section id: `discovery`

Dependencies:
- `framer-motion`
- `lucide-react`

Reference traits:
- horizontally drifting card rail with a persistent center scan point
- split-card reveal where machine-like text becomes a polished visual card
- user flick or wheel input injects directional velocity into the rail
- rail pauses when hovered and still, then resumes motion when interaction stops
- cyan-on-black terminal aesthetic with a scanning / declassification feel
- repeated cards create a seamless looping strip instead of a bounded carousel

Core interaction worth preserving:
- the strongest idea is not the cocktail content
- it is the conversion moment: raw system text turns into a clean artifact exactly at the scanner line
- that interaction communicates translation, systemization, and polish in one gesture

Why it is strong for the portfolio:
- Michael's portfolio is fundamentally about turning messy inputs into decision-ready outputs
- this component already visualizes that story
- it fits the operator-to-analyst narrative better than a generic slider or gallery

Portfolio-specific implementation ideas:
- `Artifact vault`:
  use the scanner to convert DAX / SQL / Python / KPI-definition fragments into dashboard screenshots, PDF brief cards, or demo thumbnails
- `Projects`:
  show a looping strip where raw stakeholder asks or pseudo-code become project case-study cards
- `Quick recruiter summary`:
  a short, narrower version could scan from `manual reporting`, `messy KPI logic`, `rerouted tickets`, or `stakeholder ambiguity` into outcome cards like `20+ hrs/week saved` or `$280K modeled savings`
- `Non-Traditional Advantage`:
  translate operational signals on the left into analytics deliverables on the right, making the transferability story feel interactive
- `Hidden wall / easter egg`:
  use the same reveal mechanic for private notes, invisible ink, or hidden “artifact unlock” cards

Best portfolio adaptation:
- keep the scan-line metaphor and the code-to-artifact reveal
- swap cocktail recipe code for business-facing raw inputs:
  - KPI definitions
  - SQL fragments
  - DAX measures
  - Python feature engineering notes
  - stakeholder request text
- make the cards fewer, wider, and slower than the mixology version
- anchor the strip to a specific proof section instead of using it as pure atmosphere

Production cautions:
- the original loops continuously and touches DOM styles every animation frame
- it is visually effective, but should stay scoped to one section
- the portfolio version should pause offscreen and reduce card count to avoid unnecessary motion tax
- images should be local or portfolio-safe assets rather than remote stock URLs

Recommended next step:
- build a portfolio-specific `artifact-scanner.tsx` variant that scans from raw business text into proof cards
- likely best first home: the top of `Artifacts` or as a bridge between `Projects` and `Artifacts`
