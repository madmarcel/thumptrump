'use strict';

GameState.Title = function(game){
};

GameState.Title.prototype = {
	preload: function() {
		
	},
  	create: function() {
		this.title = this.add.sprite(this.world.centerX, this.world.centerY, 'title');
		this.title.anchor.setTo(0.5,0.5);
		this.title.inputEnabled = true;
		this.title.events.onInputDown.add(this.doIntro, this);
		this.title.input.useHandCursor = true;

	},
	doIntro: function() {
		this.game.state.start('Intro', true, false);
	}
};
