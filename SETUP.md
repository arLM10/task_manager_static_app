# Task Manager App - Setup Guide

## Overview
This is a full-stack task manager application with:
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (Static Web App)
- **Backend**: Python Flask REST API
- **Database**: MySQL
- **Storage**: Both MySQL (primary) and Browser Storage (fallback)

---

## Project Structure

```
task_manager_static_app/
├── frontend/
│   ├── index.html              # Main app page
│   ├── storage-demo.html       # Storage demo page
│   ├── task-app.js             # Main application logic (with backend integration)
│   ├── api.js                  # API client helper functions
│   └── task-styles.css         # Styling
├── backend/
│   ├── app.py                  # Flask API server
│   ├── requirements.txt        # Python dependencies
│   └── task_venv/              # Virtual environment
└── SETUP.md                    # This file
```

---

## Prerequisites

### Required Software
- Python 3.8+ ([Download](https://www.python.org/downloads/))
- MySQL Server ([Download](https://dev.mysql.com/downloads/mysql/))
- Git (optional)
- Web Browser (Chrome, Firefox, Safari, Edge)

### Recommended Tools
- MySQL Workbench (for database management)
- Postman (for testing API endpoints)
- Visual Studio Code (text editor)

---

## Backend Setup

### 1. Create MySQL Database

Connect to MySQL and run:

```sql
-- Create database
CREATE DATABASE app_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE app_db;

-- Create tasks table
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create index on status for faster queries
CREATE INDEX idx_status ON tasks(status);
```

**Connection Details:**
- Host: `localhost`
- Port: `3308` (or your MySQL port)
- Username: `root`
- Password: `passw0rd` (change if needed)
- Database: `app_db`

> If you use different credentials, update `app.py` line 8-10

### 2. Set Up Python Virtual Environment

Navigate to the backend folder:

```bash
cd backend

# Create virtual environment
python -m venv task_venv

# Activate virtual environment
# On Windows:
task_venv\Scripts\activate
# On macOS/Linux:
source task_venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the Backend Server

```bash
python app.py
```

**Expected Output:**
```
✓ Database tables created successfully!
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

The API will be available at: `http://localhost:5000/api`

---

## Frontend Setup

### 1. Serve Static Files

Navigate to the frontend folder and serve using any HTTP server.

**Option A: Using Python's Built-in Server**
```bash
cd frontend
python -m http.server 8000
```

**Option B: Using Node.js http-server**
```bash
cd frontend
npx http-server
```

**Option C: Using Live Server (VS Code Extension)**
- Install "Live Server" extension in VS Code
- Right-click `index.html` → "Open with Live Server"

### 2. Access the Application

Open your browser and go to:
```
http://localhost:8000
```

or the port where you're serving the frontend.

---

## API Endpoints

All endpoints use JSON and are prefixed with `/api`

### Tasks API

#### GET - Retrieve All Tasks
```
GET /api/tasks
Response: {
    "message": "Tasks retrieved successfully",
    "count": 5,
    "tasks": [
        {
            "id": 1,
            "title": "Buy milk",
            "description": "",
            "status": "pending",
            "created_at": "2024-11-26 10:30:00",
            "updated_at": "2024-11-26 10:30:00"
        }
    ]
}
```

#### POST - Create New Task
```
POST /api/tasks
Request Body: {
    "title": "Buy milk",
    "description": "Get 2L milk from supermarket",
    "status": "pending"
}
Response: {
    "message": "Task created successfully",
    "task": { ... }
}
```

#### GET - Get Single Task
```
GET /api/tasks/1
Response: {
    "message": "Task retrieved successfully",
    "task": { ... }
}
```

#### PUT - Update Task
```
PUT /api/tasks/1
Request Body: {
    "title": "Buy milk",
    "status": "completed"
}
Response: {
    "message": "Task updated successfully",
    "task": { ... }
}
```

#### DELETE - Delete Task
```
DELETE /api/tasks/1
Response: {
    "message": "Task deleted successfully",
    "task_id": 1
}
```

---

## Features

### Frontend Features
✅ Add tasks with text
✅ Edit existing tasks
✅ Mark tasks as completed
✅ Delete tasks
✅ Filter tasks (All, Active, Completed)
✅ Real-time statistics
✅ Keyboard shortcuts (Enter to add)
✅ Notifications for actions

### Backend Features
✅ Complete REST API (CRUD)
✅ MySQL Database Persistence
✅ CORS Support
✅ Error Handling
✅ Timestamps (created_at, updated_at)
✅ Task Status Management

### Storage Features
✅ Primary: MySQL Database
✅ Fallback: Browser LocalStorage
✅ Session Storage for Demo
✅ Automatic Fallback if Backend Unavailable

---

## Data Flow

```
User Interaction
    ↓
Frontend (JavaScript)
    ↓
API Request (HTTP)
    ↓
Backend (Flask)
    ↓
MySQL Database
    ↓
Response (JSON)
    ↓
Frontend Updates UI
```

---

## Troubleshooting

### Backend Not Connecting
1. Ensure MySQL is running
2. Check database credentials in `app.py`
3. Verify backend server is running on port 5000
4. Check browser console for CORS errors

### Database Connection Error
```
Error: mysql+pymysql://root:passw0rd@localhost:3308/app_db
```
- Update credentials in `app.py` lines 8-10
- Verify MySQL port (default: 3306, might be 3308)

### Tasks Not Persisting
1. Check if backend is running
2. Check browser console for API errors
3. Verify MySQL database has the `tasks` table
4. Check browser Storage tab for fallback data

### CORS Errors
- Ensure backend has CORS enabled (it should by default)
- Check that API_BASE_URL in `api.js` matches your backend URL

---

## Testing the Application

### Test Add Task
1. Start the app
2. Enter task text and click "Add Task"
3. Should see success notification
4. Task appears in list

### Test Edit Task
1. Click "Edit" button on any task
2. Modify the text
3. Click "Save"
4. Task updates in database

### Test Complete Task
1. Click checkbox next to task
2. Task text should have strikethrough
3. Move to "Completed" filter
4. Status changes to "completed" in database

### Test Delete Task
1. Click "Delete" button
2. Confirm deletion
3. Task removed from list and database

### Test Filters
1. Add several tasks with different statuses
2. Click filter buttons (All, Active, Completed)
3. List updates to show filtered tasks

---

## Accessing Database Directly

### Using MySQL Command Line
```bash
mysql -u root -p
# Enter password: passw0rd

USE app_db;
SELECT * FROM tasks;
```

### Using MySQL Workbench
1. Connect to localhost:3308
2. Username: root
3. Password: passw0rd
4. Open `app_db` database
5. Browse `tasks` table

---

## Deployment Notes

### Production Checklist
- [ ] Change database password from `passw0rd`
- [ ] Update API_BASE_URL to production domain
- [ ] Enable Flask security settings
- [ ] Use environment variables for credentials
- [ ] Set up HTTPS
- [ ] Enable database backups
- [ ] Monitor error logs

### Environment Variables (Recommended)
```python
# In app.py
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URI = os.getenv('DATABASE_URI', 'mysql+pymysql://...')
FLASK_ENV = os.getenv('FLASK_ENV', 'development')
```

---

## Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [REST API Best Practices](https://restfulapi.net/)

---

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors (F12)
3. Check backend terminal for API errors
4. Verify database connectivity

---

## License

This is an educational project for classroom use.

Last Updated: November 26, 2024
