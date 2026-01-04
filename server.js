const express = require('express');
const cors = require('cors');
const router = require('./router');
require('./db'); // Initialize database

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware

app.use(cors());

app.use(express.json());

// Routes
app.use(router);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

