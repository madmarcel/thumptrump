'use strict';

GameState.Game = function(game){

	this.fullscreen = false;

	var self = this;
};

GameState.Game.prototype = {
	init: function() {
	},
	preload: function() {
	},
	create: function() {
		this.setupKeyboardControls();
		this.game.stage.backgroundColor = "#7a449c";
		this.game.add.sprite(0,0, 'bg');
		
		//this.brick = new Brick(this.game, 100, 100, 'A', this);
		
		var x_offset = 100;
		this.bricks = [];
		
		
		var self = this;
		
		var drawRow = function(x, y, offset){
			if(offset) {
				
				self.game.add.sprite( x, y, 'bricks', 'halfbrick_m');
				
				for(var i = 0; i < 2; i++){
					var b = new Brick(self.game, 210 * i + x + 110, y, 'A', self);
					self.bricks.push(b);
				};
				
				self.game.add.sprite( 210 * 2 + x + 110, y, 'bricks', 'halfbrick_m');
				
			} else {
				for(var i = 0; i < 3; i++){
					var b = new Brick(self.game, 215 * i + x, y, 'A', self);
					self.bricks.push(b);
				};
			}
		};
		
		var y_offset = 586;
		var toggle = false;
		for(var r = 0; r < 4; r++){
			drawRow(420, y_offset, toggle);
			y_offset -= 100;
			toggle = !toggle;
		}
		
		
		},
	update: function() {
		if(this.game.input.activePointer.isDown) {
			console.log(this.game.input.activePointer.x + this.game.camera.x, this.game.input.activePointer.y);
		}
	},
	// full screen
	toggleFullscreen: function() {
		this.fullscreen = !this.fullscreen;

		if (this.fullscreen) {
			this.scale.startFullScreen();
		} else {
			this.scale.stopFullScreen();
		}
	},
	// controls
	setupKeyboardControls: function() {

		var f_key = this.input.keyboard.addKey(Phaser.KeyCode.F);
		f_key.onDown.add(this.toggleFullscreen, this);

		var a_key = this.input.keyboard.addKey(Phaser.KeyCode.A);
		a_key.onDown.add(this.AbrickSlapped, this);
	},
	AbrickSlapped: function() {
		console.log('clicked');
	}
};
