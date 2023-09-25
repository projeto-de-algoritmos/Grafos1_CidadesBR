from pydantic import BaseModel


class Coordinate(BaseModel):
    latitude: float
    longitude: float


class Stop(BaseModel):
    id: int
    name: str
    coordinate: Coordinate
