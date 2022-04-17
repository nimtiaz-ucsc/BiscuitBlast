/***********************
Name: Nile Imtiaz
Project name: Biscuit Beast's Biscuit Blast
Start date: 4/12/2022
End date: 4/../2022
************************
Points breakdown:
- Redesign the game's artwork, UI, and sound to change its theme/aesthetic (to something other than sci-fi) (60)
- Implement a simultaneous two-player mode (30)
- Allow the player to control the Rocket after it's fired (5)
- Implement the speed increase that happens after 30 seconds in the original game (5)
***********************/

let config = {
    width: 640,
    height: 480,
    scene: [Menu, Play]
};

let keyW, keyA, keyD, keyI, keyJ, keyL, keyESC, keyR, keyLEFT, keyRIGHT;

let borderUISize = config.height / 15;
let borderPadding = borderUISize / 3;

let game = new Phaser.Game(config);