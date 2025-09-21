const db = require('../config/database');

class ProjectController {
  async getAllProjects(req, res) {
    try {
      const [rows] = await db.execute(`
        SELECT p.*, u.username as created_by_name,
               COUNT(DISTINCT t.id) as task_count,
               COUNT(DISTINCT pm.user_id) as member_count
        FROM projects p
        LEFT JOIN users u ON p.created_by = u.id
        LEFT JOIN tasks t ON p.id = t.project_id
        LEFT JOIN project_members pm ON p.id = pm.project_id
        GROUP BY p.id
        ORDER BY p.created_at DESC
      `);

      res.json({ projects: rows });
    } catch (error) {
      console.error('Get projects error:', error);
      res.status(500).json({ message: 'Failed to fetch projects' });
    }
  }

  async createProject(req, res) {
    try {
      const { name, description, start_date, end_date, team_members } = req.body;

      const [result] = await db.execute(
        'INSERT INTO projects (name, description, start_date, end_date, created_by, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [name, description, start_date, end_date, req.user.id]
      );

      const projectId = result.insertId;

      if (team_members && team_members.length > 0) {
        const memberPromises = team_members.map(memberId => {
          return db.execute(
            'INSERT INTO project_members (project_id, user_id, role, joined_at) VALUES (?, ?, ?, NOW())',
            [projectId, memberId, 'Developer']
          );
        });
        await Promise.all(memberPromises);
      }

      res.status(201).json({
        message: 'Project created successfully',
        projectId
      });

    } catch (error) {
      console.error('Create project error:', error);
      res.status(500).json({ message: 'Failed to create project' });
    }
  }

  async getProjectById(req, res) {
    try {
      const { id } = req.params;

      const [projectRows] = await db.execute(`
        SELECT p.*, u.username as created_by_name
        FROM projects p
        LEFT JOIN users u ON p.created_by = u.id
        WHERE p.id = ?
      `, [id]);

      if (projectRows.length === 0) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const [memberRows] = await db.execute(`
        SELECT pm.*, u.username, u.email, u.role as user_role
        FROM project_members pm
        JOIN users u ON pm.user_id = u.id
        WHERE pm.project_id = ?
      `, [id]);

      const [taskRows] = await db.execute(`
        SELECT t.*, u.username as assigned_to_name
        FROM tasks t
        LEFT JOIN users u ON t.assigned_to = u.id
        WHERE t.project_id = ?
        ORDER BY t.created_at DESC
      `, [id]);

      res.json({
        project: projectRows[0],
        members: memberRows,
        tasks: taskRows
      });

    } catch (error) {
      console.error('Get project error:', error);
      res.status(500).json({ message: 'Failed to fetch project' });
    }
  }

  async updateProject(req, res) {
    try {
      const { id } = req.params;
      const { name, description, status, start_date, end_date } = req.body;

      await db.execute(
        'UPDATE projects SET name = ?, description = ?, status = ?, start_date = ?, end_date = ?, updated_at = NOW() WHERE id = ?',
        [name, description, status, start_date, end_date, id]
      );

      res.json({ message: 'Project updated successfully' });

    } catch (error) {
      console.error('Update project error:', error);
      res.status(500).json({ message: 'Failed to update project' });
    }
  }

  async deleteProject(req, res) {
    try {
      const { id } = req.params;

      await db.execute('DELETE FROM user_stories WHERE project_id = ?', [id]);
      await db.execute('DELETE FROM tasks WHERE project_id = ?', [id]);
      await db.execute('DELETE FROM project_members WHERE project_id = ?', [id]);
      await db.execute('DELETE FROM projects WHERE id = ?', [id]);

      res.json({ message: 'Project deleted successfully' });

    } catch (error) {
      console.error('Delete project error:', error);
      res.status(500).json({ message: 'Failed to delete project' });
    }
  }

  async getProjectStats(req, res) {
    try {
      const [statsRows] = await db.execute(`
        SELECT 
          COUNT(DISTINCT p.id) as total_projects,
          COUNT(DISTINCT CASE WHEN p.status = 'active' THEN p.id END) as active_projects,
          COUNT(DISTINCT t.id) as total_tasks,
          COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.id END) as completed_tasks,
          COUNT(DISTINCT CASE WHEN t.deadline < NOW() AND t.status != 'done' THEN t.id END) as overdue_tasks
        FROM projects p
        LEFT JOIN tasks t ON p.id = t.project_id
      `);

      res.json({ stats: statsRows[0] });

    } catch (error) {
      console.error('Get project stats error:', error);
      res.status(500).json({ message: 'Failed to fetch project statistics' });
    }
  }
}

module.exports = new ProjectController();
