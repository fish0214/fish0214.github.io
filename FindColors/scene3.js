import { controller } from './controller.js';

let ground1, player, heart;
let monsterB;
let camera;
let cursors;
let monsterDirection = 1; // 怪物的移動方向，1 表示向右移動，-1 表示向左移動
let bullet;
let playerHealth = 100;
let audioShoot, audiobg3, audioEnd;

export default class scene3 extends Phaser.Scene {
    constructor() {
        super({ key: controller.scenes.scene3 });
    }

    preload() {
        this.load.image('bg3', './images/bg/scene3.png');
        this.load.image('ground1', './images/bg/ground.PNG');
        this.load.image('ground2', './images/bg/ground.PNG');
        this.load.spritesheet('player', './images/character.png', {
            frameWidth: 100, frameHeight: 118
        });
        this.load.spritesheet('bullet', './images/bullet.png', { frameWidth: 17, frameHeight: 9});
        this.load.spritesheet('heart', './images/heart.png', { frameWidth: 17, frameHeight: 16});
        this.load.image('monsterB', './images/monster1.png');

        this.load.audio('audioStart', './audio/start.mp3');
        this.load.audio('audioShoot', './audio/shoot.mp3');
        this.load.audio('audiobg1', './audio/bg1_music.mp3');
        this.load.audio('audiobg2', './audio/bg2_music.mp3');
        this.load.audio('audiobg3', './audio/bg3_music.mp3');

        this.load.image('end', './images/end.png');
        this.load.audio('audioEnd', './audio/end.mp3');
    }
    create() {
        /*遊戲音效*/
        audiobg3 = this.sound.add('audiobg3', { volume: 0.3, loop: true });
        audiobg3.play();
        audioShoot = this.sound.add('audioShoot');
        audioEnd = this.sound.add('audioEnd', { volume:0.3, loop: true});

        /*遊戲邊界*/
        this.physics.world.setBounds(0, 0, 2000, 600);
        cursors = this.input.keyboard.createCursorKeys();

        /*創建背景*/
        this.add.tileSprite(900, 300, 2000,1000,'bg3').setScale(0.9);
        this.add.tileSprite(3000, 300, 1600,1000,'bg3').setScale(0.65);
        
        /*創建地板*/
        ground1 = this.physics.add.staticGroup();
        ground1.create(300, 580, 'ground1')
               .setSize(650, 50); 
        
        ground1.create(930, 580, 'ground1')
               .setSize(650, 50);
        
        ground1.create(1550, 580, 'ground1')
               .setSize(650, 50);

        this.physics.add.existing(ground1);

        /*創建玩家*/
        player = this.physics.add.sprite(200, 400, 'player')
                                 .setCollideWorldBounds(true)
                                 .setBounce(0.1)
                                 .setSize(100, 50);

        player.body.onWorldBounds =true;
        // heart = this.physics.add.sprite(10, 10, 'heart');

        heart = this.add.group();
        heart.create(100, 40, 'heart')
             .setScrollFactor(0)
             .setScale(2);

        heart.create(150, 40, 'heart')
             .setScrollFactor(0)
             .setScale(2);  
             
        heart.create(200, 40, 'heart')
             .setScrollFactor(0)
             .setScale(2);


        /*創建魔王R*/
        monsterB = this.physics.add.sprite(1800, 400, 'monsterB')
                                   .setCollideWorldBounds(true)
                                   .setGravityY(800)
                                   .setScale(0.2)
                                   .setSize(500, 900);

        monsterB.health = 200;


        /*玩家奔跑動畫*/
        player.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', {
                start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        player.anims.create({
            key: 'turn',
            frames: [{ key: 'player', frame: 4 }],
            frameRate: 10,
        });
        player.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });


 
        /*攝影機跟隨*/
        camera = this.cameras.main;
        camera.setBounds(0, 0, 1800, 600)
              .startFollow(player)
              .setViewport(0, 0, 1000, 600);

        /*碰撞偵測*/
        this.physics.add.collider(player, ground1);
        this.physics.add.collider(monsterB, ground1);
        this.physics.add.collider(player, monsterB);

        
        /*發射子彈*/
        this.input.keyboard.on('keydown-SPACE', shootBullets, this);
        
        function shootBullets() {
            bullet = this.physics.add.sprite(player.x, player.y, 'bullet');
            bullet.setVelocityX(500);
            bullet.body.setAllowGravity(false);
            bullet.setScale(2);
            audioShoot.play();

            bullet.anims.create({
                key: 'shoot',
                frames: this.anims.generateFrameNumbers('bullet', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
              });
              bullet.anims.play('shoot', true);
            
              this.physics.add.collider(bullet, monsterB, damagemonsterB, null, this);
        }

        /*魔王R扣血*/
        function damagemonsterB(bullet) {
            bullet.destroy();
            monsterB.health -= 10;
            if(monsterB.health <= 0)
            {
                monsterB.destroy();
                audiobg3.setMute(true);
                audioEnd.play();
                this.add.sprite(500, 350, 'end')
                        .setScale(0.4)
                        .setScrollFactor(0);
            }
            console.log(monsterB.health);
        }
        
    }
    update() {
                /*鍵盤控制*/
                if(cursors.left.isDown)
                {
                    player.setVelocityX(-200);
                    player.anims.play('left', true);
                }
                else if(cursors.right.isDown)
                {
                    player.setVelocityX(200);
                    player.anims.play('right', true);
                }
                else
                {
                    player.setVelocityX(0);
                    player.anims.play('turn');
                }
        
                if (cursors.up.isDown && player.body.onFloor()) 
                {
                    player.setVelocityY(-500);
                }
        
                /*魔王移動*/
                const minX1 = 800; // 怪物可以移動的最小 X 坐標值
                const maxX1 = 1000; // 怪物可以移動的最大 X 坐標值
                if (monsterB && monsterB.body) 
                {
                    if (monsterB.x >= maxX1) 
                    {
                         monsterDirection = -1; // 當怪物到達最大 X 坐標值時，改變移動方向為向左
                    } 
                    else if (monsterB.x <= minX1) 
                    {
                    monsterDirection = 1; // 當怪物到達最小 X 坐標值時，改變移動方向為向右
                    }
                    monsterB.setVelocityX(100 * monsterDirection); // 根據移動方向設置怪物的水平速度
                }
    }
}