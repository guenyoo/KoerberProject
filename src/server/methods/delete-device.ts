import { IncomingMessage } from 'http';
import { pool } from '../database';
import { RowDataPacket } from 'mysql2';
import { ResultSetHeader } from 'mysql2/promise';
import { type Response } from '../server';

const deleteDevice = (req: IncomingMessage, res: Response) => {
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
        const sql = 'DELETE FROM devices WHERE id = ?';

        connection.query(sql, [newData.id], (error, results: ResultSetHeader | RowDataPacket[]) => {
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

export { deleteDevice };
