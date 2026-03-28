# Portfolio QA Checklist

Use this checklist before shipping visual or interaction changes to the portfolio app.

## Breakpoints

- `1440` desktop wide
- `1180` desktop split / half-screen
- `960` small desktop / large tablet
- `768` tablet
- `390` mobile

## Global Navigation

- Header branding does not collide with the search trigger or nav.
- Homepage desktop nav links align and scroll to the correct section offsets.
- `/projects` nav links land on the project library, artifact vault, or back to the correct homepage sections.
- `/cv` still loads quickly, and the print toolbar remains usable.
- Mobile menu opens, closes, and all section links work.
- Command/search modal opens, navigates correctly, and does not trap broken focus.

## Hero

- Hero eyebrow is visible and not clipped.
- Hero title lines are intentional at each breakpoint.
- Scroll handoff feels late enough that the frame stays dominant before content enters.
- No wheel/touch hijacking regressions.

## Sections and Interactions

- Homepage atlas cards, contact links, and `/projects` deep links are clickable.
- `/projects` library sections render in equal-weight treatment and anchor correctly from the homepage atlas.
- Impact lab renders cleanly on `/projects` and the ROI calculator still behaves.
- Translation-layer scanner renders on `/projects` without clipping or dead links.
- CV companion sections render below the printable CV summary without affecting print layout.
- No horizontal overflow on `/`, `/projects`, or `/cv`.
- Advantage cards retain readable contrast and hover polish without jank.

## Graphics and Motion

- Signal path animation still looks alive after `30+` seconds on screen.
- Signal path pauses when offscreen or the tab is hidden.
- Interactive orb responds on hover without frame drops or overflow.
- Globe drag works, stage cards switch state clearly, and active city copy updates.
- CV companion globe and timeline remain usable after moving them off the homepage.

## Assistant

- Floating assistant opens and closes on desktop and mobile.
- Prompt chips submit correctly.
- Typed messages submit correctly.
- Scrolling while hovered over the assistant scrolls the assistant content, not the page.
- Repeated prompts behave sensibly with cache headers and fallback messaging.

## Hidden Wall

- The "Leave invisible ink" trigger is discoverable but discreet.
- Wall modal opens and loads messages.
- Submitting a short alias/message works.
- Hover/tap reveal works on desktop and touch.
- Cooldown / validation errors are human-readable.

## Analytics and Debug

- `/internal/assistant-debug` loads.
- Database shows as configured and reachable in production.
- Recent analytics rows appear after UI interactions.
- Wall messages appear in the debug view after successful submit.
- No raw IPs are shown or stored.
