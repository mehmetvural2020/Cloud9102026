# Cloud9102026

A minimal full-stack **task manager**, used to exercise a Cloud Agent development
environment end to end. The backend is a small [Express](https://expressjs.com/)
API with an in-memory store; the frontend is a dependency-free static UI.

## Requirements

- Node.js `>= 20` (developed against Node 22)
- npm

## Getting started

```bash
npm ci        # install dependencies (use `npm install` if there is no lockfile yet)
npm start     # start the server on http://localhost:3000
```

Then open http://localhost:3000 and add, complete, and delete tasks.

## Scripts

| Command        | Description                                        |
| -------------- | -------------------------------------------------- |
| `npm start`    | Start the production server (`src/server.js`).     |
| `npm run dev`  | Start the server with file watching (auto-reload). |
| `npm test`     | Run the API test suite (Node's built-in runner).   |
| `npm run lint` | Lint the project with ESLint.                      |

Set `PORT` to change the listening port (defaults to `3000`).

## API

| Method   | Path             | Description               |
| -------- | ---------------- | ------------------------- |
| `GET`    | `/api/health`    | Health/uptime check.      |
| `GET`    | `/api/tasks`     | List all tasks.           |
| `POST`   | `/api/tasks`     | Create a task (`title`).  |
| `PATCH`  | `/api/tasks/:id` | Toggle a task done state. |
| `DELETE` | `/api/tasks/:id` | Delete a task.            |

## Project layout

```
src/
  app.js       # Express app factory (routes)
  server.js    # HTTP server bootstrap
  tasks.js     # in-memory task store
  app.test.js  # API tests (node --test + supertest)
public/
  index.html   # UI markup
  styles.css   # UI styling
  app.js        # UI logic (fetches the API)
```
