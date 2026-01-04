const express = require('express');
const customerAPI = require('./customerAPI');

const router = express.Router();

// Use customer API routes
router.use('/api', customerAPI);

module.exports = router;

