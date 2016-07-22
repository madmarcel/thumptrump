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

		this.brick = this.game.add.sprite( 100, 100, 'brick' );
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
