# RecipeVision

RecipeVision is a web app that turns photos of your ingredients into recipe ideas. You upload a picture of what's in your fridge or pantry, OpenAI's vision API extracts the ingredients, and the app then suggests recipes you can make from them — optionally generating a picture of the finished dish.

## How it works

The repo is split into two apps that run side-by-side:

- **`dev/server`** — a [Bun](https://bun.sh) + Express backend that:
  - serves uploaded images to OpenAI so the vision model can read them,
  - calls OpenAI to extract ingredients from images and to generate recipe ideas,
  - stores users, sessions, and saved recipes in MongoDB (via Mongoose + `connect-mongo`),
  - sends transactional email through Resend (e.g. account verification).
- **`dev/client`** — a Vue 3 + Vite + Vuetify frontend. In dev mode Vite proxies `/api` and `/images` to the backend; in production the backend serves the built client as static files.

A typical request flow:

1. User uploads an image → backend stores it under `IMAGES_PATH` and returns a public URL under `PUBLIC_URL`.
2. Backend calls OpenAI with that URL using `IMAGE_PROMPT` → gets back a JSON list of ingredients.
3. User picks ingredients/exclusions → backend calls OpenAI with `RECIPE_PROMPT` (or `GENERATE_RECIPE_PROMPT` for full recipes) → returns recipe ideas.
4. Optionally, the backend calls OpenAI image generation with `GENERATE_RECIPE_IMAGE_PROMPT` and stores the result under `GENERATED_IMAGES_PATH`.

`PUBLIC_URL` matters because OpenAI fetches the uploaded image over the public internet — it has to be a URL OpenAI can reach (port 80/443 in practice, usually behind a reverse proxy).

## Project layout

```
RecipeVision/
├── compose.yaml          # Docker Compose: mongo + mongo-express + app
├── Dockerfile            # builds the production image
├── Makefile              # dev/deploy/docker targets
├── dev/
│   ├── server/           # Bun + Express backend
│   │   ├── .env          # non-secret defaults (committed)
│   │   ├── .env.local    # secrets (NOT committed)
│   │   └── src/
│   └── client/           # Vue 3 + Vite frontend
│       └── .env          # VITE_PUBLIC_URL
└── dist/                 # built output produced by `make deploy`
```

## Prerequisites

- [Bun](https://bun.sh) ≥ 1.1
- A running MongoDB instance (local, Atlas, or `docker compose up mongo`)
- An [OpenAI API key](https://platform.openai.com/api-keys)
- A [Resend API key](https://resend.com/api-keys) (for email)
- GNU `parallel` (only needed for `make dev` / `make dev2`)

## Configuration: the `.env` files

There are three env files. Two are checked in as templates/defaults; one is **not** committed and holds your secrets.

### 1. `dev/server/.env` — backend defaults (committed)

This file contains optional knobs and the **required** `PUBLIC_URL`. Edit it for your environment. The defaults shown are what the server falls back to.

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `PUBLIC_URL` | **yes** | — | URL OpenAI will use to fetch uploaded images. Must be reachable from the internet for production. For local dev pointing only at the local frontend, `http://localhost:8080` works. |
| `BACKEND_PORT` | no | `8080` | Port the Express server listens on. |
| `FILE_LIMIT` | no | `104857600` (100 MiB) | Max upload size in bytes. |
| `RATE_LIMIT` | no | `15000` | Per-user millisecond cooldown between OpenAI calls. |
| `WEBSITE_PATH` | no | `../client` | Path to built client assets. |
| `IMAGES_PATH` | no | `images` | Where uploaded images are stored. |
| `GENERATED_PATH` | no | `generated_images` | Where AI-generated recipe images are stored. |
| `COOKIE_EXPIRATION` | no | `604800000` (1 week) | Session cookie lifetime, ms. |
| `DEMO_AUTH` | no | `false` | If `true`, relaxes auth for demos. |
| `IMAGE_PROMPT` / `RECIPE_PROMPT` / `RECIPE_IMAGE_PROMPT` | no | (see `src/env.ts`) | Override the prompts sent to OpenAI. |
| `HOMEPAGE_QUERIES` | no | `["favorite","breakfast",...]` | JSON array of demo searches for the homepage. |

### 2. `dev/server/.env.local` — backend secrets (NOT committed)

Create this file yourself. It holds keys and connection strings that should never be in git. Bun automatically loads `.env.local` and it overrides values in `.env`.

| Variable | Required | Purpose |
|---|---|---|
| `OPENAI_KEY` | **yes** | OpenAI API key for vision + recipe + image generation. |
| `MONGODB_URL` | **yes** | MongoDB connection string, e.g. `mongodb://localhost:27017/recipevision`. |
| `RESEND_KEY` | **yes** | Resend API key for transactional email. |
| `SESSION_SECRET` | recommended | Secret used to sign session cookies. Set this in production. |

### 3. `dev/client/.env` — frontend (committed)

| Variable | Required | Purpose |
|---|---|---|
| `VITE_PUBLIC_URL` | yes | Public URL the Vue app uses to build links (e.g. for sharing recipes). |

### Example `dev/server/.env.local`

Copy this into `dev/server/.env.local` and fill in real values. **Do not commit it.**

```dotenv
# --- Required secrets ---
OPENAI_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MONGODB_URL=mongodb://localhost:27017/recipevision
RESEND_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx

# --- Recommended in production ---
SESSION_SECRET=replace-me-with-a-long-random-string

# --- Optional overrides (uncomment to use) ---
# BACKEND_PORT=8080
# RATE_LIMIT=15000
# COOKIE_EXPIRATION=604800000
# DEMO_AUTH=false
```

And the matching `dev/server/.env` only really needs:

```dotenv
PUBLIC_URL=http://localhost:8080
```

## Running it

### Local dev (hot reload, two processes)

Runs the Bun server with `--hot` and the Vite dev server in parallel. Vite proxies `/api` and `/images` to the backend.

```bash
make dev
```

This sets `BACKEND_PORT=8443`, `LOCAL_PORT=8080`, and points the client at `https://dont-pani.cc`. Override these by editing the `dev` target in the `Makefile` if you're not using that domain.

Then open <http://localhost:8080>.

### Local production-style build

Builds the client, copies the server, and runs from `dist/`:

```bash
make run
```

### Docker

Builds the image and brings up MongoDB, mongo-express, and the app via Compose:

```bash
make docker
```

The app listens on `localhost:8080`; mongo-express is on `localhost:8880`. Compose injects `MONGODB_URL=mongodb://mongo:27017/`, so you don't need to set it in `.env.local` when running this way — but you still need `OPENAI_KEY` and `RESEND_KEY` in `dev/server/.env.local` (it's copied into the image by `make docker-files`).

### Useful targets

| Target | What it does |
|---|---|
| `make dependencies` | `bun install` for both server and client |
| `make deploy` | Build client + stage server into `dist/` |
| `make kill` | Free ports 8080/8443/8880/9990 |
| `make clean` | Remove `dist/`, `docker-files/`, `node_modules/`, generated images |

## Troubleshooting

- **`unable to find required env var OPENAI_KEY` (or `MONGODB_URL`, `RESEND_KEY`, `PUBLIC_URL`)** — the server's env loader throws if a required var is missing. Check `dev/server/.env.local` exists and has the right keys.
- **OpenAI can't see my image** — `PUBLIC_URL` has to be reachable from OpenAI's servers. Localhost won't work for end-to-end testing; use a tunnel (e.g. ngrok) or a real public host.
- **Port already in use** — `make kill` clears the dev ports.
