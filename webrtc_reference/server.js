//requires
const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const port = process.env.PORT || 3000;

// express routing
app.use(express.static('public'));


// signaling
io.on('connection', function (socket) {
    console.log('A user has opened the page.');

    socket.on('create or join', function (room) {
        console.log('Creating or joining Room', room);
        
        var myRoom = io.sockets.adapter.rooms[room] || { length: 0 };
        var numClients = myRoom.length;

        console.log('Room',room,'has ', numClients, ' clients');

        if (numClients == 0) {
            socket.join(room);
            socket.emit('created', room);
        } else if (numClients == 1) {
            socket.join(room);
            socket.emit('joined', room);
        } else {
            socket.emit('full', room);
        }
    });

    socket.on('ready', function (room){
        socket.broadcast.to(room).emit('ready');
    });

    socket.on('candidate', function (event){
        socket.broadcast.to(event.room).emit('candidate', event);
    });

    socket.on('offer', function(event){
        socket.broadcast.to(event.room).emit('offer',event.sdp);
    });

    socket.on('answer', function(event){
        socket.broadcast.to(event.room).emit('answer',event.sdp);
    });

    socket.on('send_message', function(event){
        console.log("Received a message from test user", event.message);
        socket.broadcast.to(event.room).emit('receive_message', event.message);
    });

});

// listener
http.listen(port || 3000, function () {
    console.log('listening on', port);
});