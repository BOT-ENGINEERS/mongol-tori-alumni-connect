# Alumni Connect - Code Flow & Examples

This document shows actual code examples with explanations for every major feature.

---

## TABLE OF CONTENTS

1. [Authentication Flow](#authentication-flow)
2. [Job Posting Flow](#job-posting-flow)
3. [Shopping Cart Flow](#shopping-cart-flow)
4. [Admin Panel Flow](#admin-panel-flow)
5. [Data Relationships](#data-relationships)
6. [Error Handling](#error-handling)

---

## AUTHENTICATION FLOW

### Complete User Signup Process

#### **Step 1: Frontend - Auth.tsx (User Interface)**

```typescript
// File: src/pages/Auth.tsx

import { useState } from "react";
import { signUp, signIn } from "@/integrations/api/client";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  // State variables (what changes as user types)
  const [isLogin, setIsLogin] = useState(true);           // Toggle login/signup
  const [email, setEmail] = useState("");                  // Email input
  const [password, setPassword] = useState("");            // Password input
  const [fullName, setFullName] = useState("");            // Name input
  const [userType, setUserType] = useState<"student" | "alumni">("student");  // Selected type
  const [loading, setLoading] = useState(false);           // Is request in progress?

  // When form is submitted
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  // Prevent page reload
    setLoading(true);    // Show loading state
    
    try {
      if (isLogin) {
        // User is signing in
        const response = await signIn(email, password);
        if (response.error) {
          throw new Error(response.error);  // Wrong password?
        }
        toast({ title: "Welcome back!" });
        navigate("/");  // Go to home page
      } else {
        // User is signing up
        const response = await signUp(email, password, fullName, userType);
        if (response.error) {
          throw new Error(response.error);  // Email already exists?
        }
        toast({ title: "Account created!" });
        navigate("/");  // Go to home page
      }
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);  // Stop showing loading
    }
  };

  // Render the form
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}  // Update state when user types
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      {/* Only show name input during signup */}
      {!isLogin && (
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      )}

      {/* Only show type selector during signup */}
      {!isLogin && (
        <div>
          <label>I am a...</label>
          
          {/* Student button */}
          <button
            type="button"  // Don't submit form
            onClick={() => setUserType("student")}
            className={userType === "student" ? "selected" : ""}
          >
            Student
          </button>
          
          {/* Alumni button */}
          <button
            type="button"
            onClick={() => setUserType("alumni")}
            className={userType === "alumni" ? "selected" : ""}
          >
            Alumni
          </button>
        </div>
      )}

      <button type="submit" disabled={loading}>
        {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
      </button>
    </form>
  );
};

export default Auth;
```

**What happens when user types:**
- Email field: `setEmail` updates state → input shows updated value instantly
- Password field: Same thing
- Click Student: `setUserType("student")` → Button highlights
- Click Alumni: `setUserType("alumni")` → Button highlights

#### **Step 2: API Client - client.ts (Communication)**

```typescript
// File: src/integrations/api/client.ts

// Generic function to call any endpoint
export async function apiCall(endpoint: string, method: string = 'GET', data?: any) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    // Make HTTP request
    const response = await fetch(
      'http://localhost:5000' + endpoint,
      options
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'API request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error (${method} ${endpoint}):`, error);
    throw error;
  }
}

// Sign up function
export async function signUp(
  email: string, 
  password: string, 
  fullName: string, 
  userType: string = 'student'
) {
  try {
    console.log('Sending signup:', { email, fullName, userType });
    
    // Call backend signup endpoint
    const response = await apiCall('/api/auth/signup', 'POST', {
      email, 
      password, 
      fullName, 
      userType
    });
    
    // Response should be: { user: { id, email, userType } }
    console.log('Signup response:', response);
    
    // Extract the user object
    const userData = response.user || response;
    
    // Save to localStorage (browser's memory)
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    return { user: userData, error: null };
  } catch (error: any) {
    console.error('Signup error:', error.message);
    return { user: null, error: error.message };
  }
}

// Sign in function
export async function signIn(email: string, password: string) {
  try {
    // Call backend signin endpoint
    const response = await apiCall('/api/auth/signin', 'POST', {
      email,
      password
    });
    
    // Extract user and save
    const userData = response.user || response;
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    return { user: userData, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

// Get currently logged in user
export function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);  // Convert string back to object
  } catch {
    return null;
  }
}

// Sign out
export async function signOut() {
  localStorage.removeItem('currentUser');  // Delete from localStorage
}
```

**What happens here:**
1. Takes data from frontend (email, password, userType)
2. Makes HTTP POST request to backend
3. Backend responds with user data
4. Saves user data to localStorage
5. Returns response to frontend

#### **Step 3: Backend - server.js (Database)**

```javascript
// File: server.js

app.post('/api/auth/signup', async (req, res) => {
  try {
    // Get data from request
    const { email, password, fullName, userType } = req.body;
    console.log('Signup attempt:', { email, fullName, userType });
    
    // Get database connection
    const connection = await pool.getConnection();
    
    try {
      // Step 1: Check if user already exists
      const [existing] = await connection.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );
      
      if (existing.length > 0) {
        // Email already registered
        return res.status(400).json({ error: 'User already exists' });
      }
      
      // Step 2: Generate unique ID
      const userId = generateUUID();
      console.log('Generated userId:', userId);
      
      // Step 3: Hash password (convert to unreadable format)
      const passwordHash = Buffer.from(password).toString('base64');
      // secret123 → c2VjcmV0MTIz
      
      // Step 4: Determine user type
      const finalUserType = userType || 'student';
      console.log('Creating user with type:', finalUserType);
      
      // Step 5: Insert into users table
      await connection.execute(
        'INSERT INTO users (id, email, password_hash, user_type) VALUES (?, ?, ?, ?)',
        [userId, email, passwordHash, finalUserType]
      );
      // Now database has:
      // id: 123e4567-e89b-12d3-a456
      // email: john@gmail.com
      // password_hash: c2VjcmV0MTIz
      // user_type: alumni
      
      // Step 6: Create profile record
      await connection.execute(
        `INSERT INTO profiles (id, user_id, full_name, email, is_alumni, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          generateUUID(),  // New UUID for profile
          userId,          // Link to user
          fullName,        // User's name
          email,
          userType === 'alumni' ? 1 : 0  // true/false for alumni
        ]
      );
      
      // Step 7: Send back user data
      res.json({ 
        user: { 
          id: userId, 
          email, 
          userType: finalUserType 
        } 
      });
      // Frontend receives: { user: { id: "123...", email: "john@...", userType: "alumni" } }
      
    } finally {
      // Step 8: Return connection to pool (important!)
      connection.release();
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const connection = await pool.getConnection();
    
    try {
      // Step 1: Find user by email
      const [results] = await connection.execute(
        'SELECT id, email, password_hash, user_type FROM users WHERE email = ?',
        [email]
      );
      
      if (results.length === 0) {
        // User doesn't exist
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      // Step 2: Get the user
      const user = results[0];
      console.log('Found user:', { email: user.email, user_type: user.user_type });
      
      // Step 3: Check password
      const passwordHash = Buffer.from(password).toString('base64');
      
      if (passwordHash !== user.password_hash) {
        // Password doesn't match
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      // Step 4: Password correct! Send back user data
      const responseData = {
        user: {
          id: user.id,
          email: user.email,
          userType: user.user_type  // ← This is the key line!
        }
      };
      console.log('Signin response:', responseData);
      
      res.json(responseData);
      
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

#### **Step 4: Database - What Gets Stored**

```sql
-- users table after signup
┌────────────────────────────────────┬──────────────────┬────────────┬───────────┬─────────────────┐
│ id                                 │ email            │ password   │ user_type │ created_at      │
├────────────────────────────────────┼──────────────────┼────────────┼───────────┼─────────────────┤
│ 550e8400-e29b-41d4-a716-446655440 │ john@gmail.com   │ c2VjcmV0   │ alumni    │ 2024-01-15 ...  │
└────────────────────────────────────┴──────────────────┴────────────┴───────────┴─────────────────┘

-- profiles table after signup
┌────────────────────────────────────┬────────────────────────────────────┬────────────┬───────────┐
│ id                                 │ user_id                            │ full_name  │ is_alumni │
├────────────────────────────────────┼────────────────────────────────────┼────────────┼───────────┤
│ 6ba7b810-9dad-11d1-80b4-00c04fd430 │ 550e8400-e29b-41d4-a716-446655440 │ John Doe   │ 1         │
└────────────────────────────────────┴────────────────────────────────────┴────────────┴───────────┘
```

#### **Step 5: Frontend - Save & Use**

```typescript
// After successful signup/signin, data is in localStorage
localStorage.getItem('currentUser')
// Returns: '{"id":"550e8400...","email":"john@gmail.com","userType":"alumni"}'

// Later, in Navbar component:
const currentUser = getCurrentUser();
// Returns: { id: "550e8400...", email: "john@gmail.com", userType: "alumni" }

if (currentUser?.userType === 'alumni') {
  // Show ALUMNI badge in navbar
  <span className="text-primary">ALUMNI</span>
} else if (currentUser?.userType === 'student') {
  // Show STUDENT badge in navbar
  <span className="text-blue">STUDENT</span>
} else {
  // Not logged in
  <a href="/auth">Sign In</a>
}
```

---

## JOB POSTING FLOW

### Complete Job Creation Process

#### **Step 1: Frontend - Jobs.tsx**

```typescript
// File: src/pages/Jobs.tsx

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getJobs, createJob, deleteJob, getCurrentUser } from "@/integrations/api/client";

const Jobs = () => {
  // State
  const navigate = useNavigate();
  const qc = useQueryClient();  // React Query client
  const { toast } = useToast();
  const currentUser = getCurrentUser();  // Get logged in user
  
  // Is current user alumni?
  const isAlumni = currentUser?.userType === "alumni";
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",           // "Senior Developer"
    company: "",         // "Google"
    workingHours: "",    // "Full-time"
    salary: "",          // "50,000-80,000"
    qualifications: ""   // "5+ years React..."
  });

  // Query: Fetch all jobs
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs"],  // Cache key
    queryFn: async () => await getJobs()
  });

  // Mutation: Create new job
  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      await createJob(payload);
    },
    onSuccess: () => {
      // Job created! Refresh job list
      qc.invalidateQueries({ queryKey: ["jobs"] });
      toast({ title: "Job posted successfully!" });
      resetForm();
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  // Mutation: Delete job
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteJob(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      toast({ title: "Job deleted" });
    }
  });

  // Handle form input
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value  // Update corresponding field
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check: Is user logged in?
    if (!currentUser) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to post a job",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    // Check: Is user alumni?
    if (!isAlumni) {
      toast({
        title: "Alumni Only",
        description: "Only alumni members can post job opportunities",
        variant: "destructive"
      });
      return;
    }

    // Validation: All fields filled?
    if (!formData.title || !formData.company || !formData.workingHours || 
        !formData.salary || !formData.qualifications) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields"
      });
      return;
    }

    try {
      // Create job
      await createMutation.mutateAsync({
        title: formData.title,                      // "Senior Developer"
        company: formData.company,                  // "Google"
        type: formData.workingHours,                // Map to database field
        salary_range: formData.salary,              // Map to database field
        requirements: formData.qualifications,      // Map to database field
        description: `${formData.company} is hiring for ${formData.title}. Required: ${formData.qualifications}`,
        location: "",
        is_active: true
      });
    } catch (error) {
      console.error("Error posting job:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <h1 className="text-3xl font-bold mb-8">Job Opportunities</h1>

        {/* Post Job Button - Alumni Only */}
        {isAlumni && (
          <button 
            onClick={() => setShowForm(true)}
            className="btn-primary mb-8"
          >
            Post a Job
          </button>
        )}

        {/* Job Posting Form - Alumni Only */}
        {showForm && isAlumni && (
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold">Post a New Job</h2>
            
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Position Title"
              required
            />
            
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Company Name"
              required
            />
            
            <input
              type="text"
              name="workingHours"
              value={formData.workingHours}
              onChange={handleInputChange}
              placeholder="Full-time, Part-time, Contract"
              required
            />
            
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              placeholder="Salary Range"
              required
            />
            
            <textarea
              name="qualifications"
              value={formData.qualifications}
              onChange={handleInputChange}
              placeholder="Required Qualifications"
              required
            />
            
            <button type="submit">Post Job</button>
          </form>
        )}

        {/* Access Control Message - Non-Alumni */}
        {!isAlumni && currentUser && (
          <div className="bg-amber-50 border border-amber-200 p-6 mb-8">
            <h3 className="font-semibold">Alumni Only Feature</h3>
            <p>Only alumni members can post job opportunities.</p>
          </div>
        )}

        {/* Access Control Message - Not Logged In */}
        {!currentUser && (
          <div className="bg-blue-50 border border-blue-200 p-6 mb-8">
            <h3 className="font-semibold">Want to Post a Job?</h3>
            <p>
              <Link to="/auth">Sign in as an alumni</Link>
              {" "}to post job opportunities.
            </p>
          </div>
        )}

        {/* Jobs List */}
        <div className="bg-card rounded-lg border">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">
              Available Opportunities ({jobs?.length || 0})
            </h2>
          </div>

          {isLoading && <div className="p-6">Loading jobs...</div>}

          {jobs && jobs.length > 0 ? (
            <div className="divide-y">
              {jobs.map((job: any) => (
                <div key={job.id} className="p-6">
                  {/* Job Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold">{job.title}</h3>
                      <p className="text-lg font-semibold text-primary">{job.company}</p>
                    </div>
                    {/* Delete button - only for alumni */}
                    {isAlumni && (
                      <button
                        onClick={() => deleteMutation.mutate(job.id)}
                        className="text-red-600 hover:bg-red-100 p-2 rounded"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>

                  {/* Job Details */}
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Working Hours</p>
                      <p className="font-semibold">{job.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Salary Range</p>
                      <p className="font-semibold">{job.salary_range}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Posted</p>
                      <p className="font-semibold">
                        {new Date(job.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Qualifications */}
                  {job.requirements && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Required Qualifications</p>
                      <p className="text-sm">{job.requirements}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <p>No job opportunities available yet.</p>
              {isAlumni && <p>Be the first to post a job!</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
```

#### **Step 2: API Client**

```typescript
// File: src/integrations/api/client.ts

export async function getJobs() {
  return apiCall('/api/jobs');  // GET request
}

export async function createJob(data: any) {
  return apiCall('/api/jobs', 'POST', data);  // POST request
}

export async function deleteJob(id: string) {
  return apiCall(`/api/jobs/${id}`, 'DELETE');  // DELETE request
}
```

#### **Step 3: Backend**

```javascript
// File: server.js

// GET all jobs
app.get('/api/jobs', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [jobs] = await connection.execute(
        'SELECT * FROM jobs WHERE is_active = true ORDER BY created_at DESC'
      );
      res.json(jobs);
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new job
app.post('/api/jobs', async (req, res) => {
  try {
    const { title, company, type, salary_range, requirements } = req.body;
    
    // Validate: All fields present?
    if (!title || !company || !type || !salary_range || !requirements) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const connection = await pool.getConnection();
    try {
      const id = generateUUID();
      
      // Insert into database
      await connection.execute(
        `INSERT INTO jobs (id, title, company, type, salary_range, requirements, 
         created_at, updated_at, is_active) 
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), true)`,
        [id, title, company, type, salary_range, requirements]
      );
      
      // Get created job
      const [result] = await connection.execute(
        'SELECT * FROM jobs WHERE id = ?',
        [id]
      );
      
      // Return newly created job
      res.status(201).json(result[0]);
      
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE job
app.delete('/api/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;  // Get ID from URL
    
    const connection = await pool.getConnection();
    try {
      // Delete from database
      await connection.execute('DELETE FROM jobs WHERE id = ?', [id]);
      
      res.json({ success: true });
      
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### **Step 4: Data Stored in Database**

```sql
-- jobs table
INSERT INTO jobs VALUES (
  '550e8400-e29b-41d4-a716-446655440000',  -- id
  'Senior Developer',                        -- title
  'Google',                                  -- company
  'Full-time',                               -- type
  '50,000-80,000',                           -- salary_range
  '5+ years React, Node.js',                 -- requirements
  '2024-01-15 10:30:00',                    -- created_at
  '2024-01-15 10:30:00',                    -- updated_at
  true                                       -- is_active
);

-- Result: Job appears in list for all users!
```

---

## SHOPPING CART FLOW

### Complete Cart to Checkout Process

#### **Step 1: useCart Hook (State Management)**

```typescript
// File: src/hooks/use-cart.ts

import { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Cart {
  items: CartItem[];
  total: number;
}

export function useCart() {
  // State
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('alumni_cart');
    if (saved) {
      const parsedCart = JSON.parse(saved);
      setCart(parsedCart);
    }
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('alumni_cart', JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      // Check if item already in cart
      const existing = prev.items.find(i => i.id === item.id);
      
      if (existing) {
        // Already in cart: increase quantity
        return {
          items: prev.items.map(i =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
          total: prev.total + item.price
        };
      } else {
        // New item: add to cart
        return {
          items: [...prev.items, { ...item, quantity: 1 }],
          total: prev.total + item.price
        };
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const item = prev.items.find(i => i.id === itemId);
      return {
        items: prev.items.filter(i => i.id !== itemId),
        total: prev.total - (item?.price ?? 0) * (item?.quantity ?? 1)
      };
    });
  };

  // Update quantity
  const updateQuantity = (itemId: string, quantity: number) => {
    setCart(prev => {
      const item = prev.items.find(i => i.id === itemId);
      const difference = quantity - (item?.quantity ?? 0);
      
      return {
        items: prev.items.map(i =>
          i.id === itemId ? { ...i, quantity } : i
        ),
        total: prev.total + (item?.price ?? 0) * difference
      };
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart({ items: [], total: 0 });
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
}
```

**How it works:**
- User clicks "Add to Cart"
- `addToCart` is called with item
- State updates
- `useEffect` saves to localStorage
- Cart shows updated count

#### **Step 2: Merchandise Component**

```typescript
// File: src/components/MerchandiseSection.tsx

import { useCart } from '@/hooks/use-cart';

const MerchandiseSection = () => {
  const { addToCart } = useCart();
  const { data: merchandise, isLoading } = useQuery({
    queryKey: ['merchandise'],
    queryFn: () => getMerchandise()
  });

  return (
    <div>
      {merchandise?.map(product => (
        <div key={product.id} className="product-card">
          <img src={product.image_url} alt={product.name} />
          <h3>{product.name}</h3>
          <p className="price">₿{product.price}</p>
          
          <button
            onClick={() => addToCart({
              id: product.id,
              name: product.name,
              price: product.price
            })}
            className="btn-primary"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};
```

#### **Step 3: Cart Page - View Items**

```typescript
// File: src/pages/Cart.tsx

import { useCart } from '@/hooks/use-cart';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  if (cart.items.length === 0) {
    return (
      <div>
        <h1>Your Cart is Empty</h1>
        <Link to="/#shop">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-3 gap-8">
        
        {/* Cart Items */}
        <div className="col-span-2">
          {cart.items.map(item => (
            <div key={item.id} className="border p-4 mb-4 flex justify-between">
              <div>
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-gray-600">₿{item.price} × {item.quantity}</p>
              </div>
              
              <div className="flex gap-2">
                {/* Quantity control */}
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                />
                
                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:bg-red-100 p-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="border p-6 h-fit sticky top-6">
          <h2 className="font-bold text-xl mb-4">Order Summary</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₿{cart.total}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%):</span>
              <span>₿{Math.round(cart.total * 0.1)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>₿{Math.round(cart.total * 1.1)}</span>
            </div>
          </div>
          
          <Link
            to="/checkout"
            className="btn-primary w-full block text-center"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
```

#### **Step 4: Checkout Page**

```typescript
// File: src/pages/Checkout.tsx

import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { createOrder } from '@/integrations/api/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

  const total = Math.round(cart.total * 1.1);  // With tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate
      if (!formData.fullName || !formData.email || !formData.phone) {
        throw new Error('Please fill in all required fields');
      }

      // Create order
      const response = await createOrder({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.street}, ${formData.city}, ${formData.state} ${formData.postalCode}, ${formData.country}`,
        items: cart.items,
        total: total
      });

      // Success
      toast({ title: 'Order placed successfully!' });
      clearCart();  // Empty the cart
      navigate('/');  // Go to home
      
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-3 gap-8">
        
        {/* Form */}
        <div className="col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label>Full Name *</label>
              <input
                required
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label>Email *</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label>Phone *</label>
              <input
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full border p-2 rounded"
              />
            </div>

            <h3 className="font-bold mt-6">Shipping Address</h3>

            <div>
              <label>Street</label>
              <input
                value={formData.street}
                onChange={(e) => setFormData({...formData, street: e.target.value})}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>City</label>
                <input
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label>State</label>
                <input
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Postal Code</label>
                <input
                  value={formData.postalCode}
                  onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label>Country</label>
                <input
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-6"
            >
              {loading ? 'Processing...' : 'Complete Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="border p-6 h-fit">
          <h2 className="font-bold text-xl mb-4">Order Summary</h2>
          
          {cart.items.map(item => (
            <div key={item.id} className="flex justify-between mb-2">
              <span>{item.name} × {item.quantity}</span>
              <span>₿{item.price * item.quantity}</span>
            </div>
          ))}
          
          <div className="border-t pt-4 mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₿{cart.total}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>₿{Math.round(cart.total * 0.1)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>₿{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
```

#### **Step 5: Backend - Create Order**

```javascript
// File: server.js

app.post('/api/orders', async (req, res) => {
  try {
    const { fullName, email, phone, address, items, total } = req.body;
    
    const connection = await pool.getConnection();
    try {
      // Step 1: Create order record
      const orderId = generateUUID();
      
      await connection.execute(
        `INSERT INTO orders (id, full_name, email, phone, address, total_amount, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())`,
        [orderId, fullName, email, phone, address, total]
      );
      
      // Step 2: Add each item to order
      for (let item of items) {
        await connection.execute(
          `INSERT INTO order_items (id, order_id, merchandise_id, quantity, price)
           VALUES (?, ?, ?, ?, ?)`,
          [generateUUID(), orderId, item.id, item.quantity, item.price]
        );
      }
      
      // Step 3: Send confirmation
      res.status(201).json({
        orderId,
        status: 'pending',
        total,
        message: 'Order created successfully'
      });
      
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## ERROR HANDLING

### How Errors Flow Through the System

```typescript
// USER MAKES MISTAKE
User enters: password: ""
  ↓
Frontend validation:
if (!password) {
  throw new Error("Password is required");
}
  ↓
Toast message: "Password is required"
  ✓ User never sends empty request


// DATABASE DOESN'T HAVE DATA
GET /api/jobs
  ↓
Backend query: SELECT * FROM jobs
  ↓
Result: 0 rows
  ↓
Return: []
  ↓
Frontend shows: "No jobs found"
  ✓ Not an error, just empty state


// SERVER ERROR
Backend can't connect to database
  ↓
try { ... } catch (error) {
  console.error('Database error:', error);
  res.status(500).json({ error: error.message });
}
  ↓
Frontend receives: 500 error
  ↓
catch (error) {
  toast({
    title: "Error",
    description: "Something went wrong. Please try again.",
    variant: "destructive"
  });
}
  ↓
User sees: "Something went wrong. Please try again."
  ✓ User informed but not scared
```

---

This explains the complete code flow with real examples!
