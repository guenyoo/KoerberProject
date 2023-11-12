import { pool } from '../database';
import { type Response } from '../server';
import { RowDataPacket } from 'mysql2';
import { IncomingMessage } from 'http';
import { ResultSetHeader } from 'mysql2/promise';

const updateDevice = (req: IncomingMessage, res: Response) => {
  let data = '';

  // Collect data from the request
  req.on('data', (chunk) => {
    data += chunk;
  });

  // Process data when the request is finished
  req.on('end', () => {
    try {
      const newData = JSON.parse(data);

      // Get a connection from the pool
      pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error getting connection:', err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          return;
        }

        // Log the SQL query and parameters
        const columns = Object.keys(newData);
        const setClause = columns.map((column) => `${column} = ?`).join(', ');
        const updateQuery = `UPDATE devices SET ${setClause} WHERE id = ?`;

        // Values for the SET clause and WHERE clause
        const values = [...columns.map((column) => newData[column]), newData.id];

        connection.query(updateQuery, values, (error, results: ResultSetHeader | RowDataPacket[]) => {
          connection.release();

          if (error) {
            console.error('Error deleting data:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
          }

          // Send the response only after the database operation is complete
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'ok', data: { ...newData, results } }));
        });
      });
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Bad Request');
    }
  });
};

export { updateDevice };
