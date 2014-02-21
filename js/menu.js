var splash;

Game.Menu = function(game) {};

Game.Menu.prototype = {
  create: function() {
    splash = game.add.tileSprite(0, 0, 1024, 1024, 'splash');

    var titleStyle = { font: "40px Griffy", fill: "#000000", align: "center" };
    var gameTitle = game.add.text(Win.WIDTH / 2, 50, 'Flight of the Bumblebee', titleStyle);
    gameTitle.anchor.setTo(0.5, 0);
    gameTitle.fixedToCamera = true;

    var textStyle = { font: "40px Griffy", fill: "#ffffff", align: "center" };
    var menuLabel = game.add.text(Win.WIDTH / 2, 200, this.menuTxt, textStyle);
    menuLabel.anchor.setTo(0.5, 0.5);
    menuLabel.fixedToCamera = true;

    var highScore = game.state.states['Play'].highScore;
    if(highScore > 0) {
      var menuLabel = game.add.text(Win.WIDTH / 2, 300, "Your high score: " + highScore, textStyle);
      menuLabel.anchor.setTo(0.5, 0.5);
      menuLabel.fixedToCamera = true;
    }

    var startBtn = game.add.button(Win.WIDTH / 2, Win.HEIGHT / 2 + 100, 'startBtn', this.startGame, this, 2, 1, 0);
    startBtn.anchor.setTo(0.5, 0.5);
    startBtn.fixedToCamera = true;
  },

  startGame: function() {
    game.state.start('Play');
  }
};
