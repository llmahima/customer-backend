const express = require('express');
const router = express.Router();
const customerRoutes = require('./customerRoutes');
const addressRoutes = require('./addressRoutes');

// API routes
router.use('/api/customers', customerRoutes);
router.use('/api', addressRoutes);

module.exports = router;

