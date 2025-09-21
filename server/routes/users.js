const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', authorizeRoles('admin', 'manager'), userController.getAllUsers);

router.post('/', authorizeRoles('admin'), userController.createUser);

router.put('/:id', authorizeRoles('admin'), userController.updateUser);

router.delete('/:id', authorizeRoles('admin'), userController.deleteUser);

module.exports = router;
