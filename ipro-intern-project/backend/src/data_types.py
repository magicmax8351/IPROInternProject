from typing import List
from sqlalchemy import Column, Integer, String, Date, ForeignKey, MetaData, DateTime, Date
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel, constr
import datetime

# See https://docs.sqlalchemy.org/en/13/orm/basic_relationships.html
# for more information.

Base = declarative_base()
metadata = MetaData()

class IntegerModel(BaseModel):
    i: int

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
    groups = relationship("GroupORM")
    applications = relationship("ApplicationORM")
    presets = relationship("PresetORM")
    tokens = relationship("TokenORM")

class UserModel(BaseModel):
    class Config:
        orm_mode = True

    id: int
    fname: str
    lname: str
    salt: str
    hashed: str
    email: str
    pic: str
    graddate: datetime.date
    city: str
    state: str

class ResumeORM(Base):
    __tablename__ = "resume"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(32), nullable=False)
    filename = Column(String(32), nullable=True)
    date = Column(DateTime)
    user_id = Column(Integer, ForeignKey("user.id"))

class ResumeModel(BaseModel):
    class Config:
        orm_mode = True
    id: int
    name: str
    filename: str
    date: datetime.datetime

class StageORM(Base):
    __tablename__ = "stage"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    name: Column(String(32), nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"))

class StageModel(BaseModel):
    class Config:
        orm_mode = True
    name: str
    # [user id relationship model] 

class TokenORM(Base):
    __tablename__ = "token"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    val = Column(String(128), nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"))

class TokenModel(BaseModel):
    class Config:
        orm_mode = True
    val: str

class SettingsORM(Base):
    __tablename__ = "settings"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    visibility = Column(String(32), nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"))

class SettingsModel(BaseModel):
    class Config:
        orm_mode = True
    id: int
    visibility: str

class GroupORM(Base):
    __tablename__ = "group"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(32), nullable=False)
    icon = Column(String(32), nullable=False) 
    desc = Column(String(256), nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"))

class GroupModel(BaseModel):
    class Config:
        orm_mode = True
    id: int
    name: str
    icon: str
    desc: str

class MembershipORM(Base):
    __tablename__ = "membership"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"))
    group_id = Column(Integer, ForeignKey("group.id"))
    permission = Column(Integer)

class MembershipModel(BaseModel):
    class Config:
        orm_mode = True
    id: int
    permission: int
    # [group id relationship model]
    # # [user id relationship model]  

class PostORM(Base):
    __tablename__ = "post"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    subject = Column(String(32), nullable=False)
    body = Column(String(32), nullable=False)
    timestamp = Column(DateTime)
    job_id = Column(Integer, ForeignKey("job.id"))
    user_id = Column(Integer, ForeignKey("user.id"))
    group_id = Column(Integer, ForeignKey("group.id"))

class PostModel(BaseModel):
    class Config:
        orm_mode = True
    id: int
    subject: str
    body: str
    # tags: List[TagModel]

    timestamp: datetime.datetime
    job_id: int
    # [user id relationship model] 
    group_id: int

class CommentORM(Base):
    __tablename__ = "comment"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    text = Column(String(32), nullable=False)
    timestamp =  Column(DateTime)
    post_id = Column(Integer, ForeignKey("post.id"))
    user_id = Column(Integer, ForeignKey("user.id"))
    parent_id = Column(Integer, ForeignKey("comment.id"))

class CommentModel(BaseModel):
    class Config:
        orm_mode = True

class CompanyORM(Base):
    __tablename__ = "company"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(32), nullable=False)

class CompanyModel(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

class JobORM(Base):
    __tablename__ = "job"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(32), nullable=False)
    location = Column(String(32), nullable=False)
    company_id = Column(Integer, ForeignKey("company.id"))

class JobModel(BaseModel):
    id: int
    name: str
    location: str
    company_id: int

    class Config:
        orm_mode = True

class JobtagORM(Base):
    __tablename__ = "jobtag"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    tag = Column(String(32), nullable=False)
    job_id = Column(Integer, ForeignKey("job.id"))

class JobtagModel(BaseModel):
    id: int
    tag: str
    job_id: int

    class Config:
        orm_mode = True

class ApplicationORM(Base):
    __tablename__ = "application"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    date = Column(DateTime, nullable=False)
    job_id = Column(Integer, ForeignKey("job.id"))
    stage_id = Column(Integer, ForeignKey("stage.id"))
    user_id = Column(Integer, ForeignKey("user.id"))
    resume_id = Column(Integer, ForeignKey("resume.id"))

class ApplicationModel(BaseModel):
    id: int
    date: datetime.date
    job_id: int
    stage_id: int
    user_id: int
    resume_id: int

    class Config:
        orm_mode = True

class PresetORM(Base):
    __tablename__ = "preset"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(32), nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"))

class PresetModel(BaseModel):
    id: int
    name = str
    user_id: int

    class Config:
        orm_mode = True

class PresetitemORM(Base):
    __tablename__ = "presetitem"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    preset_id = Column(Integer, ForeignKey("preset.id"))
    group_id = Column(Integer, ForeignKey("group.id"))
    user_id = Column(Integer, ForeignKey("user.id"))

class PresetitemModel(BaseModel):
    id: int
    preset_id: int
    group_id: int
    user_id: int
    
    class Config:
        orm_mode = True
