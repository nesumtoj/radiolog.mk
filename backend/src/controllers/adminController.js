const prisma = require('../models/prisma');
const bcrypt = require('bcrypt');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalConsultations = await prisma.consultation.count();
    const monthlyConsultations = await prisma.consultation.groupBy({
      by: ['createdAt'],
      _count: true,
    });

    const totalRevenue = await prisma.consultation.count({ where: { status: 'COMPLETED' } }); // Simplified
    res.json({ totalConsultations, monthlyConsultations, totalRevenue });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

exports.deleteRadiologist = async (req, res) => {
  try {
    await prisma.radiologist.delete({ where: { id: req.params.id } });
    res.json({ message: 'Radiologist deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete radiologist' });
  }
};

exports.createRadiologist = async (req, res) => {
  const { email, password, name, bio, pricing } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const radiologist = await prisma.radiologist.create({
      data: {
        email,
        password: hashedPassword,
        name,
        bio,
        pricing,
        verified: true
      }
    });
    res.status(201).json(radiologist);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create radiologist' });
  }
};
