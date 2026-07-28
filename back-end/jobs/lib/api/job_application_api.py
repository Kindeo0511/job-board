from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from account.models import User
from jobs.lib.serializer.job_serializer import *
from jobs.lib.service.job_service import *
from account.lib.services.job_seeker_service import *
from account.lib.services.employer_service import get_employer
from rest_framework.permissions import IsAuthenticated,AllowAny
from jobs.permission import IsEmployer, IsEmployerOwner, IsEmployerJobOwner,IsEmployerJobApplicationOwner, IsJobSeeker, IsJobSeekerOwner
from jobs.lib.common.custom_pagination import StandardResultsSetPagination


paginator = StandardResultsSetPagination()

class GetAllJobApplicationView(APIView):
    permission_classes = [AllowAny]
    def get(self, request: Request) -> Response:
        job_application = get_all_job_application()
        serializer = JobApplicationSerializer(job_application, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class GetAllJobApplicationsByEmployer(APIView):
    permission_classes = [IsAuthenticated, IsEmployer]
    def get(self,request: Request) -> Response:
        job_title =request.query_params.get("job_title",None)
        job_status = request.query_params.get("job_status",None)
        
        employer = get_employer(request.user)
        job = GetJobByEmployer(employer,job_title)
        applicants = get_all_job_application_by_job_employer(job,job_status)

        page_result = paginator.paginate_queryset(applicants, request)

        serializer = JobApplicationSerializer(page_result,many=True,context ={"request": request})
        return paginator.get_paginated_response(serializer.data)

class ApplyJobApplicationView(APIView):
    permission_classes = [IsAuthenticated, IsJobSeeker]
    def post(self, request, job_id:int) -> Response:

        job = get_job(job_id)
        applicant = get_job_seeker_by_user(request.user)   
        job_application = create_job_application(job,applicant)
        serializer = JobApplicationSerializer(job_application)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
  
class GetMyJobApplicationView(APIView):
    permission_classes = [IsAuthenticated, IsJobSeeker]
    def get(self, request: Request) -> Response:
        filter_by_status = request.query_params.get("status", None)
        jobseeker = get_job_seeker_by_user(request.user)
        applicant = get_job_application_by_user(jobseeker, filter_by_status)
        page_result = paginator.paginate_queryset(applicant, request)
        serializer = JobApplicationSerializer(page_result, many=True, context={"request": request})

        return paginator.get_paginated_response (serializer.data)
 
class GetTotalByStatusView(APIView):
    permission_classes = [IsAuthenticated, IsEmployer]
    def get(self, request: Request) -> Response:
        
        employer = get_employer(request.user)
        job = GetJobByEmployer(employer,None)

        total_applicants = get_total_job_applications(job)
        total_new_applicant = get_total_by_status("pending",job)
        total_interview = get_total_by_status("interview",job)
        total_accepted = get_total_by_status("accepted",job)
        total_rejected = get_total_by_status("rejected",job)
        
        return Response({
            "total_applicants":total_applicants,
            "total_new_applicant":total_new_applicant,
            "total_interview":total_interview,
            "total_accepted":total_accepted,
            "total_rejected":total_rejected,
                         }, status=status.HTTP_200_OK)
    
class UpdateJobApplicationStatusVIew(APIView):
    permission_classes = [IsAuthenticated, IsEmployer, IsEmployerJobApplicationOwner]
    def patch(self, request, pk:int) -> Response:
        try:
            job_application = get_job_application_by_id(pk)
        except JobApplication.DoesNotExist:
            return Response ({"error":"Job application not found."}, status=status.HTTP_404_NOT_FOUND)
  
        self.check_object_permissions(request, job_application)
        
        serializer = JobApplicationSerializer(data=request.data)

        if serializer.is_valid():
            data = update_job_application_status(job_application,serializer.validated_data)
            serializer = JobApplicationSerializer(data)

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class GetJobApplicationByIdView(APIView):
    permission_classes = [IsAuthenticated, IsEmployer, IsEmployerJobApplicationOwner]
    def get(self,request, pk: int) -> Response:
        try:
            data = get_job_application_by_id(pk)
        except JobApplication.DoesNotExist:
            return Response({"error":"Job application not found."}, status=status.HTTP_404_NOT_FOUND)
        self.check_object_permissions(request, data)
        serializer = JobApplicationSerializer(data, context ={"request": request})

        return Response(serializer.data, status=status.HTTP_200_OK)
   