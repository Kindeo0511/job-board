from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from account.models import User
from account.lib.serializer.account_serializer import *
from account.lib.services.register_account_service import RegisterAccount, get_user_account, UpdateAccount, change_password, get_email
from account.lib.services.employer_service import *
from account.lib.services.job_seeker_service import *
from rest_framework.permissions import AllowAny,IsAuthenticated

import random
from django.core.mail import send_mail
from django.conf import settings
from django.core.cache import cache

class RegisterEmployerView(APIView):
    permission_classes = [AllowAny]
    def post(self,request:Request) -> Response:
        serializer = CreateEmployerSerializer(data=request.data)

        if serializer.is_valid():

            employer  = create_employer(serializer._validated_data)
            serializer = CreateEmployerSerializer(employer)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class RegisterJobSeekerView(APIView):
    permission_classes = [AllowAny]
    def post(self, request: Request) -> Response:

        serializer = CreateJobSeekerSerializer(data=request.data)

        if serializer.is_valid():
            job_seeker = create_job_seeker(serializer.validated_data)
            serializer = CreateJobSeekerSerializer(job_seeker)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetRoleAccountView(APIView):
   
    permission_classes = [IsAuthenticated]
    def get(self, request: Request) -> Response:

        serializer = AccountRoleSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UpdateUserName(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request: Request) -> Response:
        user = get_user_account(request.user.username)
        serializer = AccountSerializer(data = request.data, partial = True)

        if serializer.is_valid():
            user = UpdateAccount(user,serializer.validated_data)
            serializer = AccountSerializer(user)

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request: Request) -> Response:
        user = get_user_account(request.user.username)
        serializer = ChangePasswordSerializer(data= request.data)

        if serializer.is_valid():
            change_password(user, serializer.validated_data)
 
            return Response("Change Password Success", status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def put(self, request: Request) -> Response:
        email = request.data.get('email')

        try:
            user = get_email(email)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            change_password(user, serializer.validated_data)
            return Response({"detail": "Password changed successfully."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class EmailOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request): 
        try:
            user = get_email( request.data.get('email'))
        except User.DoesNotExist:
            return Response({"error":"Email does not exists!"}, status=status.HTTP_404_NOT_FOUND)

        otp = random.randint(1000, 9999)
        cache.set(f"otp:{user.email}", otp, timeout=300)  # expires in 5 min

        subject = 'Your account verification email'
        message = f'Your OTP is {otp}'
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])

        return Response({"detail": "OTP sent successfully."}, status=status.HTTP_200_OK)

class VerifyOTPView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        if not email or not otp:
            return Response(
                {"detail": "Email and OTP are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        cached_otp = cache.get(f"otp:{email}")

        if cached_otp is None:
            return Response(
                {"detail": "OTP expired or not found. Please request a new one."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if str(cached_otp) != str(otp):
            return Response(
                {"detail": "Incorrect OTP. Please try again."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # OTP is correct — delete it so it can't be reused, then let them proceed
        cache.delete(f"otp:{email}")

        # Optional: issue a short-lived token here so the reset-password page
        # can prove this email was verified, without re-entering the OTP
        return Response(
            {"detail": "OTP verified successfully."},
            status=status.HTTP_200_OK
        )