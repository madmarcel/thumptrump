'use strict';

function Trump(game, x, y, parent){
	this.game = game;
	this.x = x;
	this.y = y;
	this.parent = parent;
	
	this.currentState = Trump.STATES.IDLE;
	this.oldState = Trump.STATES.IDLE;
	this.currentBrickIndex = 0;
		
	this.stand = this.game.add.sprite(x , y - 40, 'stand');
	this.stand.anchor.setTo(0.5, 0.0);

	this.trump = this.game.add.sprite(x , y, 'trump', 'talk1');
	this.trump.anchor.setTo(0.5, 1.0);
	
	this.trumpSFX = [];
	this.trumpSFX.push(this.game.add.audio('fuckwall',1,true));
	this.trumpSFX.push(this.game.add.audio('wellbeat',1,true));
	this.trumpSFX.push(this.game.add.audio('losers',1,true));
	this.trumpSFX.push(this.game.add.audio('hardtime',1,true));
	this.trumpSFX.push(this.game.add.audio('trumptrumptrump',1,true));
	this.trumpSFX.push(this.game.add.audio('pussy',1,true));

	


	var fillArray = function(value, max) {
        var result = [];
        for(var i = 0; i < max; i++) {
            result.push(value);
        }
        return result;
    };

	var frames = fillArray( 'push1', 20 ).concat(fillArray('push2', 10));

	this.pushAnimation = this.trump.animations.add('push', frames, 24, true);

	frames = fillArray( 'talk1', 5 ).concat(fillArray('talk2', 5));

	this.talkAnimation = this.trump.animations.add('talk', frames, 24, true);

	this.talkAnimation.play();


};


/* States Trump can be in */
Trump.STATES = {
	'PUSHING': 0,
	'INSULT': 1,
	'CHEER': 2,
	'IDLE': 3,
	'GAMEOVER': 4,
	'MOVETOBRICK': 5,
	'MOVETOINSULT': 6,
	'MOVETOBOMB': 7,
	'TALKING': 8
};

Trump.prototype = {
	'update': function() {

		this.stand.x = this.trump.x - 10;
		this.stand.y = this.trump.y - 40;

		switch(this.currentState) {
			case Trump.STATES.IDLE:
				this.chooseNextAction();
			break;
			case Trump.STATES.INSULT:
				this.doInsult();
			break;
			case Trump.STATES.MOVING:
				// nothing
			break;
			case Trump.STATES.MOVETOBRICK:
			case Trump.STATES.MOVETOINSULT:
			case Trump.STATES.MOVETOBOMB:
				this.moveToDestination();
			break;
			case Trump.STATES.PUSHING:
				this.doPush();
			break;
			case Trump.STATES.CHEER:
				
			break;
			case Trump.STATES.GAMEOVER:
				
			break;

		}
	},
	// only called when an action has been completed
	'chooseNextAction': function() {
		switch(this.currentState) {
			case Trump.STATES.IDLE:
				var r = this.game.rnd.integerInRange(0, 5);

				if( r > 0) {
					// either pick the next brick
					this.pickNextBrick();
				} else {
					// or insult the player
					this.pickInsultDest();
				}
			break;
			case Trump.STATES.INSULT:
				this.pickNextBrick();
			break;
			case Trump.STATES.MOVING:
				// do nothing
			break;
			case Trump.STATES.MOVETOBRICK:
				this.startPushing();
			break;
			case Trump.STATES.MOVETOINSULT:
				this.timestamp = this.game.time.time;
				this.doInsult();
			break;
			case Trump.STATES.MOVETOBOMB:				
				this.doBomb();
			break;
			case Trump.STATES.TALKING:
				this.pickNextBrick();
			break;
			case Trump.STATES.PUSHING:

				var r = this.game.rnd.integerInRange(0, 5);

				if( r > 1) {
					// either pick the next brick
					this.pickNextBrick();
				} else if (r === 0 ){
					// or insult the player
					this.pickInsultDest();
				} else if (r === 1 ){
					// or drop a bomb 
					this.pickBombDest();
				}

			break;
			case Trump.STATES.CHEER:
				// todo
			break;
			case Trump.STATES.GAMEOVER:
				// todo 
			break;
		}
	},
	'pickInsultDest': function() {

		var rx = this.game.rnd.integerInRange(720, 850);

		this.destination = { 'x': rx, 'y': 400 };
		this.currentState = Trump.STATES.MOVETOINSULT;		
	},
	'pickBombDest': function() {

		var rx = this.game.rnd.integerInRange(600, 1000);

		this.destination = { 'x': rx, 'y': 400 };
		this.currentState = Trump.STATES.MOVETOBOMB;		
	},
	'doBomb': function() {
		if( this.parent.bomb.isInactive()) {
			this.parent.bomb.doThrow( this.trump.x, this.trump.y - 200);
		}

		this.currentState = Trump.STATES.IDLE;
	},
	// brick helper functions
	/* --------------------------- */
	'findAllGoodBricks': function() {
		var result = [];

		var b = this.parent.bricks;

		for(var i = 0; i < b.length; i++) {
			if(b[i].isInactive() || b[i].isSliding() ) {
				result.push(i);
			}
		}

		return result;
	},
	'howManyGoodBricksLeft': function() {
		return this.findAllGoodBricks().length;
	},
	'pickNextBrick': function() {

		var brickIndexes = this.findAllGoodBricks();

		if(brickIndexes.length < 1) {
			this.parent.doGameOver();
		}

		var r = this.game.rnd.integerInRange(0, brickIndexes.length - 1);

		var index = brickIndexes[r];

		//if(this.parent.bricks[r].isInactive() || this.parent.bricks[r].isSliding()){ 
			// take this out
			//this.parent.bricks[r].makeActive(); 

			this.currentBrickIndex = index;
			this.destination = { 'x': this.parent.bricks[index].x + 160, 'y': this.parent.bricks[index].y + 180 };
			this.currentState = Trump.STATES.MOVETOBRICK;
		//}
	},
	'moveToDestination': function() {	
		this.oldState = this.currentState;
		this.currentState = Trump.STATES.MOVING;
		this.talkAnimation.play();
		var tween = this.game.add.tween(this.trump).to( { x: this.destination.x, y: this.destination.y }, 600, Phaser.Easing.Linear.None, true );
		tween.onComplete.addOnce(this.reachedDestination, this);
	},
	'reachedDestination': function() {
		this.currentState = this.oldState;
		this.chooseNextAction();
	},
	'startPushing': function() {
		this.pushAnimation.play();
		this.parent.bricks[this.currentBrickIndex].makeActive(); 
		this.currentState = Trump.STATES.PUSHING;
		this.timestamp = this.game.time.time;
	},
	'doPush': function() {
		var delta = this.game.time.elapsedSecondsSince(this.timestamp);

		var brick = this.parent.bricks[this.currentBrickIndex];

		
		
			if( brick.isSliding() && delta >= brick.slideInterval) {
				brick.slideOut();
				this.timestamp = this.game.time.time;
				var chancy = this.game.rnd.integerInRange(0, 3);
				if(chancy < 1){
				//	brick.slideOut();
					this.chooseNextAction();
				}
		
			}
		
		//30% chance to do another action
		
		if( brick.isDone() || brick.isFalling() || brick.isInactive() ) {
			// we're done with this brick, on to the next one
			this.chooseNextAction();
		}
		

		// TODO - handle player knocking brick back

	},
	'doInsult': function() {
		this.currentState = Trump.STATES.TALKING;
		
		var r = this.game.rnd.integerInRange(0,this.trumpSFX.length - 1);
		this.trumpSFX[r].onStop.addOnce(this.insultDone, this);
		this.trumpSFX[r].play('', 0, 1.0, false);
		
	},
	'insultDone': function() {
		this.chooseNextAction();
	},
	'isMoving': function() {
		return this.currentState === Trump.STATE.MOVING;
	},
	'isActive': function() {
		return this.currentState !== Trump.STATE.IDLE;
	},	
	'isIdle': function() {
		return this.currentState === Trump.STATES.IDLE;
	},
	
};