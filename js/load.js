var Win = {
  WIDTH: 480,
  HEIGHT: 720
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
    game.state.states['Play'].highScore = 0;

    game.state.start('Load');
  }
};

Game.Load = function(game) {};

Game.Load.prototype = {
  preload: function() {
    game.stage.backgroundColor = "#000000";

    var textStyle = { font: "65px Griffy", fill: "#ffffff", align: "center" };
    var loadingLabel = game.add.text(Win.WIDTH / 2, Win.HEIGHT / 2, 'Loading...', textStyle);
    loadingLabel.anchor.setTo(0.5, 0.5);

    var loadbar = game.add.sprite(Win.WIDTH / 2, Win.HEIGHT / 2 + 80, 'loading');
    loadbar.anchor.setTo(0.5, 0.5);
    game.load.setPreloadSprite(loadbar);

    game.load.image('splash', 'assets/graphics/bumblebee_splash_gold.png');
    game.load.image('grass', 'assets/graphics/bumblebee_grass.png');
    game.load.image('hills', 'assets/graphics/bumblebee_green_bg.png');
    game.load.image('plants', 'assets/graphics/bumblebee_hearts.png');
    game.load.image('startBtn', 'assets/graphics/bumblebee_beehive.png');
    game.load.image('bee', 'assets/graphics/bumblebee.png');
    game.load.spritesheet('spider', 'assets/graphics/bumblebee_spider_new_sheet.png',60,600,5);
    game.load.image('barrierBottom', 'assets/graphics/bumblebee_flytrap.png');
    game.load.audio('song', 'assets/sounds/fotbb.mp3');
  },

  create: function() {
    game.state.states['Menu'].menuTxt = 'Avoid the spiders!\nClick/touch and hold to fly.';
    game.state.start('Menu');
  }
};
