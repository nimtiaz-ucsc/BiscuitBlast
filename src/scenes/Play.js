class Play extends Phaser.Scene {
    constructor() {
        super("play");
    }

    preload() {
        this.load.image('sky', 'assets/sky.png'); 
        
        this.load.spritesheet('monster1', 'assets/monster1.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 3});
        this.load.spritesheet('monster2', 'assets/monster2.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 3});
        this.load.spritesheet('crumbling', 'assets/crumble.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 7});
        this.load.spritesheet('cookie', 'assets/cookie.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 1});
        this.load.spritesheet('clouds', 'assets/clouds.png', {frameWidth: 640, frameHeight: 480, startFrame: 0, endFrame: 1});

        this.load.audio('sfx_select', 'assets/select.wav');
        this.load.audio('sfx_explosion', 'assets/explosion.wav');
        this.load.audio('sfx_rocket', 'assets/rocket.wav');
    }


    create() {
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);    // p1 controls
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);    // p2 controls
        keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);

        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);    // gameover controls
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        
        this.anims.create({
            key: 'crumble',
            frames: this.anims.generateFrameNumbers('crumbling', {start: 0, end: 7, first: 0}),
            frameRate: 20
        });
        
        let crumbsAnim = this.anims.create({
            key: 'crumbs',
            frames: this.anims.generateFrameNumbers('cookie', {start: 0, end: 1, first: 0}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'float',
            frames: this.anims.generateFrameNumbers('clouds', {start: 0, end: 1, first: 0}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'munch1',
            frames: this.anims.generateFrameNumbers('monster1', {start: 0, end: 3, first: 0}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'munch2',
            frames: this.anims.generateFrameNumbers('monster2', {start: 0, end: 3, first: 0}),
            frameRate: 10,
            repeat: -1
        });

        this.add.tileSprite(0, 0, game.config.width, game.config.height, 'sky').setOrigin(0);
        this.clouds = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'clouds').setOrigin(0);
        this.cloudSprite = this.add.sprite(game.config.width, game.config.height, 'clouds').setVisible(false).play('float');

        this.p1Rocket = new Rocket(this, game.config.width/3, 431, 'monster1', 'munch1', keyA, keyD, keyW).setOrigin(0.5, 0);
        this.p2Rocket = new Rocket(this, 2 * game.config.width/3, 431, 'monster2', 'munch2', keyJ, keyL, keyI).setOrigin(0.5, 0);

        this.shipA = new Ship(this, game.config.width + borderUISize*6, borderUISize*4, 'cookie', 0, 30).setOrigin(0);
        this.shipB = new Ship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'cookie', 0, 20).setOrigin(0);
        this.shipC = new Ship(this, game.config.width, borderUISize*6 + borderPadding*4, 'cookie', 0, 10).setOrigin(0);

        this.shipA.anims.play('crumbs');
        crumbsAnim.frameRate = 4;
        this.shipB.anims.play('crumbs');
        crumbsAnim.frameRate = 6;
        this.shipC.anims.play('crumbs');

        //this.add.rectangle(0, borderUISize*2 + borderPadding, game.config.width, borderUISize*2, 0x68386C).setOrigin(0, 0.5);
        this.add.rectangle(0, borderUISize*2 + borderPadding, game.config.width, borderUISize*2.5, 0x68386C).setOrigin(0, 0.5).setAlpha(0.75); 

        this.p1Score = 0;
        this.p2Score = 0;

        this.p1Config = {
            fontFamily: 'Cursive',
            fontSize: '28px',
            backgroundColor: '#B55088',
            color: '#FDE7FF',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
                left: 5,
                right: 5
            },
            fixedWidth: 100
        }
        this.p2Config = {
            fontFamily: 'Cursive',
            fontSize: '28px',
            backgroundColor: '#FDE7FF',
            color: '#BC91C0',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
                left: 5,
                right: 5
            },
            fixedWidth: 100
        }        
        this.gameOverConfig = {
            fontFamily: 'Cursive',
            fontSize: '28px',
            color: '#FFCDDB',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
                left: game.config.width,
                right: game.config.width
            },
            fixedWidth: 0
        }

        this.p1ScoreText = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, this.p1Config);
        this.p2ScoreText = this.add.text(game.config.width - borderUISize*4 - borderPadding*2, borderUISize + borderPadding*2, this.p2Score, this.p2Config);
        this.centerText = this.add.text(game.config.width/2, borderUISize*2 + borderPadding, '', this.gameOverConfig).setOrigin(0.5);
        
        this.p1Config.fixedWidth = game.config.width;
        this.p2Config.fixedWidth = game.config.width;
        this.winnerConfig = this.gameOverConfig;
        this.gameOver = false;

        this.clock = this.time.delayedCall(game.settings.gameTimer/2, () => {
            this.shipA.moveSpeed *= 1.5;
            this.shipB.moveSpeed *= 1.5;
            this.shipC.moveSpeed *= 1.5;
            this.centerText.text = 'Speed Up!';
        }, null, this);

        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.centerText.text = this.winner();
            this.add.rectangle(game.config.width/2, game.config.height/2 + 32, game.config.width, borderUISize*5.5, 0x68386C).setOrigin(0.5).setAlpha(0.75);  
            this.add.text(game.config.width/2, game.config.height/2 + 32, 'PRESS\n[R] to Restart\nOR\n[ESC] for Menu', this.gameOverConfig).setOrigin(0.5);

            this.gameOver = true;
            this.p1Rocket.destroy();
            this.p2Rocket.destroy();
            this.shipA.destroy();
            this.shipB.destroy();
            this.shipC.destroy();
        }, null, this);
    }

    update() {
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sound.play('sfx_select');
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.sound.play('sfx_select');
            this.scene.start('menu');
        }
        this.clouds.setFrame(this.cloudSprite.frame.name);
        this.clouds.tilePositionX -= 1;

        if (!this.gameOver) {
            this.p1Rocket.update();
            this.p2Rocket.update();
            this.shipA.update();
            this.shipB.update();
            this.shipC.update();
        }

        this.hitUpdate(this.p1Rocket);
        this.hitUpdate(this.p2Rocket);
    }

    hitUpdate(rocket) {
        if (this.checkCollision(rocket, this.shipA)) {
            rocket.reset();
            this.shipExplode(rocket, this.shipA);

        } else if (this.checkCollision(rocket, this.shipB)) {
            rocket.reset();
            this.shipExplode(rocket, this.shipB);

        } else if (this.checkCollision(rocket, this.shipC)) {
            rocket.reset();
            this.shipExplode(rocket, this.shipC);
        }
    }

    checkCollision(rocket, ship) {
        return rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.y + rocket.height > ship.y;
    }

    shipExplode(rocket, ship) {
        ship.alpha = 0;
        let boom = this.add.sprite(ship.x, ship.y, 'crumbling').setOrigin(0);
        ship.reset();
        boom.anims.play('crumble');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        if (rocket === this.p1Rocket) {
            this.p1Score += ship.points;
            this.p1ScoreText.text = this.p1Score;   
        }
        if (rocket === this.p2Rocket) {
            this.p2Score += ship.points;
            this.p2ScoreText.text = this.p2Score;
        }
        this.sound.play('sfx_explosion');
    }

    winner() {
        if (this.p1Score > this.p2Score) {
            this.winnerConfig = this.p1Config;
            return "Player 1 Wins!";
        } else if (this.p2Score > this.p1Score) {
            this.winnerConfig = this.p2Config;
            return "Player 2 Wins!";
        } else {
            return "It's a Draw!"
        }
    }
}