var initConnection = function() {
	// Override onmessage function
	connection.onmessage = function(event) {
		var data = JSON.parse(event.data);

		// Deal with ping
		if(data.ping) {
			connection.ping = Date.now() - data.ping;
		}

		// Deal with list
		if(data.list) {
			var list = data.list;
			if(list instanceof Array) {
				for(var i = 0; i < list.length; i++) {
					var li = document.createElement('li');
					li.innerHTML = list[i];
					document.querySelector('#messages').appendChild(li);
				}
			} else {
				var li = document.createElement('li');
				li.innerHTML = list;
				document.querySelector('#messages').appendChild(li);
			}
		}

		return connection;
	};
};

window.onload = function() {
	initConnection();
};