const prisma = require('../models/prisma');
const { uploadToAzureBlob } = require('../utils/azure');

exports.createConsultation = async (req, res) => {
  const { question, radiologistId, scanBase64, fileName } = req.body;
  try {
    const scanUrl = await uploadToAzureBlob(scanBase64, fileName);
    const consultation = await prisma.consultation.create({
      data: {
        userId: req.user.id,
        radiologistId,
        question,
        scanUrl,
        status: 'PENDING'
      }
    });
    res.status(201).json(consultation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create consultation' });
  }
};

exports.getConsultations = async (req, res) => {
  try {
    const whereClause = req.user.role === 'RADIOLOGIST'
      ? { radiologistId: req.user.id }
      : { userId: req.user.id };
    const consultations = await prisma.consultation.findMany({
      where: whereClause,
      include: { user: true, radiologist: true }
    });
    res.json(consultations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch consultations' });
  }
};

exports.respondToConsultation = async (req, res) => {
  const { id } = req.params;
  const { reportText, reportBase64, reportFileName } = req.body;
  try {
    const reportUrl = await uploadToAzureBlob(reportBase64, reportFileName);
    const consultation = await prisma.consultation.update({
      where: { id },
      data: {
        reportText,
        reportFileUrl: reportUrl,
        status: 'COMPLETED'
      }
    });
    res.json(consultation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to respond to consultation' });
  }
};
