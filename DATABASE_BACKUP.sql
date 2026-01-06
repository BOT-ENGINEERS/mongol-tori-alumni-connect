-- MySQL Database Dump for Alumni Connect
-- Database: alumni_connect
-- Generated: 2024-01-06
-- 
-- Instructions:
-- 1. Open phpMyAdmin at http://localhost/phpmyadmin
-- 2. Click "Import" tab
-- 3. Select this file
-- 4. Click "Go"
-- OR
-- Run: mysql -u root < supabase/mysql_schema.sql

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS alumni_connect;
USE alumni_connect;

-- ============================================================
-- TABLE: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  user_type ENUM('student', 'alumni') NOT NULL DEFAULT 'student',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: profiles
-- ============================================================
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
  INDEX idx_email (email),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: user_roles
-- ============================================================
CREATE TABLE IF NOT EXISTS user_roles (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  role ENUM('admin', 'moderator', 'user') NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_role (user_id, role),
  INDEX idx_user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: jobs
-- ============================================================
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
  INDEX idx_created_at (created_at),
  INDEX idx_is_active (is_active),
  INDEX idx_posted_by (posted_by),
  FOREIGN KEY (posted_by) REFERENCES profiles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: news
-- ============================================================
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
  INDEX idx_published_at (published_at),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: achievements
-- ============================================================
CREATE TABLE IF NOT EXISTS achievements (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT,
  date DATE,
  image_url VARCHAR(500),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_date (date),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: merchandise
-- ============================================================
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
  INDEX idx_is_active (is_active),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: orders
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  shipping_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: order_items
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  merchandise_id VARCHAR(36),
  quantity INT DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_order_id (order_id),
  INDEX idx_merchandise_id (merchandise_id),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (merchandise_id) REFERENCES merchandise(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SAMPLE DATA (Optional)
-- ============================================================

-- Sample merchandise
INSERT INTO merchandise (id, name, description, price, category, stock, is_active) VALUES
('prod-001', 'Alumni T-Shirt', 'High quality cotton t-shirt with Mongol-Tori logo', 25.00, 'clothing', 50, true),
('prod-002', 'Alumni Cap', 'Adjustable baseball cap with embroidered logo', 15.00, 'accessories', 30, true),
('prod-003', 'Alumni Mug', 'Ceramic mug perfect for coffee or tea', 12.00, 'accessories', 20, true)
ON DUPLICATE KEY UPDATE stock = stock;

-- Sample achievements
INSERT INTO achievements (id, title, description, date) VALUES
('ach-001', 'Founded', 'Mongol-Tori Alumni Network established', '2020-01-01'),
('ach-002', 'First 100 Members', 'Reached 100 members milestone', '2021-06-15'),
('ach-003', 'Annual Conference', 'First annual alumni conference held', '2022-03-20')
ON DUPLICATE KEY UPDATE id = id;

-- Sample news
INSERT INTO news (id, title, content, source, published_at) VALUES
('news-001', 'Welcome to Alumni Connect', 'Join our community to stay connected with fellow alumni', 'Admin', NOW()),
('news-002', 'Job Opportunities Available', 'Check out the latest job postings from alumni companies', 'Admin', NOW())
ON DUPLICATE KEY UPDATE id = id;

-- ============================================================
-- COMMIT CHANGES
-- ============================================================
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- ============================================================
-- SETUP COMPLETE
-- ============================================================
-- Database 'alumni_connect' has been created with all required tables
-- All tables include proper indexes and foreign key constraints
-- Sample data has been inserted (merchandise, achievements, news)
-- 
-- Next Steps:
-- 1. Create test users via the signup form in the app
-- 2. Add more sample data as needed
-- 3. Test all features
--
-- Connection Details:
-- Host: localhost
-- Port: 3306
-- User: root
-- Password: (empty)
-- Database: alumni_connect
