import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load variables from .env (DATABASE_URL)
#Reads eenv
load_dotenv() 
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Create the engine that talks to Supabase Postgres (singleton) - one enginer per session
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Session factory — each request uses a fresh session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for ORM models
Base = declarative_base()

# FastAPI dependency to get/close a DB session per request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
