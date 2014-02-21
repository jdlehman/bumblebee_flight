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

var BARRIER_WIDTH = 60;
var BARRIER_FREQUENCY = 140;

var bee;
var barriers;
var passages;
var score;
var scoreDisplay;
var song;

var background;
var background2;
var background3;

Game.Play = function(game) {};

Game.Play.prototype = {

  create: function() {
    game.world.setBounds(0, 0, World.WIDTH, World.HEIGHT);

    background = game.add.tileSprite(0, 0, 1024, 1024, 'hills');
    background2 = game.add.tileSprite(0, 0, 1024, 1024, 'plants');
 
    bee = game.add.sprite(Win.WIDTH / 2, game.world.centerY, 'bee');
    bee.anchor.setTo(0.5, 0.5);
    bee.scale.setTo(0.5, 0.5);
    bee.body.collideWorldBounds = true;

    game.camera.follow(bee);

    song = game.add.audio('song');
    song.play();

    // group to hold barriers
    barriers = game.add.group();
    passages = game.add.group();

    var lastMidpoint = this.generateVariance(Win.HEIGHT);

    //generage barriers
    for(var xCoord = Win.WIDTH * 1.5; xCoord < World.WIDTH; xCoord += (BARRIER_FREQUENCY + this.generateVariance(BARRIER_FREQUENCY))) {
      var passageHeight = this.generateVariance(150) + 80;
      var sign = Math.round(Math.random(1)) ? -1 : 1;
      var passageMidpoint = passageMidpoint = this.generateVariance(180) * sign + lastMidpoint;
      // if point is imposible, vary in opposite direction
      if(passageMidpoint < (10 + passageHeight) || passageMidpoint > (Win.HEIGHT - passageHeight - 10)) {
        passageMidpoint = passageMidpoint = this.generateVariance(180) * sign * -1 + lastMidpoint;
      }
      lastMidpoint = passageMidpoint;

      this.createTopBarrier(xCoord, passageMidpoint, passageHeight);
      this.createPassage(xCoord, passageMidpoint, passageHeight);
      this.createBottomBarrier(xCoord, passageMidpoint, passageHeight);
    }

    background3 = game.add.tileSprite(0, 0, 1024, 1024, 'grass');

    score = 0;
    var style = { font: "40px Griffy", fill: "#ffffff", align: "center" };
    scoreDisplay = game.add.text(Win.WIDTH / 2, 0, score.toString(), style);
    scoreDisplay.fixedToCamera = true;
  },

  update: function() {
    game.physics.collide(bee, barriers, this.deathCollision);
    game.physics.overlap(bee, passages, this.increaseScore)

    if(game.input.mousePointer.isDown) {
      this.expandBee();
      bee.body.velocity.y = Bee.Velocity.UP;
    }
    else if(game.input.mousePointer.isUp) {
      this.shrinkBee();
      bee.body.velocity.y = Bee.Velocity.DOWN;
    }

    background.x = bee.x - Win.WIDTH / 2;
    background.tilePosition.x =  -bee.x*.025 % 1024;
    background2.x = bee.x - Win.WIDTH / 2;
    background2.tilePosition.x = -bee.x*.5 % 1024;
    background3.x = bee.x - Win.WIDTH / 2;
    background3.tilePosition.x = -bee.x % 1024;
    bee.body.velocity.x = Bee.Velocity.RIGHT;
    bee.body.gravity.y = 100;
  },

  deathCollision: function(bee, barrier, ctx) {
    bee.x = 0;
    bee.y = 0;
    bee.kill();
    song.stop();
    game.state.states['Menu'].menuTxt = score.toString() + ' webs avoided!';
    if(score > game.state.states['Play'].highScore) {
      game.state.states['Play'].highScore = score;
    }
    game.state.start('Menu');
  },

  increaseScore: function(bee, passage) {
    score++;
    scoreDisplay.content = score.toString();
    passage.kill();
  },

  shrinkBee: function() {
    if (beeSize > Bee.MIN_SIZE) {
      beeSize -= 0.1;
      bee.scale.setTo(beeSize, beeSize);
    }
  },

  expandBee: function() {
    if (beeSize < Bee.MAX_SIZE) {
      beeSize += Bee.GROWTH_STEP;
      bee.scale.setTo(beeSize, beeSize);
    }
  },

  generateVariance: function(val) {
    return val * Math.random();
  },

  createTopBarrier: function(x, passageMid, passageHeight) {
    var barrier = game.add.sprite(0, 0, 'wall');
    barrier.x = x;
    barrier.y = 0;
    barrier.width = BARRIER_WIDTH;
    barrier.height = passageMid - passageHeight / 2.0;
    barrier.body.immovable = true;
    barriers.add(barrier);
  },

  createBottomBarrier: function(x, passageMid, passageHeight) {
    var barrier = game.add.sprite(0, 0, 'wall');
    barrier.x = x;
    barrier.y = passageMid + passageHeight / 2.0;
    barrier.width = BARRIER_WIDTH;
    barrier.height = Win.HEIGHT - barrier.y;
    barrier.body.immovable = true;
    barriers.add(barrier);
  },

  createPassage: function(x, passageMid, passageHeight) {
    var passage = game.add.sprite(0.5, 0.5, 'passage');
    passage.x = x + BARRIER_WIDTH / 2;
    passage.y = passageMid - passageHeight / 2.0;
    passage.width = 10;
    passage.height = passageHeight;
    passage.body.immovable = true;
    passages.add(passage);
  }
};

