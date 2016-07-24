'use strict';

GameState.Game = function(game){

	this.fullscreen = false;

	var self = this;

	this.currentState = GameState.Game.STATES.PLAYING;
};

GameState.Game.STATES = {
	'PLAYING': 0,
	'GAMEOVER': 1
};

GameState.Game.prototype = {
	init: function() {
		this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
	},
	preload: function() {
	},
	create: function() {
		this.setupKeyboardControls();
		// this.game.stage.backgroundColor = "#7a449c";
		this.game.add.sprite(0, 0, 'bg');
		this.timestamp = this.game.time.time;
				
		// introducing Mr Trump
		this.trump = new Trump(this.game, 720, 400, this);

		this.mask = this.game.add.sprite( 0, 768 - 69, 'groundmask');

		var x_offset = 100;
		this.bricks = [];
				
		var self = this;
		
		var brickCounter = 0;

		var keymapping = {
			0: 'w',
			1: 'a',
			2: 's',
			3: 'd',
			4: 'f',
			5: 'g',
			6: 'ArrowDown',
			7: 'ArrowUp',
			8: 'ArrowLeft',
			9: 'ArrowRight'
		};

		var drawRow = function(x, y, offset){
			if(offset) {
				
				self.game.add.sprite( x, y, 'bricks', 'halfbrick_m');
				
				for(var i = 0; i < 2; i++){
					var b = new Brick(self.game, 210 * i + x + 110, y, '' + brickCounter, keymapping[brickCounter], self);					
					brickCounter++;
					self.bricks.push(b);
				};
				
				self.game.add.sprite( 210 * 2 + x + 110, y, 'bricks', 'halfbrick_m');
				
			} else {
				for(var i = 0; i < 3; i++){
					var b = new Brick(self.game, 215 * i + x, y, '' + brickCounter, keymapping[brickCounter], self);
					brickCounter++;
					self.bricks.push(b);
				};
			}
		};
		
		var y_offset = 586;
		var toggle = false;
		// draw the wall
		for(var r = 0; r < 4; r++){
			drawRow(420, y_offset, toggle);
			y_offset -= 100;
			toggle = !toggle;
		}

		this.bomb = new Bomb(this.game, 720, 660, this);

		// game over sign
		this.sign = this.game.add.sprite(this.game.world.centerX, -200, 'gameover');
		this.sign.anchor.setTo(0.5, 0.5);
		this.sign.visible = false;

		// retry text
		this.text = this.game.add.sprite(this.game.world.centerX, 570, 'text');
		this.text.anchor.setTo(0.5, 0.5);
		this.text.visible = false;

		this.gameoversfx = [];
		this.gameoversfx.push(this.game.add.audio('fired', 1, false));
		this.gameoversfx.push(this.game.add.audio('finished', 1, false));



	},
	update: function() {
		if(this.game.input.activePointer.isDown) {
			console.log(this.game.input.activePointer.x + this.game.camera.x, this.game.input.activePointer.y);
		}

		if(!this.isGameOver()) {
			// not dead, so update the bricks
			for(var i = 0; i < this.bricks.length; i++ ) {
				if(this.bricks[i]) {
					this.bricks[i].update();
				}
			}

			/*var delta = this.game.time.elapsedSecondsSince(this.timestamp);

				if( delta >= 4.5) {
					var r = this.game.rnd.integerInRange(0,this.bricks.length - 1);
					if(this.bricks[r].isInactive()){ this.bricks[r].makeActive(); }
					this.timestamp = this.game.time.time;
				}*/
			
			var count = 0;
			for(var i = 0; i < this.bricks.length; i++ ) {
				if(this.bricks[i].isDone()){
					count++;
				}
			}
			if(count > 8){ 
				this.doGameOver();
			}

			this.trump.update();
			this.bomb.update();
		}
	},
	doGameOver: function() {
		this.currentState = GameState.Game.STATES.GAMEOVER;
		this.showGameOverSign();
	},
	isGameOver: function() {
		return this.currentState === GameState.Game.STATES.GAMEOVER;
	},
	showGameOverSign: function() {
		this.sign.visible = true;
		var tween = this.game.add.tween(this.sign).to( { y: this.game.world.centerY }, 600, Phaser.Easing.Linear.None, true );
		tween.onComplete.addOnce(this.showText, this);

		// play a 'you're fired' sfx
		this.firedSFX();
	},
	firedSFX: function() {
        var r = this.game.rnd.integerInRange(0,1);
		this.gameoversfx[r].play('', 0, 1.0, false);
    },
	showText: function() {
		// show text under game over sign
		this.text.visible = true;
	},
	// reset state, score, etc
	resetGame: function() {
		this.currentState = GameState.Game.STATES.PLAYING;
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

		var f_key = this.input.keyboard.addKey(Phaser.KeyCode.P);
		f_key.onDown.add(this.toggleFullscreen, this);

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

		var sp = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR); // ' '
		sp.onDown.add(this.keyPress, this);

		var up = this.input.keyboard.addKey(Phaser.KeyCode.UP); // ArrowUp
		up.onDown.add(this.keyPress, this);

		var down = this.input.keyboard.addKey(Phaser.KeyCode.DOWN); // ArrowDown
		down.onDown.add(this.keyPress, this);

		var left = this.input.keyboard.addKey(Phaser.KeyCode.LEFT); // ArrowLeft
		left.onDown.add(this.keyPress, this);

		var right = this.input.keyboard.addKey(Phaser.KeyCode.RIGHT); // ArrowRight
		right.onDown.add(this.keyPress, this);
		
		var a = this.input.keyboard.addKey(Phaser.KeyCode.A);
		a.onDown.add(this.keyPress, this);

		var s = this.input.keyboard.addKey(Phaser.KeyCode.S);
		s.onDown.add(this.keyPress, this);

		var w = this.input.keyboard.addKey(Phaser.KeyCode.W);
		w.onDown.add(this.keyPress, this);

		var d = this.input.keyboard.addKey(Phaser.KeyCode.D);
		d.onDown.add(this.keyPress, this);

		var f = this.input.keyboard.addKey(Phaser.KeyCode.F);
		f.onDown.add(this.keyPress, this);

		var g = this.input.keyboard.addKey(Phaser.KeyCode.G);
		g.onDown.add(this.keyPress, this);
	},
	keyPress: function(keyEvent) {

		// console.log(keyEvent.event.key);

		// if gameover and user presses 0
		if(keyEvent.event.key === '0' && this.isGameOver()) {
			this.resetGame();
			// start a new state
			this.state.start('Game', true, false);
		}

		if(keyEvent.event.key === ' ') {
			this.bomb.thump();
			return;
		}

		// pass keypress to all the bricks
		for(var i = 0; i < this.bricks.length; i++) {
			this.bricks[i].thump(keyEvent.event.key);
		}


	}
};
