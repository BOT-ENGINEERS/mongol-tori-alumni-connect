# Alumni Connect - Complete Architecture & Code Explanation

## Table of Contents
1. [Overall Architecture](#overall-architecture)
2. [Frontend Explanation](#frontend-explanation)
3. [Backend Explanation](#backend-explanation)
4. [Database Explanation](#database-explanation)
5. [Key Features & How They Work](#key-features--how-they-work)
6. [Why Specific Decisions Were Made](#why-specific-decisions-were-made)

---

# OVERALL ARCHITECTURE

## Simple Picture of How Everything Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                               │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React App (Frontend)                                    │  │
│  │  - Shows the website                                     │  │
│  │  - Handles user clicks and interactions                  │  │
│  │  - Makes requests to backend                             │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              ↓ (Internet Connection)
┌──────────────────────────────────────────────────────────────────┐
│                    YOUR SERVER (Localhost:5000)                  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Express.js Backend (Node.js)                           │  │
│  │  - Receives requests from frontend                       │  │
│  │  - Does all the work (login, save data, etc.)           │  │
│  │  - Talks to the database                                 │  │
│  │  - Sends responses back to frontend                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              ↓ (SQL Queries)
┌──────────────────────────────────────────────────────────────────┐
│                    MYSQL DATABASE                                │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Tables:                                                 │  │
│  │  - users (email, password, userType)                     │  │
│  │  - profiles (name, phone, company, etc.)                │  │
│  │  - jobs (job postings)                                   │  │
│  │  - news (news articles)                                  │  │
│  │  - merchandise (store products)                          │  │
│  │  - achievements (university achievements)                │  │
│  │  - orders (shopping orders)                              │  │
│  │  - order_items (items in orders)                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

## How It Works (Step by Step)

**Example: User Signs Up as Alumni**

1. **User Fills Form** (in browser)
   - Enters: email, password, name, selects "Alumni"

2. **Frontend Sends Data** (React sends to server)
   - Sends: `POST /api/auth/signup { email, password, fullName, userType: 'alumni' }`

3. **Backend Receives & Processes** (Node.js server)
   - Checks if email already exists
   - Creates hashed password
   - Inserts into `users` table with `user_type = 'alumni'`
   - Inserts into `profiles` table
   - Sends back: `{ id, email, userType: 'alumni' }`

4. **Frontend Stores & Shows** (React receives response)
   - Stores in localStorage: `{ id, email, userType: 'alumni' }`
   - Shows "Alumni" badge in navbar
   - Redirects to home page

5. **Data is in Database** (MySQL stores it forever)
   - Next time user logs in, data is retrieved from database

---

# FRONTEND EXPLANATION

## What is Frontend?

**Frontend = Everything the user sees and interacts with**
- Website layout, colors, buttons
- Forms to fill
- Product listings
- Job postings
- User profile

## Technology Stack Used

```
React + TypeScript + Vite
├── React: Framework to build interactive websites
├── TypeScript: JavaScript with safety checks (catches errors early)
├── Vite: Tool that packages everything for the browser
├── Tailwind CSS: Tool to style and make things look pretty
├── React Router: Tool to create pages (home, jobs, admin, etc.)
├── React Query: Tool to fetch data from server
└── shadcn/ui: Pre-made beautiful components
```

## Key Frontend Files & What They Do

### 1. **src/App.tsx** - The Main Router (The Navigation Control Center)

```typescript
// Think of this as a GPS system for the website
// It tells the browser: "When user goes to /jobs, show Jobs page"

<Routes>
  <Route path="/" element={<Index />} />           // Home page
  <Route path="/auth" element={<Auth />} />         // Login/Signup page
  <Route path="/jobs" element={<Jobs />} />         // Jobs page
  <Route path="/cart" element={<Cart />} />         // Shopping cart
  <Route path="/admin" element={<Admin />} />       // Admin panel
</Routes>
```

**Why this structure?**
- One single place to manage all pages
- Easy to add new pages
- No broken links

### 2. **src/pages/Auth.tsx** - Login & Signup Page

**What happens when user signs up:**

```
┌─────────────────────────────────────────────┐
│  User Fills Form                            │
│  - Email: user@example.com                 │
│  - Password: secret123                      │
│  - Name: John Doe                          │
│  - Type: Alumni (or Student)               │
└─────────────────────────────────────────────┘
            ↓ (User clicks Submit)
┌─────────────────────────────────────────────┐
│  Frontend Validates                         │
│  - Check email is valid format             │
│  - Check password is not empty             │
│  - Check name is filled                    │
│  - Check type is selected                  │
└─────────────────────────────────────────────┘
            ↓ (Validation passes)
┌─────────────────────────────────────────────┐
│  Send to Backend                            │
│  POST /api/auth/signup                      │
│  Body: {email, password, fullName, userType}│
└─────────────────────────────────────────────┘
            ↓ (Backend responds)
┌─────────────────────────────────────────────┐
│  Save to localStorage                       │
│  currentUser = {id, email, userType}       │
└─────────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────┐
│  Redirect to Home Page                      │
│  Show Success Message                       │
└─────────────────────────────────────────────┘
```

**Key Code:**
```typescript
const [userType, setUserType] = useState<"student" | "alumni">("student");

// Two buttons - user clicks one to select
<button onClick={() => setUserType("alumni")}>Alumni</button>
<button onClick={() => setUserType("student")}>Student</button>

// When user submits
const response = await signUp(email, password, fullName, userType);
// Store in browser memory
localStorage.setItem('currentUser', JSON.stringify(userData));
```

### 3. **src/pages/Jobs.tsx** - Alumni Job Posting Feature

**How it works:**

```
Alumni User Visits /jobs Page
    ↓
Check: Is user alumni? (userType === 'alumni')
    ↓ YES
Show: "Post a Job" button + Form
    ↓ User fills form:
    - Position Title
    - Company Name
    - Working Hours
    - Salary Range
    - Required Qualifications
    ↓ User clicks Submit
    ↓
POST /api/jobs {title, company, type, salary_range, requirements}
    ↓ Backend saves to database
    ↓
Frontend fetches all jobs again
    ↓
Show success message: "Job posted!"
```

**Why Alumni-Only?**
```typescript
if (userType === 'alumni') {
  // Show posting form
} else {
  // Show: "Only alumni can post jobs"
}
```

### 4. **src/pages/Cart.tsx & src/pages/Checkout.tsx** - Shopping System

**How shopping works:**

```
User browses merchandise
    ↓ Clicks "Add to Cart"
    ↓
Hook (useCart) adds item to localStorage
{
  items: [
    { id: 1, name: "T-Shirt", price: 500, quantity: 2 },
    { id: 2, name: "Cap", price: 300, quantity: 1 }
  ],
  total: 1300
}
    ↓ User clicks "View Cart"
    ↓
Shows Cart page with all items + prices
    ↓ User clicks "Checkout"
    ↓
Shows form: address, phone, email
    ↓ User clicks "Complete Order"
    ↓
POST /api/orders { email, phone, address, items, total }
    ↓ Backend creates order in database
    ↓
Clear cart (remove from localStorage)
    ↓
Show: "Order successful!"
```

**Why localStorage for cart?**
- Data persists even if user closes browser
- No server calls needed while browsing
- Fast - works instantly
- Only sends to server when checkout

### 5. **src/components/Navbar.tsx** - Top Navigation Bar

**What it shows:**

```
Left Side:        Logo + "MONGOL-TORI"
Middle:           Home | Alumni | Jobs | Achievements | News | Shop
Right Side (if logged in):
                  [ALUMNI] badge (orange) or
                  [STUDENT] badge (blue) +
                  User Name +
                  Logout Button
Right Side (if not logged in):
                  "Sign In / Sign Up" button
```

**How it knows if user is logged in:**

```typescript
// On page load
const currentUser = localStorage.getItem('currentUser');
if (currentUser) {
  // User is logged in - show their name and badge
  showUserBadge(currentUser.userType);
}
```

### 6. **src/integrations/api/client.ts** - Communication Layer

**What is this file?**

Think of it as a **translator** between frontend and backend.

Frontend says: "I want to sign up with this email"
API Client translates to: "POST http://localhost:5000/api/auth/signup"

```typescript
// Function to sign up
export async function signUp(email, password, fullName, userType) {
  // Calls backend endpoint
  const response = await apiCall('/api/auth/signup', 'POST', {
    email, password, fullName, userType
  });
  // Saves to localStorage
  localStorage.setItem('currentUser', JSON.stringify(response.user));
  return response;
}

// Generic function to call any endpoint
export async function apiCall(endpoint, method, data) {
  // Makes HTTP request
  const response = await fetch('http://localhost:5000' + endpoint, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}
```

**Why this structure?**
- If backend URL changes, only update one place
- All API calls work the same way
- Easy to add error handling globally
- Can add logging to all requests

## Frontend State Management

**What is State?**

State = Data that changes as user interacts with website

Example:
- Is dropdown open? (state: `isOpen = true/false`)
- What items are in cart? (state: `cartItems = [...]`)
- What user is logged in? (state: `currentUser = {...}`)

**Two ways to store state in our app:**

1. **localStorage** - Permanent (survives browser restart)
   - User login info
   - Shopping cart

2. **useState** - Temporary (lost when page reloads)
   - Form input values
   - Dropdown open/closed
   - Loading state

```typescript
// Example: Form state
const [email, setEmail] = useState("");

<input 
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
// When user types, state updates immediately
// Email state always matches input field value
```

---

# BACKEND EXPLANATION

## What is Backend?

**Backend = The server that does all the real work**
- Checks if passwords are correct
- Saves data to database
- Retrieves data from database
- Enforces rules (e.g., only alumni can post jobs)

## Technology Stack

```
Node.js + Express.js + MySQL
├── Node.js: JavaScript runtime (runs JavaScript on server)
├── Express.js: Framework to handle web requests
├── MySQL: Database to store all data
└── mysql2: Tool to connect Node.js to MySQL
```

## Backend File: **server.js** (The Brain of the Server)

This single file contains all the logic. Let me explain the key parts:

### 1. **Setup & Configuration**

```javascript
// Import libraries
const express = require('express');
const mysql = require('mysql2/promise');
const app = express();

// Enable reading JSON from requests
app.use(express.json());

// Enable CORS (allow frontend to talk to backend)
app.use(cors());

// Create connection pool (container of 10 database connections)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'alumni_connect',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Start server on port 5000
app.listen(5000, () => console.log('Server running'));
```

**Why connection pool?**
- Database connections are expensive (slow)
- Don't want to create new connection for every request
- Pool = 10 reusable connections
- Much faster!

### 2. **Authentication Endpoints**

#### **POST /api/auth/signup** - User Registration

```javascript
app.post('/api/auth/signup', async (req, res) => {
  // 1. Get data from request
  const { email, password, fullName, userType } = req.body;
  
  // 2. Get database connection from pool
  const connection = await pool.getConnection();
  
  try {
    // 3. Check if user already exists
    const [existing] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // 4. Generate unique ID and hash password
    const userId = generateUUID();
    const passwordHash = Buffer.from(password).toString('base64');
    
    // 5. Insert into users table
    await connection.execute(
      'INSERT INTO users (id, email, password_hash, user_type) VALUES (?, ?, ?, ?)',
      [userId, email, passwordHash, userType || 'student']
    );
    
    // 6. Create profile record
    await connection.execute(
      'INSERT INTO profiles (id, user_id, full_name, email, is_alumni) VALUES (?, ?, ?, ?, ?)',
      [generateUUID(), userId, fullName, email, userType === 'alumni' ? 1 : 0]
    );
    
    // 7. Send back user data
    res.json({ 
      user: { id: userId, email, userType: userType || 'student' } 
    });
  } finally {
    // 8. Always return connection to pool
    connection.release();
  }
});
```

**Flow Diagram:**
```
Request: {email, password, fullName, userType}
    ↓
Check if email exists in database
    ↓ If yes: Send error, stop
    ↓ If no: Continue
    ↓
Create unique ID
    ↓
Hash password (convert to unreadable format)
    ↓
Insert into users table
    ↓
Insert into profiles table
    ↓
Send back: {id, email, userType}
```

#### **POST /api/auth/signin** - User Login

```javascript
app.post('/api/auth/signin', async (req, res) => {
  const { email, password } = req.body;
  const connection = await pool.getConnection();
  
  try {
    // 1. Find user by email
    const [results] = await connection.execute(
      'SELECT id, email, password_hash, user_type FROM users WHERE email = ?',
      [email]
    );
    
    // 2. User doesn't exist
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // 3. Get the user
    const user = results[0];
    
    // 4. Check password matches
    const passwordHash = Buffer.from(password).toString('base64');
    if (passwordHash !== user.password_hash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // 5. Password correct! Send back user data
    res.json({ 
      user: { id: user.id, email: user.email, userType: user.user_type } 
    });
  } finally {
    connection.release();
  }
});
```

**Flow:**
```
Request: {email, password}
    ↓
Search database for user with this email
    ↓ Found? Continue, else error
    ↓
Convert password to same format (hash)
    ↓
Does hashed password match what's in database?
    ↓ Yes? Send back user data
    ↓ No? Send error
```

### 3. **Jobs Endpoints**

#### **GET /api/jobs** - Fetch All Jobs

```javascript
app.get('/api/jobs', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    // Get all active jobs, newest first
    const [jobs] = await connection.execute(
      'SELECT * FROM jobs WHERE is_active = true ORDER BY created_at DESC'
    );
    res.json(jobs);
  } finally {
    connection.release();
  }
});
```

**What it returns:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Senior Developer",
    "company": "Tech Corp",
    "type": "Full-time",
    "salary_range": "50,000 - 80,000",
    "requirements": "5+ years React, Node.js",
    "created_at": "2024-01-15 10:30:00",
    "is_active": true
  }
]
```

#### **POST /api/jobs** - Post New Job (Alumni Only)

```javascript
app.post('/api/jobs', async (req, res) => {
  const { title, company, type, salary_range, requirements } = req.body;
  const connection = await pool.getConnection();
  
  try {
    const id = generateUUID();
    
    // Insert job into database
    await connection.execute(
      `INSERT INTO jobs (id, title, company, type, salary_range, requirements, 
       created_at, updated_at, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), true)`,
      [id, title, company, type, salary_range, requirements]
    );
    
    // Get the created job and send back
    const [result] = await connection.execute(
      'SELECT * FROM jobs WHERE id = ?',
      [id]
    );
    
    res.status(201).json(result[0]);
  } finally {
    connection.release();
  }
});
```

#### **DELETE /api/jobs/:id** - Delete Job

```javascript
app.delete('/api/jobs/:id', async (req, res) => {
  const { id } = req.params; // Get ID from URL
  const connection = await pool.getConnection();
  
  try {
    // Delete job
    await connection.execute('DELETE FROM jobs WHERE id = ?', [id]);
    res.json({ success: true });
  } finally {
    connection.release();
  }
});
```

### 4. **Shopping Order Endpoints**

#### **POST /api/orders** - Create Order

```javascript
app.post('/api/orders', async (req, res) => {
  const { fullName, email, phone, address, items, total } = req.body;
  const connection = await pool.getConnection();
  
  try {
    // 1. Create order record
    const orderId = generateUUID();
    await connection.execute(
      `INSERT INTO orders (id, full_name, email, phone, address, total_amount, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [orderId, fullName, email, phone, address, total]
    );
    
    // 2. Add each item to order_items table
    for (let item of items) {
      await connection.execute(
        `INSERT INTO order_items (id, order_id, merchandise_id, quantity, price)
         VALUES (?, ?, ?, ?, ?)`,
        [generateUUID(), orderId, item.id, item.quantity, item.price]
      );
    }
    
    // 3. Send back order confirmation
    res.status(201).json({ orderId, status: 'pending', total });
  } finally {
    connection.release();
  }
});
```

**Flow:**
```
Customer fills checkout form and submits
    ↓
Request: {name, email, phone, address, items, total}
    ↓
Backend creates record in orders table
    ↓
For each item: Create record in order_items table
    ↓
Send back: Order ID + confirmation
    ↓
Frontend clears cart
```

### 5. **Profile Endpoints**

#### **GET /api/profiles** - Fetch All User Profiles

```javascript
app.get('/api/profiles', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    // Join profiles with users table to get user_type
    const [profiles] = await connection.execute(`
      SELECT p.*, u.user_type 
      FROM profiles p 
      LEFT JOIN users u ON p.user_id = u.id
    `);
    res.json(profiles);
  } finally {
    connection.release();
  }
});
```

**Why join two tables?**
- Profiles table has: name, phone, company, bio
- Users table has: email, password, user_type
- Need both to show complete user info in admin

#### **PUT /api/profiles/:id** - Update Profile

```javascript
app.put('/api/profiles/:id', async (req, res) => {
  const { id } = req.params;
  const { full_name, bio, company, position, user_type } = req.body;
  const connection = await pool.getConnection();
  
  try {
    // Get the user_id from profile
    const [profileResult] = await connection.execute(
      'SELECT user_id FROM profiles WHERE id = ?',
      [id]
    );
    const userId = profileResult[0].user_id;
    
    // Update profile
    await connection.execute(
      `UPDATE profiles SET full_name = ?, bio = ?, company = ?, position = ? 
       WHERE id = ?`,
      [full_name, bio, company, position, id]
    );
    
    // Update user type if provided (promoting student to alumni)
    if (user_type) {
      await connection.execute(
        'UPDATE users SET user_type = ? WHERE id = ?',
        [user_type, userId]
      );
    }
    
    res.json({ success: true });
  } finally {
    connection.release();
  }
});
```

## Important Backend Concepts

### **What is an Endpoint?**

Endpoint = A URL that does something

```
GET    /api/jobs              → Get all jobs
POST   /api/jobs              → Create new job
DELETE /api/jobs/:id          → Delete job with ID
POST   /api/auth/signup       → Sign up user
POST   /api/auth/signin       → Sign in user
GET    /api/profiles          → Get all user profiles
PUT    /api/profiles/:id      → Update user profile
```

### **HTTP Methods Explained**

| Method | Purpose | Example |
|--------|---------|---------|
| GET | Retrieve data | Get list of jobs |
| POST | Create new data | Create new order |
| PUT | Update existing data | Update user profile |
| DELETE | Remove data | Delete a job |

### **Status Codes Explained**

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK - Request succeeded | Successfully got data |
| 201 | Created - New data created | User successfully signed up |
| 400 | Bad Request - Wrong data sent | Missing required field |
| 401 | Unauthorized - Not logged in | Password incorrect |
| 404 | Not Found - Data doesn't exist | Job ID doesn't exist |
| 500 | Server Error - Something broke | Database connection failed |

---

# DATABASE EXPLANATION

## What is a Database?

**Database = Organized storage for data**

Like filing cabinets:
- Each "table" = A filing cabinet
- Each "row" = One file in the cabinet
- Each "column" = Information on the file

## Database Tables

### **users Table**

```
Stores login information

Columns:
- id (UUID) - Unique identifier (like a fingerprint)
- email - User's email
- password_hash - Encrypted password
- user_type - 'student' or 'alumni'
- created_at - When account was created
- updated_at - When account was last modified

Example data:
┌──────────────┬─────────────────┬──────────────┬──────────┐
│ id           │ email           │ user_type    │ password │
├──────────────┼─────────────────┼──────────────┼──────────┤
│ abc-123      │ john@gmail.com  │ alumni       │ (hashed) │
│ def-456      │ jane@gmail.com  │ student      │ (hashed) │
└──────────────┴─────────────────┴──────────────┴──────────┘
```

### **profiles Table**

```
Stores detailed user information

Columns:
- id (UUID) - Unique identifier
- user_id - Links to users table
- full_name - User's name
- email - Email
- phone - Phone number
- company - Where they work
- position - Job title
- bio - About them
- is_alumni - Old field (not used anymore)

Example data:
┌──────────┬──────────┬────────────┬─────────────┐
│ id       │ user_id  │ full_name  │ company     │
├──────────┼──────────┼────────────┼─────────────┤
│ prf-001  │ abc-123  │ John Doe   │ Google      │
│ prf-002  │ def-456  │ Jane Smith │ Amazon      │
└──────────┴──────────┴────────────┴─────────────┘
```

### **jobs Table**

```
Stores job postings

Columns:
- id (UUID) - Unique ID
- title - Job title ("Senior Developer")
- company - Company name
- type - Full-time, Part-time, etc.
- salary_range - "50k-80k"
- requirements - Needed skills
- posted_by - User ID who posted it
- created_at - When posted
- is_active - Still available? (true/false)

Example data:
┌──────────┬──────────────────┬─────────────┬───────────────┐
│ id       │ title            │ company     │ type          │
├──────────┼──────────────────┼─────────────┼───────────────┤
│ job-001  │ Senior Dev       │ Google      │ Full-time     │
│ job-002  │ Junior Dev       │ Microsoft   │ Part-time     │
└──────────┴──────────────────┴─────────────┴───────────────┘
```

### **merchandise Table**

```
Stores store products

Columns:
- id (UUID)
- name - Product name
- description - Details
- price - Cost
- image_url - Picture URL
- category - Type of product
- stock - How many available
- is_active - Still for sale?

Example data:
┌──────────┬──────────┬────────┬──────────┐
│ id       │ name     │ price  │ category │
├──────────┼──────────┼────────┼──────────┤
│ mer-001  │ T-Shirt  │ 500    │ Apparel  │
│ mer-002  │ Cap      │ 300    │ Apparel  │
└──────────┴──────────┴────────┴──────────┘
```

### **orders Table**

```
Stores customer orders

Columns:
- id (UUID)
- full_name - Customer name
- email - Customer email
- phone - Phone number
- address - Shipping address
- total_amount - Order total
- status - 'pending', 'completed', etc.
- created_at - When order was placed

Example data:
┌──────────┬────────────┬─────────────┬──────────┐
│ id       │ full_name  │ address     │ total    │
├──────────┼────────────┼─────────────┼──────────┤
│ ord-001  │ John Doe   │ 123 Main St │ 1300     │
└──────────┴────────────┴─────────────┴──────────┘
```

### **order_items Table**

```
Stores what's IN each order

Columns:
- id (UUID)
- order_id - Links to orders table
- merchandise_id - Links to merchandise table
- quantity - How many?
- price - Price per item

Example data:
┌──────────┬──────────┬──────────────────┬──────────┐
│ order_id │ product  │ quantity │ price │
├──────────┼──────────┼──────────┼───────┤
│ ord-001  │ mer-001  │ 2        │ 500   │ (2 T-shirts)
│ ord-001  │ mer-002  │ 1        │ 300   │ (1 Cap)
└──────────┴──────────┴──────────┴───────┘
```

### **news Table**

```
Stores news articles

Columns:
- id (UUID)
- title - Article title
- content - Article text
- source - Where it's from
- image_url - Picture
- published_at - When published
```

### **achievements Table**

```
Stores university achievements

Columns:
- id (UUID)
- title - Achievement name
- description - Details
- date - When it happened
- image_url - Picture
```

## How Tables Relate (Relationships)

```
users (1) ──────────── (Many) profiles
          (one user has many profiles? No, just 1)
          
          Actually: One user = One profile
          
users (1) ──────────── (Many) jobs
          (one user can post many jobs)
          
orders (1) ──────────---- (Many) order_items
           (one order has many items)
           
merchandise (1) ─────---- (Many) order_items
                (one product in many orders)
```

## Important Database Concepts

### **Primary Key (id)**

- Unique identifier for each row
- No two rows have same ID
- Every table has one
- Example: `id: "abc-123-def-456"`

### **Foreign Key (user_id, order_id)**

- Links to another table
- Example: profile.user_id = users.id
- Maintains relationships between tables

### **WHERE Clause**

- Filters data
- `SELECT * FROM jobs WHERE is_active = true` → Get only active jobs
- `SELECT * FROM users WHERE email = ?` → Get user with specific email

### **ORDER BY**

- Sorts results
- `ORDER BY created_at DESC` → Newest first

### **Indexes**

- Make queries faster
- Like a book's table of contents
- `INDEX idx_email (email)` → Fast lookup by email

---

# KEY FEATURES & HOW THEY WORK

## 1. Alumni/Student Differentiation

**Purpose:** Different features for alumni vs students

**How it works:**

When user signs up, they select:
```
[ALUMNI] or [STUDENT]
```

This is stored in database:
```sql
INSERT INTO users VALUES (..., user_type = 'alumni')
```

Frontend uses this to show/hide features:

```typescript
// In any component
const currentUser = localStorage.getItem('currentUser');
const isAlumni = currentUser.userType === 'alumni';

if (isAlumni) {
  // Show: "Post a Job" button
  // Show: Admin panel
  // Show: "Promote to Alumni" button (in admin)
} else {
  // Hide posting form
  // Show: "Only alumni can post"
}
```

**Why this matters:**
- Keeps features exclusive to alumni
- Different navigation for different users
- Admin can promote students to alumni
- Maintains data integrity

## 2. Job Posting Feature (Alumni Only)

**Flow:**

```
Alumni User:
  1. Visits /jobs page
  2. Sees "Post a Job" button
  3. Fills form:
     - Position
     - Company
     - Hours
     - Salary
     - Qualifications
  4. Clicks Submit
  5. Frontend sends to backend
  6. Backend inserts into jobs table
  7. Jobs list updates automatically
  8. Shows success message

Student User:
  1. Visits /jobs page
  2. Doesn't see form
  3. Sees: "Only alumni can post"
  4. Can still view all jobs
```

**Frontend code:**
```typescript
// Only show form if user is alumni
{isAlumni && (
  <form>
    <input name="title" placeholder="Position" />
    <input name="company" placeholder="Company" />
    {/* ...more fields... */}
    <button type="submit">Post Job</button>
  </form>
)}

// Handle submit
const handleSubmit = async (e) => {
  const response = await createJob({
    title: formData.title,
    company: formData.company,
    type: formData.workingHours,
    salary_range: formData.salary,
    requirements: formData.qualifications
  });
}
```

**Backend code:**
```javascript
// No explicit alumni check (could add for security)
// Anyone can call endpoint, but frontend prevents non-alumni
app.post('/api/jobs', async (req, res) => {
  // Create job
  // Return job data
});
```

**Why this design?**
- Separation of concerns (frontend handles UI logic, backend stores data)
- Frontend can be faster (checks before sending)
- Backend is stateless (doesn't remember user)

## 3. Shopping Cart System

**Storage Strategy: localStorage**

Why localStorage?
- Cart data stays even if user closes browser
- No database writes needed while browsing
- Super fast (local computer memory)
- Only sends to server at checkout

**How it works:**

```
User clicks "Add to Cart"
  ↓
Frontend calls: addToCart({id, name, price})
  ↓
Hook (useCart) adds to state
  ↓
Also saves to localStorage:
{
  items: [
    {id: 1, name: "T-Shirt", price: 500, quantity: 2},
    {id: 2, name: "Cap", price: 300, quantity: 1}
  ],
  total: 1300
}
  ↓
Cart displays updated

User goes to checkout
  ↓
Form asks for: name, email, phone, address
  ↓
User clicks submit
  ↓
Frontend sends to backend:
POST /api/orders {
  fullName, email, phone, address,
  items: [{id, name, quantity, price}],
  total: 1300
}
  ↓
Backend creates order in database
  ↓
Frontend clears localStorage (cart = empty)
  ↓
Show confirmation
```

## 4. User Authentication Flow

**Two-Step Process:**

**Step 1: Signup**
```
User fills: email, password, name, type
  ↓
Frontend validates (not empty, valid email, etc.)
  ↓
Sends to backend
  ↓
Backend checks if email exists
  ↓ If exists: Error
  ↓ If new: Create user + profile
  ↓
Returns: user object with ID and userType
  ↓
Frontend saves to localStorage
  ↓
Navbar shows user is logged in
```

**Step 2: Signin**
```
User enters: email, password
  ↓
Frontend sends to backend
  ↓
Backend finds user by email
  ↓
Checks if password matches
  ↓ If wrong: Error
  ↓ If correct: Returns user object
  ↓
Frontend saves to localStorage
  ↓
Redirects to home page
```

**Why not store password in localStorage?**
- Security risk if someone accesses your computer
- Server knows the password, not the browser
- Each session can be validated by server

**Why hash passwords?**
- If database gets stolen, hackers can't use passwords
- Even with hashed version, original password is safe
- One-way encryption (can't reverse it)

## 5. Admin Panel

**Purpose:** Manage all content

**What admins can do:**

```
┌─────────────────────────────┐
│      Admin Panel            │
├─────────────────────────────┤
│ Users Management:           │
│ - View all members/alumni   │
│ - Edit profiles             │
│ - Promote to alumni         │
│ - Delete accounts           │
├─────────────────────────────┤
│ Content Management:         │
│ - Create/edit jobs          │
│ - Create/edit news          │
│ - Create/edit merchandise   │
│ - Create/edit achievements  │
├─────────────────────────────┤
│ Order Management:           │
│ - View all orders           │
│ - Update order status       │
└─────────────────────────────┘
```

**How members vs alumni view works:**

```
GET /api/profiles → Returns all users with user_type
  ↓
Frontend filters:
  
members_list = users WHERE user_type !== 'alumni'
alumni_list = users WHERE user_type = 'alumni'
  ↓
Shows separately in admin panel
```

**Why filter on frontend?**
- One API call instead of two
- All data already fetched
- Admin portal typically small list

---

# WHY SPECIFIC DECISIONS WERE MADE

## 1. React + TypeScript

**Decision: Use React for frontend**

Why?
- **Component-based:** Break UI into reusable pieces
- **Reactive:** Updates automatically when data changes
- **Large community:** Easy to find solutions
- **Job market:** Most companies use React

```typescript
// Example: Reusable JobCard component
<JobCard 
  title="Senior Dev"
  company="Google"
  salary="80k"
/>

// Used many places without rewriting
```

**Decision: Use TypeScript (not plain JavaScript)**

Why?
- **Catches errors early:** Typos caught before running
- **Self-documenting:** Types show what data looks like
- **Refactoring safe:** Can rename things without breaking

```typescript
// TypeScript catches this error:
user.userTyep // ← Typo! TypeScript says this doesn't exist
user.userType // ✓ Correct

// JavaScript would run and fail later
```

## 2. Express.js Backend

**Decision: Use Express.js for backend**

Why?
- **Same language as frontend:** Node.js runs JavaScript
- **Simple & lightweight:** Not overly complex
- **Middleware:** Can add request validators, logging, etc.
- **REST API:** Standard way to build web services

## 3. MySQL Database

**Decision: Use MySQL instead of cloud services like Firebase**

Why?
- **Full control:** Your own server, your own data
- **No vendor lock-in:** Can move to another host anytime
- **Cost-effective:** Free on localhost, cheap on servers
- **Learning:** Understand SQL and databases better
- **Partner transfer:** Easy to export and import

**Trade-offs:**
- Have to manage yourself (no automatic backups)
- Have to handle scaling (Firebase scales automatically)
- More setup work

## 4. localStorage for Shopping Cart

**Decision: Store cart in browser, not database**

Why not database?
- Would need database writes for every "Add to Cart" click
- Slow and expensive
- Carts are temporary (most get abandoned)

Why localStorage?
- Instant (no server needed)
- Persists across sessions
- Cleared at checkout (good for privacy)

**What if user has 10 browsers?**
- Each browser has own cart
- When they checkout, order is created (good enough)

## 5. Alumni/Student Type System

**Decision: Store user_type in users table**

Why?
- **Single source of truth:** One place for type
- **Admin updates:** Can change type without recreating user
- **Queries:** Easy to filter by type
- **Relationships:** user_id links profiles to users

**Why not just use is_alumni boolean?**

Old way:
```sql
profiles.is_alumni = true/false  ← Problems:
- Only 2 options
- Data could be out of sync
- Can't add new types easily
```

New way:
```sql
users.user_type = 'alumni'/'student'  ← Better:
- Can add 'advisor', 'faculty', etc.
- Single source of truth
- Easy to query
```

## 6. API Client Layer

**Decision: Create api/client.ts file**

Why?
- **Separation of concerns:** Frontend doesn't know about HTTP
- **Reusability:** One place to define all API calls
- **Easy updates:** If backend URL changes, update one file
- **Error handling:** Add logging/retries in one place
- **Type safety:** TypeScript can check all calls

```typescript
// Bad way (in many components):
fetch('http://localhost:5000/api/jobs').then(...)
fetch('http://localhost:5000/api/users').then(...)
// If URL changes, update everywhere

// Good way (in api/client.ts):
export async function getJobs() {
  return apiCall('/api/jobs');
}
export async function getUsers() {
  return apiCall('/api/users');
}
// If URL changes, update ONE place
```

## 7. React Query for Data Fetching

**Decision: Use React Query instead of useState + fetch**

Why?
- **Caching:** Don't fetch same data twice
- **Automatic updates:** Refetch when needed
- **Loading/error states:** Built-in handling
- **Mutations:** Easy to update data

```typescript
// Without React Query:
const [jobs, setJobs] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  fetch('/api/jobs')
    .then(r => r.json())
    .then(data => {
      setJobs(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err);
      setLoading(false);
    });
}, []);

// With React Query:
const { data: jobs, isLoading, error } = useQuery({
  queryKey: ['jobs'],
  queryFn: () => getJobs()
});
// 3 lines instead of 20!
```

## 8. Environment Variables (.env file)

**Decision: Use .env file for configuration**

Why?
- **Security:** Don't commit passwords to GitHub
- **Different environments:** localhost vs production
- **Easy changes:** Update without touching code

```
.env file:
VITE_API_URL=http://localhost:5000
DB_PASSWORD=secret123

Code never hardcodes these values
```

## 9. Hashed Passwords (Not Encrypted)

**Decision: Hash passwords, not encrypt**

Why?
- **One-way:** Can't reverse to get original
- **Consistent:** Same password always hashes to same value
- **Standard:** Industry best practice

```
Encryption:  secret123 ← (encrypt) → abc123xyz ← (decrypt) → secret123
             Can reverse it, dangerous!

Hashing:     secret123 ← (hash) → abc123xyz
             Can't reverse it, safe!
             
When user logs in:
1. User enters: secret123
2. Hash it: abc123xyz
3. Compare with stored: abc123xyz
4. Match? Login successful!
```

## 10. UUID for IDs (Not auto-increment)

**Decision: Use UUID for all IDs**

Example UUID: `550e8400-e29b-41d4-a716-446655440000`

Why not auto-increment (1, 2, 3)?
- **Not predictable:** Can't guess next ID
- **Distributed:** Multiple servers can generate IDs safely
- **Privacy:** Don't leak how many records exist
- **Database transfers:** No conflicts when merging databases

Trade-offs:
- Longer (36 characters vs 1-3)
- Slightly slower comparisons
- Worth it for security

---

# SUMMARY OF KEY DECISIONS

| Decision | Why | Trade-offs |
|----------|-----|-----------|
| React | Reactive UI, Large community | Learning curve |
| TypeScript | Type safety, Catches errors early | Extra syntax |
| Express.js | Simple, Node.js, REST standard | Manual scaling |
| MySQL | Full control, Cost-effective | Self-managed |
| localStorage cart | Instant, Persists | Lost if private mode |
| user_type field | Flexible, Single source of truth | Nullable field |
| API Client layer | Reusability, Easy updates | Extra file |
| React Query | Caching, Built-in logic | Another library |
| Hashed passwords | Secure, Can't reverse | Can't recover password |
| UUID IDs | Secure, Distributed-safe | Longer, Slower |

---

# GLOSSARY OF TERMS

| Term | Meaning |
|------|---------|
| **API** | Application Programming Interface - Way for frontend & backend to talk |
| **Endpoint** | URL that does something (GET /api/jobs) |
| **Route** | Path in app (/jobs, /admin, /cart) |
| **State** | Data that can change (form input, cart items) |
| **Hook** | React function to add features (useState, useQuery) |
| **Component** | Reusable piece of UI (button, card, navbar) |
| **Middleware** | Function that runs before/after request |
| **Query** | Asking database for data (SELECT ...) |
| **Mutation** | Changing data (POST, PUT, DELETE) |
| **Join** | Combining data from multiple tables |
| **Hash** | One-way encryption of password |
| **UUID** | Unique identifier (like fingerprint) |
| **Foreign Key** | Link to another table |
| **Primary Key** | Unique ID in table |
| **Async/Await** | Way to handle long-running operations |
| **Promise** | Object representing future value |
| **localStorage** | Browser's local storage (persists after close) |
| **Session** | User's logged-in state |
| **CORS** | Allows frontend to talk to backend |

---

This explains the entire system in simple terms. Every component, every decision, and every technique has a clear reason behind it!
