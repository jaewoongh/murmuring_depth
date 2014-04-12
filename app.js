var WebSocketServer = require('ws').Server
	, http = require('http')
	, express = require('express')
	, app = express()
	, port = process.env.PORT || 4444;

app.use(express.static(__dirname + '/public/'));

var server = http.createServer(app);
server.listen(port);

console.log('http server listening on %d', port);

var listsofar = [];

var wss = new WebSocketServer({server: server});
console.log('websocket server created');
wss.on('connection', function(ws) {
	console.log('websocket connection open');

	// Set timer for ping
	var ping = setInterval(function() {
		wss.broadcast(JSON.stringify({ ping: Date.now() }));
	}, 1000);

	// Remove timer when disconnected
	ws.on('close', function() {
		clearInterval(ping);
	});

	// Send data-so-far when connected
	if(listsofar.length > 0) ws.send(JSON.stringify({ list: listsofar }));

	// Deal with new message
	ws.on('message', function(data) {
		var data = JSON.parse(data);
		if(data.list) {
			listsofar.push(data.list);
			if(listsofar.length > 10) listsofar.shift();
			wss.broadcast({ list: data.list });
		}
	});
});

// Broadcasting function
wss.broadcast = function(data) {
	for(var i in this.clients) {
		this.clients[i].send(JSON.stringify(data));
	}
};