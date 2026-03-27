# Asset Sanitization Guide

Use this guide before anything leaves `01-raw`.

## Always Remove or Redact

- raw emails
- phone numbers
- internal URLs
- customer or client names
- employee names
- account IDs
- ticket IDs if they can identify internal systems
- any confidential dashboard tab, record, or metric that should not be public

## Public-Safe Defaults

- keep original files in `01-raw`
- create sanitized copies in `02-sanitized`
- prefer screenshot exports over raw internal files when public safety is unclear
- blur, crop, rename, or replace confidential labels instead of deleting the whole asset when the proof is still useful
- if a file is questionable, keep it internal until a clean sanitized version exists

## Good Portfolio-Safe Candidates

- dashboard screenshots with blurred or generalized labels
- short methodology PDFs
- small code excerpts with sensitive names removed
- scorecards, templates, or exports that no longer expose private business context
- short demo videos with confidential views removed

## Bad Public Candidates

- unredacted internal dashboards
- screenshots with internal URLs or employee names
- exports with row-level operational data
- notebooks or queries with live credentials, endpoints, or secret values

