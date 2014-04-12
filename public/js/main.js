
var MurmuringDepths = (function() {
	var canvas;
	var stage;
	var lastScreen

	return {
		initConnection: function() {
			// Override onmessage function
			connection.onmessage = function(event) {
				var data = JSON.parse(event.data);

				// Deal with ping
				if(data.ping) {
					connection.latency = Date.now() - data.ping;
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
			console.log('Connection initialized');
			return this;
		},

		initCanvas: function() {
			// Set size of canvas
			canvas = document.getElementById('testCanvas');
			canvas.width = 3000;
			canvas.height = 3000;

			// Scroll to center of the canvas
			setTimeout(function() {
				window.scrollTo((canvas.width-window.innerWidth)*0.5,
												(canvas.height-window.innerHeight)*0.5);
			}, 200);

			// Create stage and attach event listeners
			stage = new createjs.Stage(canvas);
			createjs.Touch.enable(stage);
			stage.addEventListener('stagemousedown',	this.mouseDown.bind(this));
			stage.addEventListener('stagemousemove',	this.mouseMove.bind(this));
			stage.addEventListener('stagemouseup',		this.mouseUp.bind(this));

			console.log('Canvas initialized');
			return this;
		},

		mouseDown: function(evt) {
			console.log('_ ' + evt.stageX + '@' + evt.stageY);
			return this;
		},

		mouseMove: function(evt) {
			return this;
		},

		mouseUp: function(evt) {
			console.log('^ ' + evt.stageX + '@' + evt.stageY);
			return this;
		}
	};
}());

window.onload = function() {
	MurmuringDepths.initConnection().initCanvas();
};