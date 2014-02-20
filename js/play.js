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
var BARRIER_FREQUENCY = 180;

var bee;
var barriers;
var passages;
var score;
var scoreDisplay;
var song;


Game.Play = function(game) {};

Game.Play.prototype = {

  create: function() {
    game.world.setBounds(0, 0, World.WIDTH, World.HEIGHT);

    bee = game.add.sprite(60, game.world.centerY, 'bee');
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
    for(var xCoord = Win.WIDTH * 0.8; xCoord < World.WIDTH; xCoord += (BARRIER_FREQUENCY + this.generateVariance(BARRIER_FREQUENCY))) {
      var passageHeight = this.generateVariance(150) + 80;
      var sign = Math.round(Math.random(1)) ? -1 : 1;
      var passageMidpoint = passageMidpoint = this.generateVariance(180) * sign + lastMidpoint;
      // if point is imposible, vary in opposite direction
      if(passageMidpoint < (10 + passageHeight) || passageMidpoint > (Win.HEIGHT - passageHeight - 10)) {
        passageMidpoint = passageMidpoint = this.generateVariance(180) * sign * -1 + lastMidpoint;
      }
      lastMidpoint = passageMidpoint;

      this.createTopBarrier(xCoord, passageMidpoint, passageHeight);
      this.createPassage2(xCoord, passageMidpoint, passageHeight);
      this.createBottomBarrier(xCoord, passageMidpoint, passageHeight);
    }

    score = 0;
    var style = { font: "65px Arial", fill: "#ffffff", align: "center" };
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

    bee.body.velocity.x = Bee.Velocity.RIGHT;
    bee.body.gravity.y = 100;
  },

  deathCollision: function(bee, barrier) {
    bee.kill();
    song.stop();
    game.state.states['Menu'].menuTxt = 'You Died. Try Again?'
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

  createPassage2: function(x, passageMid, passageHeight) {
    var passage = game.add.sprite(0.5, 0.5, 'passage');
    passage.x = x + BARRIER_WIDTH / 2;
    passage.y = passageMid - passageHeight / 2.0;
    passage.width = 10;
    passage.height = passageHeight;
    passage.body.immovable = true;
    passages.add(passage);
  },

  createBarrier: function(x, barrierHeight, passageHeight, isBottom) {

    var barrier = game.add.sprite(0, 0, 'wall');
    if (isBottom) {
      barrier.y = barrierHeight + passageHeight;
      barrier.height = Win.HEIGHT - (passageHeight + y);
    }
    else {// top barrier
      barrier.y = 0;
      barrier.height = barrierHeight;
    }
    barrier.x = x;
    barrier.width = BARRIER_WIDTH;
    barrier.body.immovable = true;
    barriers.add(barrier);
  },

  createPassage: function(x, y, height) {
    var passage = game.add.sprite(0.5, 0.5, 'passage');
    passage.x = x + BARRIER_WIDTH / 2;
    passage.y = y;
    passage.height = height;
    passage.width = 10;
    passage.body.immovable = true;
    passages.add(passage);
  }
};

