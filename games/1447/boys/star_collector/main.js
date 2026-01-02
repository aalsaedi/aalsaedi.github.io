var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false // يمكن تغييرها إلى true لرؤية حدود الفيزياء
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var scoreText;
var gameOver = false;
var coinSfx;

function preload ()
{
    // تحميل الأصول
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
    // تحميل ملف الصوت (اختياري)
    this.load.audio('coin_sfx', ['assets/coin.wav']);
}

function create ()
{
    // 1. إضافة الخلفية (Scene)
    this.add.image(400, 300, 'sky');

    // 2. إنشاء مجموعة المنصات الثابتة (Physics)
    platforms = this.physics.add.staticGroup();

    // إضافة الأرضية (ground)
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    // إضافة منصات عائمة (ledges)
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // 3. إنشاء اللاعب (Spritesheets & Physics)
    player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    // تعريف الرسوم المتحركة للاعب (Spritesheets)
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // 4. إضافة المدخلات (Input)
    cursors = this.input.keyboard.createCursorKeys();

    // 5. إنشاء مجموعة النجوم (Stars - Objects manipulation)
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11, // 12 نجمة في المجموع
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {
        // إعطاء كل نجمة ارتداد عشوائي
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // 6. إنشاء مجموعة القنابل (Bombs - Objects manipulation)
    bombs = this.physics.add.group();

    // 7. إضافة نص النتيجة (Score)
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    // 8. إضافة ملف الصوت (Audio output)
    coinSfx = this.sound.add('coin_sfx');

    // 9. إعداد التصادمات والتفاعلات (Physics & Objects manipulation)
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update ()
{
    if (gameOver)
    {
        return;
    }

    // منطق حركة اللاعب (Input)
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);
        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}

// دالة تجميع النجوم (Objects manipulation & Audio output)
function collectStar (player, star)
{
    star.disableBody(true, true); // إخفاء النجمة وتعطيل الفيزياء

    // تشغيل صوت جمع العملة (Audio output)
    coinSfx.play();

    // تحديث النتيجة
    score += 10;
    scoreText.setText('Score: ' + score);

    // عند جمع كل النجوم، قم بإعادة تعيينها وإضافة قنبلة
    if (stars.countActive(true) === 0)
    {
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }
}

// دالة اصطدام اللاعب بالقنبلة (Objects manipulation)
function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000); // تلوين اللاعب باللون الأحمر
    player.anims.play('turn');

    gameOver = true;

    // إضافة نص "Game Over"
    this.add.text(400, 300, 'Game Over', { fontSize: '64px', fill: '#000' }).setOrigin(0.5);
}
