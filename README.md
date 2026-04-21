# BookNotes 📚

A self-hosted personal book notes and rating web application. Record books you've read, write personal reflections, assign ratings, and browse your library — all on your own machine with no ads, no accounts, and no data sharing.

Built as the final project for **LIS 5364 — Web Development and Administration** at Florida State University.



https://github.com/user-attachments/assets/aa1d596d-f92a-42d4-b4e6-63a7433eeb8c



> **Student:** Hrithik Acharya | **Spring 2026**

---

## Features

- Add, edit, delete, and view book records
- Rate books on a scale of 1–10 with an interactive star widget
- Write personal notes and reflections for each book
- Automatic cover art fetched from the [Open Library Covers API](https://openlibrary.org/dev/docs/api#anchor_covers) using ISBN
- Sort your library by most recent, highest rated, title A–Z, or author A–Z
- Fully responsive design — works on desktop and mobile
- Self-hosted with public access via Cloudflare Tunnel (free, no account needed)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express.js 4 |
| Templating | EJS |
| Database | PostgreSQL 16 |
| HTTP client | Axios |
| Styling | Custom CSS (no framework) |
| Environment | dotenv |
| Public access | Cloudflare Tunnel |

---

## Project Structure

```
book-notes/
├── index.js              # Express app entry point
├── package.json          # Dependencies
├── .env.example          # Environment variable template
├── .gitignore
├── db/
│   ├── index.js          # PostgreSQL connection pool
│   └── schema.sql        # Table definition + seed data
├── routes/
│   └── books.js          # All CRUD route handlers
├── views/
│   ├── index.ejs         # Book grid / library home
│   ├── detail.ejs        # Single book detail page
│   ├── form.ejs          # Add / edit form
│   ├── error.ejs         # Error page
│   └── partials/
│       ├── header.ejs
│       └── footer.ejs
└── public/
    ├── css/style.css     # Full responsive stylesheet
    └── js/app.js         # Star rating widget + UX
```

---

## Prerequisites

- Ubuntu 22.04 LTS (or any Linux distro)
- Node.js 20+
- PostgreSQL 16
- npm

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/YourUsername/book-notes.git
cd book-notes
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
nano .env
```

Fill in your values:

```
PORT=3000
DB_USER=booknotes_user
DB_HOST=localhost
DB_NAME=booknotes
DB_PASSWORD=YourStrongPassword
DB_PORT=5432
```

### 4. Set up PostgreSQL

```bash
# Create user and database
sudo -u postgres psql
```

```sql
CREATE USER booknotes_user WITH PASSWORD 'YourStrongPassword';
CREATE DATABASE booknotes OWNER booknotes_user;
GRANT ALL PRIVILEGES ON DATABASE booknotes TO booknotes_user;
\c booknotes
GRANT ALL ON SCHEMA public TO booknotes_user;
\q
```

### 5. Load the schema and seed data

```bash
psql -U booknotes_user -d booknotes -h localhost -f db/schema.sql
```

Expected output:
```
DROP TABLE
CREATE TABLE
INSERT 0 5
```

### 6. Start the application

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the library with 5 sample books.

---

## Making It Publicly Accessible (Free)

Use [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/) to expose the app to the internet at no cost, with no account or router configuration needed.

### Install cloudflared

```bash
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
sudo dpkg -i cloudflared.deb
```

### Start the tunnel

In a second terminal while the app is running:

```bash
npx cloudflared tunnel --url http://localhost:3000
```

You'll get a public HTTPS URL like:
```
https://random-words.trycloudflare.com
```

Share this URL to access BookNotes from any device anywhere in the world.

> **Note:** If running inside a VirtualBox VM, bind the app to all interfaces first:
> ```bash
> HOST=0.0.0.0 PORT=3000 node index.js
> ```

---

## Development

Run with auto-restart on file changes:

```bash
npm run dev
```

---

## Database Schema

```sql
CREATE TABLE books (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(255) NOT NULL,
  author     VARCHAR(255) NOT NULL,
  isbn       VARCHAR(20),
  rating     INTEGER CHECK (rating >= 1 AND rating <= 10),
  notes      TEXT,
  date_read  DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/books` | List all books (supports `?sort=recent\|rating\|title\|author`) |
| GET | `/books/new` | Show add book form |
| POST | `/books` | Create new book |
| GET | `/books/:id` | View book detail |
| GET | `/books/:id/edit` | Show edit form |
| POST | `/books/:id?_method=PUT` | Update book |
| POST | `/books/:id/delete` | Delete book |

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Port the server runs on | `3000` |
| `DB_USER` | PostgreSQL username | — |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_NAME` | Database name | `booknotes` |
| `DB_PASSWORD` | PostgreSQL password | — |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DATABASE_URL` | Full connection string (overrides above, used for cloud deployment) | — |

---

## Troubleshooting

**`Failed to load books` / password authentication failed**
- Make sure `dotenv` is installed: `npm install dotenv`
- Verify `DB_PASSWORD` in `.env` matches the PostgreSQL user password
- Reset the password: `sudo -u postgres psql -c "ALTER USER booknotes_user WITH PASSWORD 'newpassword';"`

**`connect ECONNREFUSED 127.0.0.1:5432`**
- PostgreSQL is not running: `sudo systemctl start postgresql`

**`permission denied for schema public`**
- Run: `sudo -u postgres psql -d booknotes -c "GRANT ALL ON SCHEMA public TO booknotes_user;"`

**Cloudflare Tunnel returns 404**
- Delete leftover config: `rm -rf ~/.cloudflared`
- Make sure the app is running before starting the tunnel
- If on VirtualBox: use `HOST=0.0.0.0 PORT=3000 node index.js`

---

## Replacing Goodreads

BookNotes is a self-hosted alternative to:

- **Goodreads** (Amazon) — no ads, no data sharing, no social features you didn't ask for
- **StoryGraph** — simpler, runs on your own machine
- **LibraryThing** — free forever, no subscription

---

## License

MIT — free to use, modify, and distribute.

---

## Acknowledgements

- [Open Library](https://openlibrary.org/) for the free book cover API
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/) for free public tunneling
- [Awesome Selfhosted](https://github.com/awesome-selfhosted/awesome-selfhosted) for inspiration
