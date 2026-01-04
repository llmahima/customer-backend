const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database path
const dbDir = path.join(__dirname, '..', 'database');
const dbPath = path.join(dbDir, 'customer.db');

// Ensure database directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Check if database file already exists
const dbExists = fs.existsSync(dbPath);

// Initialize database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    if (dbExists) {
      console.log('Connected to existing SQLite database (preserving existing data)');
    } else {
      console.log('Creating new SQLite database');
    }
    
    // Always ensure tables exist (CREATE TABLE IF NOT EXISTS is safe for existing databases)
    // This won't overwrite existing data, but ensures tables exist if database is empty
    db.run(`CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone_number TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS addresses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      address_line TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      pin_code TEXT NOT NULL,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    )`);
  }
});

module.exports = db;

