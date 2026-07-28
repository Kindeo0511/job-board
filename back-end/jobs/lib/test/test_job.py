from django.urls import reverse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from jobs.models import Job,Qualification,Benefit, JobApplication
from account.models import User, Employer, JobSeeker

class TestJob(APITestCase):

    def setUp(self):

        self.user = User.objects.create_user(
            username= "test_user",
            password= "test_password",
            role="EM"
        )
        self.other_employer_user = User.objects.create_user(
            username= "other_user",
            password= "test_password",
            role="EM"
        )
        self.other_role = User.objects.create_user(
            username= "other_role",
            password= "test_password",
            role="JS"
        )
        self.employer = Employer.objects.create(
            user= self.user,
            company = "test_company",
            industry="test_industry",
            company_size ="test_company_size",
            description ="test_description",
            phone_number="0912345643",
            website_url = "https://test.com",
            location = "test_location",

        )
        self.employer.save()
        self.job = Job.objects.create(
            employer = self.employer,
            title = "test_title",
            salary_min = 1000,
            salary_max = 2000,
            min_exp = 1,
            max_exp = 2,
            job_type = "full-time",
            location = "test_location"
        )

        self.qualification = Qualification.objects.create(
            job=self.job,
            text= "test_qualification"
        )

        self.benefit = Benefit.objects.create(
            job=self.job,
            text= "test_benefit"
        )

        # Applicant 
        self.applicant = User.objects.create_user(
            username= "test_applicant",
            password= "test_password",
            role="JS"
        )
        self.applicant_data = JobSeeker.objects.create(
            user= self.applicant,
            job_title = "test_title",
            location ="test_location",
            about = "test_location",
            phone_number = "test_number",
            portfolio_url = "https://test.com",

        )
        self.applicant_data.save()

        # Job Application Data
        self.job_application = JobApplication.objects.create(
            job=self.job,
            applicant=self.applicant_data,
            status="pending",

        )
        self.job_application.save()


        self.client.force_authenticate(user=self.user)
        self.get_all_job_url = reverse('employer-jobs')
        self.create_job_url = reverse('create-job')
        self.update_job_url = reverse('update-job',kwargs={'pk':self.job.id})
        
        # Job Application URL
        self.get_all_applicants_url = reverse('get-employer-applicants')
        self.get_applicant_url = reverse('get-employer-applicant', kwargs={'pk':self.job_application.id})
        self.apply_job_url = reverse('apply-job',kwargs={'job_id':self.job.id})
        self.applicant_job_application_url = reverse('get-my-job-application')
        self.update_applicant_status_url = reverse('update-job-application',kwargs={'pk':self.job_application.id})
    
    def test_get_all_job(self):
        response = self.client.get(self.get_all_job_url,format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Job.objects.count(),1)
    
    def test_get_all_job_by_employer_unauthorized(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.get_all_job_url,format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_all_job_wrong_role(self):
        self.client.force_authenticate(user=self.other_role)
        response = self.client.get(self.get_all_job_url,format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    
    def test_create_job(self):
        data = {
            "title": "new_title",
            "salary_min": "5000",
            "salary_max": "10000",
            "min_exp": "0",
            "max_exp": "1",
            "job_type": "full-time",
            "location": "new_location",
            "qualifications": [
                {"text": "new qualification"}
            ],
            "benefits": [
                {"text": "new benefit"}
            ],
        }

        response = self.client.post(self.create_job_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Job.objects.count(), 2)

        new_job = Job.objects.get(title='New_Title')
        self.assertEqual(new_job.employer, self.employer)
        self.assertTrue(Qualification.objects.filter(job=new_job, text='new qualification').exists())
        self.assertTrue(Benefit.objects.filter(job=new_job, text='new benefit').exists())

    def test_create_job_unauthorized(self):
        self.client.force_authenticate(user=None)
        data = {
            "title": "new_title",
            "salary_min": "5000",
            "salary_max": "10000",
            "min_exp": "0",
            "max_exp": "1",
            "job_type": "full-time",
            "location": "new_location",
            "qualifications": [
                {"text": "new qualification"}
            ],
            "benefits": [
                {"text": "new benefit"}
            ],
        }

        response = self.client.post(self.create_job_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_job_wrong_role(self):
        self.client.force_authenticate(user=self.other_role)
        data = {
            "title": "new_title",
            "salary_min": "5000",
            "salary_max": "10000",
            "min_exp": "0",
            "max_exp": "1",
            "job_type": "full-time",
            "location": "new_location",
            "qualifications": [
                {"text": "new qualification"}
            ],
            "benefits": [
                {"text": "new benefit"}
            ],
        }

        response = self.client.post(self.create_job_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_create_job_missing_fields(self):
        data = {}
        response = self.client.post(self.create_job_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_job_blank_fields(self):
        data = {
            "title": "",
            "salary_min": "",
            "salary_max": "",
            "min_exp": "",
            "max_exp": "",
            "job_type": "",
            "location": "",
            "qualifications": [
                {"text": ""}
            ],
            "benefits": [
                {"text": ""}
            ],
        }
        response = self.client.post(self.create_job_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


    def test_put_update_job(self):
        data = {
            "title": "updated_title",
            "salary_min": "6000",
            "salary_max": "8000",
            "min_exp": "0",
            "max_exp": "1",
            "job_type": "full-time",
            "location": "updated_location",
            "qualifications": [
                {"text": "updated qualification"}
            ],
            "benefits": [
                {"text": "updated benefit"}
            ],
        }

        response = self.client.put(self.update_job_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Job.objects.count(), 1)

        updated_job = Job.objects.get(title='Updated_Title')
        self.assertTrue(Qualification.objects.filter(job=updated_job, text='updated qualification').exists())
        self.assertTrue(Benefit.objects.filter(job=updated_job, text='updated benefit').exists())
    
    def test_put_update_job_wrong_owner(self):
        self.client.force_authenticate(user=self.other_employer_user)
        data = {
            "title": "updated_title",
            "salary_min": "6000",
            "salary_max": "8000",
            "min_exp": "0",
            "max_exp": "1",
            "job_type": "full-time",
            "location": "updated_location",
            "qualifications": [
                {"text": "updated qualification"}
            ],
            "benefits": [
                {"text": "updated benefit"}
            ],
        }

        response = self.client.put(self.update_job_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
   
    def test_put_job_missing_fields(self):

        data = {
            "title": "updated_title",
        }
        response = self.client.put(self.update_job_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_put_job_blank_fields(self):
        data = {
            "title": "",
            "salary_min": "",
            "salary_max": "",
            "min_exp": "",
            "max_exp": "",
            "job_type": "",
            "location": "",
            "qualifications": [
                {"text": ""}
            ],
            "benefits": [
                {"text": ""}
            ],
        }
        response = self.client.put(self.update_job_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_job_not_exists(self):
        url = reverse('update-job',kwargs={'pk':999})
        data = {
            "title": "updated_title",
            "salary_min": "6000",
            "salary_max": "8000",
            "min_exp": "2",
            "max_exp": "5",
            "job_type": "full-time",
            "location": "updated_location",
            "qualifications": [
                {"text": "updated qualification"}
            ],
            "benefits": [
                {"text": "updated benefit"}
            ],
        }

        response = self.client.put(url,data, format='json')

        self.assertEqual(response.status_code, 404)
       
    # Job Application

    def test_get_all_applicants(self):

        response = self.client.get(self.get_all_applicants_url,format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(JobApplication.objects.count(), 1)

    def test_get_all_applicants_unauthorized(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.get_all_applicants_url,format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_get_all_applicants_wrong_role(self):
        self.client.force_authenticate(user=self.other_role)
        response = self.client.get(self.get_all_applicants_url,format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_get_applicant(self):

        response = self.client.get(self.get_applicant_url,format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], 1)
        self.assertEqual(response.data['status'], 'pending')

    def test_get_applicant_unauthorized(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.get_applicant_url,format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_get_applicant_wrong_role(self):
        self.client.force_authenticate(user=self.other_role)
        response = self.client.get(self.get_applicant_url,format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_applicant_does_not_exists(self):

        url = reverse('get-employer-applicant', kwargs={'pk':999})
        response = self.client.get(url,format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data,{"error":"Job application not found."})
    
    


    def test_apply_applicant(self):
        self.client.force_authenticate(user=self.applicant)
        response = self.client.post(self.apply_job_url,format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_apply_applicant_unauthorized(self):
        self.client.force_authenticate(user=None)
        response = self.client.post(self.apply_job_url,format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_apply_applicant_wrong_role(self):
        self.client.force_authenticate(user=self.other_employer_user)
        response = self.client.post(self.apply_job_url,format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_get_applicant_job_application(self):
        self.client.force_authenticate(user=self.applicant)
        response = self.client.get(self.applicant_job_application_url,format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_job_application_status(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(self.update_applicant_status_url,format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_updated_job_application_unauthorized(self):
        self.client.force_authenticate(user=None)
        response = self.client.patch(self.update_applicant_status_url,format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_updated_job_application_wrong_role(self):
        self.client.force_authenticate(user=self.other_role)
        response = self.client.patch(self.update_applicant_status_url,format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_updated_job_application_wrong_owner(self):
        self.client.force_authenticate(user=self.other_employer_user)
        response = self.client.patch(self.update_applicant_status_url,format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    

    

    


      


  



