# Quick Setup Checklist for Partner

## Before You Start
- [ ] You have Node.js installed (version 14+)
- [ ] You have XAMPP installed with MySQL
- [ ] You have MySQL credentials: root / (no password)
- [ ] You have access to the Git repository

---

## Setup Steps (Do in Order)

### 1. Clone & Install
```bash
git clone <repository-url>
cd mongol-tori-alumni-connect
npm install
```
- [ ] Repository cloned successfully
- [ ] npm install completed without errors

### 2. Start MySQL in XAMPP
- [ ] Open XAMPP Control Panel
- [ ] Click "Start" button next to MySQL
- [ ] MySQL status shows "Running" (green)

### 3. Import Database
**Do ONE of these:**

**Option A (Easiest):**
- [ ] Open http://localhost/phpmyadmin
- [ ] Click "Import" tab
- [ ] Choose file: `supabase/mysql_schema.sql` OR `DATABASE_BACKUP.sql`
- [ ] Click "Go"
- [ ] See message: "Import successful"

**Option B (Command Line):**
```bash
mysql -u root < supabase/mysql_schema.sql
```
- [ ] Command executed without errors

### 4. Verify Database
- [ ] Open phpMyAdmin (http://localhost/phpmyadmin)
- [ ] See `alumni_connect` database in left sidebar
- [ ] Click it and see 9 tables (see below)

**Tables should exist:**
- [ ] users
- [ ] profiles
- [ ] jobs
- [ ] news
- [ ] achievements
- [ ] merchandise
- [ ] orders
- [ ] order_items
- [ ] user_roles

### 5. Check .env File
File: Root directory of project

- [ ] File exists: `.env`
- [ ] Contains VITE_API_URL=http://localhost:5000
- [ ] Contains DB_HOST=localhost
- [ ] Contains DB_USER=root
- [ ] Contains DB_PASSWORD=(empty)
- [ ] Contains DB_NAME=alumni_connect

*If .env doesn't exist, create it with above content*

### 6. Start Servers
```bash
npm run dev:all
```

Expected output:
- [ ] `[0] 🚀 Server running on http://localhost:5000`
- [ ] `[0] Database: alumni_connect`
- [ ] `[1] ➜  Local:   http://localhost:8080/` (or 8081, 8082, etc)
- [ ] No error messages

### 7. Test in Browser
1. Open the URL from step 6 (http://localhost:8080 or similar)
2. [ ] Homepage loads with Mongol-Tori logo
3. [ ] Click "Sign in / Create Account"
4. [ ] Click "Sign Up"
5. [ ] Create a test account:
   - Full Name: Test User
   - Email: test@example.com
   - Password: testpass123
   - Type: Alumni (or Student)
6. [ ] Account created successfully
7. [ ] Redirected to homepage
8. [ ] Navbar shows "ALUMNI" or "STUDENT" badge
9. [ ] Click "Logout" to test sign out
10. [ ] Click "Sign in" and log back in

### 8. Test Admin Panel
1. [ ] Still logged in as your test user
2. [ ] Click "Admin" link in navbar
3. [ ] Go to Alumni section (if you created alumni account)
4. [ ] See your test user listed there
5. [ ] Click edit icon and try to update profile
6. [ ] Click "Update" button
7. [ ] See success message

### 9. Test Jobs Feature
1. [ ] Go to "Jobs" section from navbar or homepage
2. [ ] If logged in as Alumni: Click "Post a Job" button
   - [ ] Form appears with fields:
     - Position Title
     - Company Name
     - Working Hours
     - Salary Range
     - Required Qualifications
   - [ ] Fill out form and submit
   - [ ] Job appears in the list
3. [ ] If logged in as Student: "Post a Job" button NOT visible
   - [ ] See message: "Alumni Only Feature"
   - [ ] Can still see job listings

---

## If Something Fails

### Error: "Cannot connect to database"
1. Check MySQL is running in XAMPP
2. Check `.env` file has correct credentials
3. Restart XAMPP MySQL
4. Go back to step 3 (import database)

### Error: "Module not found"
1. Run: `npm install`
2. Restart servers: `npm run dev:all`

### Error: "Port 5000 already in use"
1. Restart computer, OR
2. Kill the process: (Windows PowerShell)
   ```
   Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
   ```
3. Restart: `npm run dev:all`

### Frontend shows blank
1. Clear browser cache: Ctrl+Shift+Delete
2. Hard refresh: Ctrl+Shift+R
3. Check browser console (F12) for errors

### Still can't figure it out?
1. Check terminal output for error messages
2. Verify all 9 database tables exist in phpMyAdmin
3. Verify `.env` file is correct
4. Restart everything (MySQL, npm servers, browser)

---

## Success = All Checkboxes Checked ✅

When all items above are checked, your setup is complete!

---

## Important Files & Locations

```
Root Directory
├── server.js                    # Backend server (run automatically)
├── .env                         # Configuration (MUST be correct)
├── supabase/
│   └── mysql_schema.sql         # Database schema (import this)
├── DATABASE_BACKUP.sql          # Alternative backup file
├── PARTNER_SETUP_GUIDE.md       # Detailed setup instructions
├── JOBS_FEATURE_QUICKSTART.md   # Info about jobs feature
├── ALUMNI_JOBS_FEATURE.md       # Detailed jobs documentation
└── src/                         # React frontend code
```

---

## After Setup Works

### Getting Latest Updates:
```bash
git pull origin main
npm install
npm run dev:all
```

### Troubleshooting Updates:
- If new database tables needed, re-import SQL file
- If errors appear, check PARTNER_SETUP_GUIDE.md

### Making Changes & Pushing:
```bash
git add .
git commit -m "Description of changes"
git push origin main
```

---

**Last Updated:** January 2024
**Project:** Mongol-Tori Alumni Connect
**Status:** Ready for Partner Setup ✅
