'use strict';

function Bomb(game, x, y, parent){
	this.game = game;
	this.x = x;
	this.y = y;
	this.parent = parent;

    this.sprite = this.game.add.sprite(x, y, 'bomb');
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.visible = false;

    this.timestamp = this.game.time.time;

    this.flag = true;

    this.originalTint = this.sprite.tint;

    this.speed = 1.0;

    this.boom = this.game.add.sprite(x, y, 'kaboom');
    this.boom.anchor.setTo(0.5, 0.5);
    this.boom.visible = false;

    /* 1.0 
    0.95
    0.90
    0.85


    0.2
    0.15 */

    this.currentState = Bomb.STATES.INACTIVE;

    this.sfx = this.game.add.audio('kaboom', 1, false);
};

Bomb.STATES = {
    'INACTIVE': 0,
    'FALLING': 1,
    'TICKING': 2,
    'EXPLODING': 3,
    'DONE': 4,
    'FLICKEDAWAY': 5
};

Bomb.prototype = {
    'update': function() { 
        switch(this.currentState) {
            case Bomb.STATES.INACTIVE:
            break;

            case Bomb.STATES.FALLING:
            break;

            case Bomb.STATES.TICKING:
                var delta = this.game.time.elapsedSecondsSince(this.timestamp);

                if( delta >= this.speed) {
                    this.toggleTint(this.flag);

                    this.flag = !this.flag;
                    this.timestamp = this.game.time.time;

                    if( this.speed > 0.2) {
                        this.speed -= 0.05;
                    } else {
                        this.currentState = Bomb.STATES.EXPLODING;
                    }
                }
            break;

            case Bomb.STATES.EXPLODING:
                // add sfx here

                this.sfx.play();

                this.boom.scale.setTo(0.1, 0.1);
                this.boom.x = this.sprite.x;
                this.boom.y = this.sprite.y;
                this.boom.visible = true;
                var tween = this.game.add.tween(this.boom.scale).to( { x: 1.0, y: 1.0 }, 300, Phaser.Easing.Linear.None, true );
		        tween.onComplete.addOnce(this.boomDone, this);
                this.currentState = Bomb.STATES.DONE;
            break;

            case Bomb.STATES.DONE:
            break;
        }
    },
    'boomDone': function() {
        // fire game over
        this.parent.doGameOver();
    },
    'toggleTint': function(flag) {
        if(flag) {
            this.sprite.tint = 0xff0000;
        } else {
            this.sprite.tint = this.originalTint;
        }
    },
    'thump': function() {
        if(this.currentState === Bomb.STATES.TICKING) {

            var r = this.game.rnd.integerInRange(0, 1);

            var destX = -50;
            if( r > 0 ) {
                destX = 1500;
            }


            var tween = this.game.add.tween(this.sprite).to( { x: destX }, 400, Phaser.Easing.Linear.None, true );
		    tween.onComplete.addOnce(this.reset, this);

            this.currentState = Bomb.STATES.FLICKEDAWAY;
        }
    },
    // reset the bomb for use
    'reset': function() {

        // reset a bunch of variables
        // hide the bomb
        this.sprite.visible = false;
        this.sprite.tint = this.originalTint;
        // reset the speed
        this.speed = 1.0;

        this.currentState = Bomb.STATES.INACTIVE;
    },
    'doThrow': function(x,y) {

        // console.log('Here comes a bomb buddy!');

        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.visible = true;

        var tween = this.game.add.tween(this.sprite).to( { y: 660 }, 400, Phaser.Easing.Linear.None, true );
		tween.onComplete.addOnce(this.startTicking, this);
        this.currentState = Bomb.STATES.FALLING;
    },
    'startTicking': function() {
        this.currentState = Bomb.STATES.TICKING;
        this.timestamp = this.game.time.time;
    },
    'isInactive': function() {
        return this.currentState === Bomb.STATES.INACTIVE;
    }
};