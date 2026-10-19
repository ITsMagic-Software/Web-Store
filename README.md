# ITsMagic Web Store

Next.js storefront for `https://itsmagic.com.br/store/`, exported as static files and published to the existing web server.

## Development

Requirements: Node.js 22 and npm.

```sh
npm ci
npm run dev
```

## Production build

```sh
npm run typecheck
npm run build
```

Next.js exports the site to `out/`. The `/store` base path is configured for the production URL.

## GitHub Actions

Pull requests targeting `main` run type checks and a static build. Every push to `main` builds the site and uploads the contents of `out/` to the server endpoint.

Repository Actions configuration:

- Secret `STORE_UPLOAD_SECRET`: shared upload secret installed on the server.
- Variable `STORE_UPLOAD_URL`: optional; defaults to `https://itsmagic.com.br/devtools/updateStore.php`.

The deploy endpoint is managed directly on the server and is intentionally excluded from this repository.
