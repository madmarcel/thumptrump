'use strict';

GameState.Game = function(game){

	this.fullscreen = false;

	var self = this;

	this.currentState = GameState.Game.STATES.PLAYING;

	this.config = {};

	this.score = 0;
};

GameState.Game.STATES = {
	'PLAYING': 0,
	'GAMEOVER': 1
};

GameState.Game.prototype = {
	init: function( config ) {
		this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

		this.config = config;
	},
	preload: function() {
	},
	create: function() {
		
		this.game.add.sprite(0, 0, 'bg');
		this.timestamp = this.game.time.time;
				
		// introducing Mr Trump
		this.trump = new Trump(this.game, 720, 400, this, this.config.profanity);

		this.mask = this.game.add.sprite( 0, 768 - 69, 'groundmask');

		var x_offset = 100;
		this.bricks = [];
				
		var self = this;
		
		var brickCounter = 0;

		var inputMethod = this.config.controlMethod;		

		this.keymapping = {
			'makeymakey': {
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
			},
			'keyboard': {
				0: 'c',
				1: 'v',
				2: 'b',
				3: 'f',
				4: 'g',
				5: 'r',
				6: 't',
				7: 'y',
				8: '5',
				9: '6'
			},
			'numpad': {
				0: '1',
				1: '2',
				2: '3',
				3: '5',
				4: '6',
				5: '7',
				6: '8',
				7: '9',
				8: '/',
				9: '*'
			},
			'mouse': {
				0: '.',
				1: '.',
				2: '.',
				3: '.',
				4: '.',
				5: '.',
				6: '.',
				7: '.',
				8: '.',
				9: '.'
			}
		};

		this.setupKeyboardControls();

		var drawRow = function(x, y, offset){
			if(offset) {
				
				self.game.add.sprite( x, y, 'bricks', 'halfbrick_m');
				
				for(var i = 0; i < 2; i++){
					var b = new Brick(self.game, 210 * i + x + 110, y, self.keymapping[inputMethod][brickCounter], self);
					if(inputMethod === 'mouse') {
						b.enableMouse();
					}					
					brickCounter++;
					self.bricks.push(b);
				};
				
				self.game.add.sprite( 210 * 2 + x + 110, y, 'bricks', 'halfbrick_m');
				
			} else {
				for(var i = 0; i < 3; i++){
					var b = new Brick(self.game, 215 * i + x, y, self.keymapping[inputMethod][brickCounter], self);
					if(inputMethod === 'mouse') {
						b.enableMouse();
					}
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
		if(inputMethod === 'mouse') {
			this.bomb.enableMouse();
		}

		// game over sign
		this.sign = this.game.add.sprite(this.game.world.centerX, -200, 'gameover');
		this.sign.anchor.setTo(0.5, 0.5);
		this.sign.visible = false;

		this.restartGameText = 'Hit NUMPAD_1 to try again';

		switch(this.config.controlMethod) {
			case 'mouse': 
				this.restartGameText = 'Click to try again';
				break;
			case 'keyboard': 
				this.restartGameText = 'Hit C to try again';
				break;
			case 'makeymakey': 
				this.restartGameText = 'Hit W to try again';
				break;
		}

		// retry text
		this.text = this.game.add.text(this.game.world.centerX, 570, this.restartGameText);
		this.text.anchor.setTo(0.5, 0.5);
		this.text.visible = false;

		this.gameoversfx = [];
		this.gameoversfx.push(this.game.add.audio('fired', 1, false));
		this.gameoversfx.push(this.game.add.audio('finished', 1, false));

		this.music = this.add.audio('gametheme',1,true);
		// play it quietly
		this.music.play('', 0, 0.2, true);

	},
	update: function() {

		if(!this.isGameOver()) {
			// not dead, so update the bricks
			for(var i = 0; i < this.bricks.length; i++ ) {
				if(this.bricks[i]) {
					this.bricks[i].update();
				}
			}
			
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
		} else {
			if(this.config.controlMethod === 'mouse') {
				if(this.game.input.activePointer.isDown) {
					this.resetGame();
					// start a new state
					this.music.stop();
					this.state.start('Game', true, false, this.config);
					}
			}
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
		this.score = 0;
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

		var keymappings = {
			'makeymakey': [
				'W', 'A', 'S', 'D', 'F', 'G', 'UP', 'DOWN', 'LEFT', 'RIGHT'
			],
			'keyboard': [
				'C', 'V', 'B', 'F', 'G', 'R', 'T', 'Y', 'FIVE', 'SIX'
			],
			'numpad': [
				'NUMPAD_1', 'NUMPAD_2', 'NUMPAD_3', 'NUMPAD_4', 'NUMPAD_5', 'NUMPAD_6', 'NUMPAD_7', 'NUMPAD_8', 'NUMPAD_9', 'NUMPAD_DIVIDE', 'NUMPAD_MULTIPLY'
			],
			'mouse': []
		};

		var keys = keymappings[this.config.controlMethod];

		for(var i = 0; i < keys.length; i++) {
			var t = this.input.keyboard.addKey(Phaser.KeyCode[keys[i]]);
			t.onDown.add(this.keyPress, this);
		}

		if(this.config.controlMethod !== 'mouse') {
			var sp = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR); // ' '
			sp.onDown.add(this.keyPress, this);
		}
	},
	keyPress: function(keyEvent) {

		if(this.isGameOver()) {
			// if gameover and user presses 1
			if(keyEvent.event.key === '1' || keyEvent.event.key == 'W' || keyEvent.event.key == 'w' || keyEvent.event.key == 'C' || keyEvent.event.key == 'c') {
				this.resetGame();
				// start a new state
				this.music.stop();
				this.state.start('Game', true, false, this.config);
			}
		}

		if(this.config.controlMethod !== 'mouse') {
			if(keyEvent.event.key === ' ') {
				this.bomb.thump();
				return;
			}

			// pass keypress to all the bricks
			for(var i = 0; i < this.bricks.length; i++) {
				this.bricks[i].thump(keyEvent.event.key);
			}
		}
	}
};
