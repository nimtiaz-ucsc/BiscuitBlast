class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('title', 'assets/title.png');

        this.load.spritesheet('clouds', 'assets/clouds.png', {frameWidth: 640, frameHeight: 480, startFrame: 0, endFrame: 1});

        this.load.audio('sfx_select', 'assets/select.wav');
    }
    create() {
        let menuConfig = {
            fontFamily: 'Cursive',
            fontSize: '20px',
            //backgroundColor: '#B55088',
            color: '#FDE7FF',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
                left: 5,
                right: 5
            },
            fixedWidth: 0
        }

        this.anims.create({
            key: 'float',
            frames: this.anims.generateFrameNumbers('clouds', {start: 0, end: 1, first: 0}),
            frameRate: 5,
            repeat: -1
        });

        this.add.sprite(0, 0, 'sky').setOrigin(0, 0);
        this.add.sprite(0, 0, 'clouds').setOrigin(0, 0).play('float');
        this.add.sprite(0, 0, 'title').setOrigin(0, 0);
        
        this.add.text(2.05 * game.config.width/3, game.config.height/2, 'P1 CONTROLS:\nMove: [A], [D]\nFire: [W]', menuConfig).setOrigin(0);
        this.add.text(2.05 * game.config.width/3, 3 * game.config.height/4, 'P2 CONTROLS:\nMove: [J], [L]\nFire: [I]', menuConfig).setOrigin(0);
        menuConfig.backgroundColor = '#B55088';
        menuConfig.align = 'center';
        menuConfig.fontSize = '24px';
        this.add.text(game.config.width/9, 1.75 * game.config.height/3 + borderUISize + borderPadding, 'PRESS\n[<-] for Novice\nOR\n[->] for Expert', menuConfig).setOrigin(0);

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 60000
            }
            this.sound.play('sfx_select');
            this.scene.start('play');
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            game.settings = {
                spaceshipSpeed: 4,
                gameTimer: 45000
            }
            this.sound.play('sfx_select');
            this.scene.start('play');
        }
    }
}