from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from account.models import Education, User, JobSeeker



class TestEducation(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="test_user",
            password="test_password",
            role="JS"
        )
        self.other_job_seeker_user = User.objects.create_user(
            username="other_jobseeker",
            password="test_password",
            role="JS"
        )
        self.other_role = User.objects.create_user(
            username="other_role",
            password="test_password",
            role="EM"
        )


        self.jobseeker = JobSeeker.objects.create(
            user = self.user,
            job_title = "test_title",
            location ="test_location",
            about = "test_location",
            phone_number = "09374917011",
            portfolio_url = "https://test.com",
        )
        self.jobseeker.save()

        self.other_jobseeker = JobSeeker.objects.create(
            user=self.other_job_seeker_user,
            job_title="other_title",
            location="other_location",
            about="other_about",
            phone_number="09474839471",
            portfolio_url="https://other.com",
        )
        self.other_jobseeker.save()

        self.education = Education.objects.create(
            job_seeker = self.jobseeker,
            degree="BSCS",
            school="TFVC",
            start_year= 2022,
            end_year=2026
        )
        self.education.save()


        self.client.force_authenticate(user=self.user)
        self.add_education_url = reverse('add-education')
        self.update_education_url = reverse('update-education', kwargs={'pk':self.education.id})
        self.delete_education_url = reverse('delete-education', kwargs={'pk':self.education.id})
    

    def test_add_education(self):
        data = {
            "degree": "HRM",
            "school": "TFVC",
            "start_year": 2022,
            "end_year": 2026
        }
        response = self.client.post(self.add_education_url, data, format='json')
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Education.objects.count(), 2)
    
    def test_add_education_already_exists(self):
        data = {
            "degree": "BSCS",
            "school": "TFVC",
            "start_year": 2022,
            "end_year": 2026
        }
        response = self.client.post(self.add_education_url, data, format='json')
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Education.objects.count(), 1)

    
    def test_add_education_blank_field(self):
        data = {
            "degree": "",
            "school": "",
            "start_year": "",
            "end_year": ""
        }

        response = self.client.post(self.add_education_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Education.objects.count(), 1)
    
    def test_add_education_missing_field(self):
        data = {
            "degree": "BSCS",
        }

        response = self.client.post(self.add_education_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Education.objects.count(), 1)
    
    def test_update_education(self):

        data = {
            "degree": "BSIT",
            "school": "UP",
            "start_year": 2022,
            "end_year": 2026
        }
        response = self.client.put(self.update_education_url, data, format='json')
        self.education.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['degree'], self.education.degree)
        self.assertEqual(response.data['school'], self.education.school)

    def test_update_education_not_exists(self):
        url = reverse('update-education',kwargs={'pk':999})

        data = {
            "degree": "BSIT",
            "school": "UP",
            "start_year": 2022,
            "end_year": 2026
        }

        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {"error":"Education not found."})
    
    def test_delete_education(self):
        response = self.client.delete(self.delete_education_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Education.objects.count(), 0)
    
    def test_delete_education_not_exists(self):
        url = reverse('delete-education',kwargs={'pk':999})
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {"error":"Education not found."})
    

    def test_add_education_unauthorized(self):
        self.client.force_authenticate(user=None)
        data = {
            "degree": "HUMSS",
            "school": "STI",
            "start_year": 2022,
            "end_year": 2026
        }
        response = self.client.post(self.add_education_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_add_education_wrong_role(self):
        self.client.force_authenticate(user=self.other_role)
        data = {
            "degree": "HUMSS",
            "school": "STI",
            "start_year": 2022,
            "end_year": 2026
        }
        response = self.client.post(self.add_education_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_update_education_wrong_owner(self):
        self.client.force_authenticate(user=self.other_job_seeker_user)
        data = {
            "degree": "HUMSS",
            "school": "STI",
            "start_year": 2022,
            "end_year": 2026
        }
        response = self.client.put(self.update_education_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)



