const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/dashboard', authenticate, adminController.getDashboardStats);
router.delete('/users/:id', authenticate, adminController.deleteUser);
router.delete('/radiologists/:id', authenticate, adminController.deleteRadiologist);
router.post('/radiologists', authenticate, adminController.createRadiologist);

module.exports = router;
