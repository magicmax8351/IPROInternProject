from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import random


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HelloResponse(BaseModel):
    name: str
    message: str

@app.get("/")
def root(name: str) -> HelloResponse:
    return HelloResponse(
        name=name,
        message=f"Hello {name}! Your lucky number is {random.randint(5, 100)}"
    )


class Item(BaseModel):
    name: str
    price: float

@app.get("/groups/get")
def get_group(group_id: int):
    """Returns a group object with the given ID. """
    raise HTTPException(400, "Not implemented")


@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    return {"item_name": item.name, "item_id": item_id}