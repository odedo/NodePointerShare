var express = require("express");
var app = express.createServer();
var cache = require('./cache');
var communication = require('./communication');

// init socket.io module
communication.init(app);

// start listening
app.listen(81);

// serving static content - anything inside the "/public" folder
app.use("/public", express.static(__dirname + '/public'));

// loading the main application page
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});