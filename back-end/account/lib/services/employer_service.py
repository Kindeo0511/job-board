from account.models import Employer, User



def get_all_employer():
    return Employer.objects.all()

def get_employer(user):
    return Employer.objects.get(user=user)

def get_employer_by_id(emp_id):
    return Employer.objects.get(id=emp_id)

def create_employer(data):
    user_data = data.pop('user')
    user = User.objects.create_user(**user_data)
    return Employer.objects.create(user=user,**data)

def upload_photo(old_data, data):
    for field, value in data.items():
        setattr(old_data, field, value)
    old_data.save()
    return old_data

def update_employer(emp,data):
    user_data = data.pop('user',None)
   
    if user_data:
        user = emp.user
        for field, value in user_data.items():
            setattr(user,field,value)
        user.save()

    for field, value in data.items():
        setattr(emp, field,value)
    emp.save()
    return emp

def delete_employer(employer):
    employer.delete()