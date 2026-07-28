from account.models import JobSeeker, User, WorkExperience, Education, Skill

def create_job_seeker(data):
    user_data = data.pop('user')
    user = User.objects.create_user(**user_data)
    return JobSeeker.objects.create(user=user,**data)

def upload_resume(data, new_resume):
    for field, value in new_resume.items():
        setattr(data, field, value)
    data.save()
    return data

def delete_resume(data):
    if data.resume:
        data.resume.delete(save=False)
        data.resume = None
        data.save()

def upload_photo(old_data, data):
    for field, value in data.items():
        setattr(old_data, field, value)
    old_data.save()
    return old_data


def update_job_seeker(old_data, data):
    user_data = data.pop('user', None)

    if user_data:
       user = old_data.user
       for field, value in user_data.items():
           setattr(user,field,value)
           user.save()

    for field,value in data.items():
        setattr(old_data, field, value)
    
    old_data.save()
    return old_data

def delete_job_seeker(data):
    data.delete()

def get_all_job_seeker():
    return JobSeeker.objects.all()

def get_job_seeker(job_id):
    return JobSeeker.objects.get(id=job_id)

def get_job_seeker_by_user(user):
    return JobSeeker.objects.get(user=user)

# WORK EXPERIENCE
def create_work_experience(job_seeker,data):
    return WorkExperience.objects.create(job_seeker=job_seeker,**data)
def update_work_experience(old_data, data):
    for field, value in data.items():
        setattr(old_data, field, value)
    
    old_data.save()
    return old_data
def get_work_experience_by_id(pk):
    return WorkExperience.objects.get(id=pk)
def delete_work_experience(data):
    data.delete()

# EDUCATION
def create_education(job_seeker,data):
    return Education.objects.create(job_seeker=job_seeker,**data)

def update_education(old_data, data):
    for field,value in data.items():
        setattr(old_data, field,value)
    old_data.save()
    return old_data

def get_education_by_id(pk):
    return Education.objects.get(id=pk)
def delete_education(data):
    data.delete()

# SKILLS
def create_skill(job_seeker,data):
    return Skill.objects.create(job_seeker=job_seeker,**data)

def update_skill(old_data, data):
    for field, value in data.items():
        setattr(old_data, field, value)
    old_data.save()
    return old_data

def get_skill_by_id(pk):
    return Skill.objects.get(id=pk)

def delete_skill(data):
    data.delete()