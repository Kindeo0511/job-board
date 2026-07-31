from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from account.models import WorkExperience, User, JobSeeker
from datetime import date
class TestWorkExperience(APITestCase):

    def setUp(self):

        self.user = User.objects.create_user(
            username="test_user",
            password="test_password",
            role="JS"
        )
        self.other_user = User.objects.create_user(
            username="other_user",
            password="test_password",
            role="EM"
        )
        self.other_job_seeker_user = User.objects.create_user(
            username="other_job_seeker",
            password="test_password",
            role="JS"
        )

        self.jobseeker = JobSeeker.objects.create(
            user = self.user,
            job_title = "test_title",
            location ="test_location",
            about = "test_location",
            phone_number = "09123456789",
            portfolio_url = "https://test.com",
        )
        self.jobseeker.save()

        self.other_job_seeker = JobSeeker.objects.create(
        user=self.other_job_seeker_user,
        job_title="other_title",
        location="other_location",
        about="other_about",
        phone_number="09123456789",
        portfolio_url="https://other.com",
        )
        self.other_job_seeker.save()

        self.work_experience = WorkExperience.objects.create(
            job_seeker=self.jobseeker,
            title="test work experience",
            company="test company",
            start_date = date(1999,5,11),
            end_date= date(2025,6,11),
            description="test description"
        )
        self.work_experience.save()
        
        self.client.force_authenticate(user=self.user)
        self.add_experience_url = reverse('add-work-experience')
        self.update_experience_url = reverse('update-work-experience', kwargs={'pk':self.work_experience.id})
        self.delete_experience_url = reverse('delete-work-experience', kwargs={'pk':self.work_experience.id})

    def test_add_work_experience(self):
        data = {
            "title":"new work experience",
            "company":"new company",
            "start_date": date(2000,8,5),
            "end_date":date(2012,5,18),
            "description":"new description"
        }

        response = self.client.post(self.add_experience_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'new work experience')
    
    def test_add_work_experience_missing_field(self):
        data = {
            "title":"new title 2"
        }
        response = self.client.post(self.add_experience_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_add_work_experience_blank_field(self):
        data = {
            "title":"",
            "company":"",
            "start_date":"" ,
            "end_date":"",
            "description":""
        }
        response = self.client.post(self.add_experience_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_update_work_experience(self):

        data = {
            "title":"updated work experience",
            "company":"updated company",
            "start_date": date(2000,8,5),
            "end_date":date(2012,5,18),
            "description":"updated description"
        }

        response = self.client.put(self.update_experience_url, data, format='json')
        self.work_experience.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.work_experience.title)
    
    def test_update_work_experience_not_exist(self):
        url = reverse('update-work-experience',kwargs={'pk':999})
        data = {
            "title":"updated work experience",
            "company":"updated company",
            "start_date": date(2000,8,5),
            "end_date":date(2012,5,18),
            "description":"updated description"
        }

        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {"error":"Work experience not found."})
    
    def test_delete_work_experience(self):
        
        response = self.client.delete(self.delete_experience_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(WorkExperience.objects.count(), 0)

    def test_delete_work_experience_not_exist(self):
        url = reverse('delete-work-experience',kwargs={'pk':999})
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data,{"error":"Work experience not found."})
    
    def test_add_work_experience_unauthorized(self):
        self.client.force_authenticate(user=None)
        data = {
            "title":"new work experience",
            "company":"new company",
            "start_date": date(2000,8,5),
            "end_date":date(2012,5,18),
            "description":"new description"
        }
        response = self.client.post(self.add_experience_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_add_work_experience_wrong_role(self):
        self.client.force_authenticate(user=self.other_user)
        data = {
            "title":"new work experience",
            "company":"new company",
            "start_date": date(2000,8,5),
            "end_date":date(2012,5,18),
            "description":"new description"
        }
        response = self.client.post(self.add_experience_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_work_experience_wrong_owner(self):
        self.client.force_authenticate(user=self.other_job_seeker_user)
        data = {
            "title": "updated company",
            "company": "company.co",
            "start_date": date(2000, 8, 5),
            "end_date": date(2012, 5, 18),
            "description": "updated company"
        }
        response = self.client.put(self.update_experience_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_work_experience_wrong_owner(self):
        self.client.force_authenticate(user=self.other_job_seeker_user)
        response = self.client.delete(self.delete_experience_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(WorkExperience.objects.count(), 1)
     

        

    

        










