// var connection = (function() {
// 	var socket;

// 	return {
// 		// Init method
// 		init: function() {
// 			socket = io.connect('/');

// 			socket.on('heyclient', function(data) {
// 				if(data.message) {
// 					console.log(data.message);
// 				} else {
// 					console.log(data);
// 				}
// 			});
// 		},

// 		// Test messaging method
// 		testMessage: function(msg) {
// 			socket.emit('heyserver', { message: msg });
// 		}
// 	};
// })();

var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host);
ws.onmessage = function (event) {
	console.log(event.data);
	// var li = document.createElement('li');
	// li.innerHTML = JSON.parse(event.data);
	// document.querySelector('#pings').appendChild(li);
};

// var connection = (function() {
// 	var ws, host;

// 	return {
// 		init: function() {
// 			host = location.origin.replace(/^http/, 'ws');
// 			ws = new WebSocket(host);
			
// 			ws.onopen = function() {
// 				this.send(JSON.stringify({ message: 'Hello server!' }));
// 			};

// 			ws.onmessage = function(evt) {
// 				console.log(JSON.parse(evt.data));
// 			};

// 			return this;
// 		},

// 		send: function(msg, onErr) {
// 			try {
// 				ws.send(JSON.stringify(msg));
// 			} catch(e) {
// 				(onErr || function() {
// 					console.log(e);
// 				})();
// 			}
// 			return this;
// 		}
// 	};
// })();

// window.onload = function() {
// 	connection.init();
// };