const express = require('express');
const taskController = require('../controllers/taskController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', taskController.getAllTasks);

router.post('/', authorizeRoles('admin', 'manager'), taskController.createTask);

router.put('/:id', taskController.updateTask);

router.delete('/:id', authorizeRoles('admin', 'manager'), taskController.deleteTask);

router.get('/stats/overview', taskController.getTaskStats);

module.exports = router;
