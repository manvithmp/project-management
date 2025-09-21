require('dotenv').config();
const db = require('./config/database');

const createTables = async () => {
  try {
    console.log('🔄 Setting up Aiven MySQL database...');
    console.log(`📍 Connecting to: ${process.env.DB_HOST}`);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'manager', 'developer') DEFAULT 'developer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Users table created');

    await db.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        status ENUM('planning', 'active', 'completed', 'on_hold') DEFAULT 'planning',
        start_date DATE,
        end_date DATE,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_created_by (created_by),
        INDEX idx_status (status),
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Projects table created');

    await db.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        status ENUM('todo', 'in_progress', 'done') DEFAULT 'todo',
        priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
        deadline DATETIME,
        project_id INT NOT NULL,
        assigned_to INT,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_project_id (project_id),
        INDEX idx_assigned_to (assigned_to),
        INDEX idx_status (status),
        INDEX idx_deadline (deadline),
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tasks table created');

    await db.execute(`
      CREATE TABLE IF NOT EXISTS user_stories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        story TEXT NOT NULL,
        project_id INT NOT NULL,
        generated_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_project_id (project_id),
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ User Stories table created');

    await db.execute(`
      CREATE TABLE IF NOT EXISTS project_members (
        id INT PRIMARY KEY AUTO_INCREMENT,
        project_id INT NOT NULL,
        user_id INT NOT NULL,
        role ENUM('manager', 'developer', 'tester') DEFAULT 'developer',
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_project_id (project_id),
        INDEX idx_user_id (user_id),
        UNIQUE KEY unique_project_user (project_id, user_id),
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Project Members table created');

    console.log('🎉 All tables created successfully!');
    
    console.log('🔄 Inserting sample data...');
    
    const [existingUser] = await db.execute('SELECT id FROM users WHERE email = ?', ['admin@example.com']);
    
    if (existingUser.length === 0) {
      const [adminResult] = await db.execute(`
        INSERT INTO users (username, email, password, role, created_at) VALUES 
        ('admin', 'admin@example.com', '$2a$10$rXKhF8PjBMwlW.ZYvzD7DuFqJ3tKxQE9HgYvF8kCzI1nQm7f9Xr.O', 'admin', NOW())
      `);
      console.log('✅ Admin user created');

      const adminId = adminResult.insertId;

      await db.execute(`
        INSERT INTO users (username, email, password, role, created_at) VALUES 
        ('john_manager', 'john@example.com', '$2a$10$rXKhF8PjBMwlW.ZYvzD7DuFqJ3tKxQE9HgYvF8kCzI1nQm7f9Xr.O', 'manager', NOW()),
        ('sarah_dev', 'sarah@example.com', '$2a$10$rXKhF8PjBMwlW.ZYvzD7DuFqJ3tKxQE9HgYvF8kCzI1nQm7f9Xr.O', 'developer', NOW())
      `);
      console.log('✅ Sample users created');

      const [projectResult] = await db.execute(`
        INSERT INTO projects (name, description, status, start_date, end_date, created_by, created_at) VALUES 
        ('AI-Powered E-commerce Platform', 'Build a modern e-commerce platform with React, Node.js, and AI features including personalized recommendations', 'active', '2025-09-20', '2025-12-31', ?, NOW())
      `, [adminId]);
      console.log('✅ Sample project created');

      const projectId = projectResult.insertId;

      await db.execute(`
        INSERT INTO tasks (title, description, status, priority, deadline, project_id, created_by, created_at) VALUES 
        ('Setup Development Environment', 'Install and configure all necessary tools including Node.js, React, and database', 'done', 'high', '2025-09-25 17:00:00', ?, ?, NOW()),
        ('Design Database Schema', 'Create comprehensive database design for users, products, orders, and AI features', 'in_progress', 'high', '2025-09-28 17:00:00', ?, ?, NOW()),
        ('Implement User Authentication', 'Setup JWT-based authentication with role management (Admin, Customer)', 'todo', 'medium', '2025-10-05 17:00:00', ?, ?, NOW()),
        ('Build Product Catalog API', 'Create RESTful API for product management with search and filtering', 'todo', 'medium', '2025-10-10 17:00:00', ?, ?, NOW()),
        ('AI Recommendation Engine', 'Implement AI-powered product recommendations using user behavior data', 'todo', 'low', '2025-11-01 17:00:00', ?, ?, NOW())
      `, [projectId, adminId, projectId, adminId, projectId, adminId, projectId, adminId, projectId, adminId]);
      console.log('✅ Sample tasks created');

      await db.execute(`
        INSERT INTO user_stories (story, project_id, generated_by, created_at) VALUES 
        ('As a customer, I want to browse products by category, so that I can easily find what I am looking for.', ?, ?, NOW()),
        ('As a customer, I want to add products to my cart, so that I can purchase multiple items together.', ?, ?, NOW()),
        ('As a customer, I want to receive personalized product recommendations, so that I can discover new items I might like.', ?, ?, NOW()),
        ('As an admin, I want to manage product inventory, so that I can keep track of stock levels and update product information.', ?, ?, NOW())
      `, [projectId, adminId, projectId, adminId, projectId, adminId, projectId, adminId]);
      console.log('✅ Sample user stories created');

    } else {
      console.log('ℹ️ Sample data already exists, skipping...');
    }

    console.log('🎉 Aiven MySQL database setup completed successfully!');
    console.log('');
    console.log('📋 Login credentials for your application:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('🔗 Additional test accounts:');
    console.log('   Manager: john@example.com / admin123');
    console.log('   Developer: sarah@example.com / admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up Aiven database:', error.message);
    
    if (error.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log('ℹ️ Tables already exist, this is normal');
    } else {
      console.error('Full error:', error);
    }
    
    process.exit(1);
  }
};

createTables();
