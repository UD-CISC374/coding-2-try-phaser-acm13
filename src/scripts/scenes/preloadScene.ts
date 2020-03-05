//This file is used to preload the images and start the main scene
export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    //Load all of the images
    this.load.image("background", "assets/background.jpg");
    this.load.image("broom", "assets/broom.png");
    this.load.image("ball", "assets/ball.png");
    this.load.image("opponent", "assets/opponent.png");
    this.load.image("win", "assets/win.png");
    this.load.image("lose", "assets/lose.png");
    this.load.bitmapFont("pixelFont", "assets/font/font.png", "assets/font/font.xml");
  }

  create() {
    this.scene.start('MainScene');

  }
}
