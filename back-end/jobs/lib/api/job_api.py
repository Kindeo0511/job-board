from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from account.models import User
from jobs.lib.serializer.job_serializer import *
from jobs.lib.service.job_service import *
from account.lib.services.employer_service import *
from rest_framework.permissions import IsAuthenticated
from jobs.lib.common.custom_pagination import StandardResultsSetPagination
from rest_framework.permissions import AllowAny, IsAuthenticated
from jobs.permission import IsEmployer, IsEmployerOwner, IsEmployerJobOwner
paginator = StandardResultsSetPagination()

class AllJobView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    def get(self, request: Request) -> Response:
        
        job_title = request.query_params.get("title", None)
        jobs = view_all_jobs(job_title)
        page_result = paginator.paginate_queryset(jobs,request)
        serializer = JobSerializer(page_result, many=True, context={"request": request})

        return paginator.get_paginated_response(serializer.data)
    
class GetJobByEmployerView(APIView):
    permission_classes = [IsAuthenticated, IsEmployer]
    def get(self, request: Request) -> Response:
        employer = get_employer(request.user)
        is_active = request.query_params.get("is_active",None)   
        jobs = GetJobByEmployer(employer, is_active)
        page_result = paginator.paginate_queryset(jobs, request)
        serializer = JobSerializer(page_result, many=True)
        return paginator.get_paginated_response(serializer.data)

class CountTotal(APIView):
    permission_classes = [IsAuthenticated, IsEmployer]
    def get(self, request: Request) -> Response:
        employer = get_employer(request.user)
        total_jobs = CountTotalJobPosts(employer)
        total_active_jobs = CountTotalActive(employer)
        total_applicants = CountTotalApplicantsByEmployer(employer)
        return Response({"total_jobs": total_jobs,"total_active_jobs": total_active_jobs,
                         "total_applicants": total_applicants
                         }, status=status.HTTP_200_OK)

class CreateJobView(APIView):
    permission_classes = [IsAuthenticated, IsEmployer]
    def post(self, request: Request) -> Response:
        
        employer = get_employer(request.user)
        serializer = JobSerializer(data=request.data, context={'employer':employer})

        if serializer.is_valid():
            job = CreateJob(employer,serializer.validated_data)
            serializer = JobSerializer(job)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class UpdateJobView(APIView):
    permission_classes = [IsAuthenticated, IsEmployer, IsEmployerJobOwner]

    def put(self, request, pk:int) -> Response:
        try:
            old_data = get_job(pk)
        except Job.DoesNotExist:
            return Response({"error":"Job not found."}, status=status.HTTP_404_NOT_FOUND)
        
        self.check_object_permissions(request, old_data)
      
        employer = get_employer(request.user)
        serializer = JobSerializer(data = request.data, context={'employer':employer, 'instance':old_data})

        if serializer.is_valid():
            new_data = UpdateJob(old_data, serializer.validated_data)
            serializer = JobSerializer(new_data)

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)


     
    
    def patch(self, request, pk: int) -> Response:
        old_data = get_job(pk)
        employer = get_employer(request.user)
        serializer = JobSerializer(data = request.data, context={'employer':employer, 'instance':old_data}, partial=False)

        if serializer.is_valid():
            new_data = UpdateJob(old_data, serializer.validated_data)
            serializer = JobSerializer(new_data)

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)



  