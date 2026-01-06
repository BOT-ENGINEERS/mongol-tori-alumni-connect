import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'alumni_connect',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Utility functions
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, fullName, userType } = req.body;
    console.log('Signup attempt:', { email, fullName, userType });
    
    const connection = await pool.getConnection();
    
    try {
      // Check if user exists
      const [existing] = await connection.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );
      
      if (existing.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
      }
      
      const userId = generateUUID();
      const passwordHash = Buffer.from(password).toString('base64');
      
      // Create user with user_type
      const finalUserType = userType || 'student';
      console.log('Creating user with type:', finalUserType);
      
      await connection.execute(
        'INSERT INTO users (id, email, password_hash, user_type) VALUES (?, ?, ?, ?)',
        [userId, email, passwordHash, finalUserType]
      );
      
      // Create profile
      await connection.execute(
        `INSERT INTO profiles (id, user_id, full_name, email, is_alumni, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [generateUUID(), userId, fullName, email, userType === 'alumni' ? 1 : 0]
      );
      
      res.json({ user: { id: userId, email, userType: finalUserType } });
    } finally {
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
      const [results] = await connection.execute(
        'SELECT id, email, password_hash, user_type FROM users WHERE email = ?',
        [email]
      );
      
      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      const user = results[0];
      console.log('Login user from DB:', { email: user.email, user_type: user.user_type, user_type_type: typeof user.user_type });
      
      const passwordHash = Buffer.from(password).toString('base64');
      
      if (passwordHash !== user.password_hash) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      const responseData = { user: { id: user.id, email: user.email, userType: user.user_type } };
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

// Profile Routes
app.get('/api/profiles', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [profiles] = await connection.execute(`
        SELECT p.*, u.user_type 
        FROM profiles p 
        LEFT JOIN users u ON p.user_id = u.id
      `);
      res.json(profiles);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/profiles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, bio, avatar_url, location, phone, company, position, is_alumni, user_type } = req.body;
    
    const connection = await pool.getConnection();
    try {
      // Get the profile to find user_id
      const [profileResult] = await connection.execute('SELECT user_id FROM profiles WHERE id = ?', [id]);
      
      if (profileResult.length === 0) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      
      const userId = profileResult[0].user_id;
      
      // Update profile fields
      await connection.execute(
        `UPDATE profiles SET 
         full_name = ?, bio = ?, avatar_url = ?, location = ?, phone = ?, company = ?, position = ?, is_alumni = ?, updated_at = NOW() 
         WHERE id = ?`,
        [full_name || null, bio || null, avatar_url || null, location || null, phone || null, company || null, position || null, is_alumni || 0, id]
      );
      
      // Update user type if provided
      if (user_type) {
        await connection.execute(
          'UPDATE users SET user_type = ? WHERE id = ?',
          [user_type, userId]
        );
      }
      
      // Return updated profile with user_type
      const [updated] = await connection.execute(
        `SELECT p.*, u.user_type FROM profiles p LEFT JOIN users u ON p.user_id = u.id WHERE p.id = ?`, 
        [id]
      );
      res.json(updated[0]);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/profiles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await pool.getConnection();
    try {
      await connection.execute('DELETE FROM profiles WHERE id = ?', [id]);
      res.json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// News Routes
app.get('/api/news', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [news] = await connection.execute('SELECT * FROM news ORDER BY published_at DESC');
      res.json(news);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/news', async (req, res) => {
  try {
    const { title, content, source, source_url, image_url, is_external } = req.body;
    const connection = await pool.getConnection();
    
    try {
      const id = generateUUID();
      await connection.execute(
        `INSERT INTO news (id, title, content, source, source_url, image_url, is_external, published_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [id, title, content, source, source_url, image_url, is_external || false]
      );
      
      const [result] = await connection.execute('SELECT * FROM news WHERE id = ?', [id]);
      res.status(201).json(result[0]);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/news/:id', async (req, res) => {
  try {
    const { title, content, source, source_url, image_url, is_external } = req.body;
    const connection = await pool.getConnection();
    
    try {
      await connection.execute(
        `UPDATE news SET title = ?, content = ?, source = ?, source_url = ?, image_url = ?, is_external = ?
         WHERE id = ?`,
        [title, content, source, source_url, image_url, is_external, req.params.id]
      );
      
      const [result] = await connection.execute('SELECT * FROM news WHERE id = ?', [req.params.id]);
      res.json(result[0]);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/news/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      await connection.execute('DELETE FROM news WHERE id = ?', [req.params.id]);
      res.json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ error: error.message });
  }
});

// Jobs Routes
app.get('/api/jobs', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [jobs] = await connection.execute('SELECT * FROM jobs WHERE is_active = true ORDER BY created_at DESC');
      res.json(jobs);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/jobs', async (req, res) => {
  try {
    const { title, company, location, type, salary_range, description, requirements } = req.body;
    const connection = await pool.getConnection();
    
    try {
      const id = generateUUID();
      await connection.execute(
        `INSERT INTO jobs (id, title, company, location, type, salary_range, description, requirements, created_at, updated_at, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), true)`,
        [id, title, company, location, type, salary_range, description, requirements]
      );
      
      const [result] = await connection.execute('SELECT * FROM jobs WHERE id = ?', [id]);
      res.status(201).json(result[0]);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/jobs/:id', async (req, res) => {
  try {
    const { title, company, location, type, salary_range, description, requirements } = req.body;
    const connection = await pool.getConnection();
    
    try {
      await connection.execute(
        `UPDATE jobs SET title = ?, company = ?, location = ?, type = ?, salary_range = ?, description = ?, requirements = ?, updated_at = NOW()
         WHERE id = ?`,
        [title, company, location, type, salary_range, description, requirements, req.params.id]
      );
      
      const [result] = await connection.execute('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
      res.json(result[0]);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/jobs/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      await connection.execute('DELETE FROM jobs WHERE id = ?', [req.params.id]);
      res.json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: error.message });
  }
});

// Merchandise Routes
app.get('/api/merchandise', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [items] = await connection.execute('SELECT * FROM merchandise WHERE is_active = true');
      res.json(items);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching merchandise:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/merchandise', async (req, res) => {
  try {
    const { name, description, price, image_url, category, is_digital, stock } = req.body;
    const connection = await pool.getConnection();
    
    try {
      const id = generateUUID();
      await connection.execute(
        `INSERT INTO merchandise (id, name, description, price, image_url, category, is_digital, stock, is_active, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, true, NOW())`,
        [id, name, description, price, image_url, category, is_digital || false, stock || 0]
      );
      
      const [result] = await connection.execute('SELECT * FROM merchandise WHERE id = ?', [id]);
      res.status(201).json(result[0]);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating merchandise:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/merchandise/:id', async (req, res) => {
  try {
    const { name, description, price, image_url, category, is_digital, stock, is_active } = req.body;
    const connection = await pool.getConnection();
    
    try {
      await connection.execute(
        `UPDATE merchandise SET name = ?, description = ?, price = ?, image_url = ?, category = ?, is_digital = ?, stock = ?, is_active = ?
         WHERE id = ?`,
        [name, description, price, image_url, category, is_digital, stock, is_active, req.params.id]
      );
      
      const [result] = await connection.execute('SELECT * FROM merchandise WHERE id = ?', [req.params.id]);
      res.json(result[0]);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating merchandise:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/merchandise/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      await connection.execute('DELETE FROM merchandise WHERE id = ?', [req.params.id]);
      res.json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error deleting merchandise:', error);
    res.status(500).json({ error: error.message });
  }
});

// Achievements Routes
app.get('/api/achievements', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [achievements] = await connection.execute('SELECT * FROM achievements ORDER BY date DESC');
      res.json(achievements);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/achievements', async (req, res) => {
  try {
    const { title, description, date, image_url } = req.body;
    const connection = await pool.getConnection();
    
    try {
      const id = generateUUID();
      await connection.execute(
        `INSERT INTO achievements (id, title, description, date, image_url, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [id, title, description, date, image_url]
      );
      
      const [result] = await connection.execute('SELECT * FROM achievements WHERE id = ?', [id]);
      res.status(201).json(result[0]);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating achievement:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/achievements/:id', async (req, res) => {
  try {
    const { title, description, date, image_url } = req.body;
    const connection = await pool.getConnection();
    
    try {
      await connection.execute(
        `UPDATE achievements SET title = ?, description = ?, date = ?, image_url = ? WHERE id = ?`,
        [title, description, date, image_url, req.params.id]
      );
      
      const [result] = await connection.execute('SELECT * FROM achievements WHERE id = ?', [req.params.id]);
      res.json(result[0]);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating achievement:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/achievements/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      await connection.execute('DELETE FROM achievements WHERE id = ?', [req.params.id]);
      res.json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error deleting achievement:', error);
    res.status(500).json({ error: error.message });
  }
});

// Order Routes
app.post('/api/orders', async (req, res) => {
  try {
    const { fullName, email, phone, address, items, total, status } = req.body;
    
    const connection = await pool.getConnection();
    try {
      const orderId = generateUUID();
      
      // Create order
      await connection.execute(
        `INSERT INTO orders (id, full_name, email, phone, address, total, status, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [orderId, fullName, email, phone, address, total, status || 'pending']
      );
      
      // Create order items
      for (const item of items) {
        await connection.execute(
          `INSERT INTO order_items (id, order_id, merchandise_id, quantity, price, created_at) 
           VALUES (?, ?, ?, ?, ?, NOW())`,
          [generateUUID(), orderId, item.id, item.quantity, item.price]
        );
      }
      
      const [orders] = await connection.execute('SELECT * FROM orders WHERE id = ?', [orderId]);
      res.json(orders[0]);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [orders] = await connection.execute('SELECT * FROM orders ORDER BY created_at DESC');
      res.json(orders);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await pool.getConnection();
    try {
      const [orders] = await connection.execute('SELECT * FROM orders WHERE id = ?', [id]);
      
      if (orders.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      const [items] = await connection.execute(
        'SELECT * FROM order_items WHERE order_id = ?',
        [id]
      );
      
      res.json({ ...orders[0], items });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const connection = await pool.getConnection();
    try {
      await connection.execute(
        'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
        [status, id]
      );
      
      const [updated] = await connection.execute('SELECT * FROM orders WHERE id = ?', [id]);
      res.json(updated[0]);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`Database: ${process.env.DB_NAME || 'alumni_connect'}`);
});
