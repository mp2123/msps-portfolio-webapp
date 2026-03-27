# hero-futuristic

Original request:
- intended target path: `/components/ui/hero-futuristic.tsx`
- dependencies:
  - `three`
  - `@react-three/fiber`
  - `@react-three/drei`

Reference traits:
- WebGPU-driven hero
- depth-map image distortion
- bloom and scan-line post-processing
- staged glitch-style headline reveal
- premium “future interface” presentation

Raw integration cautions:
- WebGPU support is still a compatibility risk for a public portfolio
- this component is much heavier than the recruiter use case justifies
- it is better as inspiration for scanline, glow, and reveal language than as a direct mount

Likely production adaptation guidance:
- keep the scanline and depth-language, but render it with lighter canvas or CSS effects
- avoid shipping the raw WebGPU stack unless the target browser matrix explicitly allows it
- use it as a visual reference for hero pacing, not a literal production dependency
