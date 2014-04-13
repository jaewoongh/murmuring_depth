var connection = (function() {
	var host = location.origin.replace(/^http/, 'ws')
	var ws = new WebSocket(host);
	var latency;
	var that;

	console.log('Connected to the server');

	ws.onmessage = function(event) {
		connection.onmessage(event);
	};

	return {
		onmessage: function(evt) {
			console.log(evt.data);
			return this;
		},

		send: function(msg) {
			ws.send(JSON.stringify(msg));
			return this;
		}
	};
})();