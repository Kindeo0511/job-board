from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from account.models import Employer
from account.lib.serializer.account_serializer import *
from account.lib.services.employer_service import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from account.permission import IsEmployer, IsEmployerOwner


class GetAllEmployerView(APIView):
    permission_classes  = [AllowAny]
    def get(self, request: Request) -> Response:
        try:
            employer = get_all_employer()
            serializer = EmployerSerializer(employer,many=True)
            return Response(serializer.data, status=status.HTTP_200_OK) 
        except Exception as e:
            return Response(e,status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class UpdateEmployerCompanyProfileView(APIView):
    permission_classes  = [IsAuthenticated, IsEmployer]  
    def put(self,request: Request) -> Response:

        employer = get_employer(request.user)
        serializer = UpdateEmployerCompanyProfileSerializer(employer,request.data)

        if serializer.is_valid():
            employer = update_employer(employer,serializer.validated_data)
            serializer = UpdateEmployerCompanyProfileSerializer(employer)

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UpdateEmployerCompanyContactView(APIView):
    permission_classes  = [IsAuthenticated, IsEmployer]  
    def put(self,request: int) -> Response:

        employer = get_employer(request.user)
        serializer = UpdateEmployerCompanyContactProfileSerializer(employer,request.data)

        if serializer.is_valid():
            employer = update_employer(employer,serializer.validated_data)
            serializer = UpdateEmployerCompanyContactProfileSerializer(employer)

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetEmployerView(APIView):

    def get(self, request, emp_id:int) -> Response:

        try:
            employer = get_employer_by_id(emp_id)
            serializer = EmployerSerializer(employer)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except Employer.DoesNotExist:
            return Response({"error: Employer does not exists!"}, status=status.HTTP_404_NOT_FOUND)

class GetEmployerProfileView(APIView):
    permission_classes = [IsAuthenticated, IsEmployer]
    def get(self, request: Request) -> Response:
        user = get_employer(request.user)
        serializer = EmployerSerializer(user, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
       
class UploadEmployerPhotoView(APIView):
    permission_classes = [IsAuthenticated, IsEmployer]
    def patch(self, request: Request) -> Response:
        data = get_employer(request.user)
        serializer = EmployerPhotoSerializer(data = request.data)

        if serializer.is_valid():
            data = upload_photo(data,serializer.validated_data)
            serializer = EmployerPhotoSerializer(data, context={"request":request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



