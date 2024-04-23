import { controller } from './controller.js';
// import scene3 from './scene3.js';

let ground1, player, heart;
let monsterG, littlemonster1, littlemonster2, littlemonster3;
let camera;
let cursors;
let monsterDirection = 1; // 怪物的移動方向，1 表示向右移動，-1 表示向左移動

let playerHealth = 100;
let littlemonster1Health = 30;
let littlemonster2Health = 30;
let littlemonster3Health = 30;

let bullet;
let audioShoot, audiobg2;

export default class scene2 extends Phaser.Scene {
    constructor() {
        super({ key: controller.scenes.scene2 });
    }
    preload() {
        this.load.image('bg2', './images/bg/scene2.png');
        this.load.image('ground1', './images/bg/ground.PNG');
        this.load.image('ground2', './images/bg/ground.PNG');
        this.load.spritesheet('player', './images/character.png', {
            frameWidth: 100, frameHeight: 118
        });
        this.load.spritesheet('bullet', './images/bullet.png', { frameWidth: 17, frameHeight: 9});
        this.load.spritesheet('heart', './images/heart.png', { frameWidth: 17, frameHeight: 16});
        this.load.image('monsterG', './images/monster2.png');

        this.load.audio('audioStart', './audio/start.mp3');
        this.load.audio('audioShoot', './audio/shoot.mp3');
        this.load.audio('audiobg1', './audio/bg1_music.mp3');
        this.load.audio('audiobg2', './audio/bg2_music.mp3');
        this.load.audio('audiobg3', './audio/bg3_music.mp3');
    }
    create() {
        /*遊戲音效*/
        audiobg2 = this.sound.add('audiobg2', { volume: 0.3, loop: true });
        audiobg2.play();

        audioShoot = this.sound.add('audioShoot');
        /*遊戲邊界*/
        this.physics.world.setBounds(0, 0, 2000, 600);
        cursors = this.input.keyboard.createCursorKeys();

        /*創建背景*/
        this.add.tileSprite(900, 300, 2000,1000,'bg2').setScale(0.9);
        this.add.tileSprite(3000, 300, 1600,1000,'bg2').setScale(0.65);
        
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
        monsterG = this.physics.add.sprite(1800, 400, 'monsterG')
                                   .setCollideWorldBounds(true)
                                   .setGravityY(800)
                                   .setScale(0.2)
                                   .setSize(500, 1000);

        monsterG.health = 200;

        /* 創建小怪*/
        littlemonster1 = this.physics.add.sprite(600, 510, 'obstacle')
                                         .setCollideWorldBounds(true)
                                         .setScale(0.1)
                                         .setGravityY(800)
                                         .setSize(400, 480)
                                         .setVelocityX(-50);

        littlemonster2 = this.physics.add.sprite(850, 270, 'obstacle')
                                         .setCollideWorldBounds(true)
                                         .setScale(0.1)
                                         .setGravityY(800)
                                         .setSize(400, 480)
                                         .setVelocityX(-10);

        littlemonster3 = this.physics.add.sprite(950, 510, 'obstacle')
                                         .setCollideWorldBounds(true)
                                         .setScale(0.1)
                                         .setGravityY(800)
                                         .setSize(400, 480)
                                         .setVelocityX(-40);

        littlemonster1.health = 30;
        littlemonster2.health = 30;
        littlemonster3.health = 30;

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
        this.physics.add.collider(monsterG, ground1);
        this.physics.add.collider(player, monsterG,damagePlayer, null, this);
        //this.physics.add.collider(player, platforms);
        this.physics.add.collider(player, littlemonster1);
        this.physics.add.collider(player, littlemonster2);
        this.physics.add.collider(player, littlemonster3);
        this.physics.add.collider(littlemonster1, ground1);
        //this.physics.add.collider(littlemonster1, platforms);
        this.physics.add.collider(littlemonster2, ground1);
        //this.physics.add.collider(littlemonster2, platforms);
        this.physics.add.collider(littlemonster3, ground1);
        //this.physics.add.collider(littlemonster3, platforms);
        
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
            
              this.physics.add.collider(bullet, monsterG, damageMonsterG, null, this);
              this.physics.add.collider(bullet, littlemonster1, damageLittlemonster1, null, this);
              this.physics.add.collider(bullet, littlemonster2, damageLittlemonster2, null, this);
              this.physics.add.collider(bullet, littlemonster3, damageLittlemonster3, null, this); 
        }

        /*玩家扣血*/
        function damagePlayer(player, monsterR)
        {
            playerHealth -= 50;
            if(playerHealth <= 0)
            {
                this.scene.restart();
            }
        }

        /*魔王R扣血*/
        function damageMonsterG(bullet) {
            bullet.destroy();
            monsterG.health -= 10;
            if(monsterG.health <= 0)
            {
                monsterG.destroy();
                audiobg2.setMute(true);
                this.scene.start('scene3');
            }
            console.log(monsterG.health);
        }

        function damageLittlemonster1(bullet)
        {
            bullet.destroy();
            littlemonster1Health -= 10;
            if(littlemonster1Health <= 0)
            {
                littlemonster1.destroy();
            }
        }
        function damageLittlemonster2(bullet)
        {
            bullet.destroy();
            littlemonster2Health -= 10;
            if(littlemonster2Health<= 0)
            {
                littlemonster2.destroy();
            }
        }
        function damageLittlemonster3(bullet)
        {
            bullet.destroy();
            littlemonster3Health -= 10;
            if(littlemonster3Health <= 0)
            {
                littlemonster3.destroy();
            }
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
        const minX1 = 1300; // 怪物可以移動的最小 X 坐標值
        const maxX1 = 1600; // 怪物可以移動的最大 X 坐標值
        if (monsterG && monsterG.body) 
        {
            if (monsterG.x >= maxX1) 
            {
                 monsterDirection = -1; // 當怪物到達最大 X 坐標值時，改變移動方向為向左
            } 
            else if (monsterG.x <= minX1) 
            {
            monsterDirection = 1; // 當怪物到達最小 X 坐標值時，改變移動方向為向右
            }
            monsterG.setVelocityX(100 * monsterDirection); // 根據移動方向設置怪物的水平速度
        }

        /*小怪移動*/
        if(littlemonster1.x >= 500)
        {
            littlemonster1.setVelocityX(-50);
        }
        if(littlemonster2.x >= 500)
        {
            littlemonster2.setVelocityX(-10);
        }
        if(littlemonster3.x >= 600)
        {
            littlemonster3.setVelocityX(-40);
        }
        
    }
}