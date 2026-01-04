const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

// Address routes
router.get('/customers/:id/addresses', addressController.getAddressesByCustomerId);
router.post('/customers/:id/addresses', addressController.createAddress);
router.put('/addresses/:id', addressController.updateAddress);
router.delete('/addresses/:id', addressController.deleteAddress);

module.exports = router;

