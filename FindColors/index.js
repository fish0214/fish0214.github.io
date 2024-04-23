import scene1 from './scene1.js';
import scene2 from './scene2.js';
import scene3 from './scene3.js';

let startbtn;
let audioStart, clickbtn;

const start = {
    key: 'start',

    preload() {
        this.load.image('startbg', './images/startpage.jpg');
        this.load.image('startbtn', './images/startbutton.png');

        this.load.audio('audioStart', './audio/start.mp3');
        this.load.audio('audioShoot', './audio/shoot.mp3');
        this.load.audio('audiobg1', './audio/bg1_music.mp3');
        this.load.audio('audiobg2', './audio/bg2_music.mp3');
        this.load.audio('audiobg3', './audio/bg3_music.mp3');
        this.load.audio('clickbtn', './audio/click.mp3');
    },

    create() {
        audioStart = this.sound.add('audioStart', {
            volume: 0.3, 
            loop: true });

        audioStart.play();
        this.add.image(config.width/2, config.height/2, 'startbg')
                .setScale(0.2);

        startbtn = this.physics.add.staticSprite(500, 300, 'startbtn')
                                    .setScale(0.6);
        startbtn.setInteractive();                            
        startbtn.on('pointerdown', () => {
            clickbtn = this.sound.add('clickbtn');
            clickbtn.play();
            audioStart.setMute(true);
            this.scene.start('scene1');
            
        });
    },
    update() {}
}
const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,

    backgroundColor:'#0000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y:800
            },
            debug: false
        }
    },

    scene: [start, scene1, scene2, scene3]
};

const game = new Phaser.Game(config);