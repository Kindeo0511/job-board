
from django.db import models
from account.models import JobSeeker, Employer
# Create your models here.
class Job(models.Model):
    JOB_TYPE_CHOICES = [
    ("full-time", "Full-Time"),
    ("part-time", "Part-Time"),
    ("contract", "Contract")
    ]
    employer = models.ForeignKey(Employer, on_delete=models.CASCADE)
    title = models.CharField(max_length=45)
    salary_min = models.IntegerField(null=True, blank=True)
    salary_max = models.IntegerField(null=True, blank=True)

    min_exp = models.IntegerField(null=True, blank=True)
    max_exp = models.IntegerField(null=True, blank=True)

    job_type = models.CharField(max_length= 255, choices=JOB_TYPE_CHOICES, default="full-time")
    location = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']
    def __str__(self):
        return f"{self.title}"

class Qualification(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="qualifications")
    text = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.text}"
    
class Benefit(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="benefits")
    text = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.text}"


class JobApplication(models.Model):
    STATUS_CHOICES = [
    ("pending", "Pending"),
    ("reviewed", "Reviewed"),
    ("interview", "Interview"),
    ("accepted", "Accepted"),
    ("rejected", "Rejected"),
    ]
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    applicant = models.ForeignKey(JobSeeker, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-applied_at']
        constraints = [
            models.UniqueConstraint(
                fields=["job", "applicant"], name="unique_job_applicant"
            )
        ]
    def __str__(self):
        return f"{self.applicant} - {self.status}"