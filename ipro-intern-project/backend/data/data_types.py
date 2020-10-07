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

class ResumeModel(BaseModel):
    class Config:
        orm_mode = True

class StageORM(Base):
    __tablename__ = "stage"

class StageModel(BaseModel):
    class Config:
        orm_mode = True

class TokenORM(Base):
    __tablename__ = "token"

class TokenModel(BaseModel):
    class Config:
        orm_mode = True

class SettingsORM(Base):
    __tablename__ = "settings"

class SettingsModel(BaseModel):
    class Config:
        orm_mode = True

class GroupORM(Base):
    __tablename__ = "group"

class GroupModel(BaseModel):
    class Config:
        orm_mode = True

class MembershipORM(Base):
    __tablename__ = "membership"

class MembershipModel(BaseModel):
    class Config:
        orm_mode = True

class PostORM(Base):
    __tablename__ = "post"

class PostModel(BaseModel):
    class Config:
        orm_mode = True

class CommentORM(Base):
    __tablename__ = "comment"

class CommentModel(BaseModel):
    class Config:
        orm_mode = True

# justin do above 
#############################
# hunter do below 

class CompanyORM(Base):
    __tablename__ = "company"

class CompanyModel(BaseModel):
    class Config:
        orm_mode = True

class JobORM(Base):
    __tablename__ = "job"

class JobModel(BaseModel):
    class Config:
        orm_mode = True

class JobtagORM(Base):
    __tablename__ = "jobtag"

class JobtagModel(BaseModel):
    class Config:
        orm_mode = True

class ApplicationORM(Base):
    __tablename__ = "application"

class ApplicationModel(BaseModel):
    class Config:
        orm_mode = True

class PresetORM(Base):
    __tablename__ = "preset"

class PresetModel(BaseModel):
    class Config:
        orm_mode = True

class PresetitemORM(Base):
    __tablename__ = "presetitem"

class PresetitemModel(BaseModel):
    class Config:
        orm_mode = True
