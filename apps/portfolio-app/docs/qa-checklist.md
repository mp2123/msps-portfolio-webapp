# Portfolio QA Checklist

Use this checklist before shipping visual or interaction changes to the portfolio app.

## Breakpoints

- `1440` desktop wide
- `1280` desktop / `xl`
- `1180` desktop split / half-screen
- `960` small desktop / large tablet
- `768` tablet
- `390` mobile

## Global Navigation

- Header branding does not collide with the search trigger or route nav.
- Homepage desktop nav links align and scroll to the correct section offsets.
- `/projects` nav links land on the project library, artifact vault, or back to the correct homepage sections.
- `/cv` loads quickly, and the print toolbar remains usable.
- Mobile menu opens, closes, and all section links work.
- Command/search modal opens, navigates correctly, and does not trap broken focus.
- Shared assistant is available on `/`, `/projects`, and `/cv`.

## Hero and Homepage Flow

- Hero eyebrow is visible and not clipped.
- Hero title lines are intentional at each breakpoint.
- The woven hero remains smooth and visually stable.
- The proof handoff into the terminal shell feels intentional and leaves no dead space.
- No wheel/touch hijacking regressions.

## Sections and Interactions

- Homepage atlas cards, contact links, and `/projects` deep links are clickable.
- `/projects` library sections render in equal-weight treatment and anchor correctly from the homepage atlas.
- Impact lab renders cleanly on `/projects`, and the ROI calculator still behaves.
- Translation-layer scanner renders on `/projects` without clipping or dead links.
- Scanner wheel interaction works, and auto-scroll still behaves.
- CV deep-dive sections render below the printable CV summary without affecting print layout.
- Random cocktail dialog opens cleanly and keeps imagery visible on both desktop and mobile.
- No horizontal overflow on `/`, `/projects`, or `/cv`.
- Advantage cards retain readable contrast and hover polish without jank.

## Graphics and Motion

- Signal path animation still looks alive after `30+` seconds on screen.
- Signal path pauses when offscreen or the tab is hidden.
- Interactive orb responds on hover without frame drops or overflow.
- Globe auto-rotates, stage cards switch state clearly, and active city copy updates.
- If drag is enabled, it should feel readable and should not compete with idle motion.
- CV globe and orbital timeline remain usable after moving them off the homepage.

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

## Analytics and Diagnostics

- `/analytics` loads.
- Database shows as configured and reachable in production.
- Recent analytics rows appear after UI interactions.
- Wall messages appear in the diagnostics view after successful submit.
- No raw IPs are shown or stored.
- Analytics locations render decoded values like `San Jose, CA`, not URL-encoded text.

## Desktop / Mobile Audit Regression Checks

- At `1440`, the artifact vault uses 3 columns without wasting half a row.
- At `1180`, the artifact vault stays 2 columns and does not feel cramped.
- Analytics table-style sections remain readable with horizontal scrolling instead of stacked collapse.
- Recent mobile fixes still hold on `/projects`, `/analytics`, the command dialog, and the floating assistant.
