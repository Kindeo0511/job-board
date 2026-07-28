from account.models import User, JobSeeker, Employer

def RegisterAccount(data):
    user = User.objects.create_user(**data)

    if user.role == "JS":
        JobSeeker.objects.create(user=user)
    elif user.role == "EM":
        Employer.objects.create(user=user)
    return user

def  get_user_account(username):
    return User.objects.get(username=username)

def change_password(user, new_password):
    password = new_password['password']

    user.set_password(password)
    user.save()
    return user


def UpdateAccount(old_data,data):
    password = data.pop('password', None)
    
    for field, value in data.items():
        setattr(old_data,field,value)

    if password:
        old_data.set_password(password)
    old_data.save()
    return old_data

def get_email(email):
    return User.objects.get(email=email)

