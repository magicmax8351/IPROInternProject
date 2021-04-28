from fastapi import FastAPI, HTTPException, UploadFile, File, Cookie
from fastapi.responses import FileResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from src.data_types import *
import random
import datetime
import bcrypt
import time
import uuid
from sqlalchemy import desc, asc, or_
from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
import re
import os
import string
from asyncio import SelectorEventLoop, set_event_loop, get_event_loop
from uvicorn import Config, Server


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
    "http://wingman.justinjschmitz.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = create_engine("sqlite:///test_db.db")
orm_parent_session = sessionmaker(bind=engine)


def gen_token():
    tok = str(uuid.uuid4().hex)[8:] + str(uuid.uuid4().hex)[8:]
    return tok

# CRUD functions for each table


@app.post("/users/add")
def add_user(new_user: UserModel):
    """Adds a new row to user table."""
    orm_session = orm_parent_session()
    # Generate a salt, then hash the password.
    # Don't verify password strength here - do that on frontend.

    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(bytes(new_user.password, 'utf-8'), salt)
    token = gen_token()

    new_user_ORM = UserORM(
        fname=new_user.fname,
        lname=new_user.lname,
        salt=salt,
        hashed=hashed,
        email=new_user.email,
        pic=new_user.pic,
        graddate=new_user.graddate,
        city=new_user.city,
        state=new_user.state
    )

    try:
        orm_session.add(new_user_ORM)
        orm_session.commit()
    except Exception as e:
        # User failed to add. Almost certainly an IntegrityError.
        orm_session.close()
        raise HTTPException(
            400, "User already exists! Detailed message: " + str(e))

    new_token_ORM = TokenORM(
        val=token,
        uid=new_user_ORM.id
    )

    orm_session.add(new_token_ORM)
    orm_session.commit()

    # DEBUG: Add user to random number between 1 and 10 groups.

    groups = [g for g in orm_session.query(GroupMembershipORM).all()]

    memberships = []
    for g in groups:
        if(random.randint(0, 3) == 2):
            memberships.append(
                MembershipORM(
                    uid=new_user_ORM.id,
                    group_membership_id=g.id
                )
            )

    orm_session.add_all(memberships)

    ret = NewUserReturn(
        user=UserModel.from_orm(new_user_ORM),
        token=TokenModel.from_orm(new_token_ORM)
    )

    orm_session.commit()
    orm_session.close()
    return ret


@app.get("/users/get")
def get_user_token(token: str):
    uid = get_uid_token(token)["uid"]
    if uid == -1:
        raise HTTPException(422, "Not authenticated!")
    return get_user(uid)


@app.post("/users/login")
def login_user(user_creds: LoginData):
    """Adds a new row to user table."""
    orm_session = orm_parent_session()
    # Generate a salt, then hash the password.
    # Don't verify password strength here - do that on frontend.

    try:
        user = orm_session.query(UserORM).filter(
            UserORM.email == user_creds.email).one()
    except NoResultFound:
        time.sleep(random.randrange(1, 2))
        orm_session.close()
        raise HTTPException(400, "Email not found!")

    hashed = bcrypt.hashpw(bytes(user_creds.password, 'utf-8'), user.salt)

    if(hashed != user.hashed):
        orm_session.close()
        raise HTTPException(400, "Email not found!")

    token = gen_token()

    new_token_ORM = TokenORM(
        val=token,
        uid=user.id
    )

    orm_session.add(new_token_ORM)
    orm_session.commit()

    # DEBUG: Add user to random number between 1 and 10 groups.

    ret = NewUserReturn(
        user=UserModel.from_orm(user),
        token=TokenModel.from_orm(new_token_ORM)
    )
    orm_session.close()
    return ret

# NOT AN ENDPOINT


def get_user(uid: int):
    """Returns a user object with the given ID."""
    orm_session = orm_parent_session()
    for u in orm_session.query(UserORM).filter(UserORM.id == uid):
        user = UserModel.from_orm(u)
        orm_session.close()
        return user
    orm_session.close()
    raise ValueError("uid not found!")


@app.post("/users/update")
def update_user(updated_user: UserModel):
    """Updates the user with the given ID with new information.
       Checks to make sure that the user exists first."""
    raise HTTPException(400, "Not implemented")


@app.post("/users/delete")
def delete_user(uid: int):
    """Removes the user with the given ID."""
    raise HTTPException(400, "Not implemented")


@app.get("/token/test")
def token_test(token: str = Cookie("")):
    s = orm_parent_session()
    try:
        t = s.query(TokenORM).filter(TokenORM.val == token).one()
        s.close()
        return
    except NoResultFound:
        s.close()
        raise HTTPException(422, "Not valid token!")


def get_uid_token(token: str):
    s = orm_parent_session()
    try:
        t = s.query(TokenORM).filter(TokenORM.val == token).one()
        s.close()
        return {"result": token, "uid": t.uid}
    except NoResultFound:
        s.close()
        return {"result": 0, "uid": -1}
# Post


@app.post("/posts/add")
def add_post(new_post: PostModel):
    """Adds a new row to post table."""
    orm_session = orm_parent_session()
    uid = get_uid_token(new_post.token)["uid"]

    new_post_orm = PostORM(
        body=new_post.body,
        timestamp=datetime.datetime.now(),
        job_id=new_post.job_id,
        uid=uid,
        group_id=new_post.group_id
    )

    orm_session.add(new_post_orm)
    orm_session.commit()

    like = UserPostLikeORM(
        uid=uid, post_id=new_post_orm.id, like=1, dashboard=0)
    orm_session.add(like)

    ret = PostModel.from_orm(new_post_orm)
    ret.key = ret.id
    ret.userLike = 1

    applied = orm_session.query(ApplicationBaseORM).filter(
        ApplicationBaseORM.uid == uid).filter(ApplicationBaseORM.job_id == ret.job_id).all()
    if applied:
        ret.applied = 1
    else:
        ret.applied = 0

    orm_session.close()
    return ret


@app.get("/posts/get")
def get_post(count: int, start_id: int, group_link: str, token: str = Cookie("")):
    """Returns all posts."""
    uid = get_uid_token(token)["uid"]
    if uid == -1:
        raise HTTPException(410, "User token invalid!")

    s = orm_parent_session()
    group_memberships = [m.group_membership_id for m in s.query(
        MembershipORM).filter(MembershipORM.uid == uid)]
    group_ids = [m.group_id for m in s.query(GroupMembershipORM).filter(
        GroupMembershipORM.group_id.in_(group_memberships))]
    applications = {a.job_id: a for a in s.query(
        ApplicationBaseORM).filter(ApplicationBaseORM.uid == uid)}
    posts = []

    if(group_link == ""):
        if (start_id == -1):
            query = s.query(PostORM).filter(PostORM.group_id.in_(
                group_ids)).order_by(PostORM.id.desc()).limit(count).all()
        else:
            query = s.query(PostORM).filter(PostORM.group_id.in_(group_ids)).filter(
                PostORM.id < start_id).order_by(PostORM.id.desc()).limit(count).all()
    else:
        group = s.query(GroupORM).filter(GroupORM.link == group_link).one()
        if group == None:
            s.close()
            raise HTTPException(430, "Group not found!")
        if((group.privacy != 2) or (group.id in group_ids)):
            if (start_id == -1):
                query = s.query(PostORM).filter(PostORM.group_id == group.id).order_by(
                    PostORM.id.desc()).limit(count).all()
            else:
                query = s.query(PostORM).filter(PostORM.group_id == group.id).filter(
                    PostORM.id < start_id).order_by(PostORM.id.desc()).limit(count).all()
        else:
            s.close()
            raise HTTPException(422, "Private group!")

    for post in query:
        post_model = PostModel.from_orm(post)
        if len(post_model.activity) > 0:
            post_model.userLike = max(map(lambda x: x.like if (
                x.uid == uid and x.like != 0) else 0, post_model.activity))
        else:
            post_model.userLike = 0

        if post.job.id in applications:
            post_model.applied = 1
        else:
            post_model.applied = 0

        post_model.key = post_model.id
        posts.append(post_model)
    s.close()

    if(len(posts) == 0):
        raise HTTPException(450, "No more posts!")

    return {'posts': posts, 'count': len(posts)}


@app.get("/posts/like")
def like_post(post_id: int, like: int, dashboard: int = 0, token: str = Cookie("")):
    uid = get_uid_token(token)["uid"]
    if uid == -1:
        raise HTTPException(410, "User token invalid!")

    s = orm_parent_session()
    try:
        likeObj = s.query(UserPostLikeORM).filter(UserPostLikeORM.uid == uid).filter(
            UserPostLikeORM.post_id == post_id).one()
        likeObj.like = like
        likeObj.dashboard = dashboard
    except NoResultFound:
        likeObj = UserPostLikeORM(
            uid=uid, post_id=post_id, like=like, dashboard=dashboard)
        try:
            s.add(likeObj)
            s.commit()
            s.close()
            return
        except IntegrityError:
            print(f"Strange behavior! UID: {uid} Post_id: {post_id}")
            s.close()
            return

    s.commit()
    likeModel = UserPostLikeModel.from_orm(likeObj)
    s.close()
    return likeModel


@app.post("/posts/update")
def update_post(updated_post: PostModel):
    """Updates the post with the given ID with new information.
       Checks to make sure that the post exists first."""
    raise HTTPException(400, "Not implemented")


@app.post("/posts/delete")
def delete_post(post_id: int):
    """Removes the post with the given ID."""
    orm_session = orm_parent_session()
    try:
        orm_session.delete(
            orm_session.query(
                PostORM).filter_by(id=post_id).one())
    except:
        print(f"error deleting {post_id}")
    orm_session.commit()
    orm_session.close()


# Comment
@app.post("/comments/add")
def add_comment(new_comment: CommentModel):
    """Adds a new row to comment table."""

    uid = get_uid_token(new_comment.token)["uid"]
    user = get_user(uid)
    new_comment_orm = CommentORM(
        text=new_comment.text,
        timestamp=datetime.datetime.now(),
        post_id=new_comment.post_id,
        uid=uid
    )

    orm_session = orm_parent_session()
    orm_session.add(new_comment_orm)
    orm_session.commit()
    ret = CommentModel.from_orm(new_comment_orm)
    ret.user = user
    orm_session.close()
    return ret


def get_comments_post_id(post_id: int):
    """Returns all comments """
    orm_session = orm_parent_session()

    comments = []
    for p in orm_session.query(CommentORM).filter(CommentORM.post_id == post_id).order_by(asc(CommentORM.id)).all():
        c = CommentModel.from_orm(p)
        c.user = get_user(c.uid)
        comments.append(c)

    orm_session.close()

    return comments


@app.get("/applications/get")
def get_applications(token: str):
    uid = get_uid_token(token)["uid"]
    if uid == -1:
        raise HTTPException(410, "User token invalid!")

    s = orm_parent_session()
    apps_orm = {}

    stages = [StageModel.from_orm(stage) for stage in s.query(StageORM)]
    apps_model = [ApplicationBaseModel.from_orm(
        app) for app in s.query(ApplicationBaseORM).filter(ApplicationBaseORM.uid == uid)]

    s.close()

    return ApplicationDataModel(
        applicationData=apps_model,
        stages=stages
    )

# Application


@app.post("/applications/add")
def add_application(new_application: ApplicationBaseModel, applied: bool = False):
    """Adds a new row to application table.

    Test CURL:

    curl --request POST \
    --url 'http://localhost:8000/applications/add?token=ccab4e01998b735345a702ce16147378' \
    --header 'Content-Type: application/json' \
    --data '{
        "job_id": 6939,
        "token": "ccab4e01998b735345a702ce16147378",
        "resume_id": 1
    }'
    """

    uid = get_uid_token(new_application.token)["uid"]
    if uid == -1:
        raise HTTPException(410, "User token invalid!")

    orm_session = orm_parent_session()

    new_application_base_orm = ApplicationBaseORM(
        timestamp=datetime.datetime.now(),
        job_id=new_application.job_id,
        resume_id=new_application.resume_id,
        uid=uid
    )
    
    try:
        orm_session.add(new_application_base_orm)
        orm_session.commit()

    except IntegrityError:
        orm_session.close()
        raise HTTPException(411, "Job already added!")

    ret_app = ApplicationBaseModel.from_orm(new_application_base_orm)
    orm_session.close()
    return ret_app

def get_stages():
    s = orm_parent_session()
    ret = [StageModel.from_orm(x) for x in s.query(StageORM)]
    s.close()
    return ret

@app.post("/applications/update")
def update_application(newApplicationEvent: StatusUpdateModel, token: str = Cookie("")):
    """Updates the application with the given ID with new information.
       Checks to make sure that the application exists first.
    """

    uid = get_uid_token(token)["uid"]
    if uid == -1:
        raise HTTPException(410, "User token invalid!")

    orm_session = orm_parent_session()
    stages = get_stages()
    print(stages)

    try:
        base = orm_session.query(ApplicationBaseORM).filter(
            ApplicationBaseORM.uid == uid,
            ApplicationBaseORM.id == newApplicationEvent.applicationBaseId
        ).one()
    except NoResultFound:
        orm_session.close()
        raise HTTPException(411, "Couldn't match Base ID to user!")
        
    if newApplicationEvent.stage == None:
        event_obj = ApplicationEventORM(
                applicationBaseId=newApplicationEvent.applicationBaseId,
                timestamp=datetime.datetime.now(),
                stage_id=stages[0].id
        )
        orm_session.add(event_obj)
    else:
        try:
            old_event_obj = orm_session.query(ApplicationEventORM).filter(
                ApplicationEventORM.applicationBaseId == newApplicationEvent.applicationBaseId).filter(ApplicationEventORM.stage_id == newApplicationEvent.stage.id).one()

            if(old_event_obj.stage_id == stages[-1].id):
                orm_session.query(ApplicationEventORM).filter(
                ApplicationEventORM.applicationBaseId == old_event_obj.applicationBaseId).delete()
                # event_obj = ApplicationEventORM(
                #     applicationBaseId=newApplicationEvent.applicationBaseId,
                #     timestamp=datetime.datetime.now(),
                #     stage_id=stages[0].id
                # )
                # orm_session.add(event_obj)
                event_obj = None
            else:
                event_obj = ApplicationEventORM(
                    applicationBaseId=newApplicationEvent.applicationBaseId,
                    timestamp=datetime.datetime.now(),
                    stage_id=stages[old_event_obj.stage.id].id
                )
                try:
                    orm_session.add(event_obj)
                except IntegrityError:
                    raise HTTPException(430, "Status update invalid!")

        except NoResultFound:
            event_obj = ApplicationEventORM(
                applicationBaseId=newApplicationEvent.applicationBaseId,
                timestamp=datetime.datetime.now(),
                stage_id=stages[0].id
            )
            orm_session.add(event_obj)
    orm_session.commit()
    if(event_obj != None):
        ret = ApplicationEventModel.from_orm(event_obj)
    else:
        ret = None
    orm_session.close()
    return ret


@app.post("/applications/delete")
def delete_application(application_id: int):
    """Removes the application with the given ID."""
    raise HTTPException(400, "Not implemented")


# Job
@app.post("/jobs/add")
def add_job(new_job: JobModel):
    """Adds a new row to job table."""
    uid = get_uid_token(new_job.token)["uid"]
    if uid == -1:
        raise HTTPException(422, "Not Authenticated")

    s = orm_parent_session()
    j = JobORM(
        name=new_job.name,
        description=new_job.description,
        location=new_job.location,
        company_id=new_job.company_id,
        link=new_job.link
    )
    s.add(j)
    s.commit()
    r = JobModel.from_orm(j)
    r.key = r.id
    s.close()
    return r


# Not an endpoint!
def get_job_by_id(job_id: int):
    """Get job by job ID. """
    s = orm_parent_session()
    tag_map = {}
    for tag in s.query(TagORM):
        tag_map[tag.id] = TagModel.from_orm(tag)

    job = None
    for p in s.query(JobORM, JobTagORM).join(JobTagORM, isouter=True).filter(JobORM.id == job_id):
        if(not job):
            job = JobModel.from_orm(p[0])
            job.key = job.id
            job.tags = []

        if(p[1]):
            job.tags.append(tag_map[p[1].tag_id])

    s.close()
    return job


@app.get("/jobs/get")
def get_jobs(token: str):
    """Returns all jobs"""
    uid = get_uid_token(token)["uid"]
    if uid == -1:
        raise HTTPException(422, "Not Authenticated")

    s = orm_parent_session()

    tag_map = {}
    for tag in s.query(TagORM):
        tag_map[tag.id] = TagModel.from_orm(tag)

    j = {}
    for p in s.query(JobORM, JobTagORM).join(JobTagORM, isouter=True):
        job = JobModel.from_orm(p[0])
        if(job.id) not in j:
            j[job.id] = job
            job.key = job.id
            job.tags = []
            job.company = get_company_id(job.company_id)

        if(p[1]):
            j[job.id].tags.append(tag_map[p[1].tag_id])

    s.close()
    return list(j.values())


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
    uid = get_uid_token(new_company.token)["uid"]
    if uid == -1:
        raise HTTPException(422, "Not Authenticated")

    s = orm_parent_session()
    c = CompanyORM(
        name=new_company.name,
        logoFile=new_company.logoFile
    )
    s.add(c)
    s.commit()
    r = CompanyModel.from_orm(c)
    r.key = r.id
    s.close()
    return r


@app.get("/companies/get")
def get_company(token: str):
    """Returns all companies"""
    uid = get_uid_token(token)["uid"]
    if uid == -1:
        raise HTTPException(422, "Not Authenticated")
    s = orm_parent_session()
    c = []
    for p in s.query(CompanyORM):
        t = CompanyModel.from_orm(p)
        t.key = t.id
        c.append(t)
    s.close()
    return c


@app.get("/companies/get/id")
def get_company_id(company_id: int):
    """Returns company with the given ID. """
    s = orm_parent_session()
    for c in s.query(CompanyORM).filter(CompanyORM.id == company_id):
        company = CompanyModel.from_orm(c)
        s.close()
        return company
    s.close()
    raise ValueError


@app.post("/companies/logo/upload")
def upload_logo(logoFile: UploadFile = File(...)):
    """Uploads aand saves a logo file"""
    if not os.path.exists('logos'):
        os.makedirs('logos')
    unique_name = ''
    extension = logoFile.filename.split('.')[1]
    while True:
        unique_name = ''.join(random.choices(
            string.ascii_lowercase + string.ascii_uppercase + string.digits, k=10)) + '.' + extension
        if not os.path.isfile('logos/' + unique_name):
            break
    with open('logos/' + unique_name, "wb+") as file_object:
        file_object.write(logoFile.file.read())
    return {'logoFile': unique_name}


@app.get("/companies/logo/download")
def download_logo(company_id: int):
    """Download the logo for the given company"""
    #uid = get_uid_token(token)["uid"]
    # if uid == -1:
    #    raise HTTPException(422, "Not Authenticated")
    s = orm_parent_session()
    company = s.query(CompanyORM).get(company_id)
    s.close()
    file_path = 'logos/' + company.logoFile
    if os.path.exists(file_path):
        return FileResponse(file_path)
    else:
        raise HTTPException(404, f"Company id={company_id} Not Found")
        return {'error': f"Company id={company_id} Not Found"}


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
@app.post("/resumes/upload")
def upload_resume(resume: UploadFile = File(...)):
    """Uploads aand saves a resume file"""
    if not os.path.exists('resumes'):
        os.makedirs('resumes')
    unique_name = ''
    extension = resume.filename.split('.')[1]
    while True:
        unique_name = ''.join(random.choices(
            string.ascii_lowercase + string.ascii_uppercase + string.digits, k=10)) + '.' + extension
        if not os.path.isfile('resumes/' + unique_name):
            break
    with open('resumes/' + unique_name, "wb+") as file_object:
        file_object.write(resume.file.read())
    return {'filename': unique_name}


@app.get("/resumes/download")
def download_resume(token: str, resume_id: int):
    """Download the resume with given ID"""
    uid = get_uid_token(token)["uid"]
    if uid == -1:
        raise HTTPException(422, "Not Authenticated")
    s = orm_parent_session()
    resume = s.query(ResumeORM).get(resume_id)
    s.close()
    file_path = 'resumes/' + resume.filename
    if os.path.exists(file_path):
        return FileResponse(file_path)
    else:
        raise HTTPException(404, f"Resume id={resume_id} Not Found")
        return {'error': f"Resume id={resume_id} Not Found"}


@app.post("/resumes/add")
def add_resume(new_resume: ResumeModel):
    """Adds a new row to resume table."""
    uid = get_uid_token(new_resume.token)["uid"]
    if uid == -1:
        raise HTTPException(422, "Not Authenticated")

    s = orm_parent_session()
    c = ResumeORM(
        name=new_resume.name,
        filename=new_resume.filename,
        date=datetime.datetime.now(),
        uid=uid
    )
    s.add(c)
    s.commit()
    r = ResumeModel.from_orm(c)
    s.close()
    return r
    # print(new_resume.name)
    # print(new_resume.filename)


@app.get("/resumes/get")
def get_resume(token: str):
    """Get all resumes for a given user"""
    uid = get_uid_token(token)["uid"]
    if uid == -1:
        raise HTTPException(410, "User token invalid!")

    s = orm_parent_session()
    apps_orm = {}

    res_model = [ResumeModel.from_orm(res) for res in s.query(
        ResumeORM).filter(ResumeORM.uid == uid)]

    s.close()

    return res_model


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
def add_jobtag(new_jobtag: JobTagModel):
    """Adds a new row to jobtag table."""
    raise HTTPException(400, "Not implemented")


@app.get("/jobtags/get")
def get_jobtag(jobtag_id: int):
    """Returns a jobtag object with the given ID."""
    raise HTTPException(400, "Not implemented")


@app.post("/jobtags/update")
def update_jobtag(updated_jobtag: JobTagModel):
    """Updates the jobtag with the given ID with new information.
       Checks to make sure that the jobtag exists first."""
    raise HTTPException(400, "Not implemented")


@app.post("/jobtags/delete")
def delete_jobtag(jobtag_id: int):
    """Removes the jobtag with the given ID."""
    raise HTTPException(400, "Not implemented")


# Group
@app.post("/group/add")
def add_group(new_group: GroupModel, token: str = Cookie("")):
    """Adds a new row to group table."""
    uid = get_uid_token(token)["uid"]
    if uid == -1:
        raise HTTPException(422, "Not Authenticated")

    s = orm_parent_session()

    groupImages = [
        "https://live.staticflickr.com/7421/16439168222_aaecb19630_b.jpg",
        "https://image.freepik.com/free-vector/geometric-background_23-2148573776.jpg",
        "https://static8.depositphotos.com/1154062/1071/v/600/depositphotos_10712741-stock-illustration-white-crumpled-abstract-background.jpg",
        "/group_pictures/snowy_street.jpg",
        "/group_pictures/sleepy_puggle.jpg",
        "/group_pictures/bread.jpg",
        "/group_pictures/chicago.jpg"
    ]

    new_group.link = re.sub("[^0-9a-zA-Z_]+", "",
                            new_group.name.strip().replace(" ", "_").lower()).replace("__", "_")

    while(s.query(GroupORM).filter(GroupORM.link == new_group.link).scalar() != None):
        new_group.link += "_" + gen_token()[:8]

    if(new_group.privacy != 0):
        new_group.link += "_" + gen_token()[:8]

    new_group_ORM = GroupORM(
        name=new_group.name,
        icon="/fake/image.png",
        desc=new_group.desc,
        background=(
            new_group.background if new_group.background else random.choice(groupImages)),
        privacy=new_group.privacy,
        link=new_group.link
    )
    s.add(new_group_ORM)
    s.commit()
    new_group_membership_ORM = GroupMembershipORM(group_id=new_group_ORM.id)

    s.add(new_group_membership_ORM)
    s.commit()

    s.add(MembershipORM(group_membership_id=new_group_membership_ORM.id, uid=uid))
    s.commit()

    return GroupModel.from_orm(new_group_ORM)


@app.get("/groups/{link}/{token}")
def get_group_by_id(link: str, token: str):
    """Get group by group ID. """
    uid = get_uid_token(token)["uid"]
    if uid == -1:
        raise HTTPException(422, "Not Authenticated")

    s = orm_parent_session()
    group_memberships = [m.group_membership_id for m in s.query(
        MembershipORM).filter(MembershipORM.uid == uid)]
    group_ids = [m.group_id for m in s.query(GroupMembershipORM).filter(
        GroupMembershipORM.group_id.in_(group_memberships))]
    group = s.query(GroupORM).filter(GroupORM.link == link).one()
    if((group.id not in group_ids) and group.privacy == 2):
        s.close()
        raise HTTPException(422, "Not in that group!")

    groupMembershipObject = GroupMembershipModel.from_orm(s.query(
        GroupMembershipORM).filter(GroupMembershipORM.group_id == group.id).one())
    groupMembershipObject.group.activeUserInGroup = bool(
        groupMembershipObject.group.id in group_ids)

    s.close()
    return groupMembershipObject


@app.get("/group/list")
def get_user_groups(token: str, browse: bool = False):
    """Returns all groups a user has membership in."""
    s = orm_parent_session()
    groups = []
    uid = get_uid_token(token)["uid"]
    if uid == -1:
        raise HTTPException(422, "Not Authenticated")

    group_memberships = [m.group_membership_id for m in s.query(
        MembershipORM).filter(MembershipORM.uid == uid)]
    group_membership_map = {
        m.id: m.group_id for m in s.query(GroupMembershipORM)}

    group_ids = [group_membership_map[x] for x in group_memberships]

    group_memberships = []
    group_membership_count = {}

    for m in s.query(GroupMembershipORM).filter(
            GroupMembershipORM.group_id.in_(group_memberships)):
        group_memberships.append(m.group_id)

    for (group_membership_id, members) in s.query(MembershipORM.group_membership_id, func.count(MembershipORM.uid)).group_by(MembershipORM.group_membership_id).all():
        group_membership_count[group_membership_map[group_membership_id]] = members

    for group in s.query(GroupORM):
        g = GroupModel.from_orm(group)
        g.key = g.id

        if g.id in group_membership_count:
            g.memberCount = group_membership_count[g.id]
        else:
            g.memberCount = 0

        if(g.id in group_ids):
            g.activeUserInGroup = True
            groups.append(g)
        elif (browse and g.privacy == 0):
            g.activeUserInGroup = False
            groups.append(g)
        else:
            pass
    s.close()
    return groups


@app.get("/group/join")
def join_group(group_link: str, token: str):
    uid = get_uid_token(token)["uid"]
    if uid == -1:
        raise HTTPException(422, "Not Authenticated")

    s = orm_parent_session()
    try:
        group = s.query(GroupORM).filter(GroupORM.link == group_link).one()
    except NoResultFound as e:
        raise HTTPException(422, "Group not found!")

    groupMembershipObject = s.query(GroupMembershipORM).filter(
        GroupMembershipORM.group_id == group.id).one()
    if(s.query(MembershipORM).filter(MembershipORM.group_membership_id == groupMembershipObject.id).filter(MembershipORM.uid == uid).scalar() != None):
        raise HTTPException(430, "User already in group!")

    newMembershipORM = MembershipORM(
        group_membership_id=groupMembershipObject.id,
        uid=uid
    )
    s.add(newMembershipORM)
    s.commit()
    s.close()
    return (200, "OK")


@app.post("/group/leave")
def leave_group(group_link: str, token: str = Cookie("")):
    uid = get_uid_token(token)["uid"]
    if uid == -1:
        raise HTTPException(422, "Not Authenticated")

    s = orm_parent_session()
    try:
        group = s.query(GroupORM).filter(GroupORM.link == group_link).one()
    except NoResultFound as e:
        raise HTTPException(422, "Group not found!")

    groupMembershipObject = s.query(GroupMembershipORM).filter(
        GroupMembershipORM.group_id == group.id).one()
    try:
        m = s.query(MembershipORM).filter(MembershipORM.group_membership_id ==
                                          groupMembershipObject.id).filter(MembershipORM.uid == uid).one()
    except NoResultFound:
        raise HTTPException(430, "User not in group!")

    s.delete(m)
    s.commit()
    s.close()
    return (200, "OK")


@app.get("/groups_stats/{link}")
def get_group_stats(link: str):
    """Calculates and returns statistics for the given group"""

    stats = GroupStatsModel()
    s = orm_parent_session()

    # get users in this group
    group = s.query(GroupORM).filter(GroupORM.link == link).one()
    groupMemberships = s.query(GroupMembershipORM).filter(
        GroupMembershipORM.group_id == group.id).one()
    memberships = groupMemberships.membership

    # calculate avgJobsInDashboard and find mostPopularCompany
    total = 0
    count = 0
    companies = {}
    for m in memberships:
        total += len(m.user.applications)
        count += 1

        for app in m.user.applications:
            key = app.job.company.name
            companies[key] = companies[key] + 1 if key in companies else 1

    stats.avgJobsInDashboard = total // count
    stats.mostPopularCompany = max(companies, key=companies.get)
    stats.postsPerDay = random.randint(1, 20)
    stats.avgNumberOffers = random.randint(1, 10)

    s.close()
    return stats


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


if __name__ == "__main__":
    set_event_loop(SelectorEventLoop())
    server = Server(config=Config(app=app, host="0.0.0.0"))
    get_event_loop().run_until_complete(server.serve())
