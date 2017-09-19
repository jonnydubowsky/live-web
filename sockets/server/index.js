/*
=================
SERVER

Socket Server usign express and socket.io

Live Web @ NYU ITP 2017
Cristóbal Valenzuela
cv965@nyu.edu
=================
*/

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const apiai = require('apiai');
const path = require('path');
const keys = require('./../keys/index');
let agent = apiai(keys.apiai);
const PORT = 8080;

app.use(express.static(__dirname + '/public/'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  console.log('New client with id=', socket.id);

  socket.on('chatmessage', (data) => {
    getResponse(socket, data)
  });

  socket.on('disconnect', () => {
    console.log("Client has disconnected " + socket.id);
  });
});

let getResponse = (socket, data) => {
  let request = agent.textRequest(data, {
    sessionId: '123'
  });

  request.on('response', (response) => {
    socket.emit('chatmessage', response.result.fulfillment.speech);
  });

  request.on('error', (error) => {
    socket.emit('chatmessage', error);
  });

  request.end();
}

server.listen(PORT);
console.log('Server started on port', PORT)