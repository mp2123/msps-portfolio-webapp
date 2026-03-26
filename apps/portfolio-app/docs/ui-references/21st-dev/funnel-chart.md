# funnel-chart

Original request:
- intended target path: `/components/ui/funnel-chart.tsx`
- dependencies:
  - `clsx`
  - `motion`
  - `tailwind-merge`

Reference traits:
- animated funnel segments
- layered SVG ring treatment
- hover focus and dimming behavior
- flexible label layout and orientation options
- suitable for conversion funnels or staged process metrics

Raw integration cautions:
- flexible enough to be powerful, but also easier to over-style
- should be grounded in one real metric story, not used as abstract decoration

Closest current production usage:
- the portfolio currently uses other proof/impact visualizations instead of this exact funnel pattern

