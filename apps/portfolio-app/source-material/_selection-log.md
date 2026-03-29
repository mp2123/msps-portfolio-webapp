# Selection Log

Use this file to track what is likely to ship into the public portfolio.

| Project | Strongest asset candidates | Publish status | Sanitized status | Likely website destination |
| --- | --- | --- | --- | --- |
| command-center-bi | Dashboard screenshots, KPI logic walkthrough | planned | sanitized in portfolio.ts | Projects, Translation layer, Artifact vault, Assistant |
| ticket-routing-prediction | Methodology brief, model evaluation summary | planned | sanitized in portfolio.ts (Adidas = academic) | Projects, Artifact vault, Assistant |
| automation-workflows | Automation demo, process compression clip | planned | safe (generic descriptions) | Projects, Translation layer, Artifact vault, Assistant |
| spotify-modeling | Regression case study, feature analysis | published | public (academic dataset) | Projects, Artifact vault, Assistant |
| yelp-review-modeling | NLP/sentiment classification report | published | public (public dataset) | Projects, Artifact vault, Assistant |
| tjix-net-sales-drivers | Regression report, scenario model | published | public (academic project) | Projects, Artifact vault, Assistant |
| relational-database-design | ERD design, SQL query patterns | published | public (academic project) | Projects, Artifact vault, Assistant |
| recommendations | 2 sanitized quotes (initials only) | published | ✅ sanitized (v1.2.0) | Recommendations, Assistant, Contact |
| resume-and-positioning | PDF resume, positioning narrative | published | ✅ public-ready | Hero, Quick summary, Contact, Assistant |
| shared-proof-assets | Scorecard templates, reporting handoffs | planned | not started | Proof strip, Artifact vault, Assistant |
| ai-workflow-automation | Public docs repo, architecture notes | published | ✅ public repo | Projects, Artifact vault, Assistant |

## Sanitization Actions Taken (2026-03-28)

1. **Recommendation quotes**: Full names → first initial + last name (`R. Bhakta`, `T. Kedyk`)
2. **Company names**: `Paramount Barco` → `Multi-Unit Hospitality Group` (too specific for individual)
3. **Chatbot prompt**: Switched from `author` → `publicName` in recommendation summary builder
4. **Cocktail notes**: Placeholder text → professional bartender build notes
5. **Full PII sweep**: No emails, phone numbers, API keys, or secrets found in source
