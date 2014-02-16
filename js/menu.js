Game.Menu = function(game) {};

Game.Menu.prototype = {
  create: function() {
    var textStyle = { font: "65px Arial", fill: "#ffffff", align: "center" };
    var menuLabel = game.add.text(Win.WIDTH / 2, Win.HEIGHT / 2, this.menuTxt, textStyle);
    menuLabel.anchor.setTo(0.5, 0.5);
    menuLabel.fixedToCamera = true;
    var startBtn = game.add.button(Win.WIDTH / 2, Win.HEIGHT / 2 + 100, 'startBtn', this.startGame, this, 2, 1, 0);
    startBtn.anchor.setTo(0.5, 0.5);
    startBtn.fixedToCamera = true;


  },

  startGame: function() {
    game.state.start('Play');
  }
};
