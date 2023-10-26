import * as http from 'http';

const PORT = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, Docker TS HTTP Server\n');
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
