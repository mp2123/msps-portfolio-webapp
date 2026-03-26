# spotlight-card

Original request:
- intended target path: `/components/ui/spotlight-card.tsx`
- no extra package beyond React

Reference traits:
- pointer-tracked glow card
- CSS variable driven spotlight position
- layered `::before` and `::after` borders
- configurable glow color, size, and custom dimensions

Raw integration cautions:
- document-level pointer tracking means every card reacts on every move
- multiple instances can add layout and paint cost quickly
- best used selectively for premium proof blocks, not across the whole page

Closest current production usage:
- glow and spotlight language is used across several portfolio surfaces, but not via the raw component

