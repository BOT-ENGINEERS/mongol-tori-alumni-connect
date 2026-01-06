# MySQL with Express Backend - Updated Setup Guide

The issue was that `mysql2` is a Node.js package and cannot run in the browser. We've now created an Express.js backend server that handles all database operations.

## 🏗️ New Architecture

```
Browser (Vite React) 
    ↓ API Calls (fetch)
    ↓
Express.js Server (Node.js)
    ↓ Direct Database Access
    ↓
MySQL Database (XAMPP)
```

## 📁 Files Created/Modified

### New Files
- `server.js` - Express backend server with all API routes
- `src/integrations/api/client.ts` - Frontend API client functions

### Updated Files
- `src/pages/Auth.tsx` - Now calls API instead of direct DB
- `src/pages/admin/News.tsx` - Now calls API
- `src/pages/admin/Jobs.tsx` - Now calls API
- `src/pages/admin/Merchandise.tsx` - Now calls API
- `src/pages/admin/Achievements.tsx` - Now calls API
- `src/pages/admin/Members.tsx` - Now calls API
- `src/pages/admin/Alumni.tsx` - Now calls API
- `package.json` - Added server script and dependencies

## 🚀 NEW Setup Instructions

### Step 1: Start XAMPP MySQL
```
Open XAMPP Control Panel → Click Start next to MySQL
```

### Step 2: Create Database
```
Open http://localhost/phpmyadmin
Create database: alumni_connect
```

### Step 3: Import Schema
```
In phpMyAdmin:
- Select alumni_connect database
- Go to Import tab
- Upload: supabase/mysql_schema.sql
- Click Import
```

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Run Everything (NEW!)
```bash
# Option A: Run server and frontend together
npm run dev:all

# Option B: Run separately in two terminals
# Terminal 1:
npm run server

# Terminal 2:
npm run dev
```

### Step 6: Test
```
Browser: http://localhost:5173
Auth Page: http://localhost:5173/auth
Admin Panel: http://localhost:5173/admin
API Server: http://localhost:5000
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user

### News
- `GET /api/news` - Get all news
- `POST /api/news` - Create news
- `PUT /api/news/:id` - Update news
- `DELETE /api/news/:id` - Delete news

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Merchandise
- `GET /api/merchandise` - Get all items
- `POST /api/merchandise` - Create item
- `PUT /api/merchandise/:id` - Update item
- `DELETE /api/merchandise/:id` - Delete item

### Achievements
- `GET /api/achievements` - Get all achievements
- `POST /api/achievements` - Create achievement
- `PUT /api/achievements/:id` - Update achievement
- `DELETE /api/achievements/:id` - Delete achievement

### Profiles
- `GET /api/profiles` - Get all profiles

### Health
- `GET /api/health` - Server status check

## 📋 Environment Variables

Update your `.env` file:

```env
# Browser (Frontend)
VITE_API_URL=http://localhost:5000
VITE_APP_URL=http://localhost:5173

# Server (Backend) - uses process.env not VITE_
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=alumni_connect
```

## ✅ Verification Checklist

Before starting:
- [ ] XAMPP MySQL running
- [ ] Database `alumni_connect` created
- [ ] Schema imported from `mysql_schema.sql`
- [ ] `.env` file configured
- [ ] `npm install` completed
- [ ] All dependencies installed (mysql2, express, cors, dotenv, concurrently)

## 🎯 How It Works Now

### Old Way (Browser Direct Access) ❌
```
Browser Code → mysql2 (Node module) → ERROR!
(Browsers can't use Node.js modules)
```

### New Way (API + Backend) ✅
```
Browser Code → Fetch API calls → Express Server → mysql2 → MySQL
(Browser calls HTTP endpoints, server handles database)
```

## 📊 Server Architecture

```
Express Server (server.js)
├── Port: 5000
├── CORS enabled for localhost:5173
├── Connection Pool: max 10 connections
└── Routes:
    ├── /api/auth/*
    ├── /api/news/*
    ├── /api/jobs/*
    ├── /api/merchandise/*
    ├── /api/achievements/*
    ├── /api/profiles/*
    └── /api/health
```

## 🔄 Frontend API Usage

All frontend code now uses the API client:

```typescript
// Old way (no longer works)
import { getNews } from "@/integrations/mysql/queries";
const news = await getNews(); // ERROR: mysql2 not available in browser

// New way (correct)
import { getNews } from "@/integrations/api/client";
const { data } = useQuery({
  queryKey: ["news"],
  queryFn: () => getNews(), // Calls API endpoint
});
```

## 🐛 Troubleshooting

### Port Already in Use?
```bash
# Check what's using port 5000
netstat -ano | findstr :5000

# Or use a different port by editing server.js
// Change line: const PORT = 5001;
```

### CORS Error?
```
Error: Access to XMLHttpRequest at 'http://localhost:5000/api/news'
```
- Make sure server is running on port 5000
- Check CORS is enabled in server.js (it is by default)
- Verify frontend is on localhost:5173

### API Connection Refused?
```
Error: Failed to fetch
```
- Ensure server is running: `npm run server`
- Check if port 5000 is accessible
- Verify .env has VITE_API_URL=http://localhost:5000

### Database Error?
```
Error: Error: connect ECONNREFUSED 127.0.0.1:3306
```
- Check XAMPP MySQL is running
- Verify database credentials in .env
- Ensure `alumni_connect` database exists
- Check mysql_schema.sql was imported

## 📝 File Organization

```
mongol-tori-alumni-connect/
├── server.js                          ← NEW: Express backend
├── src/
│   ├── integrations/
│   │   ├── mysql/                    ← Database types
│   │   │   ├── client.ts
│   │   │   ├── types.ts
│   │   │   ├── queries.ts            ← NO LONGER USED (moved to server)
│   │   │   └── auth.ts               ← NO LONGER USED (moved to server)
│   │   └── api/
│   │       └── client.ts             ← NEW: Frontend API calls
│   └── pages/
│       ├── Auth.tsx                  ← Uses /api/auth/
│       └── admin/
│           ├── News.tsx              ← Uses /api/news
│           ├── Jobs.tsx              ← Uses /api/jobs
│           ├── etc.                  ← All use API endpoints
├── .env                              ← Updated with DB credentials
└── package.json                      ← Added server scripts
```

## 🚀 Running the Application

### Development Mode (Recommended)
```bash
npm run dev:all
```
This runs both the backend server and frontend development server in one command.

### Manual Mode (For Debugging)
```bash
# Terminal 1
npm run server
# Output: 🚀 Server running on http://localhost:5000

# Terminal 2 (in same directory)
npm run dev
# Output: VITE v5... Local: http://localhost:5173
```

### Production Mode
```bash
# Build frontend
npm run build

# Start server (backend only)
npm run server

# Serve built files from backend or use a static server
```

## 📚 API Documentation Examples

### Create News
```typescript
const response = await fetch('http://localhost:5000/api/news', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'New Article',
    content: 'Article content',
    source: 'Internal',
    is_external: false
  })
});
const newsItem = await response.json();
```

### Frontend Usage (Recommended)
```typescript
import { createNews } from "@/integrations/api/client";

const response = await createNews({
  title: 'New Article',
  content: 'Article content',
  source: 'Internal',
  is_external: false
});
```

## ✨ What's Working Now

✅ Authentication (Sign up, Login)
✅ News Management (CRUD)
✅ Jobs Management (CRUD)
✅ Merchandise Management (CRUD)
✅ Achievements Management (CRUD)
✅ Members/Alumni Management
✅ Admin Dashboard
✅ All UI Components

## 🔐 Security Notes

### Current Status
- ✅ API running on localhost (development only)
- ⚠️ Password hashing uses base64 (development only)
- ✅ CORS enabled for localhost:5173 only

### For Production
- [ ] Use HTTPS
- [ ] Implement proper authentication (JWT tokens)
- [ ] Use bcrypt for passwords
- [ ] Add input validation
- [ ] Add rate limiting
- [ ] Deploy to cloud server
- [ ] Configure CORS for your domain only

## 🎉 You're All Set!

Now when you visit the application:
1. Frontend (React) runs on `http://localhost:5173`
2. Backend (Express) runs on `http://localhost:5000`
3. Database (MySQL) runs on `localhost:3306`
4. All API calls work correctly!

---

**Commands Quick Reference:**
```bash
npm run dev:all     # Run everything together
npm run server      # Backend only
npm run dev         # Frontend only
npm run build       # Build for production
npm run preview     # Preview production build
```

Everything should now work without any "mysql2 is missing" errors! 🎉
