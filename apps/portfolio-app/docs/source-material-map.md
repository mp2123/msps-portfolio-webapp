# Source Material Map

This document maps intake folders to the current public portfolio surfaces so future content ingestion is mechanical instead of interpretive.

## Folder to Surface Mapping

### `command-center-bi`

- Primary project: `Command Center BI Infrastructure`
- Best current artifact targets:
  - `artifact-dashboard`
  - `artifact-methodology`
- Best website destinations:
  - `Projects`
  - `Translation layer`
  - `Artifact vault`
  - `Assistant`

### `ai-workflow-automation`

- Primary project: `Gemini/Codex Workflow Automation`
- Best current artifact targets:
  - `artifact-repo`
  - `artifact-video`
- Best website destinations:
  - `Project library`
  - `Translation layer`
  - `Artifact vault`
  - `Assistant`

### `ticket-routing-prediction`

- Primary project: `Ticket Reassignment Prediction`
- Best current artifact targets:
  - `artifact-methodology`
  - `artifact-video`
- Best website destinations:
  - `Projects`
  - `Artifact vault`
  - `Assistant`

### `automation-workflows`

- Primary project: `Command Center BI Infrastructure`
- Best current artifact targets:
  - `artifact-video`
  - `artifact-template`
- Best website destinations:
  - `Project library`
  - `Translation layer`
  - `Artifact vault`
  - `Assistant`

### `spotify-modeling`

- Primary project: `Spotify Popularity Prediction`
- Best current artifact targets:
  - `artifact-methodology`
- Best website destinations:
  - `Project library`
  - `Artifact vault`
  - `Assistant`

### `yelp-review-modeling`

- Primary project: `Yelp Review Rating / Sentiment Modeling`
- Best current artifact targets:
  - `artifact-video`
  - `artifact-methodology`
- Best website destinations:
  - `Project library`
  - `Artifact vault`
  - `Assistant`

### `tjix-net-sales-drivers`

- Primary project: `TJIX Net Sales Drivers`
- Best current artifact targets:
  - `artifact-methodology`
  - `artifact-template`
- Best website destinations:
  - `Project library`
  - `Artifact vault`
  - `Assistant`

### `relational-database-design`

- Primary project: `Relational Database Design`
- Best current artifact targets:
  - `artifact-template`
  - `artifact-methodology`
- Best website destinations:
  - `Project library`
  - `Artifact vault`
  - `Assistant`

### `recommendations`

- Best website destinations:
  - `Recommendations`
  - `Contact`
  - `Assistant`

### `resume-and-positioning`

- Best website destinations:
  - `Hero`
  - `Quick recruiter summary`
  - `Contact`
  - `Assistant`

### `shared-proof-assets`

- Best website destinations:
  - `Proof strip`
  - `Artifact vault`
  - `Assistant`

## Ingestion Rule

When real files arrive:
- pick the strongest 2 to 4 assets per folder
- mark each candidate as `website`, `download`, `assistant-only`, or `do-not-publish`
- replace placeholders only with sanitized assets
- keep raw originals available for provenance, but never publish directly from `01-raw`

Additional rule:
- `_incoming` remains the default unsorted drop zone, but tracked portfolio content should only be updated from canonical fact sheets and sanitized/public-safe candidates
