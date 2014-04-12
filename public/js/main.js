window.onload = function() {
	connection.onmessage = function(event) {
		var data = JSON.parse(event.data);
		if(data instanceof Array) {
			for(var i = 0; i < data.length; i++) {
				var li = document.createElement('li');
				li.innerHTML = data[i];
				document.querySelector('#messages').appendChild(li);
			}
		} else {
			var li = document.createElement('li');
			li.innerHTML = data;
			document.querySelector('#messages').appendChild(li);
		}
		return this;
	};
};