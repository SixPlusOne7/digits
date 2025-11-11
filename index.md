<img src="doc/landing-page.png" alt="Digits landing page">

Digits is a Next.js 14 + Prisma reference application for managing a personal address book with secure authentication, contact CRUD operations, and lightweight per-contact notes. It uses React Bootstrap for UI widgets, React Hook Form with Yup validation, and SweetAlert for user feedback so you can see how these tools fit together in a modern app-directory project.

## Installation

1. **Install prerequisites.** Make sure you have Node.js 18+, npm, and PostgreSQL running locally. Create a database user with permission to create databases.
2. **Clone the repo and install packages.**

```bash
git clone <your-fork-url>
cd digits
npm install
```

3. **Configure environment variables.** Copy `sample.env` to `.env` and set `DATABASE_URL` to point at your local PostgreSQL instance, for example:

```env
DATABASE_URL="postgresql://jiayiliu:m79d722j@localhost:5432/digits?schema=public"
```

4. **Create and migrate the database.**

```bash
createdb digits
npx prisma migrate dev
```

5. **Seed initial data.** This step loads default accounts and contacts defined in `config/settings.development.json`.

```bash
npx prisma db seed
```

Sample output:

```
Seeding the database
  Creating user: admin@foo.com with role: ADMIN
  Creating user: john@foo.com with role: USER
  Adding contact: Philip Johnson
  Adding contact: Henri Casanova
  Adding contact: Kim Binsted
```

6. **Run the dev server.**

```bash
npm run dev
```

Visit `http://localhost:3000` and sign in with the seeded accounts or register your own.

## Walkthrough

### Landing page

Unauthenticated visitors see marketing copy plus links to sign in or register.

<img src="doc/landing.png" alt="Landing page">

### Sign in

Existing users can authenticate through credentials handled by NextAuth.

<img src="doc/signin-page.png" alt="Sign in page">

### Sign up

New users can register with email + password; passwords are hashed before storage.

<img src="doc/register-page.png" alt="Sign up page">

### Authenticated navigation

After logging in, the navbar exposes shortcuts to add contacts, list contacts, visit admin-only pages (if authorized), and manage your session.

<img src="doc/landing-after-login-page.png" alt="Navbar after login">

### List contacts

The `/list` page shows the signed-in user’s contacts along with their notes. From here you can jump to editing or append a new note inline.

<img src="doc/list-stuff-page.png" alt="List contacts page">

### Add contact

The `/add` route uses React Hook Form + Yup to validate contact details before calling the server action that writes to PostgreSQL.

<img src="doc/add-stuff-page.png" alt="Add contact form">

### Add note

Each contact card embeds the add-note form so you can capture quick context without leaving the list view. Successful submissions trigger a toast and refresh the list.

### Edit contact

Selecting “Edit” on any card opens a form pre-populated with the existing data so you can adjust names, addresses, or descriptions while preserving validation guarantees.

### Admin overview

Admin users (configured via `config/settings.development.json`) see global navigation plus an overview that lists every contact in the system along with their notes and owner information.

<img src="doc/admin-landing-page.png" alt="Admin navbar">
<img src="doc/admin-list-stuff-page.png" alt="Admin contact list">

## Directory structure

```
config/                 Runtime settings consumed by Prisma seed scripts.
doc/                    Project documentation and screenshots.
prisma/                 Prisma schema plus migration history and seed script.
public/                 Static assets served directly by Next.js.
src/app/                App Router entry points, layouts, and route handlers.
src/components/         Client components such as forms and cards.
src/lib/                Shared utilities (Prisma client, page guards, server actions).
tests/                  Playwright smoke tests for core flows.
```

## Data model

The Prisma schema defines three tables:

- `User`: authentication records with `email`, `password`, and `role` (USER or ADMIN).
- `Contact`: address book entries owned by users.
- `Note`: short annotations linked to contacts via `contactId`.

See `prisma/schema.prisma` for the authoritative model and `prisma/seed.ts` for how default records are created.

## Styling and quality

- UI components come from React Bootstrap; customize global tokens in `src/app/globals.css`.
- ESLint is configured via `.eslintrc.json` to enforce Next.js + AirBnB rules. Run `npm run lint` to verify.
- Playwright specs under `tests/` exercise the primary authenticated flows and admin guard rails.
