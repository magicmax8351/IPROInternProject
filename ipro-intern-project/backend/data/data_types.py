from typing import List
from sqlalchemy import Column, Integer, String, Date
from sqlalchemy import MetaData
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel, constr
import datetime

# See https://docs.sqlalchemy.org/en/13/orm/basic_relationships.html
# for more information.

Base = declarative_base()
metadata = MetaData()

class UserORM(Base):
    __tablename__ = 'user'
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

class UserModel(BaseModel):
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

    class Config:
        orm_mode = True

class ResumeORM(Base):
    __tablename__ = "resume"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)

class ResumeModel(BaseModel):
    class Config:
        orm_mode = True

class StageORM(Base):
    __tablename__ = "stage"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)

class StageModel(BaseModel):
    class Config:
        orm_mode = True

class TokenORM(Base):
    __tablename__ = "token"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)

class TokenModel(BaseModel):
    class Config:
        orm_mode = True

class SettingsORM(Base):
    __tablename__ = "settings"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)

class SettingsModel(BaseModel):
    class Config:
        orm_mode = True

class GroupORM(Base):
    __tablename__ = "group"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)

class GroupModel(BaseModel):
    class Config:
        orm_mode = True

class MembershipORM(Base):
    __tablename__ = "membership"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)

class MembershipModel(BaseModel):
    class Config:
        orm_mode = True

class PostORM(Base):
    __tablename__ = "post"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)

class PostModel(BaseModel):
    class Config:
        orm_mode = True

class CommentORM(Base):
    __tablename__ = "comment"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)

class CommentModel(BaseModel):
    class Config:
        orm_mode = True

# justin do above 
#############################
# hunter do below 

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
    company_id = Column(Integer, nullable=False)

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
    tag = column(String(32), nullable=False)
    job_id = Column(Integer, nullable=False)

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
    date = Column(Datetime.Date, nullable=False)
    job_id = Column(Integer, nullable=False)
    stage_id = Column(Integer, nullable=False)
    user_id = Column(Integer, nullable=False)
    resume_id = Column(Integer, nullable=False)

class ApplicationModel(BaseModel):
    id: int
    date: Datetime.Date
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
    user_id = Column(Integer, nullable=False)

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
    preset_id = Column(Integer, nullable=False)
    group_id = Column(Integer, nullable=False)
    user_id = Column(Integer, nullable=False)

class PresetitemModel(BaseModel):
    id: int
    preset_id: int
    group_id: int
    user_id: int
    
    class Config:
        orm_mode = True
