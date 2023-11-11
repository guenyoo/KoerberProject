import mysql from 'mysql';

const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  // password: '',
  database: 'devices',
});

mysqlConnection.connect();

mysqlConnection.query('SELECT 1 + 1 AS solution', (err, rows /* , fields */) => {
  if (err) throw err;

  console.log('The solution is: ', rows[0].solution);
});

mysqlConnection.end();

export { mysqlConnection };
