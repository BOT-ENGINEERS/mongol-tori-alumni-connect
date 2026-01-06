# Partner Setup Guide - Alumni Connect Project

## Overview
This guide helps your partner set up the Alumni Connect project locally after cloning from GitHub. The project uses MySQL database, Node.js backend, and React frontend.

---

## Part 1: Clone the Repository

```bash
git clone <repository-url>
cd mongol-tori-alumni-connect
```

---

## Part 2: Install Dependencies

```bash
npm install
```

This installs all Node.js packages for both frontend and backend.

---

## Part 3: Database Setup (CRITICAL)

### Step 1: Ensure MySQL is Running
1. Open **XAMPP Control Panel**
2. Click **Start** next to MySQL
3. Verify MySQL is running (should show in green)

### Step 2: Import Database Schema

**Option A: Using phpMyAdmin (Recommended)**
1. Open http://localhost/phpmyadmin in your browser
2. Click on **"Import"** tab at the top
3. Click **"Choose File"** and select: `supabase/mysql_schema.sql`
4. Click **"Go"** to execute the SQL file
5. Database `alumni_connect` will be created with all tables

**Option B: Using MySQL Command Line**
```bash
mysql -u root -p < supabase/mysql_schema.sql
```
(Press Enter when prompted for password, leave it empty)

### Step 3: Verify Database Creation
1. In phpMyAdmin, click **Refresh** (F5)
2. You should see `alumni_connect` database in left sidebar
3. Click on it to see 9 tables:
   - users
   - profiles
   - jobs
   - news
   - merchandise
   - achievements
   - orders
   - order_items
   - user_roles

---

## Part 4: Environment Configuration

### Step 1: Check `.env` File
File location: Root directory of project

**Required content:**
```
VITE_API_URL=http://localhost:5000
VITE_DB_HOST=localhost
VITE_DB_USER=root
VITE_DB_PASSWORD=
VITE_DB_NAME=alumni_connect

API_PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=alumni_connect
```

**Note:** If `.env` file is missing, create it with the above content.

### Step 2: Verify Configuration
- API_PORT: Must be 5000
- DB_HOST: Must be localhost
- DB_USER: root (default XAMPP user)
- DB_PASSWORD: Empty (default XAMPP)
- DB_NAME: alumni_connect (exact name)

---

## Part 5: Start the Development Servers

### Command to Run Everything:
```bash
npm run dev:all
```

This will:
1. Start Express backend server on http://localhost:5000
2. Start Vite frontend dev server on http://localhost:8080 (or next available port)
3. Enable hot reload on both servers

### Expected Output:
```
[0] 🚀 Server running on http://localhost:5000
[0] Database: alumni_connect
[1] ➜  Local:   http://localhost:8080/
```

**Important:** If port 8080 is in use, Vite will try 8081, 8082, etc. Check the output for the actual port.

---

## Part 6: Verify Everything Works

### Step 1: Open the Website
1. Look at the terminal output for the URL (usually http://localhost:8080)
2. Open that URL in your browser
3. Homepage should load with Mongol-Tori logo

### Step 2: Test Authentication
1. Click **"Sign in / Create Account"**
2. Click **"Sign Up"** tab
3. Create a test account:
   - Full Name: Test User
   - Email: test@example.com
   - Password: testpass123
   - Select: **Alumni** (has Users icon) or **Student** (has GraduationCap icon)
4. Click **"Create Account"**
5. Should redirect to homepage and show user is logged in

### Step 3: Verify User Type Display
1. Check navbar (top right) - should show either:
   - **"ALUMNI"** badge (orange) if you selected Alumni
   - **"STUDENT"** badge (blue) if you selected Student
2. Click **"Admin"** link to go to admin panel
3. Go to **Alumni** or **Members** section - your test user should appear in the correct section

### Step 4: Test Database Connection
1. Go to Admin → Members (or Alumni)
2. Click on any member and edit their information
3. Click **Update**
4. Should show success message - data is being saved to database

---

## Part 7: Common Issues & Solutions

### Issue: "Database connection refused"
**Solution:**
1. Verify MySQL is running in XAMPP
2. Check `.env` file has correct credentials (root with no password)
3. Verify database name is exactly: `alumni_connect`
4. Restart XAMPP MySQL

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Kill the process using port 5000
# On Windows (PowerShell):
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# Or restart your computer
```

### Issue: "Cannot find module" errors
**Solution:**
```bash
# Clean install dependencies
rm -r node_modules
rm package-lock.json
npm install
```

### Issue: Existing users showing as "Student" instead of "Alumni"
**Solution:**
1. This is expected for old users created before the fix
2. Go to Admin → Members
3. Click the blue checkmark icon next to a member
4. This promotes them to Alumni

Or delete test users and create new ones:
```bash
# Delete a user from database via phpMyAdmin:
# 1. Go to users table
# 2. Click "X" icon next to the user
# 3. Create a new account with same email
```

### Issue: Frontend shows blank or error
**Solution:**
1. Clear browser cache: Ctrl+Shift+Delete
2. Hard refresh: Ctrl+Shift+R
3. Check browser console (F12) for errors
4. Verify backend is running: http://localhost:5000
5. Check terminal for backend errors

---

## Part 8: Project Structure

```
mongol-tori-alumni-connect/
├── src/                          # Frontend React code
│   ├── pages/                    # Page components
│   │   ├── Index.tsx            # Homepage
│   │   ├── Auth.tsx             # Login/signup
│   │   ├── Jobs.tsx             # Job listings (NEW)
│   │   ├── Cart.tsx             # Shopping cart
│   │   ├── Checkout.tsx         # Order checkout
│   │   └── admin/               # Admin pages
│   ├── components/              # Reusable components
│   ├── integrations/
│   │   └── api/                 # Backend API client
│   └── hooks/                   # Custom React hooks
├── supabase/
│   └── mysql_schema.sql         # Database schema (IMPORTANT)
├── server.js                    # Backend Express server
├── package.json                 # Dependencies
├── .env                         # Environment variables
└── vite.config.ts               # Frontend bundler config
```

---

## Part 9: Key Features to Test

After setup is complete, test these features:

### 1. Authentication ✅
- Sign up as Alumni
- Sign up as Student
- Sign in with existing account
- Logout
- Check navbar shows correct user type badge

### 2. Admin Panel ✅
- Go to Admin
- Check Members section shows only Students
- Check Alumni section shows only Alumni users
- Try editing and updating a member

### 3. Jobs Feature ✅ (NEW)
- Sign in as Alumni
- Go to Jobs section
- Click "Post a Job"
- Fill form: Company, Position, Working Hours, Salary, Qualifications
- Submit and verify job appears in list
- Sign in as Student - should not see "Post a Job" button
- Both can view jobs

### 4. Shopping Cart ✅
- Click "Shop" on homepage
- Add items to cart
- Go to Cart page
- Verify items are there
- Click Checkout
- Fill address and complete checkout

### 5. Content Management ✅
- Admin can manage News, Achievements, Merchandise
- Changes are saved to database
- Public pages show updated content

---

## Part 10: Git Workflow

### To Get Latest Updates:
```bash
git pull origin main
```

### After Pulling New Code:
1. Stop the servers (Ctrl+C)
2. Install new dependencies if package.json changed:
   ```bash
   npm install
   ```
3. Re-import database schema if changed:
   - Follow Part 3, Step 2 again
4. Restart servers:
   ```bash
   npm run dev:all
   ```

---

## Part 11: Making Changes & Committing

### To Add New Code:
```bash
# See what changed
git status

# Stage changes
git add .

# Commit with message
git commit -m "Description of changes"

# Push to GitHub
git push origin main
```

### If Database Changes:
1. Update `supabase/mysql_schema.sql` with new schema
2. Commit the SQL file
3. Tell your partner to re-import it

---

## Part 12: Data Persistence

### Database Data
- All user data is stored in MySQL
- Data persists even after server restarts
- Data is in `/xampp/mysql/data/alumni_connect/` directory

### Browser Data
- User session stored in localStorage
- Cart items stored in localStorage
- Browser cache can be cleared without affecting database

---

## Part 13: Contact & Support

If your partner encounters issues:

1. **Check this guide** - Most common issues are covered above
2. **Check terminal output** - Errors are usually printed there
3. **Check browser console** - Press F12 to see frontend errors
4. **Check phpMyAdmin** - Verify database tables exist and have data
5. **Restart everything** - Stop servers and start again fresh

---

## Quick Reference Commands

```bash
# Install dependencies
npm install

# Start all servers
npm run dev:all

# Stop servers
Ctrl+C

# Check if MySQL is running
mysql -u root -p
(press Enter, should connect)

# View database
# Open http://localhost/phpmyadmin

# Import SQL file
mysql -u root < supabase/mysql_schema.sql

# Check port 5000 is available
netstat -ano | findstr :5000
```

---

## Success Indicators

✅ When everything is set up correctly, you should see:
- Frontend loads at http://localhost:8080 (or 8081, 8082, etc)
- "🚀 Server running on http://localhost:5000" in terminal
- "Database: alumni_connect" in terminal
- Navbar shows either "ALUMNI" or "STUDENT" badge after login
- Admin panel loads and shows database content
- Data persists after page refresh
- No errors in browser console (F12)

---

## Next Steps

1. Share this guide with your partner
2. Have them follow Part 1-6
3. They should test Part 9 features
4. Both of you can now work on the same project simultaneously
5. Use Git to sync changes

Good luck! 🚀
