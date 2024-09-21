// db.js
const { Pool } = require('pg');

// Set up the database connection using Pool
const pool = new Pool({
  user: process.env.USER,      // Replace with your PostgreSQL user
  host: process.env.HOST,      // Replace with your PostgreSQL host
  database: process.env.DATABASE,    // Replace with your PostgreSQL database name
  password: process.env.PASSWORD,  // Replace with your PostgreSQL password
  port: process.env.PORT_DB,             // Replace with your PostgreSQL port, default is 5432
});

// Export the pool for querying
module.exports = pool;
