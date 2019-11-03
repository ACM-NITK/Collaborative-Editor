// server.js
// where your node app starts

// init project
const express = require("express");
const app = express();

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});





var socket = require('socket.io');

//Socket setup
var io = socket(listener);

io.on('connection',function(socket){
    console.log("made socket connection");

    socket.on('chat', function(data){
        io.sockets.emit('chat', data);
    });


    socket.on('message', function(data){
        io.sockets.emit('message', data);
    });
});