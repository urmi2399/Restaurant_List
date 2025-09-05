from typing import Optional
from pydantic import BaseModel, Field, HttpUrl
from enum import Enum
from datetime import datetime
from .models import PriceTier

class RestaurantBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    cuisine: str = Field(..., min_length=1, max_length=60)
    image_url: HttpUrl = Field(None, max_length=500)
    city: str = Field(..., min_length=1, max_length=80)
    rating: float = Field(..., ge=0.0, le=5.0)
    description: Optional[str] = Field(None, max_length=500)
    price: PriceTier
   
class RestaurantRead(BaseModel): 
    id: int 
    name: str 
    cuisine: str 
    image_url: HttpUrl = None 
    city: str 
    rating: float 
    description: Optional[str] = None 
    price: PriceTier    

    class Config:
        orm_mode = True
    
class RestaurantUpdateRating(BaseModel):
    rating: float = Field(..., ge=0, le=5)


class RestaurantUpdate(BaseModel):
    name: Optional[str] = None
    cuisine: Optional[str] = None
    image_url: Optional[str] = None
    city: Optional[str] = None
    rating: Optional[float] = Field(None, ge=0, le=5)  
    description: Optional[str] = None
    price: Optional[PriceTier] = None