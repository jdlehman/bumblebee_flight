Game.Menu = function (game) {};

Game.Menu.prototype = {
  create: function() {
    var textStyle = { font: "65px Arial", fill: "#ffffff", align: "center" };
    var menuLabel = this.game.add.text(Win.WIDTH / 2, Win.HEIGHT / 2, 'Press Up to Play', textStyle);
    menuLabel.anchor.setTo(0.5, 0.5);

    this.cursor = this.game.input.keyboard.createCursorKeys();
  },

  update: function() {
    if(this.cursor.up.isDown) {
      this.game.state.start('Play');
    }
  }
};
