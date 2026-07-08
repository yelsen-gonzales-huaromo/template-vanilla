# Deployment

## Build

```bash
npm install
npm run build      # → dist/
npm run preview    # local production server
```

The build output is a static SPA. Serve it from any HTTP server, S3 bucket,
or container.

## Docker

```bash
docker build -t template-vanilla:latest -f docker/Dockerfile .
docker run --rm -p 8080:80 template-vanilla:latest
```

The Dockerfile is multi-stage:

1. **builder**: installs dependencies and runs `vite build`.
2. **runtime**: copies `dist/` into a hardened nginx image.

`docker/nginx.conf` ships with:

- gzip + Brotli for text assets (when modules available)
- long-cache headers for `/assets/*`
- `try_files $uri /index.html` so the SPA router handles client routes
- baseline security headers (CSP, X-Frame-Options, X-Content-Type-Options)

## Environments

Configuration is read from `.env` files at build time (Vite). Never commit
`.env` — only `.env.example`.

| File              | Loaded when                |
|-------------------|----------------------------|
| `.env`            | always                     |
| `.env.local`      | always (gitignored)        |
| `.env.production` | `vite build`               |
| `.env.development`| `vite dev`                 |

## CI/CD

Two GitHub Actions workflows are provided:

- `.github/workflows/ci.yml` — lint + build on every PR.
- `.github/workflows/deploy.yml` — build and push the container on `main`.

Replace the `secrets.*` placeholders with your registry credentials.

## Observability checklist

- Forward `console.error` and `unhandledrejection` to your APM (Sentry/Datadog).
- Hook into `eventBus.on(APP_EVENTS.HTTP_ERROR, ...)` to ship request failures.
- Hook into `eventBus.on(APP_EVENTS.ROUTE_CHANGED, ...)` for analytics page views.
