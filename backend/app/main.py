from typing import List
from fastapi import FastAPI, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import engine, Base, get_db

app = FastAPI(title="My Restaurant List API (basic)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

@app.post("/restaurants", response_model=schemas.RestaurantRead, status_code=201)
def create_restaurant(payload: schemas.RestaurantBase, db: Session = Depends(get_db)):
    return crud.create_restaurant(db, payload)

@app.get("/restaurants", response_model=List[schemas.RestaurantRead], status_code=200)
def list_restaurants(db: Session = Depends(get_db)):
    return crud.list_restaurants(db)

@app.get("/restaurants/{restaurant_id}", response_model=schemas.RestaurantRead, status_code=200)
def get_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    r = crud.get_restaurant(db, restaurant_id)
    if not r:
        raise HTTPException(status_code=404, detail="Not found")
    return r

@app.patch("/restaurants/{restaurant_id}/rating", response_model=schemas.RestaurantRead, status_code=200)
def update_rating(restaurant_id: int, payload: schemas.RestaurantUpdateRating, db: Session = Depends(get_db)):
    r = crud.update_restaurant_rating(db, restaurant_id, payload.rating)
    if not r:
        raise HTTPException(status_code=404, detail="Not found")
    return r

@app.patch("/restaurants/{restaurant_id}", response_model=schemas.RestaurantRead, status_code=200)
def update_restaurant(restaurant_id: int, payload: schemas.RestaurantUpdate, db: Session = Depends(get_db)):
    r = crud.update_restaurant_details(db, restaurant_id, payload)
    if not r:
        raise HTTPException(status_code=404, detail="Not found")
    return r

@app.delete("/restaurants/{restaurant_id}", status_code=204)
def delete_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    r = crud.delete_restaurant(db, restaurant_id)
    if not r:
        raise HTTPException(status_code=404, detail="Not found")
    return None
