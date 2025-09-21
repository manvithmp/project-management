const express = require('express');
const projectController = require('../controllers/projectController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', projectController.getAllProjects);

router.post('/', authorizeRoles('admin', 'manager'), projectController.createProject);

router.get('/:id', projectController.getProjectById);

router.put('/:id', authorizeRoles('admin', 'manager'), projectController.updateProject);

router.delete('/:id', authorizeRoles('admin'), projectController.deleteProject);

router.get('/stats/overview', projectController.getProjectStats);

module.exports = router;
