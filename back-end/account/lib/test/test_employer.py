from django.urls import reverse
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from account.models import Employer, User
from rest_framework.test import APITestCase
import os
from django.core.files.uploadedfile import SimpleUploadedFile


class TestEmployer(APITestCase):

    def setUp(self):

        self.user = User.objects.create_user(
            username="employer",
            password="employer",
            role="EM"
        )
        
            
        self.employer = Employer.objects.create(
            user = self.user,
            company = "test company",
            industry = "test industry",
            company_size = "test company size",
            description = "test description",
            phone_number = "09475846135",
            website_url="http://test.com",
            location = "test location",

        )

        self.employer.save()

        self.client.force_authenticate(user=self.user)
        self.register_url = reverse('register-employer')
        self.employer_profile_url = reverse('get-employer-profile')
        self.update_employer_url = reverse('update-employer')
        self.upload_photo_url = reverse('upload-employer-photo')

        current_dir = os.path.dirname(__file__)
        self.project_root = os.path.abspath(os.path.join(current_dir, "..", "..", ".."))
        image_path = os.path.join(self.project_root, "media", "test_picture", "test_image.jpg")

        with open(image_path, 'rb') as img_file:
            self.test_photo = SimpleUploadedFile(
                "test.jpg",
                img_file.read(),
                content_type="image/jpeg"
            )

    def test_get_employer_profile(self):

        response = self.client.get(self.employer_profile_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['username'], self.user.username)
        self.assertEqual(response.data['company'], self.employer.company)

    
    def test_update_employer_company_profile(self):
        data = {
            "company": "new company",
            "industry": "new indsutry",
            "company_size": "12",
            "description": "new description"
        }

        response = self.client.put(self.update_employer_url, data, format='json')
        self.user.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['company'] , "new company")
    

    def test_missing_field(self):
        data = {}
        response = self.client.put(self.update_employer_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_blank_field(self):
        data = {
            "company":"",
            "industry":"",
            "phone_number":"",
            "website_url":"",
            "location":""    
        }
        response = self.client.put(self.update_employer_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_upload_photo(self):
       
        data = {"photo": self.test_photo}
        response = self.client.patch(self.upload_photo_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['photo'])
    

    def test_upload_photo_invalid_file_type(self):
 
        file_path = os.path.join(self.project_root, "media", "test_resume", "test.pdf")

        with open(file_path, 'rb') as f:
            invalid_file = SimpleUploadedFile(
                "test_file.pdf",
                f.read(),
                content_type="application/pdf"
            )

        data = {"photo": invalid_file}
        response = self.client.patch(self.upload_photo_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
   


    
    


