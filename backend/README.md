#  My Restaurant List — Backend (FastAPI)

This is the backend API for the "My Restaurant List" app — built with FastAPI, SQLAlchemy, and Pydantic.

---

## Features

- RESTful CRUD API for managing restaurants
- SQLAlchemy ORM with PostgreSQL (or SQLite)
- Pydantic schema validation
- CORS enabled for local frontend use
- Auto-generated Swagger UI at `/docs`

---

## Tech Stack

- Python 3.10+
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn (for running server)

---

## Setup Instructions

###  Clone the repository

```bash
git clone https://github.com/your-username/restaurant-app.git
cd restaurant-app/backend
```



### Install dependencies

```bash
pip install -r requirements.txt
```

Or manually:

```bash
pip install fastapi uvicorn sqlalchemy python-dotenv pydantic
```

---

## Environment Variables

Create a `.env` file in the root of the backend with:

```
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=${DB_SSLMODE}```

You can also connect to Supabase or PostgreSQL by replacing your password and user in .env. For now, I have shared mine 

---

## 🛠️ Running the App

```bash
uvicorn main:app --reload
```

The API will be available at:

```
http://localhost:8000
```

And interactive docs at:

```
http://localhost:8000/docs
```

---

## 📌 API Endpoints

| Method | Endpoint                      | Description                  |
|--------|-------------------------------|------------------------------|
| GET    | `/restaurants`                | List all restaurants         |
| POST   | `/restaurants`                | Create a new restaurant      |
| GET    | `/restaurants/{id}`           | Get one restaurant by ID     |
| PATCH  | `/restaurants/{id}`           | Update restaurant fields     |
| PATCH  | `/restaurants/{id}/rating`    | Update rating only           |
| DELETE | `/restaurants/{id}`           | Delete a restaurant          |

---

