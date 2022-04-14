let config = {
    width: 640,
    height: 480,
    scene: [Menu, Play]
};

let keyW, keyA, keyD, keyI, keyJ, keyL, keyESC, keyR, keyLEFT, keyRIGHT;

let borderUISize = config.height / 15;
let borderPadding = borderUISize / 3;

let game = new Phaser.Game(config);