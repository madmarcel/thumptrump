'use strict';

GameState.Config = function(game){
	this.position = 0;

	this.profanity = true;

	this.controlMethod = 'mouse';
};

GameState.Config.prototype = {
	init: function(config) {
		this.position = config.muspos;
		if( this.position > 0 ) {
			this.position /= 1000;			
		}
	},
	preload: function() {
		
	},
  	create: function() {
		this.title = this.add.sprite(this.world.centerX, this.world.centerY, 'controls');
		this.title.anchor.setTo(0.5,0.5);
		this.title.inputEnabled = true;
		this.title.events.onInputDown.add(this.doNext, this);
		this.title.input.useHandCursor = true;

		this.music = this.add.audio('title',1,true);
		this.music.addMarker('resume', this.position, 120.0, true);
		this.music.play('resume', 0, 1.0, true);

		this.toggle = this.add.sprite( 1060, 254,'switch');
		this.toggle.anchor.setTo(0.5,0.5);
		this.toggle.inputEnabled = true;
		this.toggle.events.onInputDown.add(this.doToggle, this);
		this.toggle.input.useHandCursor = true;

		this.toggleText = this.add.text( 1110, 240, 'Profanity ON');
		this.toggleText.inputEnabled = true;
		this.toggleText.events.onInputDown.add(this.doToggle, this);
		this.toggleText.input.useHandCursor = true;

		this.mouseText = this.add.text( 1130, 320, 'Mouse');
		this.keyboardText = this.add.text( 786, 320, 'Keyboard');
		this.numText = this.add.text( 460, 320, 'Numpad');
		this.mmText = this.add.text( 94, 320, 'Makey Makey');

		this.normalStyle = { fontSize: '20px', fill: '#000000' };
		this.BigStyle = { fontSize: '32px', fill: '#0000ff' };

		this.click = this.game.add.audio('click', 1, false);
	},
	update: function() {
		/*if(this.game.input.activePointer.isDown) {
			console.log(this.game.input.activePointer.x + this.game.camera.x, this.game.input.activePointer.y);
		}*/

		var x = this.game.input.activePointer.x + this.game.camera.x;

		if( x < 340 ) {
			this.controlMethod = 'makeymakey';
			this.mmText.setStyle(this.BigStyle);
		} else {
			this.mmText.setStyle(this.normalStyle);
		}
		if( x >= 340 && x < 680 ) {
			this.controlMethod = 'numpad';
			this.numText.setStyle(this.BigStyle);
		}  else {
			this.numText.setStyle(this.normalStyle);
		}
		if( x >= 680 && x < 1000 ) {
			this.controlMethod = 'keyboard';
			this.keyboardText.setStyle(this.BigStyle);
		} else {
			this.keyboardText.setStyle(this.normalStyle);
		}
		if( x > 1000 ) {
			this.controlMethod = 'mouse';
			this.mouseText.setStyle(this.BigStyle);
		} else {
			this.mouseText.setStyle(this.normalStyle);
		}
	},
	doToggle: function() {
		this.profanity = !this.profanity;

		this.toggle.scale.x *= -1;

		if( this.profanity ) {
			this.toggleText.setText('Profanity ON');
		} else {
			this.toggleText.setText('Profanity OFF');
		}
		this.click.play();
	},
	doNext: function() {

		var y = this.game.input.activePointer.y + this.game.camera.y;
		if( y < 330 ) {
			return;
		}

		// pass position on to next state
		this.position = this.music.currentTime;
		this.music.stop();
		this.click.play();

		if(this.controlMethod !== 'makeymakey') {
			this.game.state.start('Game', true, false, { 'muspos': this.position, 'controlMethod': this.controlMethod, 'profanity': this.profanity });
		} else {
			this.game.state.start('Setup', true, false, { 'muspos': this.position, 'controlMethod': this.controlMethod, 'profanity': this.profanity });
		}
	}
};
