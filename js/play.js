var World = {
  WIDTH: 25000,
  HEIGHT: Win.HEIGHT
};

var beeSize = 1;
var Bee = {
  MAX_SIZE: 0.5,
  MIN_SIZE: 0.2,
  GROWTH_STEP: 0.01,
  Velocity: {
    UP: -350,
    DOWN: 250,
    RIGHT: 350
  }

};

var BARRIER_WIDTH = 80;
var BARRIER_FREQUENCY = 180;

Game.Play = function(game) {};

Game.Play.prototype = {

  create: function() {
    game.world.setBounds(0, 0, World.WIDTH, World.HEIGHT);

    this.background = game.add.tileSprite(0, 0, 1024, 1024, 'hills');
    this.background2 = game.add.tileSprite(0, 0, 1024, 1024, 'plants');

    this.bee = game.add.sprite(Win.WIDTH / 2, game.world.centerY, 'bee');
    this.bee.anchor.setTo(0.5, 0.5);
    this.bee.scale.setTo(Bee.MIN_SIZE, Bee.MIN_SIZE);
    this.bee.body.collideWorldBounds = true;

    game.camera.follow(this.bee);

    this.song = game.add.audio('song');
    this.song.play('', 0, 1, true);

    // group to hold barriers
    this.barriers = game.add.group();
    this.passages = game.add.group();

    var lastMidpoint = Win.HEIGHT / 2;

    // generate barriers
    for(var xCoord = Win.WIDTH * 1.5; xCoord < World.WIDTH; xCoord += (BARRIER_FREQUENCY + this.generateVariance(BARRIER_FREQUENCY))) {
      var passageHeight = this.generateVariance(150) + 100;
      var sign = Math.round(Math.random(1)) ? -1 : 1;
      var delta = sign * this.generateVariance(180);
      var passageMidpoint = lastMidpoint + delta;

      // if point is imposible, vary in opposite direction
      if(passageMidpoint < (10 + passageHeight) || passageMidpoint > (Win.HEIGHT - passageHeight - 10)) {
        passageMidpoint = lastMidpoint - delta;
      }

      lastMidpoint = passageMidpoint;

      this.createTopBarrier(xCoord, passageMidpoint, passageHeight);
      this.createPassage(xCoord, passageMidpoint, passageHeight);
      this.createBottomBarrier(xCoord, passageMidpoint, passageHeight);
    }

    // Place ground background in front of barriers
    this.background3 = game.add.tileSprite(0, 0, 1024, 1024, 'grass');

    // Score instantiated last, to place it on top of all other layers
    this.score = 0;
    var style = { font: "40px Griffy", fill: "#ffffff", align: "center" };
    this.scoreDisplay = game.add.text(Win.WIDTH / 2, 0, this.score.toString(), style);
    this.scoreDisplay.fixedToCamera = true;
  },

  update: function() {
    game.physics.collide(this.bee, this.barriers, this.deathCollision, null, this);
    game.physics.overlap(this.bee, this.passages, this.increaseScore, null, this)

    if(game.input.mousePointer.isDown) {
      this.expandBee();
      this.bee.body.velocity.y = Bee.Velocity.UP;
    }
    else if(game.input.mousePointer.isUp) {
      this.shrinkBee();
      this.bee.body.velocity.y = Bee.Velocity.DOWN;
    }

    // background movement
    this.background.x = this.bee.x - Win.WIDTH / 2;
    this.background.tilePosition.x =  -this.bee.x*.025 % 1024;
    this.background2.x = this.bee.x - Win.WIDTH / 2;
    this.background2.tilePosition.x = -this.bee.x*.5 % 1024;
    this.background3.x = this.bee.x - Win.WIDTH / 2;
    this.background3.tilePosition.x = -this.bee.x % 1024;

    // bee movement
    this.bee.body.velocity.x = Bee.Velocity.RIGHT;
    this.bee.body.gravity.y = 500;
  },

  deathCollision: function(bee, barrier, ctx) {
    bee.x = 0;
    bee.y = 0;
    bee.destroy();
    this.song.stop();
    game.state.states['Menu'].menuTxt = this.score.toString() + ' webs avoided!';
    if(this.score > game.state.states['Play'].highScore) {
      game.state.states['Play'].highScore = this.score;
    }
    game.state.start('Menu');
  },

  increaseScore: function(bee, passage) {
    this.score++;
    this.scoreDisplay.content = this.score.toString();
    passage.destroy();
  },

  shrinkBee: function() {
    if (beeSize > Bee.MIN_SIZE) {
      beeSize -= 0.1;
      this.bee.scale.setTo(beeSize, beeSize);
    }
  },

  expandBee: function() {
    if (beeSize < Bee.MAX_SIZE) {
      beeSize += Bee.GROWTH_STEP;
      this.bee.scale.setTo(beeSize, beeSize);
    }
  },

  generateVariance: function(val) {
    return val * Math.random();
  },

  createTopBarrier: function(x, passageMid, passageHeight) {
    var barrier = game.add.sprite(0, 0, 'spiderTop');
    barrier.anchor.setTo(0,1);
    barrier.x = x;
    barrier.y = passageMid - passageHeight / 2.0;
    barrier.body.immovable = true;
    this.barriers.add(barrier);
  },

  createBottomBarrier: function(x, passageMid, passageHeight) {
    var barrier = game.add.sprite(0, 0, 'spiderBottom');
    barrier.x = x;
    barrier.y = passageMid + passageHeight / 2.0;
    barrier.body.immovable = true;
    this.barriers.add(barrier);
  },

  createPassage: function(x, passageMid, passageHeight) {
    var passage = game.add.sprite(0.5, 0.5);
    passage.x = x + BARRIER_WIDTH / 2;
    passage.y = passageMid - passageHeight / 2.0;
    passage.width = 10;
    passage.height = passageHeight;
    passage.body.immovable = true;
    this.passages.add(passage);
  }
};

