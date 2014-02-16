var Win = {
  WIDTH: 800,
  HEIGHT: 600
};

Game = {};

Game.Boot = function(game) {};

Game.Boot.prototype = {
  preload: function() {
    game.load.image('loading', 'assets/graphics/loading.png');
  },

  create: function() {
    game.stage.scale.minWidth = Win.WIDTH;
    game.stage.scale.minHeight = Win.HEIGHT;
    game.stage.scale.setSize();

    game.state.start('Load');
  }
};

Game.Load = function(game) {};

Game.Load.prototype = {
  preload: function() {
    game.stage.backgroundColor = "#20deff";

    var textStyle = { font: "65px Arial", fill: "#ffffff", align: "center" };
    var loadingLabel = game.add.text(Win.WIDTH / 2, Win.HEIGHT / 2, 'Loading...', textStyle);
    loadingLabel.anchor.setTo(0.5, 0.5);
    //TODO: add preload sprite
    //var preloading = game.add.sprite(Win.WIDTH / 2, Win.HEIGHT / 2, 'loading');
    //preloading.x -= preloading.width;
    //game.load.setPreloadSprite(preloading);

    game.load.image('startBtn', 'assets/graphics/start_button.png');
    game.load.image('bee', 'assets/graphics/bumblebee.png');
    game.load.image('wall', 'assets/graphics/bumblebee_spider.png');
    game.load.image('passage', 'assets/graphics/bumblebee_passage.png');
    game.load.audio('song', 'assets/sounds/fobb.mp3');
  },

  create: function() {
    game.state.start('Menu');
  }
};
