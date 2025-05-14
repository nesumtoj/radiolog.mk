const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/', authenticate, consultationController.createConsultation);
router.get('/', authenticate, consultationController.getConsultations);
router.post('/:id/respond', authenticate, consultationController.respondToConsultation);

module.exports = router;
