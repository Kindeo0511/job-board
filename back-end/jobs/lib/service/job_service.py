from jobs.models import Job, JobApplication, Qualification, Benefit
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError

# Job
def CountTotalJobPosts(employer):
    return Job.objects.filter(employer=employer).count()

def CountTotalActive(employer):
    return Job.objects.filter(is_active=True,employer=employer).count()

def CountTotalApplicantsByEmployer(employer):
    return JobApplication.objects.filter(job__employer=employer).count()

def CreateJob(employer,data):
    qualification_data = data.pop("qualifications",[])
    benefit_data = data.pop("benefits",[])
    job = Job.objects.create(employer=employer, **data)
    Qualification.objects.bulk_create(
         [Qualification(job=job, text=item["text"]) for item in qualification_data])
    Benefit.objects.bulk_create(
         [Benefit(job=job, text=item["text"]) for item in benefit_data])
    return job

def UpdateJob(old_data, new_data):
    qualification_data = new_data.pop("qualifications",None)
    benefit_data = new_data.pop("benefits",None)

    for field,value in new_data.items():
        setattr(old_data,field,value)
    old_data.save()

    if qualification_data is not None:
         old_data.qualifications.all().delete()
         Qualification.objects.bulk_create([Qualification(job=old_data, text=item["text"]) for item in qualification_data])
    
    if benefit_data is not None:
         old_data.benefits.all().delete()
         Benefit.objects.bulk_create([Benefit(job=old_data, text=item["text"]) for item in benefit_data])

    return old_data

def view_all_jobs(job_title):
    if job_title:
         return Job.objects.filter(title__icontains= job_title)
    return Job.objects.all()

def GetJobByEmployer(employer, is_active):
    if is_active is not None and is_active.lower() != "all":
        if is_active.lower() in ("true", "open"):
                    return Job.objects.filter(employer = employer,is_active = True )
        elif is_active.lower() in ("false", "closed"):
                return Job.objects.filter(employer = employer,is_active = False )
    return Job.objects.filter(employer = employer)
def get_job(pk):
    return Job.objects.get(id=pk)        

# Job Application
def get_total_job_applications(job):
    return JobApplication.objects.filter(job__in=job).count()

def get_job_application_by_id(pk):
    return JobApplication.objects.get(id=pk)

def get_total_by_status(status,job):
    return JobApplication.objects.filter(status=status, job__in =job).count()

def create_job_application(job,applicant):
    if JobApplication.objects.filter(job=job, applicant=applicant).exists():
        raise ValidationError("You have already applied to this job.")

    try:
        return JobApplication.objects.create(job=job, applicant=applicant)
    except IntegrityError:
        raise ValidationError("You have already applied to this job.")
  

def update_job_application_status(old_status, data):
    for field, value in data.items():
        setattr(old_status, field, value)
    old_status.save()
    return old_status

def get_all_job_application():
    return JobApplication.objects.all()

def get_all_job_application_by_job_employer(job,status):
    if status is not None:
        return JobApplication.objects.filter(job__in = job,status = status )
    return JobApplication.objects.filter(job__in=job)



def get_job_application_by_user(applicant, filter_by_status):
    
    if filter_by_status:
         return JobApplication.objects.filter(applicant = applicant, status= filter_by_status)
    return JobApplication.objects.filter(applicant = applicant)