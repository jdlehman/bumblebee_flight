var splash;

Game.Menu = function(game) {};

Game.Menu.prototype = {
  create: function() {
    splash = game.add.tileSprite(0, 0, 1024, 1024, 'splash');

    var titleStyle = { font: "40px Griffy", fill: "#000000", align: "center" };
    var gameTitle = game.add.text(Win.WIDTH / 2, 50, 'Flight of the Bumblebee', titleStyle);
    gameTitle.anchor.setTo(0.5, 0);

    var textStyle = { font: "40px Griffy", fill: "#ffffff", align: "center" };
    var menuLabel = game.add.text(Win.WIDTH / 2, 150, this.menuTxt, textStyle);
    menuLabel.anchor.setTo(0.5, 0.5);

    var highScore = game.state.states['Play'].highScore;
    if(highScore > 0) {
      var menuLabel = game.add.text(Win.WIDTH / 2, 225, "High Score: " + highScore, textStyle);
      menuLabel.anchor.setTo(0.5, 0.5);
    }

    var startBtn = game.add.button(Win.WIDTH / 2, Win.HEIGHT / 2, 'startBtn', this.startGame, this, 2, 1, 0);
    startBtn.anchor.setTo(0.5, 0.5);
  },

  startGame: function() {
    game.state.start('Play');
  }
};
