const Customer = require('../models/Customer');
const Address = require('../models/Address');

// Get all customers with pagination
const getAllCustomers = async (req, res) => {
  try {
    const filters = {
      city: req.query.city,
      state: req.query.state,
      pin_code: req.query.pin_code
    };
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const pagination = { page, limit };
    
    // Get customers and total count
    const [customers, totalCount] = await Promise.all([
      Customer.getAllCustomers(filters, pagination),
      Customer.getCustomerCount(filters)
    ]);
    
    const totalPages = Math.ceil(totalCount / limit);
    
    res.json({
      customers,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get customer by ID
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.getCustomerById(id);
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new customer
const createCustomer = async (req, res) => {
  try {
    const { first_name, last_name, phone_number, city, state, pin_code } = req.body;

    // Validation
    if (!first_name || !last_name || !phone_number || !city || !state || !pin_code) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (phone_number.length < 10) {
      return res.status(400).json({ error: 'Phone number must be at least 10 digits' });
    }

    const newCustomer = await Customer.createCustomer({
      first_name,
      last_name,
      phone_number,
      city,
      state,
      pin_code
    });

    res.status(201).json({ id: newCustomer.id, message: 'Customer created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update customer
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone_number } = req.body;

    // Validation
    if (!first_name || !last_name || !phone_number) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (phone_number.length < 10) {
      return res.status(400).json({ error: 'Phone number must be at least 10 digits' });
    }

    const result = await Customer.updateCustomer(id, {
      first_name,
      last_name,
      phone_number
    });

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ message: 'Customer updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete customer
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Customer.deleteCustomer(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
};

