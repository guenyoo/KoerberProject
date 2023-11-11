import * as http from 'http';
import { pool } from './database';
import { RowDataPacket } from 'mysql2';

const PORT = 3000;

const getDevices = (
  res: http.ServerResponse<http.IncomingMessage> & {
    req: http.IncomingMessage;
  },
) => {
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

const server = http.createServer(async (req, res) => {
  if (req.url === '/api/devices' && req.method === 'GET') {
    getDevices(res);
  } else {
    // Handle other routes
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }

  // res.end('Hello, Docker TS HTTP Server\n');
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
