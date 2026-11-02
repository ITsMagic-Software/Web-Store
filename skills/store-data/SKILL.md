---
name: store-data
description: Change manifest loading, decoding, mapping, catalog filtering or service error handling without leaking raw backend data into the UI.
---

# Store data

[Português](SKILL.pt-BR.md)

- Read the existing mapper and actual payload before changing fields. The source is `ITsMagic-Software/Packages-Manifest`; endpoint overrides live in `services/endpoints.ts`.
- Fetch through `services/shared/httpClient.ts`. Preserve timeout/retry handling and the gzip-to-JSON fallback; keep requests out of components.
- Only compatible v2 assets reach the catalog. Decode `titleB64`, `descriptionB64`, `licenseB64` and prefixed values in the mapper. Preserve UTF-8, the three-layer decoding limit and malformed-value handling.
- Use `lib/date.ts` for strict `dd/MM/yyyy` or `yyyy-MM-dd` parsing in UTC. Invalid dates sort last; newest first is the default.
- Keep HTTPS URL validation in the mapper and image-host validation in `lib/images.ts`. Skip malformed individual items with observable counts; an invalid envelope should not silently become a successful empty catalog.
- Keep accent-insensitive search, category filtering, stable ordering and bounded pagination in `domain/catalog.ts`. Never mutate the input snapshot.
- Preserve the service result distinction between unavailable and ready/empty. Do not disguise fetch failures as an empty successful catalog or expose raw payloads in logs.

Run `tests/manifest.test.ts` and `tests/catalog.test.ts` for mapping/catalog changes. Add a focused case only for a new rule or demonstrated failure; document a known gap instead of claiming it is already implemented.
