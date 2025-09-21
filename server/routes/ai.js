const express = require('express');
const aiController = require('../controllers/aiController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.post('/generate-user-stories', 
  authorizeRoles('admin', 'manager'), 
  aiController.generateUserStories
);

router.get('/user-stories/:projectId', aiController.getProjectUserStories);

module.exports = router;
