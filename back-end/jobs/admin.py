from django.contrib import admin
from jobs.models import Job, JobApplication, Qualification, Benefit

# Register your models here.


class QualificationInline(admin.StackedInline):
    model = Qualification
    extra = 0

class BenefitInline(admin.StackedInline):
    model = Benefit
    extra = 0


class JobAdmin(admin.ModelAdmin):
    
    search_fields = ["title"]
    list_filter = ["title","job_type","is_active"]
    list_display = ["get_username","title","salary_min","salary_max"
                    ,"min_exp","max_exp","job_type","location"
                    ,"is_active","created_at"]
    fieldsets = [(
        "Employer",{
            "fields": ["employer"],
        },
    ),
    (
        "Job Details",{
            "fields": ["title","salary_min","salary_max",
                       "min_exp","max_exp","job_type",
                       "location","is_active"]
        }
        )
              ]
    def get_username(self, obj):
        return obj.employer.user.get_full_name()
    get_username.short_description = "Name"

    inlines = [QualificationInline, BenefitInline]

class JobApplicationAdmin(admin.ModelAdmin):
    search_fields = ["job__title"]
    list_filter = ["status"]
    list_display = ["get_applicant","job","status","applied_at"]
    fieldsets = [(
        "Job",{
            "fields": ["job"],
        },
    ),
    (
        "Applicant",{
            "fields": ["applicant", "status"]
        }
        )
                ]
    def get_applicant(self, obj):
        return obj.applicant.user.get_full_name()
    get_applicant.short_description = "applicant name"
    

admin.site.register(JobApplication, JobApplicationAdmin)
admin.site.register(Job, JobAdmin)
