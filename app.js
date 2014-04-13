var WebSocketServer = require('ws').Server
	, http = require('http')
	, express = require('express')
	, app = express()
	, port = process.env.PORT || 4444;

app.use(express.static(__dirname + '/public/'));

var server = http.createServer(app);
server.listen(port);

console.log('http server listening on %d', port);

// Data variables
var listsofar = [];
var icons = [];

// Websocket Server
var wss = new WebSocketServer({server: server});
console.log('websocket server created');
wss.on('connection', function(ws) {
	console.log('websocket connection open');

	// Set timer for ping
	var ping = setInterval(function() {
		wss.broadcast({ ping: Date.now() });
	}, 1000);

	// Send data-so-far when connected
	if(listsofar.length > 0) ws.send(JSON.stringify({ list: listsofar }));
	if(icons.length > 0) ws.send(JSON.stringify({ icon: icons }));

	// Deal with new message
	ws.on('message', function(data) {
		var data = JSON.parse(data);

		// Deal with list
		if(data.list) {
			listsofar.push(data.list);
			if(listsofar.length > 10) listsofar.shift();
			wss.broadcast({ list: data.list });
		}

		// Deal with icon
		if(data.icon) {
			icons.push(data.icon);
			wss.broadcast({ icon: data.icon });
		}

		// Log out received data
		console.log('DATA FROM CLIENT');
		console.log(printoutObject(data));
	});
});

// Unfold object and make it into a string
var printoutObject = function(obj, ind, log) {
	var ind = ind || 1;
	var log = log || '';
	var indent = '';
	for(var i = 0; i < ind; i++) {
		indent += '\t';
	}
	for(var key in obj) {
		if(typeof obj[key] === 'object') {
			log += printoutObject(obj[key], ++ind, log + indent + key + ': {' + '\n');
			log += '\n' + indent + '}';
		} else {
			log += indent + key + ': ' + obj[key] + '\n';
		}
	}
	return log;
};

// Broadcasting function
wss.broadcast = function(data) {
	for(var i in this.clients) {
		this.clients[i].send(JSON.stringify(data));
	}
};