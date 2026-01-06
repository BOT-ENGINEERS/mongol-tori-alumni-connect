-- MySQL Schema for Alumni Connect
-- This file should be run in phpMyAdmin or MySQL command line

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS alumni_connect;
USE alumni_connect;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  photo_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  facebook_url VARCHAR(500),
  instagram_url VARCHAR(500),
  current_education VARCHAR(255),
  past_education VARCHAR(255),
  is_alumni BOOLEAN DEFAULT false,
  is_advisor BOOLEAN DEFAULT false,
  company VARCHAR(255),
  position VARCHAR(255),
  semester VARCHAR(50),
  team_role VARCHAR(255),
  bio TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_email (email)
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  role ENUM('admin', 'moderator', 'user') NOT NULL,
  UNIQUE KEY unique_user_role (user_id, role),
  FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  type VARCHAR(50),
  salary_range VARCHAR(100),
  description LONGTEXT,
  requirements LONGTEXT,
  posted_by VARCHAR(36),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  FOREIGN KEY (posted_by) REFERENCES profiles(id) ON DELETE SET NULL,
  INDEX idx_created_at (created_at),
  INDEX idx_is_active (is_active)
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT,
  date DATE,
  image_url VARCHAR(500),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_date (date)
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT,
  source VARCHAR(255),
  source_url VARCHAR(500),
  image_url VARCHAR(500),
  is_external BOOLEAN DEFAULT false,
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_published_at (published_at)
);

-- Create merchandise table
CREATE TABLE IF NOT EXISTS merchandise (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description LONGTEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(100),
  is_digital BOOLEAN DEFAULT false,
  stock INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_is_active (is_active)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  shipping_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  merchandise_id VARCHAR(36),
  quantity INT DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (merchandise_id) REFERENCES merchandise(id) ON DELETE SET NULL,
  INDEX idx_order_id (order_id)
);

-- Create a simple users table (for basic auth without Supabase)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  user_type ENUM('student', 'alumni') NOT NULL DEFAULT 'student',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);
