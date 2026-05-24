# Email Confirmation System

A full-stack email subscription and confirmation system built with **Angular** (frontend) and **FastAPI** (backend), using **Mailpit** for SMTP testing and **SQLite**/**MySQL** for data persistence.


## 📋 Tech Stack

### Frontend
- **Framework:** Angular 21
- **Styling:** Tailwind CSS
- **Language:** TypeScript

### Backend
- **Framework:** FastAPI
- **Database:** MySQL
- **ORM:** SQLAlchemy
- **Email:** aiosmtplib
- **Validation:** Pydantic

### Testing & Infrastructure
- **Email Testing:** Mailpit (SMTP at localhost:1025)
- **Database Drivers:** PyMySQL (for MySQL)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.9+
- **MySQL** (optional, for production)
- **Mailpit** (for email testing)

### Installation

#### 1. Frontend Setup

```bash
cd ang_frontend
npm install
```

#### 2. Backend Setup

```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```


## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `backend/` folder:

```env
# Database

DATABASE_URL="mysql+pymysql://user:password@localhost:3306/emailsystem"

# SMTP (Mailpit)
SMTP_HOST="localhost"
SMTP_PORT="1025"
FROM_EMAIL="noreply@emailsystem.dev"
```

### Frontend API Configuration

Update the API base URL in [src/services/subscriber.service.ts](ang_frontend/src/app/services/subscriber.service.ts):

```typescript
private apiUrl = 'http://localhost:8000/api';
```

---

## 🎨 Running the Application

### Using Mailpit (Recommended for Testing)

1. **Start Mailpit** (email testing):
   ```bash
   docker run -p 1025:1025 -p 8025:8025 mailpit/mailpit
   ```
   - SMTP: `localhost:1025`
   - Web UI: http://localhost:8025

2. **Start the Backend**:
   ```bash
   cd backend
   source venv/bin/activate
   uvicorn main:app --reload
   ```
   - API runs at: http://localhost:8000
   - Docs at: http://localhost:8000/docs

3. **Start the Frontend**:
   ```bash
   cd ang_frontend
   npm run serve
   ```
   - App runs at: http://localhost:4200

### Database Schema

**Subscribers Table:**
| Column | Type | Notes |
|--------|------|-------|
| id | Integer | Primary Key |
| name | String(120) | User's name |
| email | String(255) | Unique email address |
| confirmed | Boolean | Email confirmed flag |
| created_at | DateTime | Timestamp with timezone |

---

## 📡 API Endpoints

### Create Subscriber
**POST** `/api/subscribers`

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

Response (201):
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "confirmed": true
}
```

### List All Subscribers
**GET** `/api/subscribers`

Response:
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "confirmed": true
  }
]
```

### Delete Subscriber
**DELETE** `/api/subscribers/{subscriber_id}`

Response: 204 No Content

### Health Check
**GET** `/health`

Response:
```json
{
  "status": "ok"
}
```

---

## 📁 Project Structure

```
email-system/
├── ang_frontend/                 # Angular frontend app
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   └── registration/    # Email registration form
│   │   │   ├── services/
│   │   │   │   └── subscriber.service.ts
│   │   │   ├── models/
│   │   │   │   └── subscriber.model.ts
│   │   │   └── app.ts
│   │   └── main.ts
│   ├── angular.json
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                      # FastAPI backend
│   ├── main.py                   # Main app & routes
│   ├── models.py                 # SQLAlchemy models
│   ├── database.py               # Database configuration
│   ├── .env                      # Environment variables (⚠️ DO NOT COMMIT)
│   └── requirements.txt          # Python dependencies
│
└── README.md                     # This file
```



