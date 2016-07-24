'use strict';

GameState.Setup = function(game){
};

GameState.Setup.prototype = {
	preload: function() {
		
	},
  	create: function() {
		this.title = this.add.sprite(this.world.centerX, this.world.centerY, 'setup');
		this.title.anchor.setTo(0.5,0.5);
		this.title.inputEnabled = true;
		this.title.events.onInputDown.add(this.doIntro, this);
		this.title.input.useHandCursor = true;

	},
	doIntro: function() {
		this.game.state.start('Game', true, false);
	}
};
