# Task Manager - Quick Start Guide

## 30-Second Setup

### Step 1: Database Setup (1 minute)
Open MySQL terminal and run:
```sql
CREATE DATABASE app_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE app_db;
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Step 2: Backend Setup (1 minute)
```bash
cd backend
python -m venv task_venv
task_venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app.py
```
✓ Backend runs on http://localhost:5000

### Step 3: Frontend Setup (30 seconds)
Open new terminal:
```bash
cd frontend
python -m http.server 8000
```
✓ App runs on http://localhost:8000

---

## What You Get

### ✅ Working Features
- Add/Edit/Delete tasks
- Mark tasks as complete
- Filter tasks (All, Active, Completed)
- Real-time updates
- Success/Error notifications
- Auto-saves to MySQL database

### ✅ Storage
- **Primary**: MySQL Database (persistent)
- **Fallback**: LocalStorage (if backend down)
- **Demo**: SessionStorage (cross-page demo)

### ✅ Data Persistence
Tasks are stored in MySQL and survive:
- Page refresh
- Browser close
- Computer restart
- Multiple user sessions

---

## Testing

### Test 1: Add Task
1. Type "Buy milk" in input
2. Press Enter or click Add Task
3. See green notification: "Task created successfully"
4. Task appears in list

### Test 2: Edit Task
1. Click Edit button on any task
2. Change text to "Buy 2L milk"
3. Click Save
4. See blue notification: "Task updated"

### Test 3: Complete Task
1. Click checkbox on task
2. Text gets strikethrough
3. Click "Completed" filter
4. Only completed tasks show

### Test 4: Persistence
1. Add a task
2. Refresh page (Ctrl+R)
3. **Task still appears** ← Data persisted in MySQL!
4. Close browser and reopen
5. **Task still there** ← MySQL is permanent!

### Test 5: Backend Status
Look at bottom of app:
- 🟢 **✓ Connected** = Using MySQL
- 🔴 **⚠️ Using localStorage** = Backend down

---

## Architecture

```
┌─────────────────┐
│  Frontend       │
│  (HTML/JS/CSS)  │
└────────┬────────┘
         │ HTTP REST
         ↓
┌─────────────────┐
│  Flask API      │
│  (Python)       │
└────────┬────────┘
         │ SQL
         ↓
┌─────────────────┐
│  MySQL Database │
│  (app_db)       │
└─────────────────┘
```

---

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create task |
| GET | /api/tasks/{id} | Get one task |
| PUT | /api/tasks/{id} | Update task |
| DELETE | /api/tasks/{id} | Delete task |

**Base URL**: `http://localhost:5000`

---

## File Structure

```
frontend/
├── index.html          ← Main app
├── storage-demo.html   ← Storage demo
├── task-app.js         ← App logic (with API)
├── api.js              ← API client
└── task-styles.css     ← Styling

backend/
├── app.py              ← Flask REST API
├── requirements.txt    ← Python packages
└── task_venv/          ← Virtual env
```

---

## Common Issues & Fixes

### "Cannot connect to MySQL"
→ Install MySQL or check credentials in `backend/app.py` line 13

### "Backend not available, using localStorage"
→ Start backend: `python backend/app.py`

### Tasks not showing
→ Check:
  1. Backend running on port 5000
  2. MySQL running
  3. Database created
  4. Browser console for errors (F12)

### Port already in use
→ Change port in commands:
  ```bash
  python -m http.server 8001  # Use 8001 instead of 8000
  # or update Flask
  # In app.py, change: app.run(debug=True, port=5001)
  ```

---

## Environment

**Windows:**
```bash
# Terminal 1 - Backend
cd backend
task_venv\Scripts\activate
python app.py

# Terminal 2 - Frontend
cd frontend
python -m http.server 8000
```

**Mac/Linux:**
```bash
# Terminal 1 - Backend
cd backend
source task_venv/bin/activate
python app.py

# Terminal 2 - Frontend
cd frontend
python -m http.server 8000
```

---

## Next Steps

1. ✅ Run the app
2. ✅ Add some tasks
3. ✅ Test edit/delete
4. ✅ Refresh page - data persists!
5. ✅ Check `storage-demo.html` for storage details
6. Read `SETUP.md` for advanced config

---

## Key Concepts Learned

✓ Frontend-Backend Communication
✓ REST API Design
✓ Database Persistence
✓ Data Structure Conversion
✓ Error Handling
✓ Async/Await in JavaScript
✓ CORS (Cross-Origin)
✓ Fallback Strategies

---

Enjoy! 🚀
