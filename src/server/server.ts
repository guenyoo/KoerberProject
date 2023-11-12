import * as http from 'http';
import { getDevices } from './methods/get-devices';
import { addDevice } from './methods/add-device';
import { updateDevice } from './methods/update-device';
import { deleteDevice } from './methods/delete-device';

const PORT = 3000;

type Response = http.ServerResponse<http.IncomingMessage> & {
  req: http.IncomingMessage;
};

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // I explicitly didn't use express because I wanted to do it without a framework for once.
  if (req.url === '/api/devices' && req.method === 'GET') {
    getDevices(res);
  } else if (req.method === 'POST' && req.url === '/api/devices/put') {
    addDevice(req, res);
  } else if (req.method === 'DELETE' && req.url === '/api/devices/delete') {
    deleteDevice(req, res);
  } else if (req.method === 'PUT' && req.url === '/api/devices/edit-device') {
    updateDevice(req, res);
  } else {
    // Handle other routes
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export { type Response };
