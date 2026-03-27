# radial-orbital-timeline

Original request:
- intended target path: `/components/ui/radial-orbital-timeline.tsx`
- dependencies:
  - `lucide-react`
  - `class-variance-authority`
  - `@radix-ui/react-slot`
- shadcn references requested:
  - `badge`
  - `button`
  - `card`

Reference traits:
- orbiting career nodes
- auto-rotation with click-to-focus behavior
- relationship highlighting between timeline items
- detailed expanded cards with status and energy indicators

Raw integration cautions:
- constant auto-rotation can feel theatrical if overused
- interaction density is high for recruiter scanning
- works best when the data model is tightly curated

Likely production adaptation guidance:
- keep the orbital metaphor only if the narrative benefits from it
- reduce motion by default and let the user choose focus, not chase rotation
- ensure the dense expanded state is still readable on mobile before using it broadly
