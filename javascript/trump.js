'use strict';

function Trump(game, x, y, parent){
	this.game = game;
	this.x = x;
	this.y = y;
	this.parent = parent;
	
	this.currentState = Trump.STATES.IDLE;
	
	//add trump sprite
	
	//trump SFX
	
	
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