const db = require('../config/db');

// Get total count of customers with filters (searching in addresses table)
const getCustomerCount = (filters = {}) => {
  return new Promise((resolve, reject) => {
    const { city, state, pin_code } = filters;
    let query = 'SELECT COUNT(DISTINCT c.id) as count FROM customers c';
    const params = [];

    if (city || state || pin_code) {
      query += ' INNER JOIN addresses a ON c.id = a.customer_id WHERE ';
      const conditions = [];
      if (city) {
        conditions.push('a.city LIKE ?');
        params.push(`%${city}%`);
      }
      if (state) {
        conditions.push('a.state LIKE ?');
        params.push(`%${state}%`);
      }
      if (pin_code) {
        conditions.push('a.pin_code LIKE ?');
        params.push(`%${pin_code}%`);
      }
      query += conditions.join(' AND ');
    }

    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row.count);
    });
  });
};

// Get all customers with optional filters and pagination (searching in addresses table)
// Includes first address information for display
const getAllCustomers = (filters = {}, pagination = {}) => {
  return new Promise((resolve, reject) => {
    const { city, state, pin_code } = filters;
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    
    // Build the query: Filter customers by addresses, then get their first address for display
    let query = `
      SELECT DISTINCT 
        c.id,
        c.first_name,
        c.last_name,
        c.phone_number,
        a.city,
        a.state,
        a.pin_code,
        a.address_line
      FROM customers c
      LEFT JOIN addresses a ON c.id = a.customer_id AND a.id = (
        SELECT MIN(id) FROM addresses WHERE customer_id = c.id
      )
    `;
    const params = [];

    // Apply filters: Join with addresses table to filter customers
    if (city || state || pin_code) {
      query += ' INNER JOIN addresses af ON c.id = af.customer_id WHERE ';
      const conditions = [];
      if (city) {
        conditions.push('af.city LIKE ?');
        params.push(`%${city}%`);
      }
      if (state) {
        conditions.push('af.state LIKE ?');
        params.push(`%${state}%`);
      }
      if (pin_code) {
        conditions.push('af.pin_code LIKE ?');
        params.push(`%${pin_code}%`);
      }
      query += conditions.join(' AND ');
    }

    query += ' ORDER BY c.id DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

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

// Create new customer (only personal info, addresses are stored separately)
const createCustomer = (customerData) => {
  return new Promise((resolve, reject) => {
    const { first_name, last_name, phone_number } = customerData;
    
    db.run(
      'INSERT INTO customers (first_name, last_name, phone_number) VALUES (?, ?, ?)',
      [first_name, last_name, phone_number],
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, first_name, last_name, phone_number });
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
  getCustomerCount,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
};

