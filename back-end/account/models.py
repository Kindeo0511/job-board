from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary_storage.storage import RawMediaCloudinaryStorage

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "AD", "Admin"
        EMPLOYER  = "EM", "Employer"
        JOBSEEKER = "JS", "Job-Seeker"
    
    role = models.CharField(max_length=20, choices=Role.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-id"]
    def __str__(self):
        return f"{self.username}"

class JobSeeker(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    job_title = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=255, blank=True)
    about = models.TextField(blank=True)
    phone_number = models.CharField(max_length=11, blank=True)
    portfolio_url = models.URLField(blank=True)
    resume = models.FileField(upload_to="resumes/",storage=RawMediaCloudinaryStorage, blank=True)
    photo = models.ImageField(upload_to='photos/',null=True, blank=True)

    def save(self, *args, **kwargs):
        try:
            old = JobSeeker.objects.get(pk=self.pk)
            if old.photo and old.photo != self.photo:
                old.photo.delete(save=False)
            if old.resume and old.resume != self.resume:
                old.resume.delete(save=False)
        except JobSeeker.DoesNotExist:
            pass
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.photo:
            self.photo.delete(save=False)
        if self.resume:
            self.resume.delete(save=False)
        super().delete(*args, **kwargs)
    
 

    def __str__(self):
        return f"JobSeeker: {self.user.username}"
    
class WorkExperience(models.Model):
    job_seeker = models.ForeignKey(JobSeeker, on_delete=models.CASCADE, related_name='experiences')
    title = models.CharField(max_length=255, blank=False)
    company = models.CharField(max_length=255, blank=False)
    start_date = models.DateField(null=False, blank=False)
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=False)

    def __str__(self):
        return f"{self.title} at {self.company}"

class Education(models.Model):
    job_seeker = models.ForeignKey(JobSeeker, on_delete=models.CASCADE, related_name='educations')
    degree = models.CharField(max_length=255, blank=False)
    school = models.CharField(max_length=255, blank=False)
    start_year = models.IntegerField(null=False, blank=False)
    end_year = models.IntegerField(null=False, blank= False)

    def __str__(self):
        return f"{self.degree} at {self.school}"
    
class Skill(models.Model):
    job_seeker = models.ForeignKey(JobSeeker, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=255, blank=False)

    def __str__(self):
            return f"{self.name}"
    
class Employer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company = models.CharField(max_length=255, blank=True)
    industry = models.CharField(max_length=55, blank=True)
    company_size = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    phone_number = models.CharField(max_length=11, blank=True)
    website_url = models.CharField(max_length=150, blank=True)
    location = models.CharField(max_length=255, blank=True)
    photo = models.ImageField(upload_to='photos/',null=True, blank=True)

    def save(self, *args, **kwargs):
        try:
            old = Employer.objects.get(pk=self.pk)
            if old.photo and old.photo != self.photo:
                old.photo.delete(save=False)
                
        except Employer.DoesNotExist:
            pass
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.photo:
            self.photo.delete(save=False)
       
        super().delete(*args, **kwargs)
    def __str__(self):
        return f"{self.user.username}"