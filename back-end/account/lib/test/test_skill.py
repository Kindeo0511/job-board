from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from account.models import Skill, User, JobSeeker

class TestSkill(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="test_user",
            password="test_password",
            role="JS"
        )
        self.other_job_seeker = User.objects.create_user(
            username="other_job_seeker",
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
            phone_number = "test_number",
            portfolio_url = "https://test.com",
        )
        self.jobseeker.save()

        self.skill = Skill.objects.create(
            job_seeker = self.jobseeker,
            name = "Java"
        )

        self.client.force_authenticate(user=self.user)
        self.add_skill_url = reverse('add-skill')
        self.delete_skill_url = reverse('delete-skill', kwargs={'pk':self.skill.id})

    def test_add_skill(self):
        data = {
            "name": "Python"
        }

        response = self.client.post(self.add_skill_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Skill.objects.count(), 2)

    def test_add_skill_blank_field(self):
        data = {
            "name": ""
        }
        response = self.client.post(self.add_skill_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"name":["This field may not be blank."]})

    def test_add_skill_missing_field(self):
        data = {}
        response = self.client.post(self.add_skill_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"name":["This field is required."]})

    def test_add_duplicate_skill(self):
        data = {
            "name": "Java"
        }

        response = self.client.post(self.add_skill_url, data, format='json')
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"error":["This skill already exists."]})
    
    def test_delete_skill(self):
        response = self.client.delete(self.delete_skill_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Skill.objects.count(), 0)

    def test_delete_skill_not_exists(self):
        url = reverse('delete-skill', kwargs={'pk':999})
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {"error":"Skill not found."})
    
    def test_add_skill_unauthorized(self):
        self.client.force_authenticate(user=None)
        data = {
            "name": "Python"
        }
    
        response = self.client.post(self.add_skill_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_add_skill_wrong_role(self):
        self.client.force_authenticate(user=self.other_role)
        data = {
            "name": "Python"
        }

        response = self.client.post(self.add_skill_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_skill_wrong_owner(self):
        self.client.force_authenticate(user=self.other_job_seeker)
        response = self.client.post(self.delete_skill_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
     
        
