from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

import os
import image_gen
import sheet_data

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"Hello": "World"}

class Item(BaseModel):
    name: str
    price: float
    is_offer: Optional[bool] = None

# CRUD functions for each table
# User
@app.post("/users/add")
def add_user(new_user: UserModel):
    """Adds a new row to user table."""
    raise HTTPException(400, "Not implemented")

@app.get("/users/get")
def get_user(user_id: int):
    """Returns a user object with the given ID."""
    raise HTTPException(400, "Not implemented")

@app.post("/users/update")
def update_user(updated_user: UserModel):
    """Updates the user with the given ID with new information.
       Checks to make sure that the user exists first."""
    raise HTTPException(400, "Not implemented")

@app.post("/users/delete")
def delete_user(user_id: int):
    """Removes the user with the given ID."""
    raise HTTPException(400, "Not implemented")

# Post
@app.post("/posts/add")
def add_post(new_post: PostModel):
    """Adds a new row to post table."""
    raise HTTPException(400, "Not implemented")

@app.get("/posts/get")
def get_post(post_id: int):
    """Returns a post object with the given ID."""
    raise HTTPException(400, "Not implemented")

@app.post("/posts/update")
def update_post(updated_post: PostModel):
    """Updates the post with the given ID with new information.
       Checks to make sure that the post exists first."""
    raise HTTPException(400, "Not implemented")

@app.post("/posts/delete")
def delete_post(post_id: int):
    """Removes the post with the given ID."""
    raise HTTPException(400, "Not implemented")

# Comment
@app.post("/comments/add")
def add_comment(new_comment: CommentModel):
    """Adds a new row to comment table."""
    raise HTTPException(400, "Not implemented")

@app.get("/comments/get")
def get_comment(comment_id: int):
    """Returns a comment object with the given ID."""
    raise HTTPException(400, "Not implemented")

@app.post("/comments/update")
def update_comment(updated_comment: CommentModel):
    """Updates the comment with the given ID with new information.
       Checks to make sure that the post exists first."""
    raise HTTPException(400, "Not implemented")

@app.post("/comments/delete")
def delete_comment(comment_id: int):
    """Removes the comment with the given ID."""
    raise HTTPException(400, "Not implemented")

# END HUNTER'S CODE

@app.get("/groups/get")
def get_group(group_id: int):
    """Returns a group object with the given ID. """
    raise HTTPException(400, "Not implemented")

@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    return {"item_name": item.name, "item_id": item_id}