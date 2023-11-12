import * as http from 'http';
import { pool } from './database';
import { RowDataPacket } from 'mysql2';

const PORT = 3000;

type Response = http.ServerResponse<http.IncomingMessage> & {
  req: http.IncomingMessage;
};

const getDevices = (res: Response) => {
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

const putIntoDB = (req: http.IncomingMessage, res: Response) => {
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
        connection.query('INSERT INTO devices SET ?', newData, (error, results) => {
          // Release the connection back to the pool
          connection.release();

          if (error) {
            console.error('Error inserting data:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
          }

          console.log('Data inserted successfully:', results);

          // Send the response only after the database operation is complete
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'ok', data: newData }));
        });
      });
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Bad Request');
    }
  });
};

const server = http.createServer(async (req, res) => {
  console.log(req.headers.host);
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/api/devices' && req.method === 'GET') {
    console.log('getDevices');
    getDevices(res);
  } else if (req.method === 'POST' && req.url === '/api/devices/put') {
    putIntoDB(req, res);
  } else {
    // Handle other routes
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
