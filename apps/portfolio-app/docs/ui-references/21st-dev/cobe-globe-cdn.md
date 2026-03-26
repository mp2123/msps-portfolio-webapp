# cobe-globe-cdn

Original request:
- intended target path: `/components/ui/cobe-globe-cdn.tsx`
- dependency: `cobe`

Reference traits:
- interactive globe with markers and arcs
- animated traffic labels on arc anchors
- rotating “pyramid” node markers
- CDN or distributed systems visual storytelling

Raw integration cautions:
- anchor-positioning based labels are visually clever but browser-sensitive
- globe samples and continuous animation need to be budgeted carefully
- best used as a scoped story module, not a global decorative widget

Production adaptation in this repo:
- `src/components/ui/experience-globe.tsx`

