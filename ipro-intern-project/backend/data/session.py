from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import data_types
import datetime
import random

class Session:
    def __init__(self):
        self.engine = create_engine("sqlite:///example2.db")
        self.orm_parent_session = sessionmaker(bind=self.engine)
        data_types.metadata.create_all(self.engine)

    def demo(self):
        orm_session = self.orm_parent_session()

        user = data_types.UserORM(
            id=random.randint(1, 100000),
            fname=f"John{random.randint(1,1000)}",
            lname="Smith",
            salt="hunter2",
            hashed="hunter3",
            email=f"jsmith@earthlink.net{random.randint(1,1000)}",
            pic="/var/www/images/image.png",
            graddate=datetime.date(year=2020, month=4, day=20),
            city="Chicago",
            state="IL"
        )

        # print(user)
        orm_session.add(user)
        orm_session.commit()

        user_model = data_types.UserModel.from_orm(user)
        # print(user_model)


s = Session()
s.demo()