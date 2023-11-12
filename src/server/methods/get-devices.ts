import { pool } from '../database';
import { type Response } from '../server';
import { RowDataPacket } from 'mysql2';

const getDevices = (res: Response) => {
  /* TODO: Implement paging so that the database doesn't fetch more than 20 entries for performance */
  pool.getConnection((error, connection) => {
    if (error) {
      console.error(error);
      res.statusCode = 500;
      res.end('Internal Server Error');
      return;
    }

    connection.query('SELECT * FROM devices', (queryError, results: RowDataPacket[]) => {
      connection.release();

      if (queryError) {
        console.error(queryError);
        res.statusCode = 500;
        res.end('Internal Server Error');
        return;
      }

      // Extract data from the query result
      const data = results.map((result) => ({ ...result }));

      // Return only the data as JSON
      res.end(JSON.stringify(data));
    });
  });
};

export { getDevices };
