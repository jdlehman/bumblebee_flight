var win = {
  width: 800,
  height: 600
};
var game = new Phaser.Game(win.width, win.height, Phaser.AUTO, 'Bumblebee_Flight', { preload: preload, create: create, update: update, render: render});

var bee;
var beeSize = 1;

function preload() {
  game.load.image('bee', 'assets/bumblebee.png');
}

function create() {
  bee = game.add.sprite(game.world.centerX, game.world.centerY, 'bee');
  bee.anchor.setTo(0.5, 0.5);

  // barrier props
  var barrier = {
    width: 80,
    height: 200,
    heightVar: 80,
    widthVar: 30
  };
  // group to hold barriers
  var barriers = game.add.group();
  //generage barriers
  for(var i = 200; i < win.width - barrier.width; i+= (barrier.width * 1.5 + Math.random() * barrier.width)) {
    var rand = Math.random();
    //create bottom barrier
    createBarrier(barriers, i, win.height, barrier.width, barrier.height, barrier.widthVar * rand, barrier.heightVar, true);
    //create corresponding top barrier
    createBarrier(barriers, i, 0, barrier.width, barrier.height, barrier.widthVar * rand, barrier.heightVar, false);
  }

}

function update() {
  if (game.input.mousePointer.isDown) {
    shrinkBee();
  } else if (game.input.mousePointer.isUp) {
    expandBee();
  }
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

function createBarrier(group, x, y, width, height, widthVariance, heightVariance, isBottom) {
  var barrier = game.add.sprite(0, 0, null);

  var newHeight = height + Math.random() * heightVariance;
  if(isBottom) {
    y = y - newHeight;
  }

  var wall = game.add.graphics(0, 0);
  wall.beginFill(0xFFFFFF);
  wall.lineStyle(10, 0xFFFFFF, 1);
  wall.drawRect(x, y, width + widthVariance, newHeight);
  wall.endFill();


  barrier.addChild(wall);
  group.add(barrier);
}
