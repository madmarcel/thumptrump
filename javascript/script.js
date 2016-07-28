'use strict';

window.onload = function() {
    var parent = document.getElementById('mywrapper');

    var game = new Phaser.Game(1366, 768, Phaser.AUTO, parent);
    game.state.add('Boot', GameState.Boot);
    game.state.add('Preloader', GameState.Preloader);
    game.state.add('Title', GameState.Title);
    game.state.add('Intro', GameState.Intro);
    game.state.add('Setup', GameState.Setup);
    game.state.add('Config', GameState.Config);
    game.state.add('Game', GameState.Game);

    game.state.start('Boot');
};
