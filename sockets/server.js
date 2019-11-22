const net = require('net');
const port = 8124;
let i = 0,
id = 0;

const server = net.createServer((client) => {
  id = Date.now() + i++;
  console.log(`Client ${id} connected`);

  client.setEncoding('utf8');

  client.on('data', (data) => {
    console.log(data);
    if(data === 'QA') {
      client.write('ACK');
    } else {
      client.write('DEC');
    }
  });

  client.on('end', () => console.log('Client disconnected'));
});

server.listen(port, () => {
  console.log(`Server listening on localhost:${port}`);
});