var game = new Phaser.Game(Win.WIDTH, Win.HEIGHT, Phaser.AUTO, 'Bumblebee_Flight');

game.state.add('Boot', Game.Boot);
game.state.add('Load', Game.Load);
game.state.add('Menu', Game.Menu);
game.state.add('Play', Game.Play);

game.state.start('Boot');
