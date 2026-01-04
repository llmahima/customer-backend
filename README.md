# Customer Management System - Backend API

A RESTful API backend for managing customers and their addresses, built with Node.js, Express.js, and SQLite.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite
- **Architecture**: MVC (Model-View-Controller) pattern

## Folder Structure

```
customer-backend/
├── config/
│   └── db.js                    # Database connection and initialization
├── controllers/
│   ├── customerController.js    # Customer business logic and validation
│   └── addressController.js     # Address business logic and validation
├── models/
│   ├── Customer.js              # Customer data access layer
│   └── Address.js               # Address data access layer
├── routes/
│   ├── customerRoutes.js        # Customer route definitions
│   ├── addressRoutes.js         # Address route definitions
│   └── index.js                 # Main router combining all routes
├── database/
│   └── customer.db              # SQLite database file (auto-generated)
├── server.js                    # Application entry point
└── package.json                 # Dependencies and scripts
```

## How to Run

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation Steps

1. **Navigate to the backend directory**
   ```bash
   cd customer-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Server will start on**
   - Default port: `5001`
   - Base URL: `http://localhost:5001`
   - API Base: `http://localhost:5001/api`

### Environment Variables

You can set a custom port using environment variable:
```bash
PORT=3000 npm start
```

### Database

- SQLite database is automatically created in the `database/` folder
- Tables are automatically created on first server start
- No additional database setup required

## API Documentation

### Base URL
```
http://localhost:5001/api
```

---

## Customer APIs

### 1. Get All Customers

**Endpoint:** `GET /api/customers`

**Query Parameters (Optional):**
- `city` (string): Filter by city (partial match)
- `state` (string): Filter by state (partial match)
- `pin_code` (string): Filter by pin code (partial match)
- `page` (integer): Page number (default: 1)
- `limit` (integer): Items per page (default: 10)

**Response:**
```json
{
  "customers": [
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "phone_number": "1234567890",
      "city": "New York",
      "state": "NY",
      "pin_code": "10001"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCount": 50,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**Status Codes:**
- `200 OK`: Success

---

### 2. Get Customer by ID

**Endpoint:** `GET /api/customers/:id`

**URL Parameters:**
- `id` (integer): Customer ID

**Response:**
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "1234567890",
  "city": "New York",
  "state": "NY",
  "pin_code": "10001"
}
```

**Status Codes:**
- `200 OK`: Customer found
- `404 Not Found`: Customer not found

---

### 3. Create Customer

**Endpoint:** `POST /api/customers`

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "1234567890",
  "city": "New York",
  "state": "NY",
  "pin_code": "10001"
}
```

**Validations:**
- `first_name` (required, string): Customer's first name
- `last_name` (required, string): Customer's last name
- `phone_number` (required, string): Must be at least 10 digits
- `city` (required, string): Customer's city
- `state` (required, string): Customer's state
- `pin_code` (required, string): Customer's pin code

**Response:**
```json
{
  "id": 1,
  "message": "Customer created successfully"
}
```

**Status Codes:**
- `201 Created`: Customer created successfully
- `400 Bad Request`: Validation error (missing fields or invalid phone number)

---

### 4. Update Customer

**Endpoint:** `PUT /api/customers/:id`

**URL Parameters:**
- `id` (integer): Customer ID

**Request Body:**
```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "phone_number": "9876543210"
}
```

**Validations:**
- `first_name` (required, string): Customer's first name
- `last_name` (required, string): Customer's last name
- `phone_number` (required, string): Must be at least 10 digits

**Note:** Only `first_name`, `last_name`, and `phone_number` can be updated. City, state, and pin code cannot be updated via this endpoint.

**Response:**
```json
{
  "message": "Customer updated successfully"
}
```

**Status Codes:**
- `200 OK`: Customer updated successfully
- `400 Bad Request`: Validation error
- `404 Not Found`: Customer not found

---

### 5. Delete Customer

**Endpoint:** `DELETE /api/customers/:id`

**URL Parameters:**
- `id` (integer): Customer ID

**Response:**
```json
{
  "message": "Customer deleted successfully"
}
```

**Status Codes:**
- `200 OK`: Customer deleted successfully
- `404 Not Found`: Customer not found

**Note:** Deleting a customer will also delete all associated addresses (CASCADE delete).

---

## Address APIs

### 1. Get All Addresses for a Customer

**Endpoint:** `GET /api/customers/:id/addresses`

**URL Parameters:**
- `id` (integer): Customer ID

**Response:**
```json
[
  {
    "id": 1,
    "customer_id": 1,
    "address_line": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "pin_code": "10001"
  }
]
```

**Status Codes:**
- `200 OK`: Success

---

### 2. Add Address to Customer

**Endpoint:** `POST /api/customers/:id/addresses`

**URL Parameters:**
- `id` (integer): Customer ID

**Request Body:**
```json
{
  "address_line": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "pin_code": "10001"
}
```

**Validations:**
- `address_line` (required, string): Street address
- `city` (required, string): City name
- `state` (required, string): State name
- `pin_code` (required, string): Pin/ZIP code

**Response:**
```json
{
  "id": 1,
  "message": "Address added successfully"
}
```

**Status Codes:**
- `201 Created`: Address added successfully
- `400 Bad Request`: Validation error (missing fields)
- `404 Not Found`: Customer not found

---

### 3. Update Address

**Endpoint:** `PUT /api/addresses/:id`

**URL Parameters:**
- `id` (integer): Address ID

**Request Body:**
```json
{
  "address_line": "456 Oak Avenue",
  "city": "Los Angeles",
  "state": "CA",
  "pin_code": "90001"
}
```

**Validations:**
- `address_line` (required, string): Street address
- `city` (required, string): City name
- `state` (required, string): State name
- `pin_code` (required, string): Pin/ZIP code

**Response:**
```json
{
  "message": "Address updated successfully"
}
```

**Status Codes:**
- `200 OK`: Address updated successfully
- `400 Bad Request`: Validation error
- `404 Not Found`: Address not found

---

### 4. Delete Address

**Endpoint:** `DELETE /api/addresses/:id`

**URL Parameters:**
- `id` (integer): Address ID

**Response:**
```json
{
  "message": "Address deleted successfully"
}
```

**Status Codes:**
- `200 OK`: Address deleted successfully
- `404 Not Found`: Address not found

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

### Common Error Status Codes

- `400 Bad Request`: Invalid request data or validation failed
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Project Architecture

### MVC Pattern

- **Models** (`models/`): Handle database operations and data access simillar to repositories.
- **Controllers** (`controllers/`): Handle business logic, validation, and request/response
- **Routes** (`routes/`): Define API endpoints and map them to controllers

### Data Flow

1. Request comes to `routes/`
2. Route calls appropriate `controller/`
3. Controller validates and calls `model/`
4. Model performs database operation
5. Response flows back through controller → route → client

## Notes

- All timestamps and IDs are automatically managed by SQLite
- Foreign key constraints ensure data integrity
- CASCADE delete ensures addresses are deleted when customer is deleted
- Phone number validation requires minimum 10 digits
- All text fields are case-sensitive in filters

