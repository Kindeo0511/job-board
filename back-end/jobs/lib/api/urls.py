from django.urls import path
from jobs.lib.api.job_api import *
from jobs.lib.api.job_application_api import *
urlpatterns =[
    path("job/",AllJobView.as_view(),name="view-job"),
    path("job/employer/",GetJobByEmployerView.as_view(),name="employer-jobs"),
    path("job/create/",CreateJobView.as_view(),name="create-job"),
    path("job/update/<int:pk>/",UpdateJobView.as_view(),name="update-job"),
    path("job/total/",CountTotal.as_view(),name="total-job"),

    path("employer/applicants/",GetAllJobApplicationsByEmployer.as_view(),name="get-employer-applicants"),
    path("employer/applicant/<int:pk>/",GetJobApplicationByIdView.as_view(),name="get-employer-applicant"),
    path("job-application/total/",GetTotalByStatusView.as_view(),name="get-total-job-application"),
    path("job-application/<int:job_id>/apply/",ApplyJobApplicationView.as_view(),name="apply-job"),
    path("job-application/",GetAllJobApplicationView.as_view(),name="get-all-job-application"),
    path("my-job-application/",GetMyJobApplicationView.as_view(),name="get-my-job-application"),
    path("job-application/update/<int:pk>/",UpdateJobApplicationStatusVIew.as_view(),name="update-job-application"),
    
]
