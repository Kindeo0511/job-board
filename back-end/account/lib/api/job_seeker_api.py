from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from account.models import Employer
from account.lib.serializer.account_serializer import *
from account.lib.services.job_seeker_service import *
from rest_framework.permissions import IsAuthenticated
from account.permission import IsJobSeeker, IsJobSeekerOwner, IsWorkExperienceOwner, IsEducationOwner, IsSkillOwner

class CreateJobSeekerView(APIView):
    
    permission_classes = [IsAuthenticated, IsJobSeeker]
    def post(self, request: Request) -> Response:

        serializer = CreateJobSeekerSerializer(data=request.data)

        if serializer.is_valid():
            job = create_job_seeker(serializer.validated_data)
            serializer = ReadJobSeekerSerializer(job)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UploadJobSeekerResumeView(APIView):
    permission_classes = [IsAuthenticated, IsJobSeeker]
    def put(self, request: Request) -> Response:
        data = get_job_seeker_by_user(request.user)
        serializer = JobSeekerResumeSerializer(data= request.data)
        
        if serializer.is_valid():
            resume = upload_resume(data,serializer.validated_data)
            serializer = JobSeekerResumeSerializer(resume)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetResumeView(APIView):
    permission_classes = [IsAuthenticated, IsJobSeeker]
    def get(self, request: Request) -> Response:

        try:
            job_seeker = get_job_seeker_by_user(request.user)
            serializer = JobSeekerResumeSerializer(job_seeker)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except JobSeeker.DoesNotExist:
            return Response({"error: Job Seeker does not exists!"}, status=status.HTTP_404_NOT_FOUND)
        
class DeleteJobSeekerResumeView(APIView, IsJobSeeker):
    permission_classes = [IsAuthenticated]
    def delete(self, request : Request) -> Response:
        data = get_job_seeker_by_user(request.user)
        delete_resume(data);
        return Response(status=status.HTTP_204_NO_CONTENT)

class UpdateBasicInfoView(APIView):
    permission_classes = [IsAuthenticated, IsJobSeeker]
    def put(self, request:Request) -> Response:
        try:
                
            job_seeker = get_job_seeker_by_user(request.user)
            serializer = JobSeekerBasicInfoSeriliazer(data=request.data)

            if serializer.is_valid():
                job_seeker = update_job_seeker(job_seeker,serializer.validated_data)
                serializer = JobSeekerBasicInfoSeriliazer(job_seeker)

                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except JobSeeker.DoesNotExist:
            return Response({"error":"Job Seeker does not exists!"}, status=status.HTTP_404_NOT_FOUND)
        
class UpdateContactInfoView(APIView):
    permission_classes = [IsAuthenticated, IsJobSeeker]
    def put(self, request:Request) -> Response:
        try:
                
            job_seeker = get_job_seeker_by_user(request.user)
            serializer = JobSeekerContactInfoSerializer(data=request.data)

            if serializer.is_valid():
                job_seeker = update_job_seeker(job_seeker,serializer.validated_data)
                serializer = JobSeekerContactInfoSerializer(job_seeker)

                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except JobSeeker.DoesNotExist:
            return Response({"error":"Job Seeker does not exists!"}, status=status.HTTP_404_NOT_FOUND)
        
class UpdateAboutView(APIView):
    permission_classes = [IsAuthenticated, IsJobSeeker]
    def put(self, request:Request) -> Response:
        try:
                
            job_seeker = get_job_seeker_by_user(request.user)
            serializer = JobSeekerAboutInfoSerializer(data=request.data)

            if serializer.is_valid():
                job_seeker = update_job_seeker(job_seeker,serializer.validated_data)
                serializer = JobSeekerAboutInfoSerializer(job_seeker)

                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except JobSeeker.DoesNotExist:
            return Response({"error":"Job Seeker does not exists!"}, status=status.HTTP_404_NOT_FOUND)
        
class UpdateJobSeekerView(APIView):
    permission_classes = [IsAuthenticated, IsJobSeeker]
    def put(self, request:Request) -> Response:
        try:
                
            job_seeker = get_job_seeker_by_user(request.user)
            serializer = UpdateJobSeekerSerializer(data=request.data)

            if serializer.is_valid():
                job_seeker = update_job_seeker(job_seeker,serializer.validated_data)
                serializer = ReadJobSeekerSerializer(job_seeker)

                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except JobSeeker.DoesNotExist:
            return Response({"error":"Job Seeker does not exists!"}, status=status.HTTP_404_NOT_FOUND)
        
    def patch(self, request: Request) -> Response:
        try:
            job_seeker = get_job_seeker_by_user(request.user)
            serializer = UpdateJobSeekerSerializer(data=request.data, partial=False)

            if serializer.is_valid():
                job_seeker = update_job_seeker(job_seeker,serializer.validated_data)
                serializer = ReadJobSeekerSerializer(job_seeker)

                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except JobSeeker.DoesNotExist:
            return Response({"error":"Job Seeker does not exists!"}, status=status.HTTP_404_NOT_FOUND)

class GetAllJobSeekerView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request: Request) -> Response:
        
        job_seeker = get_all_job_seeker()
        serializer = ReadJobSeekerSerializer(job_seeker, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

class GetJobSeekerView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk: int) -> Response:

        try:
            job_seeker = get_job_seeker(pk)
            serializer = ReadJobSeekerSerializer(job_seeker)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except JobSeeker.DoesNotExist:
            return Response({"error: Job Seeker does not exists!"}, status=status.HTTP_404_NOT_FOUND)
        
class UploadPhotoView(APIView):
    permission_classes = [IsAuthenticated, IsJobSeeker]
    def put(self, request: Request) -> Response:
        data = get_job_seeker_by_user(request.user)
        serializer = JobSeekerPhotoSerializer(data = request.data)

        if serializer.is_valid():
            data = upload_photo(data,serializer.validated_data)
            serializer = JobSeekerPhotoSerializer(data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetJobSeekerProfileView(APIView):
    permission_classes = [IsAuthenticated, IsJobSeeker]
    def get(self, request: Request) -> Response:
        job_seeker = get_job_seeker_by_user(request.user)
        serializer = ReadJobSeekerSerializer(job_seeker)
        return Response(serializer.data, status=status.HTTP_200_OK)

class JobSeekerProfileView(APIView):
    permission_classes = [IsAuthenticated, IsJobSeeker]
    def get(self, request: Request) -> Response:
        user = get_job_seeker_by_user(request.user)
        serializer = JobSeekerProfileSerializer(user,context ={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

# WORK EXPERIENCE API VIEW
class CreateWorkExperienceView(APIView):
    permission_classes = [IsAuthenticated, IsJobSeeker]
    def post(self, request: Request) -> Response:
        job_seeker = get_job_seeker_by_user(request.user)
        serializer = WorkExperienceSerializer(data=request.data, context={"job_seeker": job_seeker})

        if serializer.is_valid():
            work_experience = create_work_experience(job_seeker,serializer.validated_data)
            serializer = WorkExperienceDisplaySerializer(work_experience)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateWorkExperienceView(APIView):
    permission_classes = [IsAuthenticated,IsJobSeeker, IsWorkExperienceOwner]

    def put(self, request, pk:int) -> Response:
        try:
            old_data = get_work_experience_by_id(pk)
        except WorkExperience.DoesNotExist:
            return Response({"error":"Work experience not found."}, status=status.HTTP_404_NOT_FOUND)
        
        self.check_object_permissions(request, old_data)
      
        job_seeker = get_job_seeker_by_user(request.user)
        serializer = WorkExperienceSerializer(data=request.data, context={'job_seeker':job_seeker, 'instance':old_data})
        if serializer.is_valid():
            data = update_work_experience(old_data,serializer.validated_data)
            serializer = WorkExperienceDisplaySerializer(data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

       

class DeleteWorkExperienceView(APIView):
    permission_classes = [IsAuthenticated, IsJobSeeker, IsWorkExperienceOwner]
    def delete(self, request, pk: int) -> Response:
        try:
            data = get_work_experience_by_id(pk)
        except WorkExperience.DoesNotExist:
            return Response({"error":"Work experience not found."}, status=status.HTTP_404_NOT_FOUND)
        self.check_object_permissions(request, data)
        delete_work_experience(data)

        return Response(status=status.HTTP_204_NO_CONTENT)

      
     

    

# EDUCATION API VIEW
class CreateEducationView(APIView):
    permission_classes = [IsAuthenticated, IsJobSeeker]
    def post(self, request:Request) -> Response:
       
        job_seeker = get_job_seeker_by_user(request.user)
        serializer = EducationSerializer(data=request.data, context={'job_seeker':job_seeker})

        if serializer.is_valid():
            data = create_education(job_seeker,serializer.validated_data)
            serializer = EducationDisplaySerializer(data,)

            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateEducationView(APIView):
    permission_classes =[IsAuthenticated, IsJobSeeker, IsEducationOwner]
    def put(self, request, pk:int) -> Response:
        try:
            old_data = get_education_by_id(pk)
        except Education.DoesNotExist:
            return Response({"error":"Education not found."}, status=status.HTTP_404_NOT_FOUND)
        
        job_seeker = get_job_seeker_by_user(request.user)
        serializer = EducationSerializer(data=request.data, context={'job_seeker':job_seeker,
                                                                    'instance':old_data})
        self.check_object_permissions(request, old_data)
        if serializer.is_valid():
            data = update_education(old_data, serializer.validated_data)
            serializer = EducationDisplaySerializer(data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteEducationView(APIView):
    permission_classes = [IsAuthenticated, IsJobSeeker, IsEducationOwner]
    def delete(self, request, pk:int) -> Response:
        try:
            data = get_education_by_id(pk)
        except Education.DoesNotExist:
            return Response({"error":"Education not found."}, status=status.HTTP_404_NOT_FOUND)
        self.check_object_permissions(request, data)
        delete_education(data)
        return Response(status=status.HTTP_204_NO_CONTENT)

       
    
# SKILL API VIEW
class CreateSkillView(APIView):
    permission_classes = [IsAuthenticated, IsJobSeeker]
    def post(self, request: Request) -> Response:
    
        job_seeker = get_job_seeker_by_user(request.user)
        serializer = SkillSerializer(data=request.data, context={'job_seeker':job_seeker})

        if serializer.is_valid():
            data = create_skill(job_seeker,serializer.validated_data)
            serializer = SkillDisplaySerializer(data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateSkillView(APIView):
    permission_classes = [IsAuthenticated, IsJobSeeker, IsSkillOwner]
    def put(self, request, pk:int) -> Response:
        try:
            old_data = get_skill_by_id(pk)
        except Skill.DoesNotExist:
            return Response({"error":"Skill not found."}, status=status.HTTP_404_NOT_FOUND)
        self.check_object_permissions(request, data)
        job_seeker = get_job_seeker_by_user(request.user)
        serializer = SkillSerializer(data=request.data,
                                      context={'job_seeker':job_seeker,
                                               'instance':old_data})
       
        if serializer.is_valid():
            data = update_skill(old_data, serializer.validated_data)
            serializer = SkillDisplaySerializer(data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteSkillView(APIView):
    permission_classes = [IsAuthenticated, IsJobSeeker, IsSkillOwner ]
    def delete(self, request, pk:int) ->Response:
        try:
            data = get_skill_by_id(pk)
        except Skill.DoesNotExist:
            return Response({"error":"Skill not found."}, status=status.HTTP_404_NOT_FOUND)
        self.check_object_permissions(request, data)
        delete_skill(data)
        return Response(status=status.HTTP_204_NO_CONTENT)
       
       


        




