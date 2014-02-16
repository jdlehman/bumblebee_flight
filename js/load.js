var Win = {
  WIDTH: 800,
  HEIGHT: 600
};

Game = {};

Game.Boot = function (game) {};

Game.Boot.prototype = {
  preload: function () {
    this.game.load.image('loading', 'assets/graphics/loading.png');
  },

  create: function() {
    this.game.stage.scale.minWidth = Win.WIDTH;
    this.game.stage.scale.minHeight = Win.HEIGHT;
    this.game.stage.scale.setSize();

    this.game.state.start('Load');
  }
};

Game.Load = function (game) {};

Game.Load.prototype = {
  preload: function () {
    this.game.stage.backgroundColor = "#20DEFF";

    var textStyle = { font: "65px Arial", fill: "#ffffff", align: "center" };
    var loadingLabel = this.game.add.text(Win.WIDTH / 2, Win.HEIGHT / 2, 'loading...', textStyle);
    loadingLabel.anchor.setTo(0.5, 0.5);
    //TODO: add preload sprite
    //var preloading = game.add.sprite(Win.WIDTH / 2, Win.HEIGHT / 2, 'loading');
    //preloading.x -= preloading.width;
    //game.load.setPreloadSprite(preloading);

    this.game.load.image('bee', 'assets/graphics/bumblebee.png');
    this.game.load.image('wall', 'assets/graphics/bumblebee_spider.png');
    this.game.load.image('passage', 'assets/graphics/bumblebee_passage.png');
    this.game.load.audio('song', 'assets/sounds/fobb.mp3');
  },

  create: function () {
    this.game.state.start('Menu');
  }
};
