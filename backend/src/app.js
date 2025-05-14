const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const radiologistRoutes = require('./routes/radiologists');
const consultationRoutes = require('./routes/consultations');
const adminRoutes = require('./routes/admin');

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/radiologists', radiologistRoutes);
app.use('/consultations', consultationRoutes);
app.use('/admin', adminRoutes);

app.use(require('./middlewares/errorHandler'));

module.exports = app;
