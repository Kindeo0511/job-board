from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from account.models import User, JobSeeker, WorkExperience, Education, Skill, Employer


class CustomUserAdmin(BaseUserAdmin):
    list_filter = ["is_staff", "is_superuser", "role", "is_active"]
    list_display = ["username", "first_name", "last_name", "email",
                     "is_active", "is_staff", "is_superuser", "role"]
    search_fields = ["username"]

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal Details", {"fields": ("first_name", "last_name", "email")}),
        ("Role", {"fields": ("role", "is_staff", "is_superuser", "is_active")}),
        ("Advanced", {"fields": ("groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "password1", "password2", "role", "is_staff", "is_active"),
        }),
    )


class EmployerUser(admin.ModelAdmin):
    list_filter = ["industry"]
    list_display = ["get_username", "company", "industry", "company_size"]
    search_fields = ["user__username", "company"]

    fieldsets = (
        ("User", {"fields": ("user",)}),
        ("Company Details", {"fields": ("company", "industry", "company_size",
                                         "description", "phone_number", "website_url",
                                         "location", "photo")}),
    )

    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = "Username"

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "user":
            kwargs["queryset"] = User.objects.filter(role=User.Role.EMPLOYER)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


class WorkExperienceInline(admin.StackedInline):
    model = WorkExperience
    extra = 0


class EducationInline(admin.StackedInline):
    model = Education
    extra = 0
    verbose_name = "Education"
    verbose_name_plural = "Educations"


class SkillInline(admin.StackedInline):
    model = Skill
    extra = 0
    verbose_name = "Skill"
    verbose_name_plural = "Skills"


class JobSeekerUser(admin.ModelAdmin):
    list_display = ["get_username", "job_title", "phone_number", "location"]
    search_fields = ["user__username", "job_title"]

    fieldsets = (
        ("JobSeeker Account", {"fields": ("user",)}),
        ("JobSeeker Details", {"fields": ("job_title", "phone_number", "location",
                                           "portfolio_url", "resume", "photo",
                                           "about")}),
    )
    inlines = [WorkExperienceInline, EducationInline, SkillInline]

    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = "Username"

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "user":
            kwargs["queryset"] = User.objects.filter(role=User.Role.JOBSEEKER)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


admin.site.register(User, CustomUserAdmin)
admin.site.register(Employer, EmployerUser)
admin.site.register(JobSeeker, JobSeekerUser)