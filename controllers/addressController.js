const Address = require('../models/Address');
const Customer = require('../models/Customer');

// Get all addresses for a customer
const getAddressesByCustomerId = async (req, res) => {
  try {
    const { id } = req.params;
    const addresses = await Address.getAddressesByCustomerId(id);
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new address for a customer
const createAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { address_line, city, state, pin_code } = req.body;

    // Validation
    if (!address_line || !city || !state || !pin_code) {
      return res.status(400).json({ error: 'All address fields are required' });
    }

    // Check if customer exists
    const customer = await Customer.getCustomerById(id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const newAddress = await Address.createAddress(id, {
      address_line,
      city,
      state,
      pin_code
    });

    res.status(201).json({ id: newAddress.id, message: 'Address added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update address
const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { address_line, city, state, pin_code } = req.body;

    // Validation
    if (!address_line || !city || !state || !pin_code) {
      return res.status(400).json({ error: 'All address fields are required' });
    }

    const result = await Address.updateAddress(id, {
      address_line,
      city,
      state,
      pin_code
    });

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json({ message: 'Address updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete address
const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Address.deleteAddress(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAddressesByCustomerId,
  createAddress,
  updateAddress,
  deleteAddress
};

