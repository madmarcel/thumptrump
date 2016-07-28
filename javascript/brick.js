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
    //this.sprite.visible = false;
    //this.mortar.visible = false;

    this.scrapes = [];
	this.scrapes.push(this.game.add.audio('scrape1',1,true));
	this.scrapes.push(this.game.add.audio('scrape2',1,true));

    this.thumpSFX = this.game.add.audio('thump',1,false);
	this.slideInterval = 0.05;

    this.cross = this.game.add.sprite(x + 55, y + 40, 'cross');
    this.cross.visible = false;

    this.bubble = this.game.add.sprite(x + 60, y + 45, 'bubble');
    this.bubble.visible = false;

    this.multiplier = 1;
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
    'enableMouse': function() {
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(this.doClick, this);
		this.sprite.input.useHandCursor = true;
    },
    'doClick': function() {
        this.thump('.');
    },
    'update': function() {

        if( this.isDone() ) {
            return;
        }     
    },

    'slideSFX': function() {
        var r = this.game.rnd.integerInRange(0,1);

		this.scrapes[r].play('', 0, 1.0, false);
    },

    'slideOut': function() {

        for(var i = 0; i < this.multiplier; i++) {
            this.sprite.x -= 5;
            this.sprite.y += 3;

            this.slidelevel++;
        }

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
		var stepBack = 3;
		if(this.slidelevel <= 4){
			this.sprite.x += 5 * this.slidelevel;
			this.sprite.y -= 3 * this.slidelevel;
			this.slidelevel = 0;
			//this.slideInterval = 0.5;
			this.timestamp = this.game.time.time;
			this.makeInactive();
		}
		if(this.slidelevel > 4){
			this.sprite.x += 5 * stepBack;
			this.sprite.y -= 3 * stepBack;
			this.slidelevel -= stepBack;
			//this.slideInterval = 0.7;
			//reset time stamp, wait 0.7
			this.timestamp = this.game.time.time;
		}
		

    },
    'showCross': function() {        
        this.cross.alpha = 0.1;
        this.cross.visible = true;
        var tween = this.game.add.tween(this.cross).to( { alpha: 1.0 }, 200, Phaser.Easing.Linear.None, true );
        tween.onComplete.addOnce(this.hideCross, this);
    },
    'hideCross': function() {
        this.cross.visible = false;
    },
    'showBubble': function() {
        this.bubble.alpha = 0.1;
        this.bubble.visible = true;
        var tween = this.game.add.tween(this.bubble).to( { alpha: 1.0 }, 200, Phaser.Easing.Linear.None, true );
        tween.onComplete.addOnce(this.hideBubble, this);
    },
    'hideBubble': function() {
        this.bubble.visible = false;
    },
    // player has pressed a key
    'thump': function(keyPressed) {

        if(!this.isSliding() ) {

            if(keyPressed === this.key ) {
                this.showCross();
            }
            return;
        }

        if(keyPressed === this.key ) {

            //console.log('Match');

            this.showBubble();

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
    'isFalling': function() {
        return this.currentState === Brick.STATES.FALLING;
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