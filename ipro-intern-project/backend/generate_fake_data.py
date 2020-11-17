from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from src.data_types import *
import datetime
from main import *
import faker
import random
import os

def gen_fake_data():
    # initialize
    engine = create_engine("sqlite:///test_db.db")
    orm_parent_session = sessionmaker(bind=engine)
    metadata.create_all(engine)
    s = orm_parent_session()

    # Add a bunch of users

    fake = faker.Faker()
    fake.seed_instance(random.randint(1, 999999))
    faker.random = random

    nameFaker = faker.providers.person.Provider(fake)
    email = faker.providers.internet.Provider(fake)
    lipsum = faker.providers.lorem.Provider(fake)
    
    users = []
    for x in range(100):
        users.append(UserORM(
            fname=fake.first_name(),
            lname=fake.last_name(),
            salt="hunter2",
            hashed="hunter3",
            email=email.ascii_free_email(),
            pic="/var/www/images/image.png",
            graddate=datetime.date(year=2020, month=9, day=9),
            city="Chicago",
            state="IL"
        ))
    
    s.add_all(users)

    s.commit()
    print("Added sample users to DB")

    def user_id():
        return random.choice(s.query(data_types.UserORM).all()).id

    # Add some companies
    companies = []
    companies.append(CompanyORM(name="Google"))
    companies.append(CompanyORM(name="JPMorgan Chase"))
    companies.append(CompanyORM(name="Uber"))
    companies.append(CompanyORM(name="Citadel"))
    companies.append(CompanyORM(name="Boeing"))

    for c in companies:
        s.add(c)
    s.commit()
    print("Added sample companies to DB")

    def comp_id():
        return random.choice(s.query(data_types.CompanyORM).all()).id

    # Add some jobs

    fake_job_titles = ["Machine Learning Sales Specialist", "Research Intern", "Junior Software Developer",
                        "Android Developer", "Product Manager", "UI Designer", "Quant Researcher", 
                        "Trader", "Software Engineer", "DBA"]

    fake_locations = ["Sunnyvale, CA", "Mountain View, CA", "Chicago, IL", "New York, NY", "St. Louis, MO"]

    jobs = []
    for i in range(10):
        jobs.append(JobORM(
            name=random.choice(fake_job_titles),
            location=random.choice(fake_locations),
            company_id=comp_id(),
            description=lipsum.paragraph(nb_sentences=15, variable_nb_sentences=False, ext_word_list="the crazy brown dog jumped over the fence".split())
        ))

    s.add_all(jobs)
    s.commit()
    print("Added sample jobs to DB")

    # Add some groups
    groups = []
    groups.append(GroupORM(name="ACM @ IIT", icon="/var/www/images/acm_logo.png", desc="Advancing Computing as a Science & Profession"))
    groups.append(GroupORM(name="AEPKS", icon="/var/www/images/pks_logo.png", desc="Men of Honor"))
    groups.append(GroupORM(name="Tesla Fan Club", icon="/var/www/images/pks_logo.png", desc="I love Elon's Musk"))

    for g in groups:
        s.add(g)
    s.commit()
    print("Added sample groups to DB")


    def g_id():
        return random.choice(s.query(data_types.GroupORM).all()).id

    # Add some posts

    posts = []
    for i in range(100):
        posts.append(PostORM(
            subject = lipsum.paragraph(nb_sentences=2, variable_nb_sentences=False, ext_word_list="the crazy brown dog jumped over the fence".split()),
            body = lipsum.paragraph(nb_sentences=5, variable_nb_sentences=False, ext_word_list="the crazy brown dog jumped over the fence".split()),
            timestamp = datetime.datetime.now(),
            job_id = random.choice(jobs).id,
            user_id = user_id(),
            group_id = g_id()
        ))

    for post in posts:
        s.add(post)
    
    s.commit()

    def post_id():
        return random.choice(s.query(data_types.PostORM).all()).id

    comments = []
    for i in range(1000):
        comments.append(CommentORM(
            text = lipsum.paragraph(nb_sentences=2, variable_nb_sentences=False, ext_word_list="the crazy brown dog jumped over the fence".split()),
            timestamp = datetime.datetime.now(),
            post_id = post_id(),
            user_id = user_id()
        ))
    for c in comments:
        s.add(c)
    s.commit()
    print("Added to DB!")    

if __name__ == "__main__":
    print("Generating sample data...")
    gen_fake_data()

