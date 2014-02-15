var win = {
  width: 800,
  height: 600
};
var game = new Phaser.Game(win.width, win.height, Phaser.AUTO, 'Bumblebee_Flight', { preload: preload, create: create, update: update, render: render});

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
var barriers;

function preload() {
  game.load.image('bee', 'assets/bumblebee.png');
  game.load.image('wall', 'assets/bumblebee_wall.png');
  game.load.audio('song', 'assets/fobb.mp3');
}

function create() {
  bee = game.add.sprite(60, game.world.centerY, 'bee');
  bee.anchor.setTo(0.5, 0.5);
  bee.scale.setTo(0.5, 0.5);

  song = game.add.audio('song');
  song.play();

  // barrier props
  var barrierConfig = {
    width: 60,
    height: 200,
    variance: 100
  };
  // group to hold barriers
  barriers = game.add.group();
  //generage barriers
  for(var i = barrierConfig.width; i < win.width; i+= (barrierConfig.width * 1.5 + generateVariance(barrierConfig.width))) {
    //create bottom barrier
    createBarrier(barrierConfig, i, true);
    //create corresponding top barrier
    createBarrier(barrierConfig, i, false);
  }

}

function update() {
  game.physics.collide(bee, barriers);

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

function createBarrier(barrierConfig, xCoord, isBottom) {

  var randomHeight = barrierConfig.height + generateVariance(barrierConfig.variance);
  var yCoord = 0;
  if(isBottom) {
    yCoord = win.height - randomHeight;
  }

//  wall.drawRect(xCoord, yCoord, barrierConfig.width, randomHeight);

  var barrier = game.add.sprite(0, 0, 'wall');
  barrier.x = xCoord;
  barrier.y = yCoord;
  barrier.height = randomHeight;
  barrier.width = barrierConfig.width;
  barrier.body.immovable = true;
  barriers.add(barrier);
}
