# ClubSphere

ClubSphere is a college club and event discovery platform with a React + Vite
frontend and a PHP + PostgreSQL backend.

## Features

- Public landing page with club and event discovery
- Verified club browsing and club detail views
- Event listings with search and category filters
- Admin dashboard for club creation and verification
- Coordinator dashboard for event publishing and club management
- Student dashboard with club following, a personalised feed, and announcements
- All data is persisted in PostgreSQL (no mock data)

## Tech stack

- React 19
- Vite
- React Router DOM
- Tailwind CSS
- Lucide React
- PHP (PDO) REST API
- PostgreSQL

## Prerequisites

- Node.js 18+
- PHP 8.1+ with the `pdo_pgsql` extension enabled
- PostgreSQL 13+

## 1. Database setup

Create the database and load the schema (this also creates the `pgcrypto`
extension and the baseline accounts):

```powershell
createdb -U postgres clubsphere
psql -U postgres -d clubsphere -f backend/schema.sql
```

## 2. Backend setup

Copy `backend/.env.example` to `backend/.env` and fill in your PostgreSQL
credentials:

```
DB_DRIVER=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=clubsphere
DB_USER=postgres
DB_PASSWORD=your-password-here
```

Start the PHP development server from the project root:

```powershell
php -S localhost:8000 -t backend
```

The API is then available at `http://localhost:8000/api.php`.

## 3. Frontend setup

1. Install dependencies:
   `npm install`
2. Start the app:
   `npm run dev`
3. Open the local Vite URL from the terminal output.

The frontend talks to `http://localhost:8000/api.php` by default. Override this
with a `VITE_API_URL` entry in a root `.env` file if your backend runs elsewhere.

## Demo accounts

- Admin:
  - Email: admin@college.edu
  - Password: admin123
- Student:
  - Email: student@college.edu
  - Password: student123

Club coordinator accounts are generated automatically when an admin creates a
club; the credentials are shown once after creation.

## API overview

| Method | Endpoint                     | Description                          |
| ------ | ---------------------------- | ------------------------------------ |
| POST   | `/auth/login`                | Authenticate a user                  |
| GET    | `/clubs`                     | List clubs (`?status=` filter)       |
| POST   | `/clubs`                     | Create a club + coordinator account  |
| GET    | `/clubs/{id}`                | Get a single club                    |
| PATCH  | `/clubs/{id}/status`         | Verify / reject a club               |
| GET    | `/events`                    | List events (`?club_id=`, `?status=`)|
| POST   | `/events`                    | Create an event                      |
| GET    | `/events/{id}`               | Get a single event                   |
| PUT    | `/events/{id}`               | Update an event                      |
| PATCH  | `/events/{id}/cancel`        | Cancel an event                      |
| GET    | `/users`                     | List users                           |
| GET    | `/users/{id}`                | Get a user (+ followed clubs)        |
| POST   | `/users/{id}/follow`         | Toggle a student's club follow       |
| GET    | `/announcements`             | List announcements (`?club_id=`)     |
| POST   | `/announcements`             | Create an announcement               |
