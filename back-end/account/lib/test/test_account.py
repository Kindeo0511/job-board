from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from account.models import User,Employer,JobSeeker
from rest_framework_simplejwt.tokens import RefreshToken


class TestRegisterAccount(APITestCase):

    def setUp(self):

        # Create employer account
        self.employer_user = User.objects.create_user (
        username  ="employer_username",
        password ="employer_password",
        role ="EM"
        )

        self.employer_data = Employer.objects.create(
            user = self.employer_user,
            company = "test company",
            industry = "test industry",
            company_size = "test company size",
            description = "test description",
            phone_number = "test number",
            website_url="http://test.com",
            location = "test location",

        )
        
        # Create jobseeker account
        self.jobseeker_user = User.objects.create_user (
        username="job_seeker",
        password="job_seeker_password",
        role="JS"
        )
    
        self.jobseeker_data = JobSeeker.objects.create(
            user = self.jobseeker_user,
            job_title = "test company",
            location = "test industry",
            about = "test company size",
            phone_number = "09123456781",
            portfolio_url="http://test.com"
        )

        # empty data
        self.empty_data = {}
        # blank data
        self.blank_data = {
            "username":"",
            "password":"",
            "role":""
        }
  
        self.register_employer_url = reverse('register-employer')
        self.register_jobseeker_url = reverse('register-jobseeker')
        self.update_account_url = reverse('update-account')
        self.change_password_url = reverse('change-password')
       
    def test_register_employer(self):

        data = {
            "user":{
            "username":"test_employer",
            "password":"test_password",
            "role":"EM"
            }
         
        }

        response = self.client.post(self.register_employer_url, data, format='json')
     
        user = User.objects.get(username='test_employer')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(user.username, 'test_employer')
        self.assertEqual(user.role, 'EM')
     
    
    def test_register_jobseeker(self):

        data = {
            "user":{
                "username":"test_jobseeker",
                "password":"test_password",
                "role":"JS"
            }
     
        }

        response = self.client.post(self.register_jobseeker_url, data, format='json')

        user = User.objects.get(username='test_jobseeker')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(user.username, 'test_jobseeker')
        self.assertEqual(user.role, 'JS')
      
    
    def test_duplicate_employer_account(self):
 
        data ={
            "username":"employer_username",
            "password":"employer_password",
            "role":"EM"
        }

        response = self.client.post(self.register_employer_url, data, format='json')
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST) 

    def test_duplicate_jobseeker_account(self):
 
        data ={
            "username":"job_seeker",
            "password":"job_seeker_password",
            "role":"JS"
        }

        response = self.client.post(self.register_jobseeker_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
       
    
    def test_register_empty_field(self):
        
        response = self.client.post(self.register_employer_url, self.empty_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_blank_field(self):
        
        response = self.client.post(self.register_employer_url, self.blank_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_employer_account(self):
        self.client.force_authenticate(user=self.employer_user)
        data = {
            "username":"emp1",
            "password":"emp2",
            "role":"EM"
        }

        response = self.client.patch(self.update_account_url, data, format='json')
        user = User.objects.get(username='emp1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(user.username,'emp1')


    def test_update_jobseeker_account(self):
        self.client.force_authenticate(user=self.jobseeker_user)
        data = {
            "username":"js1",
            "password":"js2",
            "role":"JS"
        }

        response = self.client.patch(self.update_account_url, data, format='json')
        user = User.objects.get(username='js1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(user.username,'js1')

    def test_employer_change_password(self):
        self.client.force_authenticate(user=self.employer_user)
        data = {
            "password":"test_password"
        }

        response = self.client.put(self.change_password_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), "Change Password Success")
    
    def test_jobseeker_change_password(self):
        self.client.force_authenticate(user=self.jobseeker_user)
        data = {
            "password":"test_password"
        }

        response = self.client.put(self.change_password_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), "Change Password Success")
    
    def test_jobseeker_change_password_missing_field(self):
        self.client.force_authenticate(user=self.jobseeker_user)
        data = {}

        response = self.client.put(self.change_password_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_jobseeker_change_password_blank_field(self):
        self.client.force_authenticate(user=self.jobseeker_user)
        data = {
            "password":""
        }
        
        response = self.client.put(self.change_password_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_employer_change_password_missing_field(self):
        self.client.force_authenticate(user=self.employer_user)
        data = {}

        response = self.client.put(self.change_password_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_employer_change_password_blank_field(self):
        self.client.force_authenticate(user=self.employer_user)
        data = {
            "password":""
        }
        
        response = self.client.put(self.change_password_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_change_password_authentication(self):
        data = {
            "password":"change_password"
        }
        
        response = self.client.put(self.change_password_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    




