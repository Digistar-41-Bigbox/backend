// db.js
const { Pool } = require('pg');

// Set up the database connection using Pool
const pool = new Pool({
  user: 'postgres.gffxncxyqlitbxcyjtvn',      // Replace with your PostgreSQL user
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',      // Replace with your PostgreSQL host
  database: 'postgres',    // Replace with your PostgreSQL database name
  password: 'eUmtEAxoJ6q5OB62',  // Replace with your PostgreSQL password
  port: 6543,             // Replace with your PostgreSQL port, default is 5432
});

// Export the pool for querying
module.exports = pool;
