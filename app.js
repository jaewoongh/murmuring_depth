var WebSocketServer = require('ws').Server
	, http = require('http')
	, express = require('express')
	, app = express()
	, port = process.env.PORT || 4444;

app.use(express.static(__dirname + '/public/'));

var server = http.createServer(app);
server.listen(port);

console.log('http server listening on %d', port);

var datasofar = [];

var wss = new WebSocketServer({server: server});
console.log('websocket server created');
wss.on('connection', function(ws) {
	console.log('websocket connection open');
	if(datasofar.length > 0) ws.send(JSON.stringify(datasofar));

	ws.on('message', function(data) {
		datasofar.push(JSON.parse(data));
		if(datasofar.length > 10) datasofar.shift();
		wss.broadcast(data);
	});
});

wss.broadcast = function(data) {
	for(var i in this.clients) {
		this.clients[i].send(data);
	}
};