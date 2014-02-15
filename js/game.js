var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var bee;
var upKey;
var beeSize = 1;

function preload() {
  game.load.image('bee', 'assets/bumblebee.png');
}

function create() {
  bee = game.add.sprite(game.world.centerX, game.world.centerY, 'bee');
  bee.anchor.setTo(0.5, 0.5);

  upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
}

function update() {
  if (upKey.isDown) {
    shrinkBee();
  } else {
    expandBee();
  }
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

