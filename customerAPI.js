const express = require('express');
const router = express.Router();
const db = require('./db');

// ========== CUSTOMER ROUTES ==========

// Get all customers
router.get('/customers', (req, res) => {
  const { city, state, pin_code } = req.query;
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
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single customer by ID
router.get('/customers/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM customers WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json(row);
  });
});

// Create new customer
router.post('/customers', (req, res) => {
  const { first_name, last_name, phone_number, city, state, pin_code } = req.body;

  if (!first_name || !last_name || !phone_number || !city || !state || !pin_code) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (phone_number.length < 10) {
    return res.status(400).json({ error: 'Phone number must be at least 10 digits' });
  }

  db.run(
    'INSERT INTO customers (first_name, last_name, phone_number, city, state, pin_code) VALUES (?, ?, ?, ?, ?, ?)',
    [first_name, last_name, phone_number, city, state, pin_code],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Customer created successfully' });
    }
  );
});

// Update customer
router.put('/customers/:id', (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, phone_number } = req.body;

  if (!first_name || !last_name || !phone_number) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (phone_number.length < 10) {
    return res.status(400).json({ error: 'Phone number must be at least 10 digits' });
  }

  db.run(
    'UPDATE customers SET first_name = ?, last_name = ?, phone_number = ? WHERE id = ?',
    [first_name, last_name, phone_number, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }
      res.json({ message: 'Customer updated successfully' });
    }
  );
});

// Delete customer
router.delete('/customers/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM customers WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json({ message: 'Customer deleted successfully' });
  });
});

// ========== ADDRESS ROUTES ==========

// Get all addresses for a customer
router.get('/customers/:id/addresses', (req, res) => {
  const { id } = req.params;
  db.all('SELECT * FROM addresses WHERE customer_id = ?', [id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add address to customer
router.post('/customers/:id/addresses', (req, res) => {
  const { id } = req.params;
  const { address_line, city, state, pin_code } = req.body;

  if (!address_line || !city || !state || !pin_code) {
    return res.status(400).json({ error: 'All address fields are required' });
  }

  // Check if customer exists
  db.get('SELECT id FROM customers WHERE id = ?', [id], (err, customer) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    db.run(
      'INSERT INTO addresses (customer_id, address_line, city, state, pin_code) VALUES (?, ?, ?, ?, ?)',
      [id, address_line, city, state, pin_code],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ id: this.lastID, message: 'Address added successfully' });
      }
    );
  });
});

// Update address
router.put('/addresses/:id', (req, res) => {
  const { id } = req.params;
  const { address_line, city, state, pin_code } = req.body;

  if (!address_line || !city || !state || !pin_code) {
    return res.status(400).json({ error: 'All address fields are required' });
  }

  db.run(
    'UPDATE addresses SET address_line = ?, city = ?, state = ?, pin_code = ? WHERE id = ?',
    [address_line, city, state, pin_code, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Address not found' });
        return;
      }
      res.json({ message: 'Address updated successfully' });
    }
  );
});

// Delete address
router.delete('/addresses/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM addresses WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Address not found' });
      return;
    }
    res.json({ message: 'Address deleted successfully' });
  });
});

module.exports = router;

