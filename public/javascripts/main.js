var connection = (function() {
	var socket;

	return {
		// Init method
		init: function() {
			socket = io.connect('/');

			socket.on('heyclient', function(data) {
				if(data.message) {
					console.log(data.message);
				} else {
					console.log(data);
				}
			});
		},

		// Test messaging method
		testMessage: function(msg) {
			socket.emit('heyserver', { message: msg });
		}
	};
})();

window.onload = function() {
	connection.init();
};