# ToDo Web App

Mobile-first ToDo web app built with Next.js, React, Redux Toolkit, Axios, MUI, and TypeScript.

## Features

- List, create, update, and delete ToDo tasks
- Title, description, start date, end date, and completed status
- Task details modal
- Mobile-first responsive layout
- Redux Toolkit state management
- Axios service layer
- MongoDB persistence through Next.js API routes
- Optional local storage fallback for offline demos

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Create `.env.local` from `.env.example` and set your MongoDB URI.

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
NEXT_PUBLIC_TODO_API_URL=/api
```

The app uses the database name `todo-web-typescript`.

## Backend API

By default the frontend calls the built-in Next.js API at `/api`.

Endpoints:

- `GET /api/todos`
- `POST /api/todos`
- `PUT /api/todos/:id`
- `DELETE /api/todos/:id`

Set `NEXT_PUBLIC_USE_LOCAL_STORAGE=true` to use browser local storage instead.

## Scripts

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
```
