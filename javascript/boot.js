'use strict';

var GameState = {
};

GameState.Boot = function(game){
};

GameState.Boot.prototype = {
	init: function() {
	},
	preload: function() {
		this.load.image('preloaderBackground', 'images/preloadbg.png');
		this.load.image('preloaderBar', 'images/preloadbar.png');
	},
	create: function() {
		this.game.state.start("Preloader");
	}
};
