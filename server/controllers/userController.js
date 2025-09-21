const db = require('../config/database');
const bcrypt = require('bcryptjs');

class UserController {
  async getAllUsers(req, res) {
    try {
      const [rows] = await db.execute(`
        SELECT id, username, email, role, created_at 
        FROM users 
        ORDER BY created_at DESC
      `);

      res.json({ users: rows });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  }

  async createUser(req, res) {
    try {
      const { username, email, password, role } = req.body;

      const [existingUsers] = await db.execute(
        'SELECT id FROM users WHERE email = ? OR username = ?',
        [email, username]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await db.execute(
        'INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())',
        [username, email, hashedPassword, role]
      );

      res.status(201).json({
        message: 'User created successfully',
        userId: result.insertId
      });

    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ message: 'Failed to create user' });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { username, email, role } = req.body;

      await db.execute(
        'UPDATE users SET username = ?, email = ?, role = ?, updated_at = NOW() WHERE id = ?',
        [username, email, role, id]
      );

      res.json({ message: 'User updated successfully' });

    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ message: 'Failed to update user' });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      if (parseInt(id) === req.user.id) {
        return res.status(400).json({ message: 'Cannot delete your own account' });
      }

      await db.execute('DELETE FROM users WHERE id = ?', [id]);

      res.json({ message: 'User deleted successfully' });

    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ message: 'Failed to delete user' });
    }
  }
}

module.exports = new UserController();
