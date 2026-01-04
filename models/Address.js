const db = require('../config/db');

// Get all addresses for a customer
const getAddressesByCustomerId = (customerId) => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM addresses WHERE customer_id = ?', [customerId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Get address by ID
const getAddressById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM addresses WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Create new address
const createAddress = (customerId, addressData) => {
  return new Promise((resolve, reject) => {
    const { address_line, city, state, pin_code } = addressData;
    
    db.run(
      'INSERT INTO addresses (customer_id, address_line, city, state, pin_code) VALUES (?, ?, ?, ?, ?)',
      [customerId, address_line, city, state, pin_code],
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, customer_id: customerId, ...addressData });
      }
    );
  });
};

// Update address
const updateAddress = (id, addressData) => {
  return new Promise((resolve, reject) => {
    const { address_line, city, state, pin_code } = addressData;
    
    db.run(
      'UPDATE addresses SET address_line = ?, city = ?, state = ?, pin_code = ? WHERE id = ?',
      [address_line, city, state, pin_code, id],
      function(err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
};

// Delete address
const deleteAddress = (id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM addresses WHERE id = ?', [id], function(err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
};

module.exports = {
  getAddressesByCustomerId,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress
};

