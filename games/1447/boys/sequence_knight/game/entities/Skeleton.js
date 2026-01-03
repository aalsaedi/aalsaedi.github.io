class Skeleton {
    constructor(scene, x, y) {
        this.scene = scene;
        this.config = GameConfig.skeleton;
        this.speed = this.config.speed;

        this.sprite = scene.physics.add.sprite(x, y, "skel_idle");
        this.sprite.setScale(this.config.scale);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setSize(this.config.hitboxSize.width, this.config.hitboxSize.height);
        this.sprite.body.setOffset(this.config.hitboxOffsetRight.x, this.config.hitboxOffsetRight.y);

        // متغيرات حالة العظمي
        this.health = this.config.maxHealth;
        this.isHurt = false;
        this.isAttacking = false;
        this.currentAnim = this.config.animations.idle;
        this.lastAttackHitbox = null;
        this.attackHitTargets = [];
        this.hitLand = false;
        this.isStunned = false;

        // دم العظمي
        this.healthBar = new EnemyHealthBar(scene, this);

        this.sprite.play(this.config.animations.idle);

        this.sprite.on('animationcomplete', (animation) => {
            if (animation.key === this.config.animations.dead) {
                this.sprite.body.destroy();
            }
            if (animation.key === this.config.animations.hurt) {
                this.isHurt = false;
            }
            if (animation.key === this.config.animations.attack) {
                this.isAttacking = false;


            }
        }, this);
    }

    update(target) {
        // تحديث دم العظمي
        if (this.healthBar) {
            this.healthBar.update();
        }

        if (!this.sprite.active || this.isHurt || this.isAttacking || this.isStunned) return;

        const distance = Phaser.Math.Distance.Between(target.x, 0, this.sprite.x, 0);

        // تحديد اتجاه العظمي
        if (target.x < this.sprite.x) {
            this.sprite.setFlipX(true);
            this.sprite.body.setOffset(this.config.hitboxOffsetLeft.x, this.config.hitboxOffsetLeft.y);
        } else {
            this.sprite.setFlipX(false);
            this.sprite.body.setOffset(this.config.hitboxOffsetRight.x, this.config.hitboxOffsetRight.y);
        }

        // النظام الهجومي للعظمي
        if (distance <= this.config.attackRange) {
            this.sprite.setVelocityX(0);
            if(this.scene.isSlowMo == false)
                this.performAttack();
        } else if (distance < this.config.detectionRange) {
            this.sprite.setVelocityX(target.x < this.sprite.x ? -this.speed : this.speed);
            this.sprite.play(this.config.animations.walk, true);
        } else {
            this.sprite.setVelocityX(0);
            this.sprite.play(this.config.animations.idle, true);
        }
    }

    //الهجوم
    performAttack() {
        this.isAttacking = true;
        this.attackHitTargets = [];
        this.sprite.play(this.config.animations.attack, true);
        if (!this.scene.player.isDefending){
            if (this.hitLand == true){
                this.scene.sound.play('mace-hit', { volume: this.config.audioVol });
                this.hitLand = false;
            } else {
                this.scene.sound.play('mace', { volume: this.config.audioVol });
            }
        }

        this.scene.time.delayedCall(this.config.attackDelay, () => {
            //للتأكد من ان العظمي حيء
            if (!this.sprite.active) return;

            const hitboxX = this.sprite.x + (this.sprite.flipX ? -this.config.attackHitboxOffsetX : this.config.attackHitboxOffsetX);
            const hitboxY = this.sprite.y + this.config.attackHitboxOffsetY;
            const attackHitbox = this.scene.add.zone(hitboxX, hitboxY, this.config.attackHitboxSize.width, this.config.attackHitboxSize.height);


            this.scene.physics.world.enable(attackHitbox);
            attackHitbox.body.setAllowGravity(false);
            this.lastAttackHitbox = attackHitbox;

            this.scene.time.delayedCall(this.config.attackHitboxDuration, () => {
                attackHitbox.destroy();
                if (this.lastAttackHitbox === attackHitbox) {
                    this.lastAttackHitbox = null;
                }
            });
        });
    }

    //دالة تلقي الضرر
    takeDamage(amount) {
        if (!this.sprite.active || this.isHurt) return;

        this.health -= amount;
        this.isHurt = true;
        this.isAttacking = false;
        this.sprite.setVelocityX(0);

        if (this.health <= 0) {
            this.sprite.play(this.config.animations.dead, true);
            this.scene.sound.play('slice', { volume: this.config.audioVol });
        } else {
            this.sprite.play(this.config.animations.hurt, true);
            this.scene.sound.play('slice', { volume: this.config.audioVol });
            if(this.scene.player.isRight == true){
                this.sprite.setVelocityX(300);
            } else {
                this.sprite.setVelocityX(-300);
            }
        }


    }
    
    // دوال مساعدة للحصول على إحداثيات الهجوم والتتبع والضرر للعظمي
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
