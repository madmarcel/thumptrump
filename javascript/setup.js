'use strict';

GameState.Setup = function(game){
	this.config;
};

GameState.Setup.prototype = {
	init: function(config) {

		this.config = config;

		this.position = config.muspos;
		if( this.position > 0 ) {
			this.position /= 1000;			
		}
	},
	preload: function() {
		
	},
  	create: function() {
		this.title = this.add.sprite(this.world.centerX, this.world.centerY, 'setup');
		this.title.anchor.setTo(0.5,0.5);
		this.title.inputEnabled = true;
		this.title.events.onInputDown.add(this.doIntro, this);
		this.title.input.useHandCursor = true;
		
		this.music = this.add.audio('title',1,true);
		this.music.addMarker('resume', this.position, 100.0, true);
		this.music.play('resume', 0, 1.0, true);
		this.click = this.game.add.audio('click', 1, false);
	},
	doIntro: function() {
		// pass position on to next state
		this.position = this.music.currentTime;
		this.music.stop();
		this.click.play();
		this.game.state.start('Game', true, false, this.config);
	}
};
