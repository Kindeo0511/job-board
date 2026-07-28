from account.models import *
from rest_framework import serializers
import re


class RegisterAccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["username","password","role"]


    def validate_username(self, value):

        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        
        if len(value) < 6:
            raise serializers.ValidationError("Username must be at least 6 characters long.")
        return value

    def validate_password(self, value):

        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        return value
    

        


class AccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["first_name","last_name","username","email","role"]
    
    def validate_first_name(self, value):
        
        if not re.match(r"^[a-zA-Z' -]+$", value):
            raise serializers.ValidationError("First name must contain only letters.")
        return value
    
    def validate_last_name(self,value):

        if not re.match(r"^[a-zA-Z' -]+$", value):
            raise serializers.ValidationError("Last name must contain only letters.")
        return value
    
    
    def validate_username(self,value):

        if not re.match(r"[a-zA-Z0-9._+-]+$", value):
            raise serializers.ValidationError("Enter a valid username.")
        return value

class AccountRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username","role"]



     
    
    

class CreateJobSeekerSerializer(serializers.ModelSerializer):
    user = RegisterAccountSerializer()

    class Meta:
        model = JobSeeker
        fields = ["user","job_title","location","about","portfolio_url","phone_number"]
    
    
    def validate_phone_number(self, value):

        if len(value) < 11 :
            raise serializers.ValidationError("Phone number must be at least 11 characters long.")
        
        if not re.match(r"^[0-9]+$", value):
            raise serializers.ValidationError("Phone number must contain only digits.")
        return value
class JobSeekerBasicInfoSeriliazer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', required=True)
    last_name = serializers.CharField(source='user.last_name', required=True)
    job_title = serializers.CharField(required=True)

    class Meta:
        model = JobSeeker
        fields = ["first_name","last_name","job_title"]

class JobSeekerContactInfoSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', required=True)
    phone_number = serializers.CharField(required=True)
    location = serializers.CharField(required=True)
    portfolio_url = serializers.URLField(required=True)

    class Meta:
        model = JobSeeker
        fields = ["email","phone_number","location","portfolio_url"]

class JobSeekerAboutInfoSerializer(serializers.ModelSerializer):

    about = serializers.CharField(required=True)
    class Meta:
        model = JobSeeker
        fields = ["about"]


class UpdateJobSeekerSerializer(serializers.ModelSerializer):
    user = RegisterAccountSerializer(read_only=True)
    job_title = serializers.CharField(required=True)
    location = serializers.CharField(required=True)
    about = serializers.CharField(required=True)
    portfolio_url = serializers.CharField(required=True)
    phone_number = serializers.CharField(required=True)

    class Meta:
        model = JobSeeker
        fields = ["user","job_title","location","about","portfolio_url","phone_number"]
    
    
    def validate_phone_number(self, value):

        if len(value) < 11 :
            raise serializers.ValidationError("Phone number must be at least 11 characters long.")
        
        if not re.match(r"^[0-9]+$", value):
            raise serializers.ValidationError("Phone number must contain only digits.")
        return value
        


class ReadJobSeekerSerializer(serializers.ModelSerializer):
    user = AccountSerializer()
    class Meta:
        model = JobSeeker
        fields = ["id","user","job_title","location","about","photo","portfolio_url","phone_number","resume"]
class WorkExperienceSerializer(serializers.ModelSerializer):

    class Meta:
        model = WorkExperience
        fields = ["id","job_seeker","title","company", "description","start_date","end_date"]
        read_only_fields = ["job_seeker"]

    
    def validate(self, data):
        job_seeker = self.context['job_seeker']
        instance = self.context.get('instance')
        data['title'] = data['title'].strip()
        data['company'] = data['company'].strip().title()
        data['description'] = data['description'].strip().title()

        query_set = WorkExperience.objects.filter(
            job_seeker=job_seeker,
            title = data['title'],
            company = data['company'],
        )
        if instance:
            query_set = query_set.exclude(pk=instance.pk)
        
        if query_set.exists():
            raise serializers.ValidationError({"error":"This work experience already exists. "})
        
        return data
            


class WorkExperienceDisplaySerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkExperience
        fields = ["id","title","company","start_date","end_date","description"]

class EducationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Education
        fields = ["job_seeker","degree","school","start_year","end_year"]
        read_only_fields = ["job_seeker"]
     
    
    def validate(self, data):
        job_seeker = self.context['job_seeker']
        instance = self.context.get('instance')
        data['degree'] = data['degree'].strip()
        data['school'] = data['school'].strip()

        query_set = Education.objects.filter(
            job_seeker = job_seeker,
            degree__iexact= data['degree'],
            school__iexact = data['school']
        )

        if instance:
            query_set = query_set.exclude(pk=instance.pk)
        
        if query_set.exists():
            raise serializers.ValidationError({"error":"This education already exists."})
        return data

class EducationDisplaySerializer(serializers.ModelSerializer):

    class Meta:
        model = Education
        fields = ["id","degree","school","start_year","end_year"]
      

class SkillSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = Skill
        fields = ["job_seeker","name"]
        read_only_fields = ["job_seeker"]
    

    def validate(self, data):
        job_seeker = self.context['job_seeker']
        instance = self.context.get('instance')
        data['name'] = data['name'].strip()


        queryset =  Skill.objects.filter(
            job_seeker=job_seeker,
            name__iexact = data['name'],
        )
        
        if instance:
            queryset = queryset.exclude(pk=instance.pk)
        
        if queryset.exists():
            raise serializers.ValidationError({"error":"This skill already exists."})
        return data

class SkillDisplaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id","name"]


class JobSeekerProfileSerializer(serializers.ModelSerializer):
    user = AccountSerializer()
    experiences = WorkExperienceDisplaySerializer(many=True, read_only=True)
    educations = EducationDisplaySerializer(many=True, read_only=True)
    skills = SkillDisplaySerializer(many=True, read_only=True)

    class Meta:
        model = JobSeeker
        fields = [
            "id", "user","job_title", "photo","location", "about", 
            "phone_number", "portfolio_url","resume",
            "experiences", "educations", "skills"
        ]
class JobSeekerPhotoSerializer(serializers.ModelSerializer):
    class Meta: 
        model = JobSeeker
        fields = ["photo"]
        
class JobSeekerResumeSerializer(serializers.ModelSerializer):
    resume = serializers.FileField(required=True)
    class Meta:
        model = JobSeeker
        fields = ["id","resume"]
        read_only_fields = ["id"]
    
    def validate_resume(self, value):
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Resume must be under 5MB.")
        if not value.name.lower().endswith((".pdf", ".doc", ".docx")):
            raise serializers.ValidationError("Resume must be a PDF or Word document.")
        return value
        


class CreateEmployerSerializer(serializers.ModelSerializer):
    user = RegisterAccountSerializer()
    class Meta:
        model = Employer
        fields = ["user","company","industry",
                  "company_size","description",
                  "phone_number","website_url","location","photo"]
    
class UpdateEmployerCompanyProfileSerializer(serializers.ModelSerializer):
    user = RegisterAccountSerializer(read_only=True)
    company = serializers.CharField(required=True)
    industry = serializers.CharField(required=True)
    company_size = serializers.CharField(required=True)
    description = serializers.CharField(required=True)
    class Meta:
        model = Employer
        fields = ['user','company','industry','company_size','description']

class UpdateEmployerCompanyContactProfileSerializer(serializers.ModelSerializer):
    user = RegisterAccountSerializer(read_only=True)
    
    email = serializers.EmailField(source='user.email', required=True)
    first_name = serializers.CharField(source='user.first_name', required=True)
    last_name = serializers.CharField(source='user.last_name', required=True)
    phone_number = serializers.CharField(required=True)
    website_url = serializers.CharField(required=True)
    location = serializers.CharField(required=True)

    class Meta:
        model = Employer
        fields = [
            'user', 'email', 'first_name', 'last_name',
            'phone_number', 'website_url', 'location',
        ]
    

class EmployerSerializer(serializers.ModelSerializer):
    user = AccountSerializer(read_only=True)
    photo = serializers.ImageField(read_only=True)
    class Meta:
        model = Employer
        fields = ["id","user","company","industry","company_size","description","phone_number","website_url","location", "photo"]

class EmployerPhotoSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Employer
        fields = ["photo"]
 
class ChangePasswordSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["password"]
    
    def validate_password(self, value):

        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        return value
    
