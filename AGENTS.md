# Working on ITsMagic Web Store

[Português](AGENTS.pt-BR.md) · [Project setup](README.md)

## Scope and constraints

- A read-only asset catalog: browse packages and open their GitHub/download links. Keep backend, accounts and payments outside routine frontend work.
- Next.js App Router, strict TypeScript, React and Tailwind. Use npm and the committed lockfile.
- Production is a static export at `/store/`. Keep `output: "export"`; request-time APIs and server actions do not work on this host.
- Load the manifest through `services/` at build time. Pass mapped assets, never the raw manifest, to the browser.
- Keep parsing/I/O in `services/`, pure models/filtering in `domain/`, shared helpers in `lib/`, and UI in `components/`. Pages compose these pieces.
- Catalog state lives in URL parameters. Preserve filters, browser history and direct package links. Use `lib/paths.ts` for `/store` and `lib/navigation.ts` for local query changes.
- Keep code, identifiers and filenames in English. Add interface text to both `locales/en.json` and `locales/pt-BR.json`.
- Reuse CSS tokens, safe image handling and existing components. Treat manifest content as untrusted; allow HTTPS links and never render it as HTML.
- Keep changes scoped. Add a dependency only for a concrete need the current stack cannot meet. Add tests for behavior and regressions, not implementation details.

## Skills

Read only the skill relevant to the change. `SKILL.md` is English; `SKILL.pt-BR.md` is the equivalent Portuguese version. Read one language, not both.

| Change | Skill |
| --- | --- |
| Boundaries, routing, static hosting | [store-architecture](skills/store-architecture/SKILL.md) |
| Manifest, mapping, network, catalog rules | [store-data](skills/store-data/SKILL.md) |
| Layout, themes, motion, images | [store-design](skills/store-design/SKILL.md) |
| Interface text, locale, metadata | [store-i18n](skills/store-i18n/SKILL.md) |
| Tests, accessibility, CI, dependencies | [store-quality](skills/store-quality/SKILL.md) |

## Verification

Run checks affected by the change; use the commands in the README. Build when runtime code or build configuration changes. For UI/navigation changes, run the browser checks against a fresh export and inspect relevant screenshots. Do not rebuild for prose-only edits.

Keep English/Portuguese documentation equivalent when changing it. Report what changed, checks run and remaining limitations. Build, preview and tests do not require deployment credentials; publishing is a separate action.
