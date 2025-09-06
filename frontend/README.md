# My Restaurant List — Frontend

A simple full stack restaurant listing app built with React, Material UI, Tailwind CSS, and TanStack React Query.

---

## Features

- Add, edit, delete restaurants
- Sort, filter, and search in a paginated grid
- Responsive UI with MUI + Tailwind
- Flip card UI with detail preview
- RESTful API integration via React Query
- Zod + React Hook Form validation

---

## Stack

- React + Vite + JavaScript
- Tailwind CSS + Material UI (MUI)
- TanStack React Query
- React Router
- Zod + React Hook Form

---

##  Running the App Locally

```bash
# Start the development server
npm run dev
```

The app will be running at: [http://localhost:5173](http://localhost:5173)

---


## 📁 Folder Structure

```
src/
├── components/         # Reusable UI (Navbar, Footer, Card, Modals)
├── pages/              # Page-level views (Add, Grid, Detail)
├── constants/          # Lists for cuisines and prices
├── theme.js            # MUI theme configuration
├── App.jsx             # Main routes and layout
├── main.jsx            # Entry point with providers
├── index.css           # Tailwind styles
```

---

## 📋 Environment Variables

Create a `.env` file with:

```
VITE_API_BASE_URL=http://localhost:8000
```

---
