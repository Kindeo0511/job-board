from django.urls import reverse
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from account.models import User, JobSeeker
from rest_framework.test import APITestCase
import os
from django.core.files.uploadedfile import SimpleUploadedFile


class TestJobSeeker(APITestCase):

    def setUp(self):

        self.user = User.objects.create_user(
            username="test_jobseeker",
            password="test_password",
            role="JS"
            
        )

        self.user_data = JobSeeker.objects.create(
            user = self.user,
            job_title = "test_title",
            location ="test_location",
            about = "test_location",
            phone_number = "test_number",
            portfolio_url = "https://test.com",
        )

        self.user_data.save()

        self.client.force_authenticate(user=self.user)
        self.profile_url = reverse('get-job-seeker-profile')
        self.update_profile_url = reverse('update-job-seeker')
        self.upload_photo_url = reverse('upload-photo')
        self.upload_resume_url = reverse('upload-resume')


        # empty field
        self.empty_data = {}

        # missing fields
        self.missing_fields = {
            "job_title": "new_title",
            "location":"",
            "about": "",
            "phone_number": "",
            "portfolio_url": "",
        }


        current_dir = os.path.dirname(__file__)
        self.project_root = os.path.abspath(os.path.join(current_dir, "..", "..", ".."))

        image_path = os.path.join(self.project_root, "media", "test_picture", "test_image.jpg")
        resume_path = os.path.join(self.project_root,"media","test_resume","test.pdf")

        # Photo
        with open(image_path, 'rb') as img_file:
            self.test_photo = SimpleUploadedFile(
                "test.jpg",
                img_file.read(),
                content_type="image/jpeg"
            )
        # Invalid Photo
        with open(resume_path, 'rb') as file:
            self.invalid_photo = SimpleUploadedFile(
                "test.pdf",
                file.read(),
                content_type="image/jpeg"
            )

        # Resume
        with open(resume_path, 'rb') as file:
            self.test_resume = SimpleUploadedFile(
                "test.pdf",
                file.read(),
                content_type="application/pdf"
            )
        with open(image_path, 'rb') as file:
            self.invalid_resume = SimpleUploadedFile(
                "test_mage.jpg",
                file.read(),
                content_type="application/pdf"
            )


    
    def test_get_jobseeker_profile(self):
        response = self.client.get(self.profile_url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK) 
        self.assertEqual(response.data['user']['username'], self.user_data.user.username) 
        self.assertEqual(response.data['job_title'], self.user_data.job_title) 
    
    def test_update_profile(self):
        data = {
            "job_title": "new_title",
            "location":"new_location",
            "about": "new_about",
            "phone_number": "09123123122",
            "portfolio_url": "https://newtest.com",
        }

        response = self.client.patch(self.update_profile_url, data, format='json')
        self.user_data.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK) 
        self.assertEqual(response.data['job_title'], self.user_data.job_title) 
    
    def test_empty_field(self):

        response = self.client.patch(self.update_profile_url, self.empty_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_missing_field(self):

        response = self.client.patch(self.update_profile_url, self.missing_fields, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_upload_photo(self):
        data = {
            "photo": self.test_photo
        }
        response = self.client.put(self.upload_photo_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['photo'])

    def test_upload_invalid_photo(self):
        data = {
            "photo": self.invalid_photo
        }
        response = self.client.put(self.upload_photo_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_upload_resume(self):
        data = {
            "resume": self.test_resume
        }
        
        response = self.client.patch(self.upload_resume_url, data, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['resume'])

    def test_upload_invalid_resume(self):
        data = {
            "resume": self.invalid_resume
        }
        
        response = self.client.patch(self.upload_resume_url, data, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
     
      

        
    
           
        
    