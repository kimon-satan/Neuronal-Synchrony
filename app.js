var express = require("express"),
    app = express(),
    bodyParser = require('body-parser')
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
    port = 4567;

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

app.listen(port);


console.log("oscReciever");

var osc = require ('osc-min');
var dgram = require ('dgram');
var outSock = dgram.createSocket('udp4');
var outport = 41234;
var inport = 66666;


var sock = dgram.createSocket("udp4", function(msg, rinfo) {
  var error;

  try {
    return console.log(osc.fromBuffer(msg));
  } catch (_error) {
    error = _error;
    return console.log("invalid OSC packet");
  }
});

sock.bind(inport);


var sendHeartbeat = function () {
  var buf;
  buf = osc.toBuffer({
    address: "/heartbeat",
    args: [
      12, "sttttring", new Buffer("beat"), {
        type: "integer",
        value: 7
      }
    ]
  });
  return outSock.send(buf, 0, buf.length, inport, "localhost");
};


setInterval(sendHeartbeat, 2000);

