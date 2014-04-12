window.onload = function() {
	connection.onmessage = function() {
		var li = document.createElement('li');
		li.innerHTML = JSON.parse(event.data);
		document.querySelector('#messages').appendChild(li);
		return this;
	};
};