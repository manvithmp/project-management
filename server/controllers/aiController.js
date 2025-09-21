const groqService = require('../services/groqService');
const db = require('../config/database');

class AIController {
  async generateUserStories(req, res) {
    try {
      const { projectDescription, projectId } = req.body;

      if (!projectDescription) {
        return res.status(400).json({ 
          message: 'Project description is required' 
        });
      }

      const userStories = await groqService.generateUserStories(projectDescription);

      if (projectId) {
        const insertPromises = userStories.map(story => {
          return db.execute(
            'INSERT INTO user_stories (story, project_id, generated_by, created_at) VALUES (?, ?, ?, NOW())',
            [story, projectId, req.user.id]
          );
        });
        
        await Promise.all(insertPromises);
      }

      res.json({
        message: 'User stories generated successfully',
        userStories,
        count: userStories.length
      });

    } catch (error) {
      console.error('Generate user stories error:', error);
      res.status(500).json({ 
        message: 'Failed to generate user stories',
        error: error.message 
      });
    }
  }

  async getProjectUserStories(req, res) {
    try {
      const { projectId } = req.params;

      const [rows] = await db.execute(`
        SELECT us.*, u.username as generated_by_name 
        FROM user_stories us
        LEFT JOIN users u ON us.generated_by = u.id
        WHERE us.project_id = ?
        ORDER BY us.created_at DESC
      `, [projectId]);

      res.json({
        userStories: rows,
        count: rows.length
      });

    } catch (error) {
      console.error('Get user stories error:', error);
      res.status(500).json({ 
        message: 'Failed to fetch user stories' 
      });
    }
  }
}

module.exports = new AIController();
