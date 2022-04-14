class Play extends Phaser.Scene {
    constructor() {
        super("play");
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('rocket', 'assets/rocket.png');
        
        this.load.spritesheet('explosion', 'assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('cookie', 'assets/cookie.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 1});
        this.load.spritesheet('clouds', 'assets/clouds.png', {frameWidth: 640, frameHeight: 480, startFrame: 0, endFrame: 1});

        this.load.audio('sfx_select', 'assets/select.wav');
        this.load.audio('sfx_explosion', 'assets/explosion.wav');
        this.load.audio('sfx_rocket', 'assets/rocket.wav');
    }


    create() {
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
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

        this.sky = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'sky').setOrigin(0, 0);
        this.clouds = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'clouds').setOrigin(0, 0);

        this.cloudSprite = this.add.sprite(this.sky.x, this.sky.y, 'clouds').setVisible(false).play('float');


        this.p1Rocket = new Rocket(this, game.config.width/2, 431, 'rocket').setOrigin(0.5, 0);

        this.shipA = new Ship(this, game.config.width + borderUISize*6, borderUISize*4, 'cookie', 0, 30).setOrigin(0, 0);
        this.shipB = new Ship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'cookie', 0, 20).setOrigin(0,0);
        this.shipC = new Ship(this, game.config.width, borderUISize*6 + borderPadding*4, 'cookie', 0, 10).setOrigin(0,0);

        this.shipA.anims.play('crumbs');
        crumbsAnim.frameRate = 4;
        this.shipB.anims.play('crumbs');
        crumbsAnim.frameRate = 6;
        this.shipC.anims.play('crumbs');

        //this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize*2, 0x00FF00).setOrigin(0, 0);

        //this.add.rectangle(0, 0, game.config.width, borderUISize, 0xB2B1B2).setOrigin(0, 0);
        //this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xB2B1B2).setOrigin(0, 0);
        //this.add.rectangle(0, 0, borderUISize, game.config.height, 0xB2B1B2).setOrigin(0, 0);
        //this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xB2B1B2).setOrigin(0, 0);    

        this.p1Score = 0;
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        this.gameOver = false;
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press [R] to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sound.play('sfx_select');
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.sound.play('sfx_select');
            this.scene.start('menu');
        }

        this.clouds.setFrame(this.cloudSprite.frame.name);
        this.clouds.tilePositionX -= 1;

        if (!this.gameOver) {
            this.p1Rocket.update();
            this.shipA.update();
            this.shipB.update();
            this.shipC.update();
        }

        if (this.checkCollision(this.p1Rocket, this.shipA)) {
            this.p1Rocket.reset();
            this.shipExplode(this.shipA);
        }
        if (this.checkCollision(this.p1Rocket, this.shipB)) {
            this.p1Rocket.reset();
            this.shipExplode(this.shipB);
        }
        if (this.checkCollision(this.p1Rocket, this.shipC)) {
            this.p1Rocket.reset();
            this.shipExplode(this.shipC);
        }

    }

    checkCollision(rocket, ship) {
        if (rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.y + rocket.height > ship.y) {
            return true;
        }
        return false;
    }

    shipExplode(ship) {
        ship.alpha = 0;
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }
}