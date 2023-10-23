import * as http from 'http';

const PORT = 3000;
console.log('something 2');
const server = http.createServer((_, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello, TS HTTP Server\n');
})

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});