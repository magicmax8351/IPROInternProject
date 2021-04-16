from typing import List, Optional
from sqlalchemy import Column, Integer, String, Date, ForeignKey, MetaData, DateTime, Date
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel, constr
import datetime
from sqlalchemy.schema import UniqueConstraint


# See https://docs.sqlalchemy.org/en/13/orm/basic_relationships.html
# for more information.

Base = declarative_base()
metadata = MetaData()

class UserORM(Base):
    __tablename__ = "user"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    fname = Column(String(32), nullable=False)
    lname = Column(String(32), nullable=False)
    salt = Column(String(32), nullable=False)
    hashed = Column(String(32), nullable=False)
    email = Column(String(32), nullable=False, unique=True)
    pic = Column(String(128))
    graddate = Column(Date)
    city = Column(String(32))
    state = Column(String(32))
    
    resumes = relationship("ResumeORM")
    settings = relationship("SettingsORM")
    membership = relationship("MembershipORM")
    applications = relationship("ApplicationBaseORM")
    presets = relationship("PresetORM")
    tokens = relationship("TokenORM")

class UserModel(BaseModel):
    class Config:
        orm_mode = True

    id: Optional[int]
    fname: Optional[str]
    lname: Optional[str]
    password: Optional[str]
    email: Optional[str]
    pic: Optional[str]
    graddate: Optional[datetime.date]
    city: Optional[str]
    state: Optional[str]

class ResumeORM(Base):
    __tablename__ = "resume"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(32), nullable=False)
    filename = Column(String(32), nullable=True)
    date = Column(DateTime)
    uid = Column(Integer, ForeignKey("user.id"))

class ResumeModel(BaseModel):
    class Config:
        orm_mode = True
    id: Optional[int]
    name: str
    filename: str
    date: Optional[datetime.datetime]
    token: Optional[str]

class StageORM(Base):
    __tablename__ = "stage"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(32), nullable=False)

class StageModel(BaseModel):
    class Config:
        orm_mode = True
    id: int
    name: str

class TokenORM(Base):
    __tablename__ = "token"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    val = Column(String(128), nullable=False)
    uid = Column(Integer, ForeignKey("user.id"))

class TokenModel(BaseModel):
    class Config:
        orm_mode = True
    val: str

class SettingsORM(Base):
    __tablename__ = "settings"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    visibility = Column(String(32), nullable=False)
    uid = Column(Integer, ForeignKey("user.id"))

class SettingsModel(BaseModel):
    class Config:
        orm_mode = True
    id: Optional[int]
    visibility: str

class MembershipORM(Base):
    __tablename__ = "membership"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    uid = Column(Integer, ForeignKey("user.id"))
    group_membership_id = Column(Integer, ForeignKey("group_membership.id"))
    user = relationship("UserORM")

class MembershipModel(BaseModel):
    class Config:
        orm_mode = True
    id: Optional[int]
    uid: int
    group_membership_id: int
    user: Optional[UserModel]

class GroupORM(Base):
    __tablename__ = "group"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(32), nullable=False)
    icon = Column(String(32), nullable=False) 
    desc = Column(String(256), nullable=False)
    background = Column(String(128), nullable=False)
    privacy = Column(Integer) # 0 = public, 1 = unlisted, 2 = private
    link = Column(String(64), unique=True)

class GroupModel(BaseModel):
    class Config:
        orm_mode = True
    id: Optional[int]
    name: Optional[str]
    icon: Optional[str]
    desc: Optional[str]
    background: Optional[str]
    privacy: Optional[int]
    activeUserInGroup: Optional[bool]
    key: Optional[int]
    token: Optional[str]
    link: Optional[str]

class GroupMembershipORM(Base):
    __tablename__ = "group_membership"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    group_id = Column(Integer, ForeignKey("group.id"))
    membership = relationship("MembershipORM")
    group = relationship("GroupORM")

class GroupMembershipModel(BaseModel):
    class Config:
        orm_mode = True
    id: Optional[int]
    group_id: Optional[int]
    membership: Optional[List[MembershipModel]]
    group: Optional[GroupModel]

class CommentORM(Base):
    __tablename__ = "comment"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    text = Column(String(32), nullable=False)
    timestamp =  Column(DateTime)
    post_id = Column(Integer, ForeignKey("post.id"))
    uid = Column(Integer, ForeignKey("user.id"))
    user = relationship("UserORM")

class CommentModel(BaseModel):
    class Config:
        orm_mode = True
        # arbitrary_types_allowed = True
    id: Optional[int]
    text: Optional[str]
    timestamp: Optional[datetime.datetime]
    post_id: int
    uid: Optional[int]
    token: Optional[str]
    user: Optional[UserModel]

class CompanyORM(Base):
    __tablename__ = "company"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(32), nullable=False) 
    logoFile = Column(String(32), nullable=True)

class CompanyModel(BaseModel):
    id: Optional[int]
    name: str
    token: Optional[str]
    key: Optional[int]
    logoFile: str

    class Config:
        orm_mode = True

class TagORM(Base):
    __tablename__ = "tag"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    tag = Column(String(32), nullable=False, unique=True)

class TagModel(BaseModel):
    id: Optional[int]
    tag: str

    class Config:
        orm_mode = True

class JobTagORM(Base):
    __tablename__ = "jobtag"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    job_id = Column(Integer, ForeignKey("job.id"))
    tag_id = Column(Integer, ForeignKey("tag.id")) 

    jobs = relationship("JobORM")
    tag = relationship("TagORM")

class JobTagModel(BaseModel):
    job_id: int
    tag_id: int
    tag: Optional[TagModel]

    class Config:
        orm_mode = True

class JobORM(Base):
    __tablename__ = "job"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(32), nullable=False)
    description = Column(String(5000), nullable=True)
    location = Column(String(32), nullable=False)
    company_id = Column(Integer, ForeignKey("company.id"))
    company = relationship("CompanyORM")
    tags = relationship("JobTagORM")
    link = Column(String(512), nullable=True)

class JobModel(BaseModel):
    id: Optional[int]
    name: str
    location: str
    description: str
    company_id: Optional[int]
    company: Optional[CompanyModel]
    token: Optional[str]
    key: Optional[int]
    tags: Optional[List[JobTagModel]]
    link: Optional[str]

    class Config:
        orm_mode = True
    
class UserPostLikeORM(Base):
    __tablename__ = "userPostLikes"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    post_id = Column(Integer, ForeignKey("post.id"))
    uid = Column(Integer, ForeignKey("user.id"))
    value = Column(Integer)

class UserPostLikeModel(BaseModel):
    id: Optional[int]
    post_id: Optional[int]
    uid: Optional[int]
    value: Optional[int]
    
    class Config:
        orm_mode = True

class PostORM(Base):
    __tablename__ = "post"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    body = Column(String(32), nullable=False)
    timestamp = Column(DateTime)
    job_id = Column(Integer, ForeignKey("job.id"))
    uid = Column(Integer, ForeignKey("user.id"))
    group_id = Column(Integer, ForeignKey("group.id"))
    job = relationship("JobORM")
    comments = relationship("CommentORM")
    user = relationship("UserORM")
    group = relationship("GroupORM")
    likes = relationship("UserPostLikeORM")

class PostModel(BaseModel):
    class Config:
        orm_mode = True
        # arbitrary_types_allowed = True

    id: Optional[int]
    body: str
    # tags: List[TagModel]
    timestamp: Optional[datetime.datetime]
    job_id: Optional[int]
    uid: Optional[int]
    group_id: Optional[int]
    token: Optional[str]
    user: Optional[UserModel]
    job: Optional[JobModel]
    comments: Optional[List[CommentModel]]
    applied: Optional[int]
    key: Optional[int]
    group: Optional[GroupModel]
    likes: Optional[List[UserPostLikeModel]]
    userLike: Optional[int]


class ApplicationEventModel(BaseModel):
    id: Optional[int]
    date: Optional[datetime.date]
    status: int
    stage_id: Optional[int]
    token: Optional[str]
    applicationBaseId: Optional[int]
    stage: Optional[StageModel]

    class Config:
        orm_mode = True

class ApplicationBaseORM(Base):
    __tablename__ = "applicationBase"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    job_id = Column(Integer, ForeignKey("job.id"))
    resume_id = Column(Integer, ForeignKey("resume.id"), nullable=True)
    uid = Column(Integer, ForeignKey("user.id"))
    __table_args__ = (UniqueConstraint('job_id', 'uid', name='_job_id_uid'),
                     )
    job = relationship("JobORM")
    resume = relationship("ResumeORM")
    applicationEvents = relationship("ApplicationEventORM")

class ApplicationEventORM(Base):
    __tablename__ = "applicationEvent"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    date = Column(DateTime, nullable=False)
    status = Column(Integer, nullable=False)
    applicationBaseId = Column(Integer, ForeignKey("applicationBase.id"))
    stage_id = Column(Integer, ForeignKey("stage.id"))
    stage = relationship("StageORM")

class ApplicationBaseModel(BaseModel):
    id: Optional[int]
    job_id: Optional[int]
    uid: Optional[int]
    resume_id: Optional[int]
    resume: Optional[ResumeModel]
    applicationEvents: Optional[List[ApplicationEventModel]]
    token: Optional[str]
    key: Optional[int]
    job: Optional[JobModel]

    class Config:
        orm_mode = True


class PresetORM(Base):
    __tablename__ = "preset"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(32), nullable=False)
    uid = Column(Integer, ForeignKey("user.id"))

class PresetModel(BaseModel):
    id: Optional[int]
    name = str
    uid: Optional[int]

    class Config:
        orm_mode = True

class PresetitemORM(Base):
    __tablename__ = "presetitem"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    preset_id = Column(Integer, ForeignKey("preset.id"))
    group_id = Column(Integer, ForeignKey("group.id"))
    uid = Column(Integer, ForeignKey("user.id"))

class PresetitemModel(BaseModel):
    id: Optional[int]
    preset_id: Optional[int]
    group_id: Optional[int]
    uid: Optional[int]
    
    class Config:
        orm_mode = True


# Composite data types

class NewUserReturn(BaseModel):
    user: UserModel
    token: TokenModel

class LoginData(BaseModel):
    email: str
    password: str

# Misc. data types

# Provide an integer ID and a user token. 
class AuthIntModel(BaseModel):
    val: int
    token: str

class ApplicationDataModel(BaseModel):
    applicationData: List[ApplicationBaseModel]
    stages: List[StageModel]