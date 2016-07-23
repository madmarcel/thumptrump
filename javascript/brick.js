'use strict';

function Brick(game, x, y, key, parent){

    this.game = game;	
    this.x = x;
    this.y = y;
    this.key = key;
    this.parent = parent;

    this.slidelevel = 0;
    this.currentState = Brick.STATES.INACTIVE;
    this.timestamp = this.game.time.time;
	this.sprite = this.game.add.sprite(x, y, 'bricks', 'brick_m');
};

/* static constants */

/* all the states a brick can have */
Brick.STATES = {
    'INACTIVE': 0,
    'SLIDING': 1,
    'FALLING': 2,
    'DONE': 3
};

// how many levels of slide
Brick.MAXLEVEL = 5;

// 500ms
Brick.SLIDE_INTERVAL = 0.5;

Brick.prototype = {
    'update': function() {

        if( this.isDone() ) {
            return;
        }

        if( this.isSliding() ) {
            var delta = this.game.time.elapsedSecondsSince(this.timestamp);

            if( delta >= Brick.SLIDE_INTERVAL) {
                this.slideOut();
                this.timestamp = this.game.time.time;
            }
        }        
    },

    'slideOut': function() {

        this.slidelevel++;

        // update sprite

        if( this.slidelevel > Brick.MAXLEVEL ) {
            this.currentState = Brick.STATES.FALLING;
            this.startFall();
        }
    },

    'slideIn': function() {

    },

    // player has pressed a key
    'thump': function(keyPressed) {
        if(keyPressed === this.key) {

            // slide back 

        }
    },

    // start the falling tween toward bottom of screen
    'startFall': function() {

    },

    // called when falling tween is done
    'fallDone': function() {
        // dead brick
        this.currentState = Brick.STATES.DONE;
    },

    'isInactive': function() {
        return this.currentState === Brick.STATES.INACTIVE;
    },

    'isActive': function() {
        return this.currentState !== Brick.STATES.INACTIVE;
    },

    'isDone': function() {
        return this.currentState === Brick.STATES.DONE;
    },

    'isSliding': function() {
        return this.currentState === Brick.STATES.SLIDING;
    }
};