const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.render('index.ejs');
});

io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        console.log(username + ' joined');
        io.emit('is_online', '🔵 <b style="color: green; font: 15px">' + socket.username + ' JOINED THE CHAT</b>');
    });

    socket.on('disconnect', function(username) {
        console.log(username +' left');
        io.emit('is_online', '🔴 <b style="color:#FF0000">' + socket.username + ' LEFT THE CHAT</b>');
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

    socket.on('typing', function(username) {
        socket.broadcast.emit('typing', socket.username);
    });

    socket.on('stoptyping', function() {
        io.emit('stoptyping');
    });


});

const server = http.listen(8080, function() {
    console.log('listening on *:8080');
});
