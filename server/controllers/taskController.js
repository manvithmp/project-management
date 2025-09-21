const db = require('../config/database');

class TaskController {
  async getAllTasks(req, res) {
    try {
      const { project_id, status, assigned_to } = req.query;
      
      let query = `
        SELECT t.*, 
               p.name as project_name,
               u1.username as assigned_to_name,
               u2.username as created_by_name
        FROM tasks t
        LEFT JOIN projects p ON t.project_id = p.id
        LEFT JOIN users u1 ON t.assigned_to = u1.id
        LEFT JOIN users u2 ON t.created_by = u2.id
        WHERE 1=1
      `;
      
      const params = [];
      
      if (project_id) {
        query += ' AND t.project_id = ?';
        params.push(project_id);
      }
      
      if (status) {
        query += ' AND t.status = ?';
        params.push(status);
      }
      
      if (assigned_to) {
        query += ' AND t.assigned_to = ?';
        params.push(assigned_to);
      }
      
      query += ' ORDER BY t.created_at DESC';

      const [rows] = await db.execute(query, params);

      res.json({ tasks: rows });
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({ message: 'Failed to fetch tasks' });
    }
  }

  async createTask(req, res) {
    try {
      const { title, description, project_id, assigned_to, priority, deadline, status } = req.body;

      const [result] = await db.execute(
        'INSERT INTO tasks (title, description, project_id, assigned_to, priority, deadline, status, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
        [title, description, project_id, assigned_to, priority, deadline, status || 'todo', req.user.id]
      );

      res.status(201).json({
        message: 'Task created successfully',
        taskId: result.insertId
      });

    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ message: 'Failed to create task' });
    }
  }

  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const { title, description, status, priority, deadline, assigned_to } = req.body;

      await db.execute(
        'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, deadline = ?, assigned_to = ?, updated_at = NOW() WHERE id = ?',
        [title, description, status, priority, deadline, assigned_to, id]
      );

      res.json({ message: 'Task updated successfully' });

    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({ message: 'Failed to update task' });
    }
  }

  async deleteTask(req, res) {
    try {
      const { id } = req.params;

      await db.execute('DELETE FROM tasks WHERE id = ?', [id]);

      res.json({ message: 'Task deleted successfully' });

    } catch (error) {
      console.error('Delete task error:', error);
      res.status(500).json({ message: 'Failed to delete task' });
    }
  }

  async getTaskStats(req, res) {
    try {
      const [statsRows] = await db.execute(`
        SELECT 
          status,
          COUNT(*) as count
        FROM tasks
        GROUP BY status
      `);

      const [overdueRows] = await db.execute(`
        SELECT COUNT(*) as overdue_count
        FROM tasks
        WHERE deadline < NOW() AND status != 'done'
      `);

      res.json({
        statusStats: statsRows,
        overdueTasks: overdueRows[0].overdue_count
      });

    } catch (error) {
      console.error('Get task stats error:', error);
      res.status(500).json({ message: 'Failed to fetch task statistics' });
    }
  }
}

module.exports = new TaskController();
