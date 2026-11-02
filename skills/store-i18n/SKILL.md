---
name: store-i18n
description: Update interface copy, locale routing, metadata or date formatting consistently in English and Brazilian Portuguese.
---

# Store translations

[Português](SKILL.pt-BR.md)

- Interface strings, accessibility labels and metadata belong in both `locales/en.json` and `locales/pt-BR.json`, with matching keys. Use natural copy, not literal word-for-word translations.
- Use `useApp().t` in client UI and `getDictionary(locale)` elsewhere. The current helper supports `{name}` interpolation, not ICU plurals; do not add unsupported message syntax or a new i18n library for a copy edit.
- Keep the distinction between dictionary locale `pt-BR` and route segment `pt-br`. Reuse `lib/i18n.ts` and `lib/paths.ts`; preserve `/store` and query parameters when switching languages.
- Manifest titles, descriptions and author text remain in their original language. Translate the surrounding interface, not package content.
- Format displayed dates with an explicit locale and UTC through `lib/date.ts`; avoid server/client differences.
- Documentation uses English entrypoints and matching `.pt-BR.md` versions. Keep filenames, commands, code identifiers and paths in English; language tags retain their standard spelling. Read only one language of each instruction document.

Run `npm run i18n:check` after changing dictionaries. Check affected Portuguese layouts for longer text; locale/navigation changes also need the relevant browser test.
