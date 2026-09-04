# Customer Application Management System (CAMS)

## Project Description

A full-stack web application designed to manage customer registrations,
application submissions, and administrative operations through a secure
role-based system. Customers can register, authenticate, and submit
application forms, while administrators can securely manage, search, filter,
update, and delete submissions through an administrative dashboard. The
system implements JWT-based authentication, role-based authorization,
server-side validation, secure password hashing, and PostgreSQL database
management.

## Tech Stack

- **Frontend**: React 18 + Vite, React Router, MUI (Material UI), Axios
- **Backend**: Node.js + Express
- **Database**: PostgreSQL, accessed via Prisma ORM
- **Auth**: JWT access + refresh tokens, bcrypt password hashing, zod request validation

## Project Structure

```
/server               Express + Prisma API
  prisma/schema.prisma Database schema
  prisma/seed.js       Seeds a default admin account
  src/
    config/            Environment config
    lib/               Prisma client instance
    middleware/        auth, validation, error handling
    utils/             JWT, password hashing, async wrapper
    validators/        zod request schemas
    controllers/       Route handlers
    routes/            Express routers
    app.js / index.js  App wiring / entrypoint
/client               React + Vite SPA
  src/
    api/               Axios client + token storage
    context/           AuthContext (login/register/logout)
    components/        NavBar, ProtectedRoute, SubmissionEditDialog
    pages/             Home, Register, Login, Application, Admin Login, Admin Dashboard
/docker-compose.yml    Local PostgreSQL for development
/postman_collection.json  Importable Postman collection covering all endpoints
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- Docker (for the bundled Postgres), or your own local PostgreSQL instance

### 1. Start PostgreSQL

```bash
docker compose up -d
```

This starts Postgres on `localhost:5432` with user/password/db `evotec`/`evotec`/`evotec`
(matching the default `DATABASE_URL` in `server/.env.example`). If you'd rather
use an existing Postgres instance, just point `DATABASE_URL` at it instead.

### 2. Backend

```bash
cd server
cp .env.example .env      # adjust values if needed
npm install
npm run prisma:migrate    # creates tables
npm run prisma:seed       # creates the default admin account (see below)
npm run dev                # starts the API on http://localhost:4000
```

The seed script prints the seeded admin's email/password to the console —
use these to log in at `/admin/login` and (optionally) create further admins
via the protected `POST /api/admin/admins` endpoint.

### 3. Frontend

```bash
cd client
cp .env.example .env      # adjust VITE_API_BASE_URL if needed
npm install
npm run dev                # starts the app on http://localhost:3000
```

Open `http://localhost:3000` in your browser.

## Environment Variables

### `server/.env.example`
| Variable | Description |
|---|---|
| `PORT` | Port the API listens on (default `4000`) |
| `CLIENT_ORIGIN` | Allowed CORS origin for the frontend |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Secrets used to sign JWTs |
| `JWT_ACCESS_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN` | Token lifetimes |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Credentials for the seeded admin account |

### `client/.env.example`
| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API |

## API Endpoints

Full request/response examples are in [`postman_collection.json`](./postman_collection.json)
(import it into Postman). Summary:

### Auth — `/api/auth`
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new customer (`email`, `password`, `confirmPassword`) |
| POST | `/login` | Public | Customer login → `{ user, accessToken, refreshToken }` |
| POST | `/admin/login` | Public | Admin login → `{ user, accessToken, refreshToken }` |
| POST | `/refresh` | Public | Exchange a `refreshToken` for a new token pair |

### Admin management — `/api/admin`
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/admins` | Admin (JWT) | Create a new admin; auto-generates and returns a password |

### Submissions — `/api/submissions`
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/` | Customer (JWT) | Submit a form (`firstName`, `lastName`, `email`, `gender`, `mobileNumber`, `address`, `feedback?`) |
| GET | `/?gender=&search=` | Admin (JWT) | List all submissions, optionally filtered by gender and/or searched by first/last name |
| PATCH | `/:id` | Admin (JWT) | Update any field of a submission |
| DELETE | `/:id` | Admin (JWT) | Delete a submission |

All protected routes require `Authorization: Bearer <accessToken>`. Requests
with a missing/invalid token receive `401`; requests from the wrong role
receive `403`. Validation failures return `400` with a `details` array of
`{ field, message }`. Duplicate emails return `409`.

## Notes on Design Decisions

- **Admin creation**: one admin is seeded via `npm run prisma:seed` so there's
  always an account that can log in and create further admins through the
  protected endpoint — matching the assignment's "super admin or seeded
  admin" requirement.
- **Audit fields**: `userCreated`/`userModified` store the acting user's
  email at the time of the action (not a foreign key), so history is
  preserved even if a user account changes later.
- **Mobile number validation**: uses a generic local-number pattern
  (`server/src/validators/submissionValidators.js`) — adjust the regex there
  for a specific country format if needed.
