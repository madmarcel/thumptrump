'use strict';

function Trump(game, x, y, parent){
	this.game = game;
	this.x = x;
	this.y = y;
	this.parent = parent;
	
	this.currentState = Trump.STATES.IDLE;
	
	//add trump sprite
	
	//trump SFX
	
	this.trump = this.game.add.sprite(x , y, 'trump', 'push1');
	this.trump.anchor.setTo(0, 1.0);
	//this.trump.scale.setTo(2.0, 2.0);


	var fillArray = function(value, max) {
        var result = [];
        for(var i = 0; i < max; i++) {
            result.push(value);
        }
        return result;
    };

	var frames = fillArray( 'push1', 20 ).concat(fillArray('push2', 10));

	this.pushAnimation = this.trump.animations.add('push', frames, 24, true);

	this.pushAnimation.play();
};


/* States Trump can be in */
Trump.STATES = {
	'PUSHING': 0,
	'INSULT': 1,
	'CHEER': 2,
	'IDLE': 3,
	'GAMEOVER': 4
};

//push height
Trump.MAXPUSH = 3;


Trump.prototype = {
	'update': function() {

	},
	
	'pushOut': function() {
		//change trump height(.y) based on which row he's pushing
		//s
	},
	
	
	'isActive': function() {
		return this.currentState !== Trump.STATE.IDLE;
	},
	
	
	'isIdle': function() {
		return this.currentState === Trump.STATES.IDLE;
	},
	
};