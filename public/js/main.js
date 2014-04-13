
var MurmuringDepths = (function() {
	var canvas;
	var stage;
	var assets;
		var	IMG_DISKET			= './assets/images/icon0.png',
				IMG_DOCUMENT		= './assets/images/icon1.png',
				IMG_FOLDER			= './assets/images/icon2.png',
				IMG_PRINTER			= './assets/images/icon3.png',
				IMG_NOTEPAD			= './assets/images/icon4.png',
				IMG_CALCULATOR	= './assets/images/icon5.png';
		var ASSETS = [IMG_DISKET, IMG_DOCUMENT, IMG_FOLDER, IMG_PRINTER, IMG_NOTEPAD, IMG_CALCULATOR];

	var icons = [];

	return {
		initConnection: function() {
			// Let connection know who is this
			connection.that = this;

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
					console.log('Recieved list: ' + list);
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

				// Deal with icons
				if(data.icon) {
					var icon = data.icon;
					console.log('Recieved icon: ' + icon);
					if(icon instanceof Array) {
						for(var i = 0; i < icon.length; i++) {
							this.that.addIcon(icon[i]);
						}
					} else {
						this.that.addIcon(icon);
					}
				}

				return this;
			};
			console.log('Connection initialized');
			return this;
		},

		initCanvas: function() {
			console.log('Initializing canvas');

			// Set size of canvas
			canvas = document.getElementById('testCanvas');
			canvas.width = 3000;
			canvas.height = 3000;
			console.log('.. canvas initialized');

			// Scroll to center of the canvas
			setTimeout(function() {
				window.scrollTo((canvas.width-window.innerWidth)*0.5,
												(canvas.height-window.innerHeight)*0.5);
			}, 200);

			// Create stage and attach event listeners
			stage = new createjs.Stage(canvas);
			createjs.Touch.enable(stage);
			stage.addEventListener('stagemousedown',	this.mouseDown);
			stage.addEventListener('stagemousemove',	this.mouseMove);
			stage.addEventListener('stagemouseup',		this.mouseUp);
			console.log('.. stage created');

			// Load assets
			assets = new AssetFactory();
			assets.onComplete = this.assetsLoaded();
			assets.loadAssets(ASSETS);

			// Set Ticker
			createjs.Ticker.setFPS(1);
			createjs.Ticker.addEventListener('tick', this.onTick);

			return this;
		},

		assetsLoaded: function() {
			console.log('.. assets loaded');
		},

		onTick: function() {
			stage.update();
		},

		mouseDown: function(evt) {
			var x = evt.stageX;
			var y = evt.stageY;
			connection.send({
				icon: {
					type:	Math.floor(Math.random()*ASSETS.length),
					x:		x,
					y:		y
				}
			});
			// console.log('_ ' + evt.stageX + '@' + evt.stageY);
		},

		mouseMove: function(evt) {
		},

		mouseUp: function(evt) {
			// console.log('^ ' + evt.stageX + '@' + evt.stageY);
		},

		addIcon: function(icon) {
			icons.push(new createjs.Bitmap(assets[ASSETS[icon.type]]).clone());
			var i = icons.length-1;
			icons[i].regX = icons[i].image.width  *0.5;
			icons[i].regY = icons[i].image.height *0.5;
			icons[i].x = icon.x;
			icons[i].y = icon.y;
			stage.addChild(icons[i]);
			return this;
		}
	};
}());

window.onload = function() {
	MurmuringDepths.initConnection().initCanvas();
};