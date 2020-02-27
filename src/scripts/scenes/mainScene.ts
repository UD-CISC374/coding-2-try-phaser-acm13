export default class MainScene extends Phaser.Scene {
  //set all of the properties
  private background;
  private ball;
  private broom;
  private opponent;
  private cursorKeys;
  private scoreLabel;
  private score;
  private winImage;
  private loseImage;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    //add the background
    this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "background");
    this.background.setOrigin(0,0);

    //set up the score box
    let graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(this.scale.width, 0);
    graphics.lineTo(this.scale.width, 20);
    graphics.lineTo(0, 20);
    graphics.lineTo(0, 0);
    graphics.closePath();
    graphics.fillPath();
    this.score = 0;
    this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE ", 16);

    //create the ball, give it speed and bounce
    this.ball = this.physics.add.image(0,0,"ball");
    this.ball.setVelocity(40,40);
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1);

    //create the broom
    this.broom = this.physics.add.image(this.scale.width/2 - 50, this.scale.height/2 - 100, "broom");
    this.broom.setCollideWorldBounds(true);

    //get user input through the keys
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    
    //create the opponent
    this.opponent = this.physics.add.image(this.scale.width/2, this.scale.height/2, "opponent");

    //set up the collisions for broom+ball and opponent+ball
    this.physics.add.overlap(this.broom, this.ball, this.win, undefined, this);
    this.physics.add.overlap(this.opponent, this.ball, this.lose, undefined, this);
  }

  //make the opponent move
  moveOpponent(opponent, speed){
    opponent.y += speed;
    if (opponent.y > this.scale.height){
      this.resetOpponentPos(opponent);
    }
  }

  //put the opponent back at the top of the screen when it reaches the bottom
  resetOpponentPos(opponent){
    opponent.y = 0;
    let randomX = Phaser.Math.Between(0, this.scale.width);
    opponent.x = randomX;
  }

  //add 0s to the front of the score
  zeroPad(number, size){
    let stringNumber = String(number);
    while(stringNumber.length < (size || 2)){
      stringNumber = "0" + stringNumber;
    }
    return stringNumber;
  }
  
  //allow keys to move the broom
  moveBroom(){
    if(this.cursorKeys.left.isDown){
      this.broom.setVelocityX(-75);
    }
    else if(this.cursorKeys.right.isDown){
      this.broom.setVelocityX(75);
    }
    else{
      this.broom.setVelocityX(0);
    }

    if(this.cursorKeys.up.isDown){
      this.broom.setVelocityY(-75);
    }
    else if(this.cursorKeys.down.isDown){
      this.broom.setVelocityY(75);
    }
    else{
      this.broom.setVelocityY(0);
    }
  }

  //hide the ball, update score, show coin, show new ball
  win(broom, ball){
    this.ball.disableBody(true,true);
    this.time.addEvent({
      delay: 100,
      callback: this.newBall,
      callbackScope: this,
      loop: false
    });
    this.score += 15;
    let scoreFormated = this.zeroPad(this.score, 6);
    this.scoreLabel.text = "SCORE " + scoreFormated;
    this.winImage = this.physics.add.image(this.scale.width/2, this.scale.height/2, "win");

    this.time.addEvent({
      delay: 100,
      callback: this.hideWin,
      callbackScope: this,
      loop: false
    });
  }

  //hide the coin after a brief time
  hideWin(){
    this.winImage.disableBody(true,true);
  }

  //hide the ball, update score, show X, show new ball
  lose(opponent, ball){
    this.ball.disableBody(true,true);
    this.time.addEvent({
      delay: 100,
      callback: this.newBall,
      callbackScope: this,
      loop: false
    });
    this.score -= 15;
    let scoreFormated = this.zeroPad(this.score, 6);
    this.scoreLabel.text = "SCORE " + scoreFormated;
    this.loseImage = this.physics.add.image(this.scale.width/2, this.scale.height/2, "lose");

    this.time.addEvent({
      delay: 100,
      callback: this.hideLose,
      callbackScope: this,
      loop: false
    });
  }

  //hide the X after a brief time
  hideLose(){
    this.loseImage.disableBody(true,true);
  }

  //create a new ball at a random location
  newBall(){
    let x = Phaser.Math.Between(0,this.scale.width);
    let y = Phaser.Math.Between(0,this.scale.height);
    this.ball.enableBody(true,x,y,true,true);
    this.ball.setVelocity(40,40);
  }

  //move the background, opponent, and broom
  update() {
    this.background.tilePositionY -= 0.5;

    this.moveOpponent(this.opponent, 2);

    this.moveBroom();
  }
}
