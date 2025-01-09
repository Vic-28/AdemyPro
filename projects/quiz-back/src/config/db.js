const { Pool } = require('pg');
require('dotenv').config(); 


const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
  ssl: {
    rejectUnauthorized: false, 
  },
});

pool.on('connect', () => {
  console.log('Conexión exitosa a la base de datos');
});

module.exports = pool;
