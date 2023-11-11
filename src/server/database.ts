import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Create a real user instead of root
  // password: '', // And give that real user a real password
  database: 'devices',
});

const endConnection = () => pool.end();

export { pool, endConnection };
