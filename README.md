# Candidates API - Node.js MVC

Basic Node.js API for managing job candidates using MVC architecture, ESLint, and Prettier.

## Project Structure

```
src/
├── controllers/   # Handle request/response logic
├── models/        # Data layer (in-memory array)
├── routes/        # Route definitions
├── app.js         # Express app setup
└── server.js      # Entry point
```

## Setup

```bash
npm install
```

## Run

```bash
npm start        # run server
npm run dev      # run with watch mode
```

## Endpoints

| Method | URL               | Description           |
| ------ | ----------------- | --------------------- |
| GET    | `/candidates`     | List all candidates   |
| GET    | `/candidates/:id` | Get a candidate by ID |

Example: `curl http://localhost:3000/candidates`

## Lint & Format

```bash
npm run lint       # check for issues
npm run lint:fix   # auto-fix
npm run format     # prettier format
```
