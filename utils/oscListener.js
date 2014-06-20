var osc = require('node-osc');
var events = require('events');
var mdns = require('mdns');

var options = {
  // host to bind to for messages from serialosc
  listenHost: '127.0.0.1'
};

// mdns browser
var browser = null;

// devices that have been discovered
var devices = {};

// if a service is bound to multiple interfaces it will show
// up as multiple distinct devices.  keep track of which have
// been seen.
var seenServices = {};

// TODO: keep numeric ids mapped to service names
var serviceIdMap = {};

// osc clients for ports that have been sent on
var oscClients = {};

// osc servers for ports that are being listened on
var oscServers = {};

// register serialosc event callbacks, currently supported:
//   deviceFound -> (device) : called when a device is found
//   deviceLost -> (device) : called when a device is lost
var eventsEmitter = new events.EventEmitter();
function on(event, callback) {
  eventsEmitter.on(event, callback);
};

exports.on = on;


function config(opts) {
  for (var key in opts) {
    options[key] = opts[key];
  }
}

function oscServer(port, callback) {
  console.log("listen on: " + port);
  if (oscServers[port]) {
    oscServers[port].removeAllListeners('message');
  } else {
    oscServers[port] = new osc.Server(port);
  }
  oscServers[port].on('message', function message(msg, rinfo) {
    callback(msg);
  });
}

oscServer(12345, function(msg){

  eventsEmitter.emit('press',msg[2][1], msg[2][2]);
  
});


