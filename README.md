# JobBoard Full-Stack Job Portal

A full-stack job board where companies can post openings and job seekers can search, filter, and apply built with Django.

🔗 **Live Demo:** (https://job-board-pearl-three.vercel.app/)

## Features

- 🔍 Search and filter jobs by title, status, and job type
- 📝 Employers can post, edit, and close job listings
- 👤 Job seekers can create profiles and apply directly
- 📧 Email OTP verification for password reset
- 🔐 Role-based authentication (job seeker / employer / admin)
- 📊 Django admin for moderating listings

## Tech Stack

- **Backend:** Django, Django REST Framework
- **Database:** PostgreSQL
- **Pytest:** Tests
- **Cloudinary:**  Cloudinary
- **Auth:** JWT Authentication (`djangorestframework-simplejwt`)
- **Frontend:** Tailwind CSS, DaisyUI
- **Email:** SMTP
- **Hosting:** Backend on Render, Frontend on Vercel
- **Hunicorn:** WSGI server (production)


## Getting Started

### Prerequisites

- Python 3.12.7
- React
- PostgreSQL (local instance or hosted Render)
- `pip` and `virtualenv`

# Clone the repo
git clone https://github.com/yourusername/jobboard.git <br>
cd jobboard/backend

# Create and activate a virtual environment
python -m venv venv <br>
source venv/bin/activate   # Windows: venv\Scripts\activate <br>

# Install dependencies
- pip install -r requirements.txt


### Frontend Setup
cd jobboard/frontend
npm install
npm run dev


 API Documentation 
 - Swagger UI: /api/schema/swagger-ui/ 
 - ReDoc: /api/schema/redoc/ 

### Environment Variables

Create a `.env` file inside the `backend` folder:
# DATABASE
DATABASE_NAME=job_board_db <br>
DATABASE_USER=postgres <br>
DATABASE_PASSWORD=your_secure_password <br>

# Email
EMAIL_HOST_USER=your_email@gmail.com <br>
EMAIL_HOST_PASSWORD=your_app_password

# DJANGO
SECRET_KEY=your_django_secret_key <br>
DEBUG=True <br>

# Cloudinary
CLOUD_NAME = your cloudinary name <br>
API_KEY =your api key <br>
API_SECRET= your api secret <br>

# Email (SMTP)
EMAIL_HOST_USER=your_email <br>
EMAIL_HOST_PASSWORD=your_email_password 


### Running Locally


# Apply migrations
python manage.py migrate

# Create a superuser (for admin access)
python manage.py createsuperuser

# Run the development server
python manage.py runserver


Backend runs at `http://127.0.0.1:8000`
Frontend runs at `http://127.0.0.1:5173` 

## Usage

- **Job seekers:** Sign up, browse listings, filter by job title, and apply with a saved profile or resume upload.
- **Employers:** Create an account, post a job listing, manage applicants, and close listings once filled.
- **Admins:** Manage all listings, users, and applications via `/admin`.


## Deployment

- **Backend:** Deployed on [Render](https://render.com)
- **Frontend:** Deployed on [Vercel](https://vercel.com)

## Running Tests


python manage.py test
