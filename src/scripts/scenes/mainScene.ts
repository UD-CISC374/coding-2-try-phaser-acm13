//This file is where the bulk of the game functionality occurs

export default class MainScene extends Phaser.Scene {
  //Set all of the properties
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
    //Add the background as a tileSprite that will fill the whole screen
    this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "background");
    this.background.setOrigin(0,0);

    //Set up the score display as a black box with the word SCORE written
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

    //Create the ball and place it on the screen
    this.ball = this.physics.add.image(0,0,"ball");
    //Give the ball a horizontal and vertical speed
    this.ball.setVelocity(40,40);
    //Make it so that the ball must stay within the confines of the screen
    this.ball.setCollideWorldBounds(true);
    //Make it so that the ball bounces when it hits the edges of the screen
    this.ball.setBounce(1);

    //Create the broom and place it on the screen
    this.broom = this.physics.add.image(this.scale.width/2 - 50, this.scale.height/2 - 100, "broom");
    //Make it so that the broom must stay within the confines of the screen
    this.broom.setCollideWorldBounds(true);

    //Get user input through the keys
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    
    //Create the opponent and place it on the screen
    this.opponent = this.physics.add.image(this.scale.width/2, this.scale.height/2, "opponent");

    //Set up the broom and ball collision which will trigger a win
    this.physics.add.overlap(this.broom, this.ball, this.win, undefined, this);
    //Set up the opponent and ball collision which will trigger a loss
    this.physics.add.overlap(this.opponent, this.ball, this.lose, undefined, this);
  }

  moveOpponent(opponent, speed: integer){
    /*
    Moves the opponent image down the screen.

    Args:
      opponent: the opponent to be moved
      speed: the amount by which to move the opponent
    */
    opponent.y += speed;
    //If the opponent has reached the bottom of the screen, call the resetOpponentPos function
    if (opponent.y > this.scale.height){
      this.resetOpponentPos(opponent);
    }
  }

  resetOpponentPos(opponent){
    /*
    Puts the opponent image back at the top of the screen when it reaches the bottom.

    Args:
      opponent: the opponent image to be moved
    */
    opponent.y = 0;
    //Pick a random x coordinate for the opponent to move to
    let randomX:integer = Phaser.Math.Between(0, this.scale.width);
    opponent.x = randomX;
  }

  zeroPad(number: integer, size: integer){
    /*
    Add 0s to make a number the desired size

    Args:
      number: the number that needs to be changed
      size: the desired number of digits
    */
    let stringNumber:string = String(number);
    while(stringNumber.length < (size || 2)){
      stringNumber = "0" + stringNumber;
    }
    return stringNumber;
  }
  
  moveBroom(){
    /*
    Moves the broom image based on the key that is pressed.
    */
    //Set horizontal velocity to be negative when left key is pressed
    if(this.cursorKeys.left.isDown){
      this.broom.setVelocityX(-65);
    }
    //Set horizontal velocity to be positive when right key is pressed
    else if(this.cursorKeys.right.isDown){
      this.broom.setVelocityX(65);
    }
    //Have no horizontal velocity if left and right keys aren't pressed
    else{
      this.broom.setVelocityX(0);
    }

    //Set the vertical velocity to be negative when up key is pressed
    if(this.cursorKeys.up.isDown){
      this.broom.setVelocityY(-65);
    }
    //Set the vertical velocity to be positive when down key is pressed
    else if(this.cursorKeys.down.isDown){
      this.broom.setVelocityY(65);
    }
    //Have no vertical velocity if up and down keys aren't pressed
    else{
      this.broom.setVelocityY(0);
    }
  }

  win(broom, ball){
    /*
    Hides the ball, updates the score, shows the coin image, and shows a new ball.

    Args:
      broom: the broom that hit the ball
      ball: the ball that was hit
    */
    this.ball.disableBody(true,true); //Hide the current ball
    //Give a brief break before the new ball is created
    this.time.addEvent({
      delay: 300,
      callback: this.newBall,
      callbackScope: this,
      loop: false
    });

    //Update the score to reflect the win
    this.score += 15; 
    let scoreFormated:string = this.zeroPad(this.score, 6);
    this.scoreLabel.text = "SCORE " + scoreFormated;

    //Show the coin image to signify a win
    this.winImage = this.physics.add.image(this.scale.width/2, this.scale.height/2, "win");
    //Hide the coin image after a brief time
    this.time.addEvent({
      delay: 300,
      callback: this.hideWin,
      callbackScope: this,
      loop: false
    });
  }

  hideWin(){
    /*
    Hides the coin image.
    */
    this.winImage.disableBody(true,true);
  }

  lose(opponent, ball){
    /*
    Hides the ball, updates the score, shows the red X, and shows a new ball

    Args:
      opponent: the opponent that got the ball
      ball: the ball that was hit
    */
    this.ball.disableBody(true,true); //Hide the current ball
    //Give a brief break before the new ball is created
    this.time.addEvent({
      delay: 300,
      callback: this.newBall,
      callbackScope: this,
      loop: false
    });

    //Update the score to reflect the loss
    this.score -= 15;
    let scoreFormated:string = this.zeroPad(this.score, 6);
    this.scoreLabel.text = "SCORE " + scoreFormated;

    //Show the red X to signify a loss
    this.loseImage = this.physics.add.image(this.scale.width/2, this.scale.height/2, "lose");
    //Remove the red X after a brief time
    this.time.addEvent({
      delay: 300,
      callback: this.hideLose,
      callbackScope: this,
      loop: false
    });
  }

  hideLose(){
    /*
    Hides the red X
    */
    this.loseImage.disableBody(true,true);
  }

  newBall(){
    /*
    Creates a new ball at a random location.
    */
    let x:integer = Phaser.Math.Between(0,this.scale.width);
    let y:integer = Phaser.Math.Between(0,this.scale.height);
    this.ball.enableBody(true,x,y,true,true);
    this.ball.setVelocity(40,40);
  }

  update() {
    /*
    Moves the background, opponent, and broom.
    */
    this.background.tilePositionY -= 0.5; //Move the background continuously

    this.moveOpponent(this.opponent, 2); //Move the opponent down continuously

    this.moveBroom(); //Move the broom based on key presses
  }
}
