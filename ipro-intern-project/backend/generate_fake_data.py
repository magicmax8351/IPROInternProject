from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from src.data_types import *
import datetime
from main import *
import faker
import random
import os
from sqlalchemy.exc import IntegrityError


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

    icons = [
        "/profile_pictures/p3.jpg",
        "/profile_pictures/p5.jpg",
        "/profile_pictures/p6.jpg",
        "/profile_pictures/p7.jpg",
        "/profile_pictures/p8.jpg",
        "/profile_pictures/p9.jpg",
        "/profile_pictures/p10.jpg",
        "/profile_pictures/p11.jpg",
        "/profile_pictures/p12.jpg",
        "/profile_pictures/p13.jpg",
        "/profile_pictures/p14.jpg",
        "/profile_pictures/p15.jpg",
        "/profile_pictures/p16.jpg",
        "/profile_pictures/p17.jpg",
    ]
    users = []
    users.append(
        UserModel(
            fname="Steven",
            lname="Traversa",
            password="admin",
            email="admin",
            pic=random.choice(icons),
            graddate=datetime.date(year=2020, month=9, day=9),
            city="Chicago",
            state="IL"
        )
    )
    used_emails = set()

    for x in range(50):
        usr_email = email.ascii_free_email()
        if usr_email in used_emails:
            continue
        used_emails.add(usr_email)

        users.append(
            UserModel(fname=fake.first_name(),
                      lname=fake.last_name(),
                      password=fake.last_name(),
                      email=usr_email,
                      pic=random.choice(icons),
                      graddate=datetime.date(year=2020, month=9, day=9),
                      city="Chicago",
                      state="IL"))

    added_users = [add_user(user) for user in users]

    adminUser = get_user(1)

    token = login_user(LoginData(
        email="admin",
        password="admin"
    )).token.val

    # Add some groups
    groups = []

    extraGroupImages = [
        "/group_pictures/acm.jfif",
        "/group_pictures/2021.jpg",
        "/group_pictures/chicago.jpg",
        "/group_pictures/suburb.jpg",
        "/group_pictures/faang.jpg",
        "/group_pictures/startup.png",
        "/group_pictures/cats.jpg",
        "/group_pictures/buildings.jpg"
    ]

    groups.append(
        GroupModel(name="ACM @ IIT",
                   background="/group_pictures/mies_campus.jpg",
                   desc="Advancing Computing as a Science & Profession",
                   privacy=0))
    groups.append(
        GroupModel(name="AEPKS",
                   background="/group_pictures/aepks.jpg",
                   desc="Men of Honor",
                   privacy=0))
    groups.append(
        GroupModel(name="Tesla Fan Club",
                   background="/group_pictures/musk.jpg",
                   desc="I love Elon's Musk",
                   privacy=0))

    # Randomly generate a heck ton of groups:

    extraGroupNames = [
        "ACM Nationals",
        "IIT Class of 2021",
        "CS Chicago",
        "CS Chicago Suburbs",
        "FAANG Fan Club",
        "Startup Finder",
        "Look, We Like Cats",
        "Rust-Belt Nerds"
    ]

    for (name, img) in zip(extraGroupNames, extraGroupImages):
        groups.append(
            GroupModel(
                name=name,
                icon="/fake/image.png",
                desc=lipsum.paragraph(
                    nb_sentences=8,
                    variable_nb_sentences=False,
                    ext_word_list=word_list.split())[:256],
                privacy=0,
                background=img
            )
        )

    added_groups = []
    memberships = []
    for g in groups:
        new_group = add_group(g, token)
        for user in added_users:
            if (random.randint(0, 2) == 1):
                try:
                    join_group(new_group.link, user.token.val)
                except Exception as e:
                    pass
        added_groups.append(new_group)
        # groupMembershipObject = s.query(GroupMembershipORM).filter(GroupMembershipORM.group_id == new_group.id).one()
        # for user in added_users:
        #     if(random.randint(0, 2) == 1):
        #         memberships.append(MembershipORM(
        #             group_membership_id = groupMembershipObject.id,
        #             uid=user.user.id
        #         ))
    # s.add_all(memberships)

    print("Added sample users to DB")

    def uid():
        return random.choice(s.query(UserORM).all()).id

    # Add some companies
    companies = []
    companies.append(CompanyORM(name="Google", logoFile="google_logo.jpg"))
    companies.append(CompanyORM(
        name="JPMorgan Chase", logoFile="chase_logo.jpg"))
    companies.append(CompanyORM(name="Uber", logoFile="uber_logo.jfif"))
    companies.append(CompanyORM(name="Citadel", logoFile="citadel_logo.jfif"))
    companies.append(CompanyORM(name="Boeing", logoFile="boeing_logo.jfif"))

    for c in companies:
        s.add(c)
    s.commit()
    print("Added sample companies to DB")

    def comp_id():
        return random.choice(s.query(CompanyORM).all()).id

    # Add some jobs

    fake_job_urls = ["https://www.coinbase.com/careers/positions/1724688?gh_jid=1724688",
                     "https://www.job.com/job/marketing-director-in-chicago-il/47904624"]

    job_descriptions = ["""The Engineering Development Solutions team is accountable for creating and supporting the ongoing improvement of infrastructure delivery management capabilities through application development, data management, and process automation. As a Python Developer, you will work to rapidly and effectively develop solutions through code that add real value for our organization. This position will focus on development of internal tools related to our continuous integration infrastructure in support of our development team. """,
                        """Blend helps lenders maximize their digital agility. Our digital lending platform is used by Wells Fargo, U.S. Bank, and other leading financial institutions to increase customer acquisition, improve productivity, and accelerate the delivery of any banking product across every channel. We process more than $3.5 billion in mortgages and consumer loans daily, helping millions of consumers get into homes and gain access to the capital they need to lead better lives.

Blend is growing our Customer Support team in Chicago! We're looking for someone who has a proven track record of delivering high quality technical support to our customer base. As a Support team member, y ou'll be the voice of the company, creating a top-notch experience to ensure our customer are utilizing our product effectively.

As part of the team, you’ll have the opportunity to grow your career, contribute your ideas and make a huge impact on the success of our product and company.

Blend views the support team as a significant investment and to make you are set-up for success, Blend will host you at our HQ in San Francisco for the first 2-3 weeks for on-boarding and training with the team.""",
                        """The individual will work on feature enhancements, performance improvements, bug fixes and troubleshooting production issues, with a broad range of Clearing and risk applications.

The candidate must be self-motivated and eager to learn new technologies. He/she will need good analytical skills and will have opportunity to work with the end users directly to come up

with creative and practical technology solution for different business problems. He/she will be mentored by other Lead developers."""]
    jobs = []
    for i in range(100):
        jobs.append(
            JobORM(
                name=random.choice(fake_job_titles),
                location=random.choice(fake_locations),
                company_id=comp_id(),
                description=random.choice(job_descriptions),
                link=random.choice(fake_job_urls)))

    s.add_all(jobs)
    s.commit()
    print("Added sample jobs to DB")

    def g_id():
        return random.choice(added_groups).id

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

    print("Adding some post likes!")
    likes = []
    likes_test = {}
    for i in range(1000):
        uid_val = uid()
        post_id_val = post_id()

        if uid_val in likes_test:
            if post_id_val in likes_test[uid_val]:
                continue
            else:
                likes_test[uid_val].append(post_id_val)
        else:
            likes_test[uid_val] = [post_id_val]

        likes.append(
            UserPostLikeORM(
                uid=uid_val,
                post_id=post_id_val,
                like=random.randint(0, 1),
                dashboard=random.randint(0, 1)
            )
        )

    s.add_all(likes)
    s.commit()

    comments = []
    for i in range(1000):
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
        filename="resume.pdf",
        date=datetime.datetime.now(),
        uid=adminUser.id
    )

    s.add(admin_resume)
    s.commit()

    application_base_list = []
    built_app_list = []
    for user in added_users:
        for job in jobs:
            if(random.randint(0, 4) == 1):
                application_base_list.append(ApplicationBaseModel(
                        job_id=job.id,
                        resume_id=admin_resume.id,
                        token=user.token.val))

    for app in application_base_list:
        try:
            built_app_list.append(add_application(app))
        except Exception as e:
            print(app)
            print(token)
            print(e)
            pass
    

    application_events = []
    for app in built_app_list:
        numStages = random.randint(0, len(stages))
        for i in range(numStages):
            application_events.append(
                ApplicationEventORM(
                    timestamp=datetime.datetime.now(),
                    applicationBaseId=app.id,
                    stage_id=stages[i].id
                )
            )

    s.add_all(application_events)
    s.commit()

    print("Adding some tags...")

    tags = [TagORM(tag=x) for x in ["machine learning", "CS", "AI", "ITM", "windows", "linux", "tesla", "microsoft",
                                    "amazon", "FAANG", "great recruiter", "high pay", "low pay", "unpaid", "good benefits", "free lunch"]]

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
