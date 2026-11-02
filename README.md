# ITsMagic Web Store

English · [Português](README.pt-BR.md)

A static asset catalog for ITsMagic Engine. Browse, search and filter compatible v2 packages,
view their details, then open the package's GitHub repository or download URL.

[Visit the store](https://itsmagic.com.br/store/) · [Package manifest](https://github.com/ITsMagic-Software/Packages-Manifest)

## Run locally

Requires **Node.js 22.12+** and npm. Python 3.11+ is needed only for deployment tooling and its tests.

```sh
npm ci
npm run dev
```

Open [localhost:3000/store/](http://localhost:3000/store/). The store supports English,
Brazilian Portuguese, light/dark themes and package links that preserve catalog filters.

## Build and preview

```sh
npm run build
npm start
```

The build needs network access to the GitHub manifest and Google Fonts. It writes static
files to `out/`; the preview serves them at `http://localhost:3000/store/`.
Catalog fetch failures stop the build. New or updated packages appear after another build/deployment.

## How it works

Built with Next.js App Router, React, TypeScript and Tailwind CSS. During the build,
`services/` loads and maps the manifest into compatible assets. The browser filters that snapshot
and stores search, category, sort, pagination and selected package in the URL.
Package links open their original HTTPS destinations; this project does not host package files.

| Directory | Responsibility |
| --- | --- |
| `app/` | Static pages, locale routes and global styles |
| `components/` | Catalog, details, controls and image fallbacks |
| `domain/` | Asset models and pure catalog selection |
| `services/` | Manifest loading, decoding and mapping |
| `lib/` | URL state, locale, dates, images and shared helpers |
| `locales/` | English and Brazilian Portuguese interface text |
| `tests/`, `tools/` | Focused checks, preview and deployment utilities |
| `skills/` | Task-specific contributor/agent guidance in both languages |

Production uses `output: "export"` and the `/store` base path. It requires a static web server,
not a running Next.js server. Architectural follow-ups are tracked in [ARCHITECTURE_REVIEW.md](ARCHITECTURE_REVIEW.md) (Portuguese).

## Configuration

These optional environment variables are read at build time; no credentials are needed to browse or build the store.

| Variable | Purpose / default |
| --- | --- |
| `STORE_MANIFEST_BASE_URL` | Manifest base URL; defaults to the upstream repository's raw `main` branch |
| `STORE_DATABASE_FORMAT` | `gz` (default, with JSON fallback) or `json` |
| `ASSET_DATABASE_URL` | Direct HTTPS manifest URL; overrides base URL and format |

To add or update a listed package, use the [manifest repository](https://github.com/ITsMagic-Software/Packages-Manifest).
Changes to this storefront alone do not register packages.

## Theme colors

Edit the light/dark palettes in [app/themes.css](app/themes.css), using HEX or another complete CSS color.
The [theme guide](THEMING.md) explains every color variable and how to customize it.

## Checks

| Command | Checks |
| --- | --- |
| `npm run typecheck` | Generated route types and TypeScript |
| `npm run lint` | ESLint |
| `npm test` | Manifest, catalog and safe image behavior |
| `npm run i18n:check` | Matching translation keys and nonempty values |
| `python -m unittest discover -s tests -p "test_*.py"` | Deployment URL and HTTP failure handling, without uploading |
| `npm run test:e2e` | Navigation and representative responsive/theme smoke checks |

Browser checks require a fresh build and Chromium. Install the browser once with
`npx playwright install chromium`, then run `npm run build` and `npm run test:e2e`.
The test runner starts the preview automatically. Screenshots are saved in `qa-screenshots/`;
reports and traces go to `test-results/`. Both directories are ignored by Git.

## Contributing

Open an issue to discuss a bug or change, or send a focused pull request with the problem,
solution and relevant checks. Read [AGENTS.md](AGENTS.md) and only the skill relevant to your change.
Keep code and filenames in English; update both dictionaries for interface text and both language
versions when changing documentation. Prefer behavioral regression tests over repetitive cases.

## Deployment

Pull requests to `main` run types, lint, unit tests, deployment-script tests, translation checks and build.
Eligible pushes to `main` also upload `out/` through `tools/deploy.py` using:

`https://itsmagic.com.br/devtools/updateStore.php`.

The endpoint is managed separately from this repository. Forks can host `out/` on any static
server that serves it under `/store/`; deployment credentials are only needed for the original upload workflow.

## License

No `LICENSE` file is currently included for this storefront. Check each package's source repository
for its own license information; listing an asset does not make it part of this project's source code.
