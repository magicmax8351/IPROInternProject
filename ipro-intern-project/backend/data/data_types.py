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
    date = datetime.datetime
    [user id relationship] 

class ResumeModel(BaseModel):
    class Config:
        orm_mode = True
    id: int
    name: str
    filename: str
    date: datetime.datetime
    [user id relationship model] 

class StageORM(Base):
    __tablename__ = "stage"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    name: Column(String(32), nullable=False)
    [user id relationship] 

class StageModel(BaseModel):
    class Config:
        orm_mode = True
    name: str
    [user id relationship model]

class TokenORM(Base):
    __tablename__ = "token"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    val = Column(String(128), nullable=False)
    [user id relationship]

class TokenModel(BaseModel):
    class Config:
        orm_mode = True
    val: str
    [user id relationship model]


class SettingsORM(Base):
    __tablename__ = "settings"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    visibility = Column(String(32), nullable=False)
    [user id relationship]

class SettingsModel(BaseModel):
    class Config:
        orm_mode = True
    id: int
    visibility: str
    [user id relationship model]

class GroupORM(Base):
    __tablename__ = "group"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(32), nullable=False)
    icon = Column(String(32), nullable=False) 
    desc = Column(String(256), nullable=False)

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
    permission = Column(Integer)
    [group id relationship]
    [user id relationship]

class MembershipModel(BaseModel):
    class Config:
        orm_mode = True
    id: int
    permission: int
    [group id relationship model]
    [user id relationship model] 

class PostORM(Base):
    __tablename__ = "post"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    subject: strcolumn
    body: strcolumn
    timestamp: datetime.datetime
    [job id relationship]
    [user id relationship]
    [group id relationship] 
    # Tags are a relatinshop 

class PostModel(BaseModel):
    class Config:
        orm_mode = True
    id: int
    subject: str
    body: str
    tags: List[TagModel]

    timestamp: datetime.datetime
    [job id relationship model]
    [user id relationship model]
    [group id relationship model]

class CommentORM(Base):
    __tablename__ = "comment"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    text: strcolumn
    timestamp: datetime.datetime
    [post id relationship]
    [user id relationship]
    [comment parent relationship]

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

class CompanyModel(BaseModel):
    class Config:
        orm_mode = True

class JobORM(Base):
    __tablename__ = "job"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)

class JobModel(BaseModel):
    class Config:
        orm_mode = True

class JobtagORM(Base):
    __tablename__ = "jobtag"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)

class JobtagModel(BaseModel):
    class Config:
        orm_mode = True

class ApplicationORM(Base):
    __tablename__ = "application"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)

class ApplicationModel(BaseModel):
    class Config:
        orm_mode = True

class PresetORM(Base):
    __tablename__ = "preset"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)

class PresetModel(BaseModel):
    class Config:
        orm_mode = True

class PresetitemORM(Base):
    __tablename__ = "presetitem"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)

class PresetitemModel(BaseModel):
    class Config:
        orm_mode = True
