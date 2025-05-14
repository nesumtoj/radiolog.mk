const prisma = require('../models/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utils/email');

exports.register = async (req, res) => {
  const { email, password, name, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      email,
      password: hashedPassword,
      name,
      role,
      verified: false,
    };

    const entity = role === 'RADIOLOGIST' ? await prisma.radiologist.create({ data: userData })
                                          : await prisma.user.create({ data: userData });

    const token = jwt.sign({ id: entity.id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    await sendVerificationEmail(email, token);

    res.status(201).json({ message: 'Registered successfully. Please verify your email.' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } }) ||
                 await prisma.radiologist.findUnique({ where: { email } });

    if (!user || !user.verified) return res.status(401).json({ error: 'Invalid or unverified account' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, role } = decoded;

    if (role === 'RADIOLOGIST') {
      await prisma.radiologist.update({ where: { id }, data: { verified: true } });
    } else {
      await prisma.user.update({ where: { id }, data: { verified: true } });
    }

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
};
