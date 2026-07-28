from django.urls import path
from account.lib.api.account_api import *
from account.lib.api.employer_api import *
from account.lib.api.job_seeker_api import *
urlpatterns =[
    path("account/me/",GetRoleAccountView.as_view(), name="get-self-account"),
    path("account/update/",UpdateUserName.as_view(), name="update-account"),
    path("account/change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("account/reset-password/", ResetPasswordView.as_view(), name="reset-password"),
    path("register/employer/",RegisterEmployerView.as_view(), name="register-employer"),
    path("register/jobseeker/",RegisterJobSeekerView.as_view(), name="register-jobseeker"),
    path("otp/",EmailOTPView.as_view(), name="otp"),
    path("verify-otp/",VerifyOTPView.as_view(), name="verify-otp"),

    path("employer/",GetAllEmployerView.as_view(), name="get-all-employer"),
    path("employer/me/",GetEmployerProfileView.as_view(), name="get-employer-profile"),
    path("employer/upload/photo/",UploadEmployerPhotoView.as_view(), name="upload-employer-photo"),
    path("employer/update/company-profile/",UpdateEmployerCompanyProfileView.as_view(), name="update-employer"),
    path("employer/update/company-contact/",UpdateEmployerCompanyContactView.as_view(), name="update-employer-contact"),
    path("employer/<int:emp_id>/",GetEmployerView.as_view(), name="get-employer"),
    
    path("job-seeker/profile/",JobSeekerProfileView.as_view(), name="profile"),
    path("job-seeker/me/",GetJobSeekerProfileView.as_view(), name="get-job-seeker-profile"),
    path("job-seeker/upload/resume/",UploadJobSeekerResumeView.as_view(), name="upload-resume"),
    path("job-seeker/delete/resume/",DeleteJobSeekerResumeView.as_view(), name="delete-resume"),
    path("job-seeker/upload/photo/",UploadPhotoView.as_view(), name="upload-photo"),
    path("job-seeker/my/resume/",GetResumeView.as_view(), name="get-job-seeker-resume"),
    path("job-seeker/update/basic-info/",UpdateBasicInfoView.as_view(), name="update-job-seeker-basic-info"),
    path("job-seeker/update/contact-info/",UpdateContactInfoView.as_view(), name="update-job-seeker-contact-info"),
    path("job-seeker/update/about/",UpdateAboutView.as_view(), name="update-job-seeker-about"),
    path("job-seeker/update/",UpdateJobSeekerView.as_view(), name="update-job-seeker"),
    path("job-seeker/",GetAllJobSeekerView.as_view(), name="get-all-job-seeker"),
    path("job-seeker/<int:pk>/",GetJobSeekerView.as_view(), name="get-job-seeker"),

    path("add/experience/",CreateWorkExperienceView.as_view(), name="add-work-experience"),
    path("update/experience/<int:pk>/",UpdateWorkExperienceView.as_view(), name="update-work-experience"),
    path("delete/experience/<int:pk>/",DeleteWorkExperienceView.as_view(), name="delete-work-experience"),

    path("add/education/",CreateEducationView.as_view(), name="add-education"),
    path("update/education/<int:pk>/",UpdateEducationView.as_view(), name="update-education"),
    path("delete/education/<int:pk>/",DeleteEducationView.as_view(), name="delete-education"),

    path("add/skill/",CreateSkillView.as_view(), name="add-skill"),
    path("update/skill/<int:pk>/",UpdateSkillView.as_view(), name="update-skill"),
    path("delete/skill/<int:pk>/",DeleteSkillView.as_view(), name="delete-skill"),
]