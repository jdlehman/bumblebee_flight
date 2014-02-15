var win = {
  width: 800,
  height: 600
};
var game = new Phaser.Game(win.width, win.height, Phaser.AUTO, 'Bumblebee_Flight', { preload: preload, create: create, update: update, render: render});

var bee;
var beeSize = 1;
var barriers;

function preload() {
  game.load.image('bee', 'assets/bumblebee.png');
  game.load.image('wall', 'assets/bumblebee_wall.png');
}

function create() {
  bee = game.add.sprite(60, game.world.centerY, 'bee');
  bee.anchor.setTo(0.5, 0.5);

  // barrier props
  var barrierConfig = {
    width: 80,
    height: 200,
    variance: 70
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
    shrinkBee();
  }
  else if(game.input.mousePointer.isUp) {
    expandBee();
  }

  bee.body.velocity.x = 170;

}

function render() {
}

function shrinkBee() {
  if (beeSize > .2) {
    beeSize = beeSize - .1;
    bee.scale.setTo(beeSize, beeSize);
  }
}

function expandBee() {
  if (beeSize < 1) {
    beeSize = beeSize + .1;
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
