const db = require('../config/db');

// Get all customers with optional filters
const getAllCustomers = (filters = {}) => {
  return new Promise((resolve, reject) => {
    const { city, state, pin_code } = filters;
    let query = 'SELECT * FROM customers';
    const params = [];

    if (city || state || pin_code) {
      const conditions = [];
      if (city) {
        conditions.push('city LIKE ?');
        params.push(`%${city}%`);
      }
      if (state) {
        conditions.push('state LIKE ?');
        params.push(`%${state}%`);
      }
      if (pin_code) {
        conditions.push('pin_code LIKE ?');
        params.push(`%${pin_code}%`);
      }
      query += ' WHERE ' + conditions.join(' AND ');
    }

    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Get customer by ID
const getCustomerById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM customers WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Create new customer
const createCustomer = (customerData) => {
  return new Promise((resolve, reject) => {
    const { first_name, last_name, phone_number, city, state, pin_code } = customerData;
    
    db.run(
      'INSERT INTO customers (first_name, last_name, phone_number, city, state, pin_code) VALUES (?, ?, ?, ?, ?, ?)',
      [first_name, last_name, phone_number, city, state, pin_code],
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...customerData });
      }
    );
  });
};

// Update customer
const updateCustomer = (id, customerData) => {
  return new Promise((resolve, reject) => {
    const { first_name, last_name, phone_number } = customerData;
    
    db.run(
      'UPDATE customers SET first_name = ?, last_name = ?, phone_number = ? WHERE id = ?',
      [first_name, last_name, phone_number, id],
      function(err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
};

// Delete customer
const deleteCustomer = (id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM customers WHERE id = ?', [id], function(err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
};

