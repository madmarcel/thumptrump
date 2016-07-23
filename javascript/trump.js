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
	'MOVETOINSULT': 6
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
			case Trump.STATES.PUSHING:

				var r = this.game.rnd.integerInRange(0, 5);

				if( r > 0) {
					// either pick the next brick
					this.pickNextBrick();
				} else {
					// or insult the player
					this.pickInsultDest();
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
	'pickNextBrick': function() {
		var r = this.game.rnd.integerInRange(0, this.parent.bricks.length - 1);
		if(this.parent.bricks[r].isInactive() || this.parent.bricks[r].isSliding()){ 
			// take this out
			//this.parent.bricks[r].makeActive(); 

			this.currentBrickIndex = r;
			this.destination = { 'x': this.parent.bricks[r].x + 160, 'y': this.parent.bricks[r].y + 180 };
			this.currentState = Trump.STATES.MOVETOBRICK;
		}
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
		}

		if( brick.isDone() || brick.isFalling() ) {
			// we're done with this brick, on to the next one
			this.chooseNextAction();
		}

		// TODO - handle player knocking brick back

	},
	'doInsult': function() {
		this.currentState = Trump.STATES.INSULT;
		var delta = this.game.time.elapsedSecondsSince(this.timestamp);
		if(delta >= 2.0) {
			this.timestamp = this.game.time.time;
			this.chooseNextAction();
		}
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