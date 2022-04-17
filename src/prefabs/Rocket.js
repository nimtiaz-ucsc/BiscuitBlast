class Rocket extends Phaser.GameObjects.Sprite {
    
    constructor(scene, x, y, texture, anim, inputLeft, inputRight, inputFire) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        this.isFiring = false;
        this.moveSpeed = 4;
        this.sfxRocket = scene.sound.add('sfx_swish');

        this.anim = anim;
        this.inputLeft = inputLeft;
        this.inputRight = inputRight;
        this.inputFire = inputFire;
    }

    update() {
        if ((!this.inputLeft.isDown && !this.inputRight.isDown) || (this.inputLeft.isDown && this.inputRight.isDown)) {
            this.angle = 0;
        }
        if (this.inputLeft.isDown && this.x >= borderUISize + this.width) {
            this.x -= this.moveSpeed;
            this.angle = -45;
        }
        if (this.inputRight.isDown && this.x <= game.config.width - borderUISize - this.width) {
            this.x += this.moveSpeed;
            this.angle = 45;
        }

        if (Phaser.Input.Keyboard.JustDown(this.inputFire) && !this.isFiring) {
            this.isFiring = true;
            this.anims.play(this.anim);
            this.sfxRocket.play();
        }
        if (this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }
        if (this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }

    reset() {
        this.isFiring = false;
        this.anims.restart();
        this.anims.stop();
        this.y = game.config.height - borderUISize * 2 - borderPadding;
    }
}