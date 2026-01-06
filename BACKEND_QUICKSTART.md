╔════════════════════════════════════════════════════════════════════════════╗
║                   MySQL + Express Backend - Quick Start                     ║
║                          Fixed mysql2 Error                                  ║
╚════════════════════════════════════════════════════════════════════════════╝

✅ PROBLEM SOLVED!

The "mysql2 is missing" error is now fixed by creating an Express backend server.

═══════════════════════════════════════════════════════════════════════════════

🚀 QUICK START (5 MINUTES):

1. Start XAMPP MySQL
   ┌─────────────────────────────────────────────────────────────────────────┐
   │ Open XAMPP Control Panel → Click Start next to MySQL                    │
   │ Wait for green "Running" indicator                                      │
   └─────────────────────────────────────────────────────────────────────────┘

2. Create Database (if not already done)
   ┌─────────────────────────────────────────────────────────────────────────┐
   │ Visit: http://localhost/phpmyadmin                                      │
   │ Create database: alumni_connect                                         │
   │ Import: supabase/mysql_schema.sql                                       │
   └─────────────────────────────────────────────────────────────────────────┘

3. Install Dependencies (run once)
   ┌─────────────────────────────────────────────────────────────────────────┐
   │ npm install                                                             │
   └─────────────────────────────────────────────────────────────────────────┘

4. Run Everything
   ┌─────────────────────────────────────────────────────────────────────────┐
   │ npm run dev:all                                                         │
   │                                                                         │
   │ This starts:                                                            │
   │ • Backend Server on http://localhost:5000                              │
   │ • Frontend on http://localhost:5173                                    │
   └─────────────────────────────────────────────────────────────────────────┘

5. Visit Your App
   ┌─────────────────────────────────────────────────────────────────────────┐
   │ Frontend: http://localhost:5173                                         │
   │ Auth: http://localhost:5173/auth                                        │
   │ Admin: http://localhost:5173/admin                                      │
   └─────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════

📊 ARCHITECTURE EXPLANATION:

Old (Broken):
  Browser → tries to use mysql2 (Node.js module) → ❌ ERROR

New (Fixed):
  Browser → HTTP API calls → Express Server → mysql2 → MySQL Database ✅

═══════════════════════════════════════════════════════════════════════════════

📁 WHAT'S NEW:

Created Files:
  ✓ server.js - Express backend with all API routes
  ✓ src/integrations/api/client.ts - Frontend API client

Updated Files:
  ✓ All admin pages now use API instead of direct DB
  ✓ package.json - Added server scripts
  ✓ .env - Configuration for both frontend and backend

═══════════════════════════════════════════════════════════════════════════════

🔧 COMMANDS:

Run Both Server & Frontend:
  npm run dev:all

Or Run Separately (in 2 terminals):
  Terminal 1: npm run server    (Express backend on port 5000)
  Terminal 2: npm run dev       (Vite frontend on port 5173)

Other Commands:
  npm run build                 (Build for production)
  npm run preview               (Preview production build)
  npm run lint                  (Check code)

═══════════════════════════════════════════════════════════════════════════════

🌐 API ENDPOINTS:

Available at http://localhost:5000

Authentication:
  POST /api/auth/signup       - Register user
  POST /api/auth/signin       - Login user

News:
  GET /api/news               - Get all news
  POST /api/news              - Create news
  PUT /api/news/:id           - Update news
  DELETE /api/news/:id        - Delete news

Jobs:
  GET /api/jobs
  POST /api/jobs
  PUT /api/jobs/:id
  DELETE /api/jobs/:id

Merchandise:
  GET /api/merchandise
  POST /api/merchandise
  PUT /api/merchandise/:id
  DELETE /api/merchandise/:id

Achievements:
  GET /api/achievements
  POST /api/achievements
  PUT /api/achievements/:id
  DELETE /api/achievements/:id

Profiles:
  GET /api/profiles

Health Check:
  GET /api/health             - Server status

═══════════════════════════════════════════════════════════════════════════════

✅ VERIFICATION:

After running npm run dev:all, you should see:

Terminal Output:
┌─────────────────────────────────────────────────────────────────────────┐
│ 🚀 Server running on http://localhost:5000                              │
│ Database: alumni_connect                                                │
│                                                                         │
│ ✓ Local:   http://localhost:5173/                                       │
│ ✓ press h to show help                                                  │
└─────────────────────────────────────────────────────────────────────────┘

Browser:
  ✓ Can access http://localhost:5173
  ✓ Can see the landing page
  ✓ Can navigate to /auth
  ✓ Can sign up / login

═══════════════════════════════════════════════════════════════════════════════

🐛 TROUBLESHOOTING:

Problem: "Cannot find module mysql2"
Solution: The error should be gone now! If persists, run: npm install mysql2

Problem: "EADDRINUSE :::5000" (Port already in use)
Solution: Kill process on port 5000 or change port in server.js

Problem: "Failed to fetch" errors
Solution: Make sure npm run server is running (not just npm run dev)

Problem: Database connection error
Solution: Check XAMPP MySQL is running and .env has correct credentials

More Help: See BACKEND_SETUP.md

═══════════════════════════════════════════════════════════════════════════════

📋 FILES OVERVIEW:

Frontend Code:
  src/pages/Auth.tsx              - Login/Signup (uses /api/auth/)
  src/pages/admin/*.tsx           - Admin pages (use /api/* endpoints)
  src/integrations/api/client.ts  - API client functions

Backend Code:
  server.js                       - Express server with all routes

Database:
  supabase/mysql_schema.sql       - Database schema
  .env                            - Configuration

═══════════════════════════════════════════════════════════════════════════════

🎯 NEXT STEPS:

1. Run: npm run dev:all
2. Open: http://localhost:5173
3. Click "Sign Up" / "Sign In"
4. Go to /admin to test features
5. Everything should work without errors!

═══════════════════════════════════════════════════════════════════════════════

💡 HOW IT WORKS:

1. You visit http://localhost:5173 (React app)
2. You click sign up or try admin features
3. Frontend calls API: fetch('http://localhost:5000/api/auth/signup', ...)
4. Express server receives request at server.js
5. Server queries MySQL database using mysql2
6. Server responds with JSON
7. Frontend updates the UI

No more browser trying to use mysql2!

═══════════════════════════════════════════════════════════════════════════════

✨ YOU'RE ALL SET!

Just run:
  npm run dev:all

And everything will work! 🎉

═══════════════════════════════════════════════════════════════════════════════

Questions? Check:
  • BACKEND_SETUP.md - Detailed explanation
  • server.js - See all API routes
  • src/integrations/api/client.ts - See how frontend calls API

═══════════════════════════════════════════════════════════════════════════════
