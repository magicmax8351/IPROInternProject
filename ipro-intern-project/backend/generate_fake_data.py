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
    os.remove("test_db.db")

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

    fake_job_titles = [
    "Machine Learning Sales Specialist", "Research Intern",
    "Junior Software Developer", "Android Developer", "Product Manager",
    "UI Designer", "Quant Researcher", "Trader", "Software Engineer", "DBA"
    ]

    fake_locations = [
        "Sunnyvale, CA", "Mountain View, CA", "Chicago, IL", "New York, NY",
        "St. Louis, MO"
    ]

    word_list = """
    About Akuna:

    Akuna Capital is a young and booming trading firm with a strong focus on cutting-edge technology, data driven decisions and automation. Our core competency is providing liquidity as an options market maker – meaning we provide competitive quotes that we are willing to both buy and sell. To do this successfully we design and implement our own low latency technologies, trading strategies and mathematical models.

    Our Founding Partners, including Akuna’s CEO Andrew Killion, first conceptualized Akuna in their hometown of Sydney. They opened the firm’s first office in 2011 in the heart of the derivatives industry and the options capital of the world – Chicago. Today, Akuna is proud to operate from additional offices in Sydney, Shanghai, and Boston.

    What you’ll do as a Development Intern on the C++ Team at Akuna:

    We are seeking Development Interns to join our innovative and growing technology team for our 10-week Akunacademy summer internship program. In this role you will work alongside our trading and software teams to design and implement elegant solutions to complex and interesting problems. 

    Development Interns at Akuna have the opportunity to use cutting-edge technology while working on high performance/low latency systems.  We offer a team-based approach to trading and software engineering, believing that productive integration of the two groups is vital for success in this industry.  Akuna loves Development interns who are self-starters and have the ability to problem solve and think outside of the box. We value innovation and hard work, and want you to make an impact in the firm. Whether you are interested in trading infrastructure, algorithms, models, exchange gateways, performance engineering, hardware, data capture and analysis, or front-end user interfaces, there’s work to be done. If you are excited to jump in and make a difference, Akuna could be the place for you. 

    The C++ teams work on applications where C++ is used for computational heavy-lifting and for applications that have timing-critical, low-latency processes such as trading strategies. C++ provides the flexibility and low-level control that our developers need to get maximum performance out of multi-core, super-scalar processors. No previous experience in finance or trading is required. Training and continuous education is provided for all engineers to ensure they have the skills and knowledge needed to be successful.        
    """
    
    # Add some groups
    groups = []
    groups.append(
        GroupORM(name="ACM @ IIT",
                 icon="/var/www/images/acm_logo.png",
                 desc="Advancing Computing as a Science & Profession"))
    groups.append(
        GroupORM(name="AEPKS",
                 icon="/var/www/images/pks_logo.png",
                 desc="Men of Honor"))
    groups.append(
        GroupORM(name="Tesla Fan Club",
                 icon="/var/www/images/pks_logo.png",
                 desc="I love Elon's Musk"))

    # Randomly generate a heck ton of groups:

    for i in range(3):
        groups.append(
            GroupORM(
                name=lipsum.paragraph(
                    nb_sentences=1,
                    variable_nb_sentences=False,
                    ext_word_list=word_list.split())[:4],
                icon="/fake/image.png",
                desc=lipsum.paragraph(
                    nb_sentences=1,
                    variable_nb_sentences=False,
                    ext_word_list=word_list.split())[:8]
            )
        )
        
    for g in groups:
        s.add(g)
    s.commit()

    icons = [
        "/profile_pictures/p1.svg",
        "/profile_pictures/p2.svg",
        "/profile_pictures/p4.svg"
    ]
    users = []
    users.append(
        UserModel(
            fname="admin",
            lname="admin",
            password="admin",
            email="admin",
            pic=random.choice(icons),
            graddate=datetime.date(year=2020, month=9, day=9),
            city="Chicago",
            state="IL"
        )
    )
    for x in range(3):
        users.append(
            UserModel(fname=fake.first_name(),
                    lname=fake.last_name(),
                    password=fake.last_name(),
                    email=email.ascii_free_email(),
                    pic=random.choice(icons),
                    graddate=datetime.date(year=2020, month=9, day=9),
                    city="Chicago",
                    state="IL"))
    
    [add_user(user) for user in users]

    adminUser = get_user(1)

    print("Added sample users to DB")

    def uid():
        return random.choice(s.query(UserORM).all()).id

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
        return random.choice(s.query(CompanyORM).all()).id

    # Add some jobs


    fake_job_urls = ['https://myjob.me', 'https://ilovemartainshray.jobs', 'https://microsoft.gov']
    jobs = []
    for i in range(10):
        jobs.append(
            JobORM(
                name=random.choice(fake_job_titles),
                location=random.choice(fake_locations),
                company_id=comp_id(),
                description=lipsum.paragraph(
                    nb_sentences=15,
                    variable_nb_sentences=False,
                    ext_word_list=word_list.split()),
                link=random.choice(fake_job_urls)))

    s.add_all(jobs)
    s.commit()
    print("Added sample jobs to DB")

    # Adding group membership

    membership = []
    for user in users:
        for group in groups:
            if random.randint(0, 2) == 1:
                membership.append(
                    MembershipORM(
                        uid=user.id,
                        group_id=group.id,
                        permission=random.randint(0, 3)
                    )
                )

    for m in membership:
        s.add(m)

    s.commit()
    print("Added membership to DB")


    def g_id():
        return random.choice(s.query(GroupORM).all()).id

    # Add some posts

    linkedin_shill_txt = """
October marked my last month at Yelp. The past two years have been an incredible learning experience, and I could not be more thankful for all the training and guidance Yelp gave me as I began my professional career. I would specifically like to thank Emma Boelter, Samantha Hills, Sami Jurofsky, Darren Harris, Hunter Pawloff, and Liz Feinstein for their leadership, fostering a magnificent office culture, and developing my sales skills. I will forever remember my time at Yelp fondly.

That said, as one door closes, another one opens.

I am excited to announce I will be moving to Park City, Utah to work as a luxury winter intern at The St. Regis Deer Valley. At The St. Regis, I will be learning the ins-and-outs of the luxury hospitality industry while continuing my graduate education. Especially during these challenging times, I am so grateful Marriott International took a chance on me and gave me this opportunity. If anyone in my network goes skiing out west this winter, let me know!"""

    posts = []
    for i in range(100):
        posts.append(
            PostORM(
                body=lipsum.paragraph(
                    nb_sentences=5,
                    variable_nb_sentences=False,
                    ext_word_list=linkedin_shill_txt.split()
                ),
                timestamp=datetime.datetime.now(),
                job_id=random.choice(jobs).id,
                uid=uid(),
                group_id=g_id()))

    for post in posts:
        s.add(post)

    s.commit()

    def post_id():
        return random.choice(s.query(PostORM).all()).id

    comments = []
    for i in range(10):
        comments.append(
            CommentORM(text=lipsum.paragraph(
                nb_sentences=2,
                variable_nb_sentences=False,
                ext_word_list=linkedin_shill_txt.split()),
            timestamp=datetime.datetime.now(),
            post_id=post_id(),
            uid=uid()))
    for c in comments:
        s.add(c)
    s.commit()
    print("Added comments to DB!")

    # Adding fake stages to the database

    stages = [] 
    for stage in ["Applied", "Round 1", "Round 2", "Round 3", "Offer"]:
        stages.append(StageORM(name=stage))

    s.add_all(stages)
    s.commit()
    
    # Adding a fake resume to the admin user


    admin_resume = ResumeORM(
        name="admin_resume",
        filename="/var/www/resume.pdf",
        date=datetime.datetime.now(),
        uid=adminUser.id
    )

    s.add(admin_resume)
    s.commit()
    
    application_base_list = []
    for job in jobs:
        if(random.randint(0, 2) == 1):
            application_base_list.append(
                ApplicationBaseORM(
                    job_id = job.id,
                    resume_id = admin_resume.id,
                    uid = adminUser.id
                )
            )

    s.add_all(application_base_list)
    s.commit()

    application_event = []
    for app in application_base_list:
        for stage in stages:
            application_event.append(
                ApplicationEventORM(
                    date=datetime.datetime.now(),
                    applicationBaseId=app.id,
                    stage_id=stage.id,
                    status=(random.randint(0,2))
                )
            )

    s.add_all(application_event)
    s.commit()


    print("Adding some tags...")

    tags = []
    for word in set(word_list.split()):
        tags.append(TagORM(tag=word))
    
    s.add_all(tags)
    s.commit()
    jobtags = []

    for job in jobs:
        for tag in tags:
            if(random.randint(0, 10) == 5):
                jobtags.append(JobTagORM(
                    job_id=job.id,
                    tag_id=tag.id
                ))
                
    
    s.add_all(jobtags)
    s.commit()




if __name__ == "__main__":
    print("Generating sample data...")
    gen_fake_data()
