var beeSize = 1;
var Bee = {
  MAX_SIZE: 0.5,
  MIN_SIZE: 0.2,
  GROWTH_STEP: 0.01,
  Velocity: {
    UP: -350,
    DOWN: 250
  }

};

var BARRIER_WIDTH = 80;
var BARRIER_FREQUENCY = 100;
var GAME_SPEED = -350;

Game.Play = function(game) {};

Game.Play.prototype = {

  create: function() {
    game.world.setBounds(0, 0, Win.WIDTH, Win.HEIGHT);
    // invisible sprite to mark the background tile locations (emulates world movement)
    this.paceSprite = game.add.sprite(Win.WIDTH / 3, game.world.centerY, null);
    this.paceSprite.body.velocity.x = -GAME_SPEED;

    this.background = game.add.tileSprite(0, 0, 1024, 1024, 'hills');
    this.background2 = game.add.tileSprite(0, 0, 1024, 1024, 'plants');

    this.bee = game.add.sprite(Win.WIDTH / 3, game.world.centerY, 'bee');
    this.bee.anchor.setTo(0.5, 0.5);
    this.bee.scale.setTo(Bee.MIN_SIZE, Bee.MIN_SIZE);
    this.bee.body.collideWorldBounds = true;

    this.song = game.add.audio('song');
    this.song.play('', 0, 1, true);

    // group to hold barriers
    this.barriers = game.add.group();
    this.passages = game.add.group();

    this.lastMidpoint = Win.HEIGHT / 2; // sets first location of passage midpoint
    this.barrierLoc = Win.WIDTH * 1.1; // sets first location of barrier

    // generate barriers
    //for(var xCoord = Win.WIDTH * 1.5; xCoord < 25000; xCoord += (BARRIER_FREQUENCY + this.generateVariance(BARRIER_FREQUENCY))) {
    //  this.generateFullBarrier(xCoord);
    //}

    // Place ground background in front of barriers
    this.background3 = game.add.tileSprite(0, 0, 1024, 1024, 'grass');

    // set background initial points
    this.background.x = this.bee.x - Win.WIDTH / 3;
    this.background2.x = this.bee.x - Win.WIDTH / 3;
    this.background3.x = this.bee.x - Win.WIDTH / 3;

    // Score instantiated last, to place it on top of all other layers
    this.score = 0;
    var style = { font: "40px Griffy", fill: "#ffffff", align: "center" };
    this.scoreDisplay = game.add.text(Win.WIDTH / 2, 0, this.score.toString(), style);
  },

  update: function() {
    game.physics.collide(this.bee, this.barriers, this.deathCollision, null, this);
    game.physics.overlap(this.bee, this.passages, this.increaseScore, null, this)

    if(this.bee.y > Win.HEIGHT - 30) {
      this.deathCollision.call(this);
    }

    if(game.input.mousePointer.isDown) {
      this.expandBee();
      this.bee.body.velocity.y = Bee.Velocity.UP;
    }
    else if(game.input.mousePointer.isUp) {
      this.shrinkBee();
      this.bee.body.velocity.y = Bee.Velocity.DOWN;
    }

    // background movement
    this.background.tilePosition.x =  -this.paceSprite.x * .025 % 1024;
    this.background2.tilePosition.x = -this.paceSprite.x * .5 % 1024;
    this.background3.tilePosition.x = -this.paceSprite.x % 1024;

    // bee movement
    this.bee.body.gravity.y = 500;

    // barrier generation
    if(this.paceSprite.x >= this.barrierLoc) {
      this.barrierLoc += (BARRIER_FREQUENCY + this.generateVariance(BARRIER_FREQUENCY * .8));
      this.generateFullBarrier(this.barrierLoc);
    };
  },

  deathCollision: function(bee, barrier, ctx) {
    this.bee.x = 0;
    this.bee.y = 0;
    this.bee.destroy();
    this.song.stop();
    game.state.states['Menu'].menuTxt = this.score.toString() + ' spiders avoided!';
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

  generateFullBarrier: function(xCoord) {
    var passageHeight = this.generateVariance(150) + 100;
    var sign = Math.round(Math.random(1)) ? -1 : 1;
    var delta = sign * this.generateVariance(180);
    var passageMidpoint = this.lastMidpoint + delta;

    // if point is imposible, vary in opposite direction
    if(passageMidpoint < (30 + passageHeight) || passageMidpoint > (Win.HEIGHT - passageHeight - 30)) {
      passageMidpoint = this.lastMidpoint - delta;
    }

    this.lastMidpoint = passageMidpoint;

    this.createTopBarrier(xCoord, passageMidpoint, passageHeight);
    this.createPassage(xCoord, passageMidpoint, passageHeight);
    this.createBottomBarrier(xCoord, passageMidpoint, passageHeight);
  },

  createTopBarrier: function(x, passageMid, passageHeight) {
    var barrier = game.add.sprite(0, 0, 'spider');
    barrier.animations.add('look');
    barrier.animations.play('look', 2, true);
    barrier.anchor.setTo(0,1);
    barrier.x = x;
    barrier.y = passageMid - passageHeight / 2.0;
    barrier.body.immovable = true;
    barrier.body.velocity.x = GAME_SPEED;
    this.barriers.add(barrier);
  },

  createBottomBarrier: function(x, passageMid, passageHeight) {
    var barrier = game.add.sprite(0, 0, 'barrierBottom');
    barrier.x = x;
    barrier.y = passageMid + passageHeight / 2.0;
    barrier.body.immovable = true;
    barrier.body.velocity.x = GAME_SPEED;
    this.barriers.add(barrier);
  },

  createPassage: function(x, passageMid, passageHeight) {
    var passage = game.add.sprite(0.5, 0.5);
    passage.x = x + BARRIER_WIDTH / 2;
    passage.y = passageMid - passageHeight / 2.0;
    passage.width = 10;
    passage.height = passageHeight;
    passage.body.immovable = true;
    passage.body.velocity.x = GAME_SPEED;
    this.passages.add(passage);
  }
};

