'use strict';

GameState.Game = function(game){

	this.fullscreen = false;

	var self = this;
};

GameState.Game.prototype = {
	init: function() {
		this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
	},
	preload: function() {
	},
	create: function() {
		this.setupKeyboardControls();
		this.game.stage.backgroundColor = "#7a449c";
		this.game.add.sprite(0,0, 'bg');
		this.timestamp = this.game.time.time;
		
		//this.brick = new Brick(this.game, 100, 100, 'A', this);
		
		var x_offset = 100;
		this.bricks = [];
		
		
		var self = this;
		
		var brickCounter = 0;
		var brickCounter = 0;

		var drawRow = function(x, y, offset){
			if(offset) {
				
				self.game.add.sprite( x, y, 'bricks', 'halfbrick_m');
				
				for(var i = 0; i < 2; i++){
					var b = new Brick(self.game, 210 * i + x + 110, y, '' + brickCounter, self);
					brickCounter++;
					self.bricks.push(b);
				};
				
				self.game.add.sprite( 210 * 2 + x + 110, y, 'bricks', 'halfbrick_m');
				
			} else {
				for(var i = 0; i < 3; i++){
					var b = new Brick(self.game, 215 * i + x, y, '' + brickCounter, self);
					brickCounter++;
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

		for(var i = 0; i < this.bricks.length; i++ ) {
			// console.log(this.bricks[i]);
			if(this.bricks[i]) {
				this.bricks[i].update();
			}
		}
		
		 var delta = this.game.time.elapsedSecondsSince(this.timestamp);

            if( delta >= 4.5) {
				  var r = this.game.rnd.integerInRange(0,this.bricks.length - 1);
				  if(this.bricks[r].isInactive()){ this.bricks[r].makeActive(); }
				  this.timestamp = this.game.time.time;
			}
		var count = 0;
		for(var i = 0; i < this.bricks.length; i++ ) {
			if(this.bricks[i].isDone()){
				count++;
			}
		}
		if(count > 8){ console.log('game over');}
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

		//var a_key = this.input.keyboard.addKey(Phaser.KeyCode.A);
		//a_key.onDown.add(this.AbrickSlapped, this);

		var one = this.input.keyboard.addKey(Phaser.KeyCode.NUMPAD_5);
		one.onDown.add(this.keyPress, this);
		var two = this.input.keyboard.addKey(Phaser.KeyCode.NUMPAD_4);
		two.onDown.add(this.keyPress, this);
		var three = this.input.keyboard.addKey(Phaser.KeyCode.NUMPAD_6);
		three.onDown.add(this.keyPress, this);
		var four = this.input.keyboard.addKey(Phaser.KeyCode.NUMPAD_7);
		four.onDown.add(this.keyPress, this);
		var five = this.input.keyboard.addKey(Phaser.KeyCode.NUMPAD_8);
		five.onDown.add(this.keyPress, this);
		var six = this.input.keyboard.addKey(Phaser.KeyCode.NUMPAD_9);
		six.onDown.add(this.keyPress, this);
		var seven = this.input.keyboard.addKey(Phaser.KeyCode.NUMPAD_1);
		seven.onDown.add(this.keyPress, this);
		var eight = this.input.keyboard.addKey(Phaser.KeyCode.NUMPAD_2);
		eight.onDown.add(this.keyPress, this);
		var nine = this.input.keyboard.addKey(Phaser.KeyCode.NUMPAD_3);
		nine.onDown.add(this.keyPress, this);
		var ten = this.input.keyboard.addKey(Phaser.KeyCode.NUMPAD_0);
		ten.onDown.add(this.keyPress, this);
	},
	keyPress: function(keyEvent) {
		// console.log(keyEvent.event.key);

		for(var i = 0; i < this.bricks.length; i++) {
			this.bricks[i].thump(keyEvent.event.key);
		}

	}
};
