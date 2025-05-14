const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/', authenticate, ratingController.addRating);
router.get('/:radiologistId', ratingController.getRatings);

module.exports = router;
