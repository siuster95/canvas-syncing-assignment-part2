const http = require('http');

const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const fs = require('fs');

const draws = {};

const handler = (request, response) => {
  fs.readFile(`${__dirname}/../client/index.html`, (err, data) => {
    if (err) {
      throw err;
    }
    response.writeHead(200);
    response.end(data);
  });
};

const app = http.createServer(handler);

app.listen(port);

const io = socketio(app);


io.on('connection', (socket) => {
  socket.join('room1');
  console.log('someone connected');


  socket.on('disconnect', () => {
    socket.leave('room1');
    console.log('someone disconnected');
  });

  socket.on('draw', (data) => {
    draws[data.time] = data.draw;
    console.log('getting draw data');
    io.in('room1').emit('updatedraws', { time: data.time, draw: data.draw });
    console.log('sending draw data back');
  });
});

console.log(`Listening on localhost on port ${port}`);
