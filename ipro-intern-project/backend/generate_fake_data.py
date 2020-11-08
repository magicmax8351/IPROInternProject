from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from src.data_types import *
import datetime

def gen_fake_data():
    # initialize
    engine = create_engine("sqlite:///test_db.db")
    orm_parent_session = sessionmaker(bind=engine)
    metadata.create_all(engine)
    s = orm_parent_session()

    # Add a single user
    user = UserORM(
        id=0,
        fname="John",
        lname="Smith",
        salt="hunter2",
        hashed="hunter3",
        email=f"jsmith@earthlink.net",
        pic="/var/www/images/image.png",
        graddate=datetime.date(year=2020, month=9, day=9),
        city="Chicago",
        state="IL"
    )
    s.add(user)
    s.commit()
    print("Added sample user to DB")

    # Add some companies
    companies = []
    companies.append(CompanyORM(id=0, name="Google"))
    companies.append(CompanyORM(id=1, name="JPMorgan Chase"))
    companies.append(CompanyORM(id=2, name="Uber"))
    companies.append(CompanyORM(id=3, name="Citadel"))
    companies.append(CompanyORM(id=4, name="Boeing"))

    for c in companies:
        s.add(c)
    s.commit()
    print("Added sample companies to DB")

    # Add some jobs
    jobs = []
    jobs.append(JobORM(id=0, name="Machine Learning Sales Specialist", location="Sunnyvale, CA", company_id=0))
    jobs.append(JobORM(id=1, name="Research Intern", location="Mountain View, CA", company_id=0))
    jobs.append(JobORM(id=2, name="Junior Software Developer", location="Chicago, IL", company_id=1))
    jobs.append(JobORM(id=3, name="Product Manager", location="New York, NY", company_id=1))
    jobs.append(JobORM(id=4, name="Android Developer", location="San Franscisco, CA", company_id=2))
    jobs.append(JobORM(id=5, name="User Interface Designer", location="San Franscisco, CA", company_id=2))
    jobs.append(JobORM(id=6, name="Quantitative Researcher", location="Chicago, IL", company_id=3))
    jobs.append(JobORM(id=7, name="Trader", location="Chicago, IL", company_id=3))
    jobs.append(JobORM(id=8, name="Software Engineer", location="St. Louis, MO", company_id=4))
    jobs.append(JobORM(id=9, name="Database Administrator", location="Chicago, IL", company_id=4))

    for j in jobs:
        s.add(j)
    s.commit()
    print("Added sample jobs to DB")

    # Add some groups
    groups = []
    groups.append(GroupORM(id=0, name="ACM @ IIT", icon="/var/www/images/acm_logo.png", desc="Advancing Computing as a Science & Profession", user_id=0))
    groups.append(GroupORM(id=1, name="AEPKS", icon="/var/www/images/pks_logo.png", desc="Men of Honor", user_id=0))

    for g in groups:
        s.add(g)
    s.commit()
    print("Added sample groups to DB")

if __name__ == "__main__":
    print("Generating sample data...")
    gen_fake_data()