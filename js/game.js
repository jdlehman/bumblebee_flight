var Win = {
  WIDTH: 800,
  HEIGHT: 600
};

var World = {
  WIDTH: 25000,
  HEIGHT: Win.HEIGHT
};

var game = new Phaser.Game(Win.WIDTH, Win.HEIGHT, Phaser.AUTO, 'Bumblebee_Flight', { preload: preload, create: create, update: update, render: render});

var bee;
var beeSize = 1;
var Bee = {
  MAX_SIZE: 0.5,
  MIN_SIZE: 0.2,
  GROWTH_STEP: 0.01,
  Velocity: {
    UP: -250,
    DOWN: 150,
    RIGHT: 250
  }

};

var BARRIER_WIDTH = 60;
var BARRIER_FREQUENCY = 200;

var barriers;
var passages;
var score;
var scoreDisplay;
var song;

function preload() {
  game.load.image('bee', 'assets/bumblebee.png');
  game.load.image('wall', 'assets/bumblebee_spider.png');
  game.load.image('passage', 'assets/bumblebee_passage.png');
  game.load.audio('song', 'assets/fobb.mp3');
}

function create() {
  game.world.setBounds(0, 0, World.WIDTH, World.HEIGHT);
  game.stage.backgroundColor = "20DEFF";

  bee = game.add.sprite(60, game.world.centerY, 'bee');
  bee.anchor.setTo(0.5, 0.5);
  bee.scale.setTo(0.5, 0.5);


  game.camera.follow(bee);

  song = game.add.audio('song');
  song.play();

  // group to hold barriers
  barriers = game.add.group();
  passages = game.add.group();

  //generage barriers
  for(var i = Win.WIDTH / 3; i < World.WIDTH; i+= BARRIER_FREQUENCY) {
    passageHeight = Math.random() * 150 + 50;
    passageY = Math.random() * (Win.HEIGHT - passageHeight - 200) + 100;

    createBarrier(i, passageY, passageHeight, true)
    createPassage(i, passageY, passageHeight);
    createBarrier(i, passageY, passageHeight, false)
  }

  score = 0;
  var style = { font: "65px Arial", fill: "#ffffff", align: "center" };
  scoreDisplay = game.add.text(Win.WIDTH / 2, 0, score.toString(), style);  
  scoreDisplay.fixedToCamera = true;
}

function update() {
  game.physics.collide(bee, barriers, deathCollision);
  game.physics.overlap(bee, passages, increaseScore);

  if(game.input.mousePointer.isDown) {
    expandBee();
    bee.body.velocity.y = Bee.Velocity.UP;
  }
  else if(game.input.mousePointer.isUp) {
    shrinkBee();
    bee.body.velocity.y = Bee.Velocity.DOWN;
  }

  bee.body.velocity.x = Bee.Velocity.RIGHT;

}

function render() {
}

function deathCollision(bee, barrier) {
  bee.kill();
  song.stop();
}

function increaseScore(bee, passage) {
  score = score + 1;
  scoreDisplay.content = score.toString();
  passage.kill();
}

function shrinkBee() {
  if (beeSize > Bee.MIN_SIZE) {
    beeSize = beeSize - .1;
    bee.scale.setTo(beeSize, beeSize);
  }
}

function expandBee() {
  if (beeSize < Bee.MAX_SIZE) {
    beeSize = beeSize + Bee.GROWTH_STEP;
    bee.scale.setTo(beeSize, beeSize);
  }
}

function generateVariance(val) {
  return val * Math.random();
}

function createBarrier(x, y, passageHeight, isBottom) {

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
}

function createPassage(x, y, height) {
  var passage = game.add.sprite(0.5, 0.5, 'passage');
  passage.x = x;
  passage.y = y;
  passage.height = height;
  passage.width = 60;
  passage.body.immovable = true;
  passages.add(passage);    
}