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
    
# Token
@app.post("/tokens/add")
def add_token(new_token: TokenModel):
    """Adds a new row to token table."""
    raise HTTPException(400, "Not implemented")

@app.get("/tokens/get")
def get_token(token_id: int):
    """Returns a token object with the given ID."""
    raise HTTPException(400, "Not implemented")

@app.post("/tokens/update")
def update_token(updated_token: TokenModel):
    """Updates the token with the given ID with new information.
       Checks to make sure that the token exists first."""
    raise HTTPException(400, "Not implemented")

@app.post("/tokens/delete")
def delete_token(token_id: int):
    """Removes the token with the given ID."""
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
       Checks to make sure that the comment exists first."""
    raise HTTPException(400, "Not implemented")

@app.post("/comments/delete")
def delete_comment(comment_id: int):
    """Removes the comment with the given ID."""
    raise HTTPException(400, "Not implemented")

# Application
@app.post("/applications/add")
def add_application(new_application: ApplicationModel):
    """Adds a new row to application table."""
    raise HTTPException(400, "Not implemented")

@app.get("/applications/get")
def get_application(application_id: int):
    """Returns a application object with the given ID."""
    raise HTTPException(400, "Not implemented")

@app.post("/applications/update")
def update_application(updated_application: ApplicationModel):
    """Updates the application with the given ID with new information.
       Checks to make sure that the application exists first."""
    raise HTTPException(400, "Not implemented")

@app.post("/applications/delete")
def delete_application(application_id: int):
    """Removes the application with the given ID."""
    raise HTTPException(400, "Not implemented")

# Job
@app.post("/jobs/add")
def add_job(new_job: JobModel):
    """Adds a new row to job table."""
    raise HTTPException(400, "Not implemented")

@app.get("/jobs/get")
def get_job(job_id: int):
    """Returns a job object with the given ID."""
    raise HTTPException(400, "Not implemented")

@app.post("/jobs/update")
def update_job(updated_job: JobModel):
    """Updates the job with the given ID with new information.
       Checks to make sure that the job exists first."""
    raise HTTPException(400, "Not implemented")

@app.post("/jobs/delete")
def delete_job(job_id: int):
    """Removes the job with the given ID."""
    raise HTTPException(400, "Not implemented")

# Company
@app.post("/companies/add")
def add_company(new_company: CompanyModel):
    """Adds a new row to company table."""
    raise HTTPException(400, "Not implemented")

@app.get("/companies/get")
def get_company(company_id: int):
    """Returns a company object with the given ID."""
    raise HTTPException(400, "Not implemented")

@app.post("/companies/update")
def update_company(updated_company: CompanyModel):
    """Updates the company with the given ID with new information.
       Checks to make sure that the company exists first."""
    raise HTTPException(400, "Not implemented")

@app.post("/companies/delete")
def delete_company(company_id: int):
    """Removes the company with the given ID."""
    raise HTTPException(400, "Not implemented")

# Stage
@app.post("/stages/add")
def add_stage(new_stage: StageModel):
    """Adds a new row to stage table."""
    raise HTTPException(400, "Not implemented")

@app.get("/stages/get")
def get_stage(stage_id: int):
    """Returns a stage object with the given ID."""
    raise HTTPException(400, "Not implemented")

@app.post("/stages/update")
def update_stage(updated_stage: StageModel):
    """Updates the stage with the given ID with new information.
       Checks to make sure that the stage exists first."""
    raise HTTPException(400, "Not implemented")

@app.post("/stages/delete")
def delete_stage(stage_id: int):
    """Removes the stage with the given ID."""
    raise HTTPException(400, "Not implemented")

# Resume
@app.post("/resumes/add")
def add_resume(new_resume: ResumeModel):
    """Adds a new row to resume table."""
    raise HTTPException(400, "Not implemented")

@app.get("/resumes/get")
def get_resume(resume_id: int):
    """Returns a resume object with the given ID."""
    raise HTTPException(400, "Not implemented")

@app.post("/resumes/update")
def update_resume(updated_resume: ResumeModel):
    """Updates the resume with the given ID with new information.
       Checks to make sure that the resume exists first."""
    raise HTTPException(400, "Not implemented")

@app.post("/resumes/delete")
def delete_resume(resume_id: int):
    """Removes the resume with the given ID."""
    raise HTTPException(400, "Not implemented")

# Jobtag
@app.post("/jobtags/add")
def add_jobtag(new_jobtag: JobtagModel):
    """Adds a new row to jobtag table."""
    raise HTTPException(400, "Not implemented")

@app.get("/jobtags/get")
def get_jobtag(jobtag_id: int):
    """Returns a jobtag object with the given ID."""
    raise HTTPException(400, "Not implemented")

@app.post("/jobtags/update")
def update_jobtag(updated_jobtag: JobtagModel):
    """Updates the jobtag with the given ID with new information.
       Checks to make sure that the jobtag exists first."""
    raise HTTPException(400, "Not implemented")

@app.post("/jobtags/delete")
def delete_jobtag(jobtag_id: int):
    """Removes the jobtag with the given ID."""
    raise HTTPException(400, "Not implemented")

# END HUNTER'S CODE

@app.get("/groups/get")
def get_group(group_id: int):
    """Returns a group object with the given ID. """
    raise HTTPException(400, "Not implemented")

@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    return {"item_name": item.name, "item_id": item_id}