# J.Notes App: A Note Taking Application

## Stack

- API: Python + Django + Django REST Framework
- Database: PostgreSQL
- Frontend: Next.js (React) App Router + TypeScript

## Services

- `db`: PostgreSQL on `localhost:5432`
- `api`: Django dev server on `localhost:8000`
- `web`: Next.js dev server on `localhost:3000`

## Run

1. Build & start

```bash
docker compose up --build
```

2. Open

- API health: http://localhost:8000/health/
- Notes API: http://localhost:8000/api/notes/
- Web: http://localhost:3000

3. Admin

- Admin: http://localhost:8000/admin/
- Default credentials: admin@admin.com / admin

## Environment variables

`docker-compose.yml` provides defaults, but you can override by exporting env vars in your shell:

- `POSTGRES_DB` (default `notes`)
- `POSTGRES_USER` (default `notes`)
- `POSTGRES_PASSWORD` (default `notes`)
- `DJANGO_SECRET_KEY` (default `dev-secret-key`)
- `DJANGO_DEBUG` (default `1`)
- `DJANGO_ALLOWED_HOSTS` (default `localhost,127.0.0.1,api`)
- `NEXT_PUBLIC_API_URL` (default `http://localhost:8000`)

An example file is provided at `.env.example`.

## Tests

### Backend (Django)

The API test suite uses `pytest` + `pytest-django`.

- Local (from `api/`):

```bash
pytest
```

- Docker:

```bash
docker compose exec api pytest
```

- Coverage:

```bash
docker compose exec api pytest --cov=notes --cov=users --cov-report=term-missing
```

### Frontend (Next.js)

The web test suite uses Jest + React Testing Library (via `next/jest`).

- Local (from `web/`):

```bash
npm test
```

- Docker:

```bash
docker compose exec web npm test
```

- Coverage:

```bash
docker compose exec web npm run test:coverage
```

## Development process summary

This project was built iteratively with an emphasis on keeping the UI and data layer maintainable as features expanded.

- **Backend foundations**
  - Core models:
    - `users.User`: Custom Django auth user (`AbstractBaseUser` + `PermissionsMixin`) using **email as the username** (`USERNAME_FIELD = "email"`). Used as `AUTH_USER_MODEL` across the API.
    - `notes.Category`: Category owned by a user (`Category.user -> AUTH_USER_MODEL`) with a `name` and a hex `color`. Category names are enforced as **unique per user**.
    - `notes.Note`: Note owned by a user (`Note.user -> AUTH_USER_MODEL`) with `title`, `content`, optional `category`, and timestamps (`created_at`, `updated_at`).
  - Default categories are created via a Django signal:
    - A `post_save` receiver on `users.User` creates the initial categories (e.g. Random Thoughts, School, Personal) when a user is first created.
    - The signal is registered in `users.apps.UsersConfig.ready()` (importing `users.signals`).
    - This was implemented as a signal to keep the behavior centralized and automatic across all user creation paths (API signup, Django admin, tests, management commands), without coupling category initialization to any single view or serializer.
  - API endpoints are protected by CSRF validation.
    - Because the API uses cookie-based session authentication, CSRF protection is needed to prevent a malicious third-party site from triggering state-changing requests (create/update/delete) with a user’s existing session.
    - Cookie-based session authentication was chosen to keep the auth flow simple for a same-origin web app (no JWT storage/refresh flow on the client) and to rely on Django’s built-in, well-tested session and permission machinery.

- **Frontend foundations**
  - Home UI was built using Base Web components consolidating shared UI helpers.
  - Autosave was designed to be reliable without spamming the API:
    - Draft state lives in `useNoteDraft` and tracks a `dirty` flag (only user edits mark the draft dirty).
    - Changes to title/content/category schedule a debounced save (currently ~900ms after the last edit).
    - Only one save runs at a time (a ref-based guard prevents concurrent updates).
    - On close, the editor flushes any pending changes before dismissing and then refreshes the notes list.
    - This approach reduces request volume, avoids saving immediately on open, and makes the editor feel responsive while still minimizing data loss.
  - The “New Note” flow creates a note immediately with a default title/content, then edits it in place.
  - Data and editor state were extracted into hooks (`useNotes`, `useNoteDraft`) to reduce coupling in `page.tsx`.
  - UI utilities were centralized in `web/src/lib/ui.ts`.
  - API requests use a consistent fetch wrapper with CSRF token handling:
    - The frontend fetches `/api/auth/csrf/` to set the CSRF cookie and includes credentials (session cookie).
    - Mutating requests (e.g. login/logout/create/update) include the CSRF token in the `X-CSRFToken` header.

- **Docker/dev ergonomics**
  - Added idempotent startup logic to create a default superuser and run migrations.

- **AI assistance**
  - Cascade was used to help with:
    - Project initial structure setup:
      - Docker configuration files
      - Directory structure
    - Architecture design and planning:
      - Exploring design options pros and cons
      - Brainstorming solutions
    - Documentation and testing:
      - Improving documentation clarity
      - Checking test coverage and writing missing tests
    - Debugging and troubleshooting:
      - Analyzing errors and identifying root causes
      - Suggesting fixes and improvements
    - Code review and optimization:
      - Reviewing code for best practices
      - Suggesting improvements for code quality and performance
