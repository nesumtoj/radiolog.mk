const prisma = require('../models/prisma');

exports.addRating = async (req, res) => {
  const { rating, comment, radiologistId } = req.body;
  try {
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId: req.user.id,
        radiologistId
      }
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add rating' });
  }
};

exports.getRatings = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { radiologistId: req.params.radiologistId },
      include: { user: true }
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
};
