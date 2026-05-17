# ToDo Web App

Mobile-first ToDo web app built with Next.js, React, Redux Toolkit, Axios, MUI, and TypeScript.

## Features

- List, create, update, and delete ToDo tasks
- Title, description, start date, end date, and completed status
- Task details modal
- Mobile-first responsive layout
- Redux Toolkit state management
- Axios service layer with optional backend configuration
- Local storage fallback when no API URL is configured

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Backend API

Set `NEXT_PUBLIC_TODO_API_URL` in `.env.local` to connect to the provided API.

```bash
NEXT_PUBLIC_TODO_API_URL=https://your-api-base-url.com
```

The app expects common REST endpoints:

- `GET /todos`
- `POST /todos`
- `PUT /todos/:id`
- `DELETE /todos/:id`

If no API URL is set, tasks are stored locally in the browser.

## Scripts

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
```
