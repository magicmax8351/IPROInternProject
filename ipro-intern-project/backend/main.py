from fastapi import FastAPI, HTTPException
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
import re

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class HelloResponse(BaseModel):
    name: str
    message: str


engine = create_engine("sqlite:///test_db.db")
orm_parent_session = sessionmaker(bind=engine)
orm_session = orm_parent_session()


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
        time.sleep(random.randrange(.5, 2))
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
def get_uid_token(token: str):
    """Tests if a token is valid. If invalid, sleep a little bit. FIXME THIS IS BAD"""
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
    ret = PostModel.from_orm(new_post_orm)
    ret.key = ret.id
    applied = orm_session.query(ApplicationBaseORM).filter(
        ApplicationBaseORM.uid == uid).filter(ApplicationBaseORM.job_id == ret.job_id).all()
    if applied:
        ret.applied = 1
    else:
        ret.applied = 0

    orm_session.close()
    return ret


@app.get("/posts/get")
def get_post(token: str, count: int, start_id: int, group_link: str):
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
        if post.job.id in applications:
            post_model.applied = 1
        else:
            post_model.applied = 0

        post_model.key = post_model.id
        posts.append(post_model)
    s.close()

    return {'posts': posts, 'count': len(posts)}


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
        app) for app in s.query(ApplicationBaseORM)]

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
        job_id=new_application.job_id,
        resume_id=new_application.resume_id,
        uid=uid
    )

    r = []

    try:
        orm_session.add(new_application_base_orm)

        for s in orm_session.query(StageORM).all():
            e = ApplicationEventORM(
                date=datetime.datetime.now(),
                status=0,
                applicationBaseId=new_application_base_orm.id,
                stage_id=s.id
            )
            if s.id == 1 and applied:
                e.status = 1

            orm_session.add(e)

        orm_session.commit()

    except IntegrityError:
        orm_session.close()
        raise HTTPException(411, "Job already added!")

    ret_app = ApplicationBaseModel.from_orm(new_application_base_orm)
    orm_session.close()

    ret_app.key = ret_app.id
    return ret_app


@app.post("/applications/update")
def update_application(newApplicationEvent: ApplicationEventModel):
    """Updates the application with the given ID with new information.
       Checks to make sure that the application exists first.

       Test request code: 
       curl --request POST \
        --url http://localhost:8000/applications/update \
        --header 'Content-Type: application/json' \
        --data '{
            "id": 4,
            "status": 0,
            "stage_id": 0,
            "token": "c0144c49bc667fb90885b6d016147410",
            "applicationBaseId": 1
        }'
    """

    uid = get_uid_token(newApplicationEvent.token)["uid"]
    if uid == -1:
        raise HTTPException(410, "User token invalid!")

    orm_session = orm_parent_session()

    base = orm_session.query(ApplicationBaseORM).filter(
        ApplicationBaseORM.uid == uid,
        ApplicationBaseORM.id == newApplicationEvent.applicationBaseId
    ).one()

    if base == None:
        orm_session.close()
        raise HTTPException(411, "Couldn't match Base ID to user!")

    event_obj = orm_session.query(ApplicationEventORM).filter(
        ApplicationEventORM.id == newApplicationEvent.id).one()

    if(event_obj == None):
        orm_session.close()
        raise HTTPException(412, "Event ID not found!")

    event_obj.status = newApplicationEvent.status
    ret = ApplicationEventModel.from_orm(event_obj)
    orm_session.commit()
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
        name=new_company.name
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
@app.post("/groups/add")
def add_group(new_group: GroupModel):
    """Adds a new row to group table."""
    uid = get_uid_token(new_group.token)["uid"]
    if uid == -1:
        raise HTTPException(422, "Not Authenticated")

    s = orm_parent_session()

    groupImages = [
        "https://live.staticflickr.com/7421/16439168222_aaecb19630_b.jpg",
        "https://image.freepik.com/free-vector/geometric-background_23-2148573776.jpg",
        "https://static8.depositphotos.com/1154062/1071/v/600/depositphotos_10712741-stock-illustration-white-crumpled-abstract-background.jpg"
    ]

    new_group.link = re.sub("[^0-9a-zA-Z]+", "",
                            new_group.name.replace(" ", "_"))
    if(new_group.privacy != 0):
        new_group.link += "_" + gen_token()[:8]

    new_group_ORM = GroupORM(
        name=new_group.name,
        icon="/fake/image.png",
        desc=new_group.desc,
        background=random.choice(groupImages),
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
    groupMembershipObject.group.activeUserInGroup = bool(groupMembershipObject.group.id in group_ids)

    s.close()
    return groupMembershipObject


@app.get("/grouplist")
def get_user_groups(token: str):
    """Returns all groups a user has membership in."""
    s = orm_parent_session()
    groups = []
    uid = get_uid_token(token)["uid"]
    if uid == -1:
        raise HTTPException(422, "Not Authenticated")

    group_memberships = [m.group_membership_id for m in s.query(
        MembershipORM).filter(MembershipORM.uid == uid)]
    group_ids = [m.group_id for m in s.query(GroupMembershipORM).filter(
        GroupMembershipORM.group_id.in_(group_memberships))]
    for group in s.query(GroupORM):
        g = GroupModel.from_orm(group)
        g.key = g.id
        if(g.id in group_ids):
            g.activeUserInGroup = True
            groups.append(g)
        elif (g.privacy == 0):
            g.activeUserInGroup = False
            groups.append(g)
        else:
            pass
    s.close()
    return groups


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
