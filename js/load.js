var Win = {
  WIDTH: 800,
  HEIGHT: 600
};

Game = {};

Game.Boot = function(game) {};

Game.Boot.prototype = {
  preload: function() {
    game.load.image('loading', 'assets/graphics/loadbar.png');
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
    game.stage.backgroundColor = "#2D9BFF";

    var textStyle = { font: "65px Griffy", fill: "#ffffff", align: "center" };
    var loadingLabel = game.add.text(Win.WIDTH / 2, Win.HEIGHT / 2, 'Loading...', textStyle);
    loadingLabel.anchor.setTo(0.5, 0.5);

    var loadbar = game.add.sprite(Win.WIDTH / 2, Win.HEIGHT / 2 + 80, 'loading');
    loadbar.anchor.setTo(0.5, 0.5);
    game.load.setPreloadSprite(loadbar);

    game.load.image('grass', 'assets/graphics/bumblebee_black_bg.png');
    game.load.image('hills', 'assets/graphics/bumblebee_green_bg.png');
    game.load.image('plants', 'assets/graphics/bumblebee_purple_bg.png');
    game.load.image('startBtn', 'assets/graphics/start_button.png');
    game.load.image('bee', 'assets/graphics/bumblebee.png');
    game.load.image('wall', 'assets/graphics/bumblebee_spider.png');
    game.load.image('passage', 'assets/graphics/bumblebee_passage.png');
    game.load.audio('song', 'assets/sounds/fotb-grand-piano.mp3');
  },

  create: function() {
    game.state.states['Menu'].menuTxt = 'Click Start to Play';
    game.state.start('Menu');
  }
};
