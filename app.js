var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var WebSocketServer = require('ws').Server;
var http = require('http');
var port = process.env.PORT || 4444;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

// Start server
var server = app.listen(port, function() {
	console.log('Listening on port %d', server.address().port);
});

// Start websocket server
var wss = new WebSocketServer({ server: server });
console.log('Websocket server created');
wss.on('connection', function(ws) {
	ws.send(JSON.stringify({ message:'Connection opened' }), function(err) {
		console.log(err);
	});

	ws.on('message', function(msg) {
		msg = JSON.parse(msg);
		console.log('');
		console.log(msg);
	});

	wss.on('close', function() {
		console.log('Websocket connection closed');
	});
});

// // Start server with socket.io
// var server;
// var io = require('socket.io').listen(server = app.listen(4444, function() {
// 	console.log('Listening on port %d', server.address().port);
// }));

// // Deal with new connection
// io.sockets.on('connection', function (socket) {
// 	socket.emit('heyclient', { message: 'Successfully connected to the server' });
// 	socket.on('heyserver', function (data) {
// 		io.sockets.emit('heyclient', data);
// 	});
// });

module.exports = app;
