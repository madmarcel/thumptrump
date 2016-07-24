'use strict';

GameState.Preloader = function(game){
	this.ready = false;
	this.sounds = [];
};

GameState.Preloader.prototype = {
	preload: function() {

		this.bck = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBackground');
		this.bck.anchor.setTo(0.5,0.5);

		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
		this.preloadBar.anchor.setTo(0,0.5);
		this.preloadBar.x = this.world.centerX - this.preloadBar.width/2;

		// this statement sets the blue bar to represent the actual percentage of data loaded
		this.load.setPreloadSprite(this.preloadBar);
		// load the images
		this.images = [ 'bg', 'gameover', 'text', 'stand', 'groundmask', 'bomb', 'kaboom', 'bubble', 'cross', 'title', 'intro'];

		var debug = true;
		var sounddebug = true;

		var folder = 'images/smaller/';
		var ext = '-fs8.png';

		if (debug) {
			folder = 'images/';
			ext = '.png';
		}

		for (var i = 0; i < this.images.length; i++) {			
			this.load.image(this.images[i], folder + this.images[i] + ext);
		}
		
		var atlases = { 'bricks': 'sprites',
						'trump': 'trump'
		};

		/* load sprite atlases */
		var a_keys = Object.keys(atlases);
		for(var i = 0; i < a_keys.length; i++) {
			var key = a_keys[i];
			var value = atlases[key];
			this.game.load.atlas(key, folder + value + '.png', folder + value + '.json');
		}

		// in game sounds and music
		this.sfx = {
			'scrape1': 'scrape1',
			'scrape2': 'scrape2',
			'thump': 'thump',
			'fired': 'fired',
			'finished': 'finished',
			'kaboom': 'kaboom',
			'fuckwall': 'fuckwall',
			'wellbeat': 'wellbeat',
			'losers': 'losers',
			'hardtime': 'hardtime',
			'trumptrumptrump': 'trumptrumptrump',
			'pussy': 'pussy'

		};
		
		var have_mp3 = this.game.device.mp3;
		var have_ogg = this.game.device.ogg;
		var have_webm = this.game.device.webm;

		var sfx_keys = Object.keys(this.sfx);
		for (var k = 0; k < sfx_keys.length; k++) {
			var key = sfx_keys[k];
			var fname = this.sfx[sfx_keys[k]];

			var loadThese = [];
			if(!sounddebug) {
				if (have_webm) {
					loadThese.push( 'sfx/' + fname + '.webm' );
				}
				if (have_ogg) {
					loadThese.push( 'sfx/' + fname + '.ogg' );
				}
			}
			if (have_mp3) {
				loadThese.push( 'sfx/' + fname + '.mp3' );
			}

			this.load.audio(key, loadThese);
		}
	},
  	create: function() {
		this.preloadBar.cropEnabled = false;
	},
	update: function() {
		if (!this.ready) {
			// check if all the sounds are loaded
			var count = 0;
			for (var s = 0; s < this.sounds.length; s++ ) {
				if (this.cache.isSoundDecoded( this.sounds[s] )) {
					count++;
				}
			}

			if ( count >= this.sounds.length) {
				this.ready = true;
				
			}
			this.game.state.start('Title', true, false);
		}
	}
};
