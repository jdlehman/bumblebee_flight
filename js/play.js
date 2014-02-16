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
var BARRIER_FREQUENCY = 200;

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
    //game.stage.backgroundColor = "20DEFF";

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

    //generage barriers
    for(var i = Win.WIDTH / 2; i < World.WIDTH; i+= (BARRIER_FREQUENCY + this.generateVariance(BARRIER_FREQUENCY))) {
      passageHeight = Math.random() * 100 + 80;
      passageY = this.generateVariance(Win.HEIGHT - passageHeight - 200);

      this.createBarrier(i, passageY, passageHeight, true)
      this.createPassage(i, passageY, passageHeight);
      this.createBarrier(i, passageY, passageHeight, false)
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

  //TODO: add restart, send back to play state
  //restart: function() {
  //  this.game.state.start('Play');
  //},

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

  createBarrier: function(x, y, passageHeight, isBottom) {

    var barrier = game.add.sprite(0, 0, 'wall');
    barrier.x = x;
    if (isBottom) {
      barrier.y = y + passageHeight;
      barrier.height = Win.HEIGHT - (passageHeight + y);
    } else {
      barrier.y = 0;
      barrier.height = y;
    }
    barrier.width = BARRIER_WIDTH;
    barrier.body.immovable = true;
    barriers.add(barrier);
  },

  createPassage:function(x, y, height) {
    var passage = game.add.sprite(0.5, 0.5, 'passage');
    passage.x = x + BARRIER_WIDTH / 2;
    passage.y = y;
    passage.height = height;
    passage.width = 10;
    passage.body.immovable = true;
    passages.add(passage);
  }
};

