from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from . import models, schemas


# Create
def create_restaurant(db: Session, payload: schemas.RestaurantBase) -> models.Restaurant:
    r = models.Restaurant(
        name=payload.name,
        cuisine=payload.cuisine,
        image_url=str(payload.image_url) if payload.image_url else None,
        city=payload.city,
        rating=payload.rating,         
        description=payload.description,
        price=payload.price,
    )
    db.add(r)
    db.commit()
    db.refresh(r)
    return r


# List (all)
def list_restaurants(db: Session) -> List[models.Restaurant]:
    stmt = select(models.Restaurant)
    return db.execute(stmt).scalars().all()


# Get one by id
def get_restaurant(db: Session, restaurant_id: int) -> Optional[models.Restaurant]:
    return db.get(models.Restaurant, restaurant_id)


# Update rating only
def update_restaurant_rating(db: Session, restaurant_id: int, new_rating: float) -> Optional[models.Restaurant]:
    r = db.get(models.Restaurant, restaurant_id)
    if not r:
        return None
    r.rating = new_rating 
    db.add(r)
    db.commit()
    db.refresh(r)
    return r

def update_restaurant_details(db: Session, restaurant_id: int, payload: schemas.RestaurantUpdate) -> Optional[models.Restaurant]:
    r = db.get(models.Restaurant, restaurant_id)
    if not r:
        return None
    
    # Only update fields that are provided (not None)
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if hasattr(r, field):
            if field == 'image_url' and value:
                setattr(r, field, str(value))
            else:
                setattr(r, field, value)
    
    db.add(r)
    db.commit()
    db.refresh(r)
    return r


# Delete
def delete_restaurant(db: Session, restaurant_id: int) -> bool:
    r = db.get(models.Restaurant, restaurant_id)
    if not r:
        return False
    db.delete(r)
    db.commit()
    return True

