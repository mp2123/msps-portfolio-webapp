# Source Material Intake

This folder is the intake system for all future portfolio-proof upgrades.

Everything in this intake system should be treated as local-only by default unless it is intentionally promoted into a public-safe website asset later.

Use it as the single staging area for:
- raw project evidence
- sanitized public-safe exports
- strongest candidate website assets
- supporting notes that explain what each file proves

Folder rules:
- `01-raw`: original material, even if messy
- `02-sanitized`: redacted public-safe versions
- `03-selected-assets`: strongest candidate files for the live site
- `04-notes`: supporting context, filenames, impact notes, and provenance

Working order:
1. Drop unsorted files into `_incoming` or place them directly in the right project folder.
2. Keep originals in `01-raw`.
3. Put redacted or cropped public-safe copies in `02-sanitized`.
4. Move the best likely portfolio candidates into `03-selected-assets`.
5. Use `04-notes` to explain what each asset proves.

Safety default:
- do not publish directly from `source-material`
- do not treat raw resumes, raw project files, or recommendation source docs as GitHub-ready or website-ready
- promotion into the live portfolio should happen only after review and sanitization

Start with:
- `_intake-template.md`
- `_asset-sanitization-guide.md`
- `_selection-log.md`

Companion docs:
- `../docs/source-material-map.md`
- `../docs/architecture-map.md`
- `../docs/project-fact-sheets.md`
