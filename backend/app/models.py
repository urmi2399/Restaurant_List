
from enum import Enum
from typing import Optional
from sqlalchemy import String, Float, Integer, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column
from .database import Base



class PriceTier(str, Enum):
    one = "$"
    two = "$$"
    three = "$$$"

class Restaurant(Base):
    __tablename__ = "restaurants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), index=True)
    cuisine: Mapped[str] = mapped_column(String(60), index=True)
    image_url: Mapped[str] = mapped_column(String(500))
    city: Mapped[str] = mapped_column(String(80), index=True)
    rating: Mapped[float] = mapped_column(Float, index=True, default=0.0)
    description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    price: Mapped[PriceTier] = mapped_column(SAEnum(PriceTier), index=True)