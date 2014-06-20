
var express = require("express"),
app = express(),
bodyParser = require('body-parser')
errorHandler = require('errorhandler'),
methodOverride = require('method-override'),
port = 8080;

app.get("/", function (req, res) {
  res.redirect("/index.html");
});
 
app.use(methodOverride());
app.use(bodyParser());
app.use(express.static(__dirname));
app.use(errorHandler({
  dumpExceptions: true,
  showStack: true
}));
 

var server = require('http').Server(app);
var io     = require('socket.io')(server);
var oscListener = require('./utils/oscListener.js');

var sockets = [];
var devices = [];



io.sockets.on('connection', function (socket) {

  socket
    .on('start', function(resp) {
      console.log('start' + resp.x + ', ' + resp.y);

    })
    .on('end', function(resp) {
      console.log('end' + resp.x + ', ' + resp.y);

    });

  sockets.push(socket);

});

server.listen(port);

oscListener.on('press', function(oscId, index){
 
  eachSocket(function(socket, i) {
      socket.emit('press', { oscId: oscId, index: index });
  });

});



var stdin = process.openStdin();


function eachSocket(func) {
  for (var i = 0; i < sockets.length; i++) {
    var socket = sockets[i];
    func(socket, i);
  }
}