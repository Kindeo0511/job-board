from rest_framework import serializers
from account.models import Employer
from jobs.models import Job, JobApplication, Qualification, Benefit
from account.lib.serializer.account_serializer import EmployerSerializer, ReadJobSeekerSerializer, JobSeekerProfileSerializer


class QualificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Qualification
        fields = ["id","text"]


class BenefitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Benefit
        fields = ["id","text"]


class JobSerializer(serializers.ModelSerializer):
    employer = EmployerSerializer(read_only=True)
    job_type_display = serializers.CharField(source="get_job_type_display", read_only=True)
    qualifications = QualificationSerializer(many=True)
    benefits = BenefitSerializer(many=True)
    
    class Meta:
        model = Job
        fields = ["id","title","qualifications",
                  "benefits","salary_min","salary_max",
                    "min_exp","max_exp","job_type",
                    "job_type_display","location","is_active",
                    "created_at","employer"]
    
    def validate_qualifications(self, value):
        if not value:
            raise serializers.ValidationError("At least one qualification is required.")
        return value
    
    def validate_benefits(self, value):
        if not value:
            raise serializers.ValidationError("At least one benefit is required.")
        return value
        
    def validate(self, data):
        employer = self.context['employer']
        instance = self.context.get('instance')


        title = data.get('title', instance.title if instance else None)
        location = data.get('location', instance.location if instance else None)

        data['title'] = title.strip().title() if title else title
        data['location'] = location.strip().title() if location else location

        query_set = Job.objects.filter(
            employer=employer,
            title__iexact=data['title'],
            location__iexact=data['location']
        )

        if instance:
            query_set = query_set.exclude(pk=instance.pk)

        if query_set.exists():
            raise serializers.ValidationError({"error": "This job already exists."})

        return data
    
    def get_application_status(self, obj):
        request = self.context.get("request")

        applicant = getattr(request.user, "jobseekerprofile", None)
        if applicant is None:
            return None

        application = JobApplication.objects.filter(job=obj, applicant=applicant).first()
        return application.status if application else None







class JobApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    applicant = JobSeekerProfileSerializer(read_only=True)

    class Meta:
        model = JobApplication
        fields = ["id","job","applicant","status","applied_at"]
