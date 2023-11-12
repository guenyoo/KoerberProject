import { pool } from '../database';
import { IncomingMessage } from 'http';
import { type Response } from '../server';
import { RowDataPacket } from 'mysql2';
import { ResultSetHeader } from 'mysql2/promise';

const addDevice = (req: IncomingMessage, res: Response) => {
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

        // Perform the insert operation
        connection.query('INSERT INTO devices SET ?', newData, (error, results: ResultSetHeader | RowDataPacket[]) => {
          // Release the connection back to the pool
          connection.release();

          if (error) {
            console.error('Error inserting data:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
          }
          const hasInsertId = 'insertId' in results;

          // Send the response only after the database operation is complete
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'ok', data: { ...newData, id: hasInsertId && results.insertId } }));
        });
      });
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Bad Request');
    }
  });
};

export { addDevice };
