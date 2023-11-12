import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'db', // should be localhost locally
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'devices',
});

const connectionString = `http://${process.env.HOST_IP}:3000`;

const endConnection = () => pool.end();

export { pool, endConnection, connectionString };
