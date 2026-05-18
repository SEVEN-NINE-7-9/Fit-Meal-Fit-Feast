# FitMeal/FitFeast

FitMeal is an AI-driven Fitness Nutrition & Personalized Meal Delivery Platform that combines smart diet planning, meal tracking, live dietitian consultations, and healthy meal ordering in one ecosystem.

The platform helps users achieve fitness goals through personalized nutrition plans, AI-powered meal analysis, and verified healthy food vendors.

---

## Features

- AI-based personalized diet planning
- Food image recognition for nutrition analysis
- Meal tracking and feedback system
- Healthy meal marketplace
- Live dietitian consultations
- Secure authentication system
- Real-time order tracking
- Responsive frontend UI

---

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- Bootstrap

### Backend
- Django
- Python
- REST APIs

### Database
- MySQL

### AI / ML
- TensorFlow / Keras
- OpenCV

### Other Tools
- JWT Authentication
- Firebase Auth
- WebRTC
- GitHub
- AWS EC2

---

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/fitmeal.git
cd fitmeal
```

---

### 2. Frontend Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Vite will start the project on: `http://localhost:5173`

---

### 3. Backend Setup (Django)

Open a new terminal and navigate to the backend folder:

```bash
cd backend
```

**Create Virtual Environment**

Windows:
```bash
python -m venv venv
venv\Scripts\activate
```

Mac/Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

**Install Dependencies & Run Server**

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend will run on: `http://127.0.0.1:8000`

---

## Environment Variables

Create a `.env` file in both the `frontend/` and `backend/` folders.

**Frontend `.env`**
```
VITE_API_URL=http://127.0.0.1:8000
```

**Backend `.env`**
```
SECRET_KEY=your_secret_key
DEBUG=True
DB_NAME=fitmeal
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
```

---

## Database Setup

Create the MySQL database:

```sql
CREATE DATABASE fitmeal;
```

Then update your database credentials in the backend `.env` file.

---

## Folder Structure

```
fitmeal/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   └── app/
│
└── README.md
```

---

## Available Commands

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build production files |
| `npm run preview` | Preview production build |

### Backend

| Command | Description |
|---|---|
| `python manage.py runserver` | Start Django server |
| `python manage.py migrate` | Apply migrations |
| `python manage.py createsuperuser` | Create admin user |

---

## API Integration

The frontend communicates with the Django backend using REST APIs.

Example endpoints:

```
GET  /api/diet-plans/
POST /api/login/
POST /api/meal-upload/
```

---

## Future Improvements

- Wearable device integration
- Grocery recommendation system
- AI vendor insights
- Regional language support
- Mental wellness tracking

---

## Contributors

- Samarth Baswaraj Ghatwane
- DilshadAli Vazir Ansari
- Jay Rasesh Shah
- Rayyan Munshi
- Raihan Inamdar

**Department of Computer Engineering**
Vishwakarma University, Pune