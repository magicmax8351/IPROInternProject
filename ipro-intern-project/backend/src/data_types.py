from typing import List, Optional
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
    user_id = Column(Integer, ForeignKey("user.id"))

class ResumeModel(BaseModel):
    class Config:
        orm_mode = True
    id: Optional[int]
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
    id: Optional[int]
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
    id: Optional[int]
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
    id: Optional[int]
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
    id: Optional[int]
    subject: str
    body: str
    # tags: List[TagModel]

    timestamp: Optional[datetime.datetime]
    job_id: Optional[int]
    user_id: Optional[int]
    group_id: Optional[int]

class CommentORM(Base):
    __tablename__ = "comment"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    text = Column(String(32), nullable=False)
    timestamp =  Column(DateTime)
    post_id = Column(Integer, ForeignKey("post.id"))
    user_id = Column(Integer, ForeignKey("user.id"))

class CommentModel(BaseModel):
    class Config:
        orm_mode = True
    id: Optional[int]
    text: Optional[str]
    timestamp: Optional[datetime.datetime]
    post_id: int
    user_id: int

class CompanyORM(Base):
    __tablename__ = "company"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(32), nullable=False)

class CompanyModel(BaseModel):
    id: Optional[int]
    name: str

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

class JobModel(BaseModel):
    id: Optional[int]
    name: str
    location: str
    description: str
    company_id: Optional[int]
    company: Optional[CompanyModel]

    class Config:
        orm_mode = True

class JobtagORM(Base):
    __tablename__ = "jobtag"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    tag = Column(String(32), nullable=False)
    job_id = Column(Integer, ForeignKey("job.id"))

class JobtagModel(BaseModel):
    id: Optional[int]
    tag: str
    job_id: Optional[int]

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
    id: Optional[int]
    date: datetime.date
    job_id: Optional[int]
    stage_id: Optional[int]
    user_id: Optional[int]
    resume_id: Optional[int]

    class Config:
        orm_mode = True

class PresetORM(Base):
    __tablename__ = "preset"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(32), nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"))

class PresetModel(BaseModel):
    id: Optional[int]
    name = str
    user_id: Optional[int]

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
    id: Optional[int]
    preset_id: Optional[int]
    group_id: Optional[int]
    user_id: Optional[int]
    
    class Config:
        orm_mode = True


# Composite data types

class NewUserReturn(BaseModel):
    user: UserModel
    token: TokenModel

