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

