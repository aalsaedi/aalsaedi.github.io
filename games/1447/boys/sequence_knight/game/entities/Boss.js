class Boss {
    constructor(scene, x, y) {
        this.scene = scene;
        this.config = GameConfig.boss;
        this.speed = this.config.speed;

        this.sprite = scene.physics.add.sprite(x, y, "boss_idle");
        this.sprite.setScale(this.config.scale);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setSize(this.config.hitboxSize.width, this.config.hitboxSize.height);
        this.sprite.body.setOffset(this.config.hitboxOffsetRight.x, this.config.hitboxOffsetRight.y);

        this.health = this.config.maxHealth;
        this.isHurt = false;
        this.isAttacking = false;
        this.isTaunting = false;
        this.isSpinning = false;
        this.isDashing = false;
        this.currentAnim = this.config.animations.idle;
        this.lastAttackHitbox = null;
        this.attackHitTargets = [];
        this.lastAttackTime = 0;
        this.currentAttackType = null;
        this.dashIdle = 0;
        this.canAttack = false;
        this.isStunned = false; 

        this.sprite.play(this.config.animations.idle);

        this.sprite.on('animationcomplete', (animation) => {
            if (animation.key === this.config.animations.dead) {
                this.sprite.body.destroy();
            }
            if (animation.key === this.config.animations.closeAttack) {
                this.isAttacking = false;
                this.currentAttackType = null;
            }
            if (animation.key === this.config.animations.spinAttack) {
                this.isAttacking = false;
                this.currentAttackType = null;
                this.sprite.x += (this.sprite.flipX ? -100 : 100);
                this.sprite.body.setSize(this.config.hitboxSize.width, this.config.hitboxSize.height);
                this.sprite.body.setOffset(this.config.hitboxOffsetRight.x, this.config.hitboxOffsetRight.y);
                this.isSpinning = false;
            }
            if (animation.key === this.config.animations.taunt) {
                this.isTaunting = false;
            }
            if (animation.key === this.config.animations.dash) {
                this.isDashing = false;
                this.sprite.x += (this.sprite.flipX ? -this.config.dashDistance : this.config.dashDistance);
            }
        }, this);
    }

    update(target) {
        //للتأكد من ان الشايب حيء
        if (!this.sprite.active || this.isHurt || this.health <= 0) return;
        if (this.scene.isSlowMo) return;

        if (this.isAttacking || this.isTaunting || this.isSpinning || this.isDashing || this.isStunned) return;
        
        const distance = Phaser.Math.Distance.Between(target.x, 0, this.sprite.x, 0);
        const currentTime = this.scene.time.now;
        
        this.canAttack = (currentTime - this.lastAttackTime) > (this.config.attackCooldown + this.dashIdle);
        this.dashIdle = this.config.dashIdle;

        // تغيير اتجاه الشايب
        if (target.x < this.sprite.x && !this.isAttacking) {
            this.sprite.setFlipX(true);
            this.sprite.body.setOffset(this.config.hitboxOffsetLeft.x, this.config.hitboxOffsetLeft.y);
        } else if (target.x > this.sprite.x && !this.isAttacking) {
            this.sprite.setFlipX(false);
            this.sprite.body.setOffset(this.config.hitboxOffsetRight.x, this.config.hitboxOffsetRight.y);
        }
        
        // النظام الهجومي للشايب
        if (distance <= this.config.closeRange && this.canAttack) { // المدى القريب ثلاث هجمات متتالية
            this.sprite.setVelocityX(0);
            this.performCloseAttack("sword");
            if (!this.scene.player.isDefending)
                this.scene.sound.play('slash2', { volume: this.config.audioVol });
            this.scene.time.delayedCall(500, () => {
                this.performCloseAttack("hammer");
                if (!this.scene.player.isDefending)
                this.scene.sound.play('ground', { volume: this.config.audioVol });
            });
            this.scene.time.delayedCall(1000, () => {
                this.performCloseAttack("swing");
                if (!this.scene.player.isDefending)
                this.scene.sound.play('air-slice', { volume: this.config.audioVol });
            });
        } else if (distance <= this.config.spinRange && this.canAttack) { // المدى المتوسط الدوران بالمطرقة
            this.sprite.setVelocityX(0);
            this.performSpinAttack();
            if (!this.scene.player.isDefending)
                this.scene.sound.play('spinning', { volume: this.config.audioVol });
        } else if (distance <= this.config.tauntRange) { // إستفزاز اللاعب عند الهروب احتمال حصوله %0.5 
            if (this.canAttack && !this.isTaunting && Math.random() < 0.005) { 
                this.sprite.setVelocityX(0);
                this.performTaunt();

            } else {// المشي نحو اللاعب
                
                this.sprite.setVelocityX(target.x < this.sprite.x ? -this.speed : this.speed);
                this.sprite.play(this.config.animations.walk, true);
            }
        } else {  // التنقل السريع إلى اللاعب عند الهرب من مدى الهجوم والإستفزاز

            this.canAttack = false;
            this.sprite.setVelocityX(0);
            this.performDash();

        }
    }
    // داالة الهجوم القريب
    performCloseAttack(weapon) {
        this.isAttacking = true;
        this.currentAttackType = 'close';
        this.attackHitTargets = [];
        this.lastAttackTime = this.scene.time.now;
        this.sprite.play(this.config.animations.closeAttack, true);

        this.scene.time.delayedCall(this.config.closeAttackDelay, () => {
            if (!this.sprite.active) return;
            var hitboxX;
            var hitboxY;
            var attackHitbox;
            if (weapon == "sword"){
                hitboxX = this.sprite.x + (this.sprite.flipX ? -this.config.closeAttackHitboxOffsetX : this.config.closeAttackHitboxOffsetX);
                hitboxY = this.sprite.y + this.config.closeAttackHitboxOffsetY;
                attackHitbox = this.scene.add.zone(hitboxX, hitboxY,
                    this.config.closeAttackHitboxSize.width,
                    this.config.closeAttackHitboxSize.height);
            }
            else if (weapon == "hammer"){
                hitboxX = this.sprite.x + (this.sprite.flipX ? -this.config.closeAttackHitboxOffsetXHammer : this.config.closeAttackHitboxOffsetXHammer);
                hitboxY = this.sprite.y + this.config.closeAttackHitboxOffsetYHammer;
                attackHitbox = this.scene.add.zone(hitboxX, hitboxY,
                    this.config.closeAttackHitboxSizeHammer.width,
                    this.config.closeAttackHitboxSizeHammer.height);
            }
            else  if (weapon == "swing"){
                hitboxX = this.sprite.x + (this.sprite.flipX ? -this.config.closeAttackHitboxOffsetXSwing: this.config.closeAttackHitboxOffsetXSwing);
                hitboxY = this.sprite.y + this.config.closeAttackHitboxOffsetYSwing;
                attackHitbox = this.scene.add.zone(hitboxX, hitboxY,
                    this.config.closeAttackHitboxSizeSwing.width,
                    this.config.closeAttackHitboxSizeSwing.height);
            }

            if (this.isHurt) return //توقف الشايب من إنشاء مربعات الضرب يوم ينضرب

            this.scene.physics.world.enable(attackHitbox);
            attackHitbox.body.setAllowGravity(false);
            attackHitbox.attackDamage = this.config.closeAttackDamage;
            if (weapon == "sword")
                attackHitbox.attackDamage = this.config.closeAttackDamage;
            else
                attackHitbox.attackDamage = this.config.closeAttackDamageHammer;

            this.lastAttackHitbox = attackHitbox;
            if (weapon == "swing") {
                this.scene.time.delayedCall(this.config.closeAttackDurationSwing, () => {
                    attackHitbox.destroy();
                    if (this.lastAttackHitbox === attackHitbox) {
                        this.lastAttackHitbox = null;
                    }
                });
            }
            this.scene.time.delayedCall(this.config.closeAttackDuration, () => {
                attackHitbox.destroy();
                if (this.lastAttackHitbox === attackHitbox) {
                    this.lastAttackHitbox = null;
                }
            });
        });
    }
    //دالة هجوم الدوران
    performSpinAttack() {
        this.isAttacking = true;
        this.isSpinning = true;
        this.currentAttackType = 'spin';
        this.attackHitTargets = [];
        this.lastAttackTime = this.scene.time.now;
        this.sprite.play(this.config.animations.spinAttack, true);


        this.scene.time.delayedCall(this.config.spinAttackDelay, () => {
            if (!this.sprite.active) return;
            var hitboxX;
            var hitboxY;
            var attackHitbox;
            hitboxX = this.sprite.x + (this.sprite.flipX ? -this.config.spinAttackHitboxOffsetX : this.config.spinAttackHitboxOffsetX);
            hitboxY = this.sprite.y + this.config.spinAttackHitboxOffsetY;
            attackHitbox = this.scene.add.zone(hitboxX, hitboxY,
                this.config.spinAttackHitboxSize.width,
                this.config.spinAttackHitboxSize.height);

            if (this.isHurt) return //توقف الشايب من إنشاء مربعات الضرب يوم ينضرب

            this.scene.physics.world.enable(attackHitbox);
            attackHitbox.body.setAllowGravity(false);
            attackHitbox.attackDamage = this.config.spinAttackDamage;
            this.lastAttackHitbox = attackHitbox;

            //زيادة حجم مربع الضرب الخاصة بالشايب علشان يسهل ضربه من قبل اللاعب
            this.sprite.body.setSize(this.config.hitboxSize.width +50, this.config.hitboxSize.height);
            this.sprite.body.setOffset(this.config.hitboxOffsetRight.x, this.config.hitboxOffsetRight.y);

            this.scene.time.delayedCall(this.config.spinAttackDuration, () => {
                attackHitbox.destroy();
                if (this.lastAttackHitbox === attackHitbox) {
                    this.lastAttackHitbox = null;
                }
            });
        });
    }
    //دالة الإستفزاز
    performTaunt() {
        this.isTaunting = true;
        this.sprite.play(this.config.animations.taunt, true);
        this.scene.sound.play('taunt', { volume: this.config.audioVol + 0.3 });
    }
    //دالة التنقل السريع
    performDash() {
        this.isDashing = true;
        this.dashIdle = this.config.dashIdle
        this.sprite.play(this.config.animations.dash, true);
        this.scene.sound.play('dash', { volume: this.config.audioVol });
    }
    //دالة تلقي الضرر
    takeDamage(amount) {
        if (!this.sprite.active || this.isHurt || this.health <= 0) return;

        this.health -= amount;
        this.isHurt = true;
        this.isAttacking = false;
        this.isTaunting = false;
        this.sprite.setVelocityX(0);
        if (!this.scene.player.isDefending)
            this.scene.sound.play('flesh-slice', { volume: this.config.audioVol });

        if (this.health <= 0) {
            this.sprite.play(this.config.animations.dead, true);
            return;
        } else {
            // وضع فلتر احمر على الشايب علشان يبين انه تضرر
            this.sprite.setTint(0xff0000);
            this.scene.time.delayedCall(200, () => {
                this.sprite.clearTint();
                this.isHurt = false;
            });
        }
        

        // دفع الشايب يوم ينضرب
        if (this.scene.player && this.scene.player.isRight) {
            this.sprite.setVelocityX(300);
        } else {
            this.sprite.setVelocityX(-300);
        }
    }
    // دوال مساعدة للحصول على إحداثيات الهجوم والتتبع والضرر للشايب
    getLastAttackHitbox() {
        return this.lastAttackHitbox && this.lastAttackHitbox.active ? this.lastAttackHitbox : null;
    }
    hasHitTarget(target) {
        return this.attackHitTargets.includes(target);
    }
    addHitTarget(target) {
        this.attackHitTargets.push(target);
    }

    // تطبيق تأثير الصدمة (Stun) مع رفع في الهواء
    applyStun(duration, liftPower) {
        if (!this.sprite.active || this.health <= 0) return;

        this.isStunned = true;
        this.isAttacking = false;
        this.isTaunting = false;
        this.isSpinning = false;
        this.isDashing = false;
        this.sprite.setVelocityX(0);

        // رفع العدو في الهواء
        if (liftPower) {
            this.sprite.setVelocityY(liftPower);
        }

        // إزالة تأثير الصدمة بعد المدة المحددة
        this.scene.time.delayedCall(duration, () => {
            this.isStunned = false;
        });
    }
}
