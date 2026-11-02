---
name: store-quality
description: Choose focused checks for store changes involving tests, accessibility, CI, dependencies or release configuration.
---

# Store quality

[Português](SKILL.pt-BR.md)

- Test observable behavior: manifest decoding/dates, filtering/pagination, image safety/fallback, URL/history and deployment error handling. Keep fixtures small and avoid assertions that copy implementation details or require exact visual wording.
- Use Vitest for pure/component behavior, Playwright for navigation/layout and Python unittest for `tools/deploy.py`. Test files live in `tests/`; reusable tools live in `tools/`, not inside skills.
- Keep browser coverage representative. The three layout smoke cases cover mobile/tablet/desktop, both themes and reduced motion; add a case only for a distinct risk. Screenshots are inspection artifacts, not pixel baselines.
- Preserve keyboard navigation, dialog focus/close behavior, visible focus, useful translated labels and image fallbacks. Do not report a WCAG/performance audit unless one was actually performed.
- Run affected checks using README commands. Changes to runtime/build code need a fresh export before browser checks; prose-only edits do not require a build. Run lint/typecheck when changing executable files or their configuration.
- Keep manifest/network tests deterministic. Browser smoke tests use the built catalog and therefore need a successful build and available packages.
- CI validates types, lint, unit tests, deployment-script tests, translations and build. Keep credentials out of local checks and generated artifacts out of Git.
- Review dependency changes and audit findings individually; do not use forced upgrades/downgrades just to clear a report. Report checks and limitations accurately.
