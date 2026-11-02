---
name: store-architecture
description: Maintain the store's module boundaries, URL state and static export when changing routing, data flow or hosting configuration.
---

# Store architecture

[Português](SKILL.pt-BR.md)

- Preserve this flow: GitHub manifest → `services/` mapping → `domain/` assets → static pages → browser filtering/details.
- Network requests and backend shapes belong in `services/`. UI imports the public `@/services` entrypoint; use type-only imports when appropriate. Keep domain functions independent of React and Next.js.
- Build pages from mapped data through `storeRepository.getSnapshot()`. Do not introduce `cookies()`, `headers()`, `connection()`, server actions or request-time catalog queries into the static export.
- `lib/paths.ts` owns `/store`; locale routes are `/en/` and `/pt-br/` beneath it. Pre-generate new dynamic route segments with `generateStaticParams`.
- Keep `q`, `category`, `sort`, `page`, `perPage` and `pkg` in the URL. Query updates use `lib/navigation.ts`; opening a package adds history, closing it retains filters and supports browser Back.
- New packages appear after a rebuild. An in-memory service cache cannot refresh the published site. Keep `npm start` serving `out/`, not `next start`.
- Prefer the existing snapshot for this catalog. Introduce an API, extra abstraction or dependency only when a concrete requirement justifies it. Record architectural follow-ups in `ARCHITECTURE_REVIEW.md`.

For a routing/data-flow change, verify typecheck, build and the affected browser navigation tests. Keep the first catalog cards in the exported HTML and preserve the build failure on catalog unavailability.
