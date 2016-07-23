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

    this.mortar = this.game.add.sprite(x - 5, y + 3, 'bricks', 'mortar');
	this.sprite = this.game.add.sprite(x, y, 'bricks', 'brick');

    this.scrapes = [];
	this.scrapes.push(this.game.add.audio('scrape1',1,true));
	this.scrapes.push(this.game.add.audio('scrape2',1,true));

    this.thumpSFX = this.game.add.audio('thump',1,false);
	this.slideInterval = 0.5;
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
Brick.MAXLEVEL = 10;

// 500ms
//Brick.SLIDE_INTERVAL = 0.5;

Brick.prototype = {
    'update': function() {

        if( this.isDone() ) {
            return;
        }

        if( this.isSliding() ) {
            var delta = this.game.time.elapsedSecondsSince(this.timestamp);

            if( delta >= this.slideInterval) {
				
                this.slideOut();
                this.timestamp = this.game.time.time;
            }
        }        
    },

    'slideSFX': function() {
        var r = this.game.rnd.integerInRange(0,1);

		this.scrapes[r].play('', 0, 1.0, false);
    },

    'slideOut': function() {

        this.sprite.x -= 5;
        this.sprite.y += 3;

        this.slidelevel++;

        if( this.slidelevel  === 1 || this.slidelevel === 5 ) {
            this.slideSFX();
        }

        // update sprite

        if( this.slidelevel > Brick.MAXLEVEL ) {
            this.currentState = Brick.STATES.FALLING;
            this.startFall();
        }
    },
	
    'slideIn': function() {
        console.log('yeah', this.slidelevel);
		var stepBack = 3;
		if(this.slidelevel <= 3){
			console.log('lessthan3');
			this.sprite.x += 5 * this.slidelevel;
			this.sprite.y -= 3 * this.slidelevel;
			this.slidelevel = 0;
			this.slideInterval = 0.5;
			this.timestamp = this.game.time.time;
			this.makeInactive();
		}
		if(this.slidelevel > 5){
			this.sprite.x += 5 * stepBack;
			this.sprite.y -= 3 * stepBack;
			this.slidelevel -= stepBack;
			this.slideInterval = 0.7;
			//reset time stamp, wait 0.7
			this.timestamp = this.game.time.time;
		}
		

    },

    // player has pressed a key
    'thump': function(keyPressed) {

        if(!this.isSliding() ) {
            return;
        }

        // console.log(keyPressed, this.key);

        if(keyPressed === this.key) {

            // slide back 
            this.slideIn();
        }
    },

    // start the falling tween toward bottom of screen
    'startFall': function() {
        this.mortar.visible = false;
        var tween = this.game.add.tween(this.sprite).to( { y: 800 }, 1000, Phaser.Easing.Linear.None, true );
        tween.onComplete.addOnce(this.fallDone, this);
    },

    // called when falling tween is done
    'fallDone': function() {
        // dead brick
        this.currentState = Brick.STATES.DONE;
        this.sprite.visible = false;
        this.thumpSFX.play('', 0, 1.0, false);
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
    },
    'makeActive': function() {
        this.currentState = Brick.STATES.SLIDING;

        this.sprite.frameName = 'slidingbrick';
    },
	'makeInactive': function() {
		this.currentState = Brick.STATES.INACTIVE;
		
		this.sprite.frameName = 'brick';
	},
};