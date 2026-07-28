from rest_framework.permissions import BasePermission

class IsEmployer(BasePermission):

    def has_permission(self, request, view):
        return bool(request.user
                     and request.user.is_authenticated 
                     and request.user.role == "EM")

class IsEmployerOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class IsEmployerJobOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.employer.user == request.user
    
class IsEmployerJobApplicationOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.job.employer.user == request.user


    
class IsJobSeeker(BasePermission):
    
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "JS"
        )

class IsJobSeekerOwner(BasePermission):

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user