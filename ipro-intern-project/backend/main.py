from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from src.data_types import *
import random
from src.session import *


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

@app.get("/test/{item_id}")
def posts_test(item_id: int):
    #print(f"The button was indeed clicked. {item_id}")

    # Adds a user and change their name
    '''c = s.demo()
    orm_session = s.orm_parent_session()
    for p in orm_session.query(data_types.UserORM).all():
        print(f"{p.id} : {p.fname}")
    print(c)
    orm_session.query(data_types.UserORM).filter_by(fname=f"John{c}").first().fname = f"JohnNameChange{c}"
    orm_session.commit()
    for p in orm_session.query(data_types.UserORM).all():
        print(f"{p.id} : {p.fname}")'''

    # delete the specified user
    '''orm_session = s.orm_parent_session()
    for p in orm_session.query(data_types.UserORM).all():
        print(f"{p.id} : {p.fname}")
    print(orm_session.query(data_types.UserORM).count())
    try:
        orm_session.delete(orm_session.query(data_types.UserORM).filter_by(id=item_id).first())
    except:
        print(f"error deleting {item_id}")
    orm_session.commit()
    for p in orm_session.query(data_types.UserORM).all():
        print(f"{p.id} : {p.fname}")
    print(orm_session.query(data_types.UserORM).count())'''

    orm_session = s.orm_parent_session()

    #for j in orm_session.query(data_types.JobORM).filter_by(id=1):
    #    print(j.name)
    #try:
    #    print(orm_session.query(data_types.JobORM).filter_by(id=item_id).one().name)
    #except:
    #    print("query error")

    for p in orm_session.query(data_types.PostORM).all():
        print(f"{p.id} : {p.subject} : {p.job_id} : {p.group_id}")
    print(orm_session.query(data_types.PostORM).count())

    #print("end of posts test")
    #return {'deletion': item_id}

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
    new_post_orm = PostORM(
        id=random.randint(1, 100000),
        subject=new_post.subject,
        body=new_post.body,
        timestamp=new_post.timestamp,
        job_id=new_post.job_id,
        #user_id=new_post.user_id,
        group_id=new_post.group_id
    )

    print(new_post.subject)
    print(new_post.body)
    print(new_post.timestamp)
    print(new_post.job_id)
    print(new_post.group_id)
    print()

    orm_session = s.orm_parent_session()
    orm_session.add(new_post_orm)
    orm_session.commit()

    for p in orm_session.query(data_types.PostORM).all():
        try:
            jobname = orm_session.query(data_types.JobORM).filter_by(id=p.job_id).one().name
            groupname = orm_session.query(data_types.GroupORM).filter_by(id=p.group_id).one().name
            print(f"{p.subject} : {p.timestamp} : {p.body[:10]} : {jobname} : {groupname}")
        except:
            print("query error. a post may have invalid group id or job id")

@app.get("/posts/get")
def get_post():
    """Returns all posts."""
    orm_session = s.orm_parent_session()

    all_posts = []
    for p in orm_session.query(data_types.PostORM).all():
        all_posts.append(PostModel(
            id=p.id,
            subject=p.subject,
            body=p.body,
            timestamp=p.timestamp,
            job_id=p.job_id, # replace with getJobById(id)
            group_id=p.group_id # replace with getGroupById(id)
        ))

    return {'posts': all_posts, 'count': len(all_posts)}
    

@app.post("/posts/update")
def update_post(updated_post: PostModel):
    """Updates the post with the given ID with new information.
       Checks to make sure that the post exists first."""
    raise HTTPException(400, "Not implemented")

@app.post("/posts/delete")
def delete_post(post_id: IntegerModel):
    """Removes the post with the given ID."""
    post_to_delete = post_id.i
    
    orm_session = s.orm_parent_session()
    try:
        orm_session.delete(orm_session.query(data_types.PostORM).filter_by(id=post_to_delete).one())
    except:
        print(f"error deleting {post_to_delete}")
    orm_session.commit()

# Comment
@app.post("/comments/add")
def add_comment(new_comment: CommentModel):
    """Adds a new row to comment table."""
    raise HTTPException(400, "Not implemented")

@app.get("/comments/get/{post_id}")
def get_comment():
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
def get_job():
    """Returns all jobs"""
    orm_session = s.orm_parent_session()

    all_jobs = []
    for j in orm_session.query(data_types.JobORM).all():
        all_jobs.append(JobModel(
            id=j.id,
            name=j.name,
            location=j.location,
            company_id=j.company_id
        ))

    return {'jobs': all_jobs, 'count': len(all_jobs)}

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
def get_company():
    """Returns all companies"""
    orm_session = s.orm_parent_session()

    all_companies = []
    for c in orm_session.query(data_types.CompanyORM).all():
        all_companies.append(CompanyModel(
            id=c.id,
            name=c.name
        ))

    return {'jobs': all_companies, 'count': len(all_companies)}

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

# Group
@app.post("/groups/add")
def add_group(new_group: GroupModel):
    """Adds a new row to group table."""
    raise HTTPException(400, "Not implemented")

@app.get("/groups/get")
def get_group():
    """Returns all groups"""
    orm_session = s.orm_parent_session()

    all_groups = []
    for g in orm_session.query(data_types.GroupORM).all():
        all_groups.append(GroupModel(
            id=g.id,
            name=g.name,
            icon=g.icon,
            desc=g.desc
        ))

    return {'jobs': all_groups, 'count': len(all_groups)}

@app.post("/groups/update")
def update_group(updated_group: GroupModel):
    """Updates the group with the given ID with new information.
       Checks to make sure that the group exists first."""
    raise HTTPException(400, "Not implemented")

@app.post("/groups/delete")
def delete_group(group_id: int):
    """Removes the group with the given ID."""
    raise HTTPException(400, "Not implemented")

# Membership
@app.post("/memberships/add")
def add_membership(new_membership: MembershipModel):
    """Adds a new row to membership table."""
    raise HTTPException(400, "Not implemented")

@app.get("/memberships/get")
def get_membership(membership_id: int):
    """Returns a membership object with the given ID."""
    raise HTTPException(400, "Not implemented")

@app.post("/memberships/update")
def update_membership(updated_membership: MembershipModel):
    """Updates the membership with the given ID with new information.
       Checks to make sure that the membership exists first."""
    raise HTTPException(400, "Not implemented")

@app.post("/memberships/delete")
def delete_membership(membership_id: int):
    """Removes the membership with the given ID."""
    raise HTTPException(400, "Not implemented")

# Settings
@app.post("/settings/add")
def add_settings(new_settings: SettingsModel):
    """Adds a new row to settings table."""
    raise HTTPException(400, "Not implemented")

@app.get("/settings/get")
def get_settings(settings_id: int):
    """Returns a settings object with the given ID."""
    raise HTTPException(400, "Not implemented")

@app.post("/settings/update")
def update_settings(updated_settings: SettingsModel):
    """Updates the settings with the given ID with new information.
       Checks to make sure that the settings exists first."""
    raise HTTPException(400, "Not implemented")

@app.post("/settings/delete")
def delete_settings(settings_id: int):
    """Removes the settings with the given ID."""
    raise HTTPException(400, "Not implemented")

# Preset
@app.post("/presets/add")
def add_preset(new_preset: PresetModel):
    """Adds a new row to preset table."""
    raise HTTPException(400, "Not implemented")

@app.get("/presets/get")
def get_preset(preset_id: int):
    """Returns a preset object with the given ID."""
    raise HTTPException(400, "Not implemented")

@app.post("/presets/update")
def update_preset(updated_preset: PresetModel):
    """Updates the preset with the given ID with new information.
       Checks to make sure that the preset exists first."""
    raise HTTPException(400, "Not implemented")

@app.post("/presets/delete")
def delete_preset(preset_id: int):
    """Removes the preset with the given ID."""
    raise HTTPException(400, "Not implemented")

# Presetitem
@app.post("/presetitems/add")
def add_presetitem(new_presetitem: PresetitemModel):
    """Adds a new row to presetitem table."""
    raise HTTPException(400, "Not implemented")

@app.get("/presetitems/get")
def get_presetitem(presetitem_id: int):
    """Returns a presetitem object with the given ID."""
    raise HTTPException(400, "Not implemented")

@app.post("/presetitems/update")
def update_presetitem(updated_presetitem: PresetitemModel):
    """Updates the presetitem with the given ID with new information.
       Checks to make sure that the presetitem exists first."""
    raise HTTPException(400, "Not implemented")

@app.post("/presetitems/delete")
def delete_presetitem(presetitem_id: int):
    """Removes the presetitem with the given ID."""
    raise HTTPException(400, "Not implemented")
