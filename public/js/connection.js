var connection = (function() {
	var host = location.origin.replace(/^http/, 'ws')
	var ws = new WebSocket(host);
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