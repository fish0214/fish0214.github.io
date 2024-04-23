import { controller } from './controller.js';

let ground1, player, heart, platforms;
let monsterR, littlemonster1, littlemonster2, littlemonster3 ;
let camera;
let cursors;
let monsterDirection = 1; // 怪物的移動方向，1 表示向右移動，-1 表示向左移動

let playerHealth = 100;
let littlemonster1Health = 30;
let littlemonster2Health = 30;
let littlemonster3Health = 30;
let bullet;
let life = 3;

let audioShoot, audiobg1;

export default class scene1 extends Phaser.Scene {
    constructor() {
        super({ key: controller.scenes.scene1});
    }

    preload() {
        this.load.image('bg1', './images/bg/scene1.png');
        this.load.image('ground1', './images/bg/ground.PNG');
        this.load.image('ground2', './images/bg/ground.PNG');
        this.load.image('platform', './images/platform.png')
        this.load.spritesheet('player', './images/character.png', {
            frameWidth: 100, frameHeight: 118
        });
        this.load.spritesheet('bullet', './images/bullet.png', { frameWidth: 17, frameHeight: 9});
        this.load.spritesheet('heart', './images/heart.png', { frameWidth: 17, frameHeight: 16});
        this.load.image('monsterR', './images/monster3.png');
        this.load.image('littlemonster', './images/littlemonster.png');
        this.load.image('obstacle', './images/obstacle.png');

        this.load.audio('audioStart', './audio/start.mp3');
        this.load.audio('audioShoot', './audio/shoot.mp3');
        this.load.audio('audiobg1', './audio/bg1_music.mp3');
        this.load.audio('audiobg2', './audio/bg2_music.mp3');
        this.load.audio('audiobg3', './audio/bg3_music.mp3');
    }

    create() {
        /*遊戲音樂*/
        audiobg1 = this.sound.add('audiobg1', { volume: 0.3, loop: true });
        audiobg1.play();

        audioShoot = this.sound.add('audioShoot');
        /*遊戲邊界*/
        this.physics.world.setBounds(0, 0, 2000, 600);
        cursors = this.input.keyboard.createCursorKeys();

        /*創建背景*/
        this.add.tileSprite(500, 300, 1700,1000,'bg1').setScale(0.65);
        this.add.tileSprite(1400, 300, 1600,1000,'bg1').setScale(0.65);
        
        /*創建地板*/
        ground1 = this.physics.add.staticGroup();
        ground1.create(300, 580, 'ground1')
               .setSize(650, 50); 
        
        ground1.create(930, 580, 'ground1')
               .setSize(650, 50);
        
        ground1.create(1550, 580, 'ground1')
               .setSize(650, 50);

        this.physics.add.existing(ground1);

        /*創建platform*/
        platforms = this.physics.add.staticGroup();
        platforms.create(500, 350, 'platform')
                 .setOrigin(0.6)
                 .setScale(0.8)
                 .setSize(215, 65);

        this.physics.add.existing(platforms);
        /*創建玩家*/
        player = this.physics.add.sprite(200, 400, 'player')
                                 .setCollideWorldBounds(true)
                                 .setBounce(0.1)
                                 .setSize(100, 90);

        player.body.onWorldBounds =true;


        heart = this.add.group();
        heart.children.iterate( (child) => {
            child.setImmovable();
            child.anims.play('heart-anim');
        });
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
        monsterR = this.physics.add.sprite(1800, 100, 'monsterR')
                                   .setCollideWorldBounds(true)
                                   .setGravityY(800)
                                   .setScale(0.2)
                                   .setSize(500, 1300, -100, 0);

        monsterR.health = 200;

        /* 創建小怪*/
        littlemonster1 = this.physics.add.sprite(400, 510, 'littlemonster')
                                         .setCollideWorldBounds(true)
                                         .setScale(0.3)
                                         .setGravityY(800)
                                         .setSize(180, 180)
                                         .setVelocityX(-50);

        littlemonster2 = this.physics.add.sprite(450, 270, 'littlemonster')
                                         .setCollideWorldBounds(true)
                                         .setScale(0.3)
                                         .setGravityY(800)
                                         .setSize(180, 180)
                                         .setVelocityX(-10);

        littlemonster3 = this.physics.add.sprite(550, 510, 'littlemonster')
                                         .setCollideWorldBounds(true)
                                         .setScale(0.3)
                                         .setGravityY(800)
                                         .setSize(180, 180)
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

        this.anims.create({
            key: 'heart-anim',
            frames: this.anims.generateFrameNumbers('heart', { start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
        })
 
        /*攝影機跟隨*/
        camera = this.cameras.main;
        camera.setBounds(0, 0, 1800, 600)
              .startFollow(player)
              .setViewport(0, 0, 1000, 600);

        /*碰撞偵測*/
        this.physics.add.collider(player, ground1);
        this.physics.add.collider(monsterR, ground1);
        this.physics.add.collider(player, monsterR,damagePlayer, null, this);
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(player, littlemonster1);
        this.physics.add.collider(player, littlemonster2);
        this.physics.add.collider(player, littlemonster3);
        this.physics.add.collider(littlemonster1, ground1);
        this.physics.add.collider(littlemonster1, platforms);
        this.physics.add.collider(littlemonster2, ground1);
        this.physics.add.collider(littlemonster2, platforms);
        this.physics.add.collider(littlemonster3, ground1);
        this.physics.add.collider(littlemonster3, platforms);
        console.log(playerHealth);
        
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
            
              this.physics.add.collider(bullet, monsterR, damageMonsterR, null, this);
              this.physics.add.collider(bullet, littlemonster1, damageLittlemonster1, null, this);
              this.physics.add.collider(bullet, littlemonster2, damageLittlemonster2, null, this);
              this.physics.add.collider(bullet, littlemonster3, damageLittlemonster3, null, this);             

        }
        

        /*魔王R扣血*/
        function damagePlayer(player, monsterR)
        {
            playerHealth -= 50;
            if(playerHealth <= 0)
            {
                this.scene.restart();
            }
        }
        function damageMonsterR(bullet) {
            bullet.destroy();
            monsterR.health -= 10;
            if(monsterR.health <= 0)
            {
                monsterR.destroy();
                audiobg1.setMute(true);
                this.scene.start('scene2');
            }
            console.log(monsterR.health);
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
            player.setVelocityY(-650);
        }


        
        /*魔王移動*/
        const minX1 = 1300; // 怪物可以移動的最小 X 坐標值
        const maxX1 = 1600; // 怪物可以移動的最大 X 坐標值
        if (monsterR && monsterR.body) 
        {
            if (monsterR.x >= maxX1) 
            {
                 monsterDirection = -1; // 當怪物到達最大 X 坐標值時，改變移動方向為向左
            } 
            else if (monsterR.x <= minX1) 
            {
            monsterDirection = 1; // 當怪物到達最小 X 坐標值時，改變移動方向為向右
            }
            monsterR.setVelocityX(100 * monsterDirection); // 根據移動方向設置怪物的水平速度
        }

        /*小怪移動*/
        if(littlemonster1.x >= 500)
        {
            littlemonster1.setVelocityX(-50);
        }
        if(littlemonster2.x >= 500)
        {
            littlemonster2.setVelocityX(-20);
        }
        if(littlemonster3.x >= 600)
        {
            littlemonster3.setVelocityX(-10);
        }

        
    }
}