class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.config = GameConfig.player;

        this.sprite = scene.physics.add.sprite(x, y, "mc_idle");
        this.sprite.setScale(this.config.scale);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setSize(this.config.hitboxSize.width, this.config.hitboxSize.height);
        this.sprite.body.setOffset(this.config.hitboxOffsetRight.x, this.config.hitboxOffsetRight.y);

        // متغيرات حالة اللاعب
        this.health = this.config.maxHealth;
        this.stamina = this.config.maxStamina;
        this.isHurt = false;
        this.isAttacking = false;
        this.isMoving = false;
        this.isDefending = false;
        this.isJumping = false;
        this.isRunning = false;
        this.isRight = true;
        this.isDead = false;
        this.currentAnim = this.config.animations.idle;
        this.attackCounter = 0;
        this.lastAttackHitbox = null;
        this.attackHitTargets = [];
        this.isUltimateActive = false;
        this.currentUltimateType = null;
        this.runningSound = null;
        this.shieldEffect = null;

        this.sprite.on('animationcomplete', (animation) => {
            if (animation.key === this.config.animations.attack1 ||
                animation.key === this.config.animations.attack2 ||
                animation.key === this.config.animations.attack3 ||
                animation.key === this.config.animations.runAttack) {
                this.isAttacking = false;
                this.isUltimateActive = false;
                this.currentUltimateType = null;
            }
            if (animation.key === this.config.animations.dead) {
                this.sprite.disableBody(true, true);
            }
            if (animation.key === this.config.animations.hurt) {
                this.isHurt = false;
            }
        }, this);
    }
    //تحديث حالة اللاعب
    update(keys, isSlowMo, delta) {
        // لا تسمح بأي تحرك للاعب عند الموت
        if (this.isDead) {
            this.sprite.setVelocityX(0);
            return;
        }

        const speedMultiplier = isSlowMo ? GameConfig.slowMotion.speedBoost : 1;
        const jumpMultiplier = isSlowMo ? GameConfig.slowMotion.jumpBoost : 1;
        const currentSpeed = this.config.speed * speedMultiplier;
        const currentJump = this.config.jumpPower * jumpMultiplier;
        const currentDown = this.config.downSpeed * jumpMultiplier;

        // تجديد النشاط - لا يتجدد أثناء السلو موشن
        if (this.stamina < this.config.maxStamina && !isSlowMo && !keys.shift.isDown) {
            this.stamina = Math.min(this.config.maxStamina, this.stamina + (this.config.staminaRegenRate * delta / 1000));
        }

        // الهجوم
        if (keys.f.isDown && this.sprite.body.blocked.down && !this.isAttacking && this.stamina >= this.config.staminaCosts.attack) {
            this.performAttack();
            this.stamina -= this.config.staminaCosts.attack;
        }

        // القفز
        if (keys.w.isDown && this.sprite.body.blocked.down && this.stamina >= this.config.staminaCosts.jump) {
            this.sprite.setVelocityY(currentJump);
            this.isJumping = true;
            this.stamina -= this.config.staminaCosts.jump;
        }

        if (keys.s.isDown) {
            this.sprite.setVelocityY(currentDown);
        }

        // الحركة والاتجاه
        if (!keys.shift.isDown) {
            // الحركة العادية
            if (keys.d.isDown) {
                this.sprite.setVelocityX(currentSpeed);
                this.sprite.setFlipX(false);
                this.sprite.body.setOffset(this.config.hitboxOffsetRight.x, this.config.hitboxOffsetRight.y);
                this.isMoving = true;
                this.isRight = true;
            } else if (keys.a.isDown) {
                this.sprite.setVelocityX(-currentSpeed);
                this.sprite.setFlipX(true);
                this.sprite.body.setOffset(this.config.hitboxOffsetLeft.x, this.config.hitboxOffsetLeft.y);
                this.isMoving = true;
                this.isRight = false;
            } else {
                this.sprite.setVelocityX(0);
                this.isMoving = false;
            }
        } else {
            // الصد
            this.sprite.setVelocityX(0);
            this.isMoving = false;


            if (keys.d.isDown) {
                this.sprite.setFlipX(false);
                this.sprite.body.setOffset(this.config.hitboxOffsetRight.x, this.config.hitboxOffsetRight.y);
                this.isRight = true;
            } else if (keys.a.isDown) {
                this.sprite.setFlipX(true);
                this.sprite.body.setOffset(this.config.hitboxOffsetLeft.x, this.config.hitboxOffsetLeft.y);
                this.isRight = false;
            }
        }

        if (!this.isAttacking && !this.isHurt) {
            if (keys.shift.isDown) {
                // إيقاف صوت الجري عند الصد
                if (this.runningSound) {
                    this.runningSound.stop();
                    this.runningSound = null;
                }
                this.isRunning = false;

                // التحقق من وجود نشاط للصد
                const hasStamina = this.stamina >= this.config.staminaCosts.defend;

                if (hasStamina) {
                    this.playAnimation(this.config.animations.defend);
                    this.isDefending = true;
                    this.stamina -= this.config.staminaCosts.defend * delta / 1000;

                    // إنشاء تأثير الدرع
                    if (!this.shieldEffect) {
                        this.shieldEffect = this.scene.add.graphics();
                        this.shieldEffect.setDepth(999);
                    }

                    // رسم الدرع حول اللاعب
                    this.shieldEffect.clear();
                    this.shieldEffect.lineStyle(3, 0x00ffff, 0.6);
                    this.shieldEffect.fillStyle(0xffff44, 0.1);

                    const hitboxX = this.sprite.body.x + this.sprite.body.width / 2;
                    const hitboxY = this.sprite.body.y + this.sprite.body.height / 2;
                    const hitboxWidth = this.sprite.body.width;
                    const hitboxHeight = this.sprite.body.height;

                    this.shieldEffect.fillEllipse(hitboxX, hitboxY, hitboxWidth + 50, hitboxHeight);
                } else {
                    this.playAnimation(this.config.animations.idle);
                    this.isDefending = false;

                    if (this.shieldEffect) {
                        this.shieldEffect.destroy();
                        this.shieldEffect = null;
                    }
                }
            } else if (!this.sprite.body.blocked.down) {
                this.playAnimation(this.config.animations.jump);
                this.isJumping = true;
                if (this.runningSound) {
                    this.runningSound.stop();
                    this.runningSound = null;
                }
                this.isRunning = false;
            } else {
                this.isJumping = false;
                this.isDefending = false;

                // إزالة الدرع عند عدم الصد
                if (this.shieldEffect) {
                    this.shieldEffect.destroy();
                    this.shieldEffect = null;
                }

                if (this.isMoving) {
                    this.playAnimation(this.config.animations.run);
                    if (!this.isRunning) {
                        this.runningSound = this.scene.sound.add("running", {
                            volume: this.config.audioVol,
                            loop: true
                        });
                        this.runningSound.play();
                        this.isRunning = true;
                    }
                } else {
                    this.playAnimation(this.config.animations.idle);
                    if (this.runningSound) {
                        this.runningSound.stop();
                        this.runningSound = null;
                    }
                    this.isRunning = false;
                }
            }

        }
    }
    //تنفيذ الهجوم
    performAttack() {
        this.isAttacking = true;
        this.attackHitTargets = [];

        switch (this.attackCounter) {
            case 0:
                this.playAnimation(this.isMoving ? this.config.animations.runAttack : this.config.animations.attack1, true);
                this.scene.sound.play('slash1', { volume: this.config.audioVol });

                break;
            case 1:
                this.playAnimation(this.isMoving ? this.config.animations.runAttack : this.config.animations.attack2, true);
                this.scene.sound.play('slash2', { volume: this.config.audioVol });
                break;
            case 2:
                this.playAnimation(this.isMoving ? this.config.animations.runAttack : this.config.animations.attack3, true);
                this.scene.sound.play('slash3', { volume: this.config.audioVol });
                break;
        }
        this.attackCounter = (this.attackCounter + 1) % 3;

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
    }

    //تنفيذ التسلسل (Ultimate)
    performUltimate(type) {
        const config = GameConfig.ultimates[type];

        // التحقق من حالة اللاعب والنشاط
        if (this.isAttacking || this.isHurt) return false;
        if (this.stamina < config.staminaCost) return false;

        // خصم النشاط
        this.stamina -= config.staminaCost;

        this.isAttacking = true;
        this.isUltimateActive = true;
        this.currentUltimateType = type;
        this.attackHitTargets = [];

        this.playAnimation(config.animationKey, true);
        this.scene.sound.play('dash-slice', { volume: this.config.audioVol });

        // إنشاء حجم مربع الضرب على حسب التسلسل Ultimate
        const hitboxX = this.sprite.x + (this.sprite.flipX ? -config.hitboxOffsetX : config.hitboxOffsetX);
        const hitboxY = this.sprite.y + config.hitboxOffsetY;
        const attackHitbox = this.scene.add.zone(hitboxX, hitboxY,
            config.hitboxSize.width, config.hitboxSize.height);

        this.scene.physics.world.enable(attackHitbox);
        attackHitbox.body.setAllowGravity(false);
        attackHitbox.isUltimate = true;
        attackHitbox.ultimateType = type;
        this.lastAttackHitbox = attackHitbox;

        if(type == "light"){
            //نقل فوري للاعب عند نهاية التسلسل
            this.sprite.x = this.sprite.x +(this.sprite.flipX ? -config.hitboxSize.width : config.hitboxSize.width) ;
        } else if (type == "medium"){
                
        }


        this.scene.time.delayedCall(config.hitboxDuration, () => {
            attackHitbox.destroy();
            if (this.lastAttackHitbox === attackHitbox) {
                this.lastAttackHitbox = null;
            }
        });

        return true;
    }
    //دالة إرسال الضرر الي انتجه اللاعب
    getUltimateDamage() {
        if (this.lastAttackHitbox && this.lastAttackHitbox.isUltimate) {
            return GameConfig.ultimates[this.lastAttackHitbox.ultimateType].damage;
        }
        return GameConfig.player.attackDamage;
    }

    //تلقي الضرر
    takeDamage(monster,amount) {
        if (this.isHurt || this.health <= 0 || this.isDead) return;

        if (!this.isDefending)
            this.health -= amount;
        else
            this.health -= amount * this.config.defendAmount;

        this.isHurt = true;
        this.isAttacking = false;
        monster.hitLand = true;

        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
            this.isHurt = false;
            this.playAnimation(this.config.animations.dead);
        } else {
            // هز الكاميرا
            this.scene.myCam.shake(
                this.config.screenShake.duration,
                this.config.screenShake.intensity
            );
            this.sprite.setVelocityX(300);
            if (!this.isDefending){
                this.playAnimation(this.config.animations.hurt);
                const flash = this.scene.add.rectangle(
                    this.scene.myCam.width / 2,
                    this.scene.myCam.height / 2,
                    this.scene.myCam.width,
                    this.scene.myCam.height,
                    0xff0000,
                    0.5
                );
                flash.setScrollFactor(0);
                flash.setDepth(1000);

                this.scene.tweens.add({
                    targets: flash,
                    alpha: 0,
                    duration: 300,
                    ease: 'Power2',
                    onComplete: () => flash.destroy()
                });
            } else{
                this.scene.sound.play('defend', { volume: this.config.audioVol });
                this.stamina -= this.config.staminaCosts.defend;
            }
        }
            this.scene.time.delayedCall(500, () => this.isHurt = false);
    }

    //دالة مساعدة لبدء الإنمشين للاعب
    playAnimation(animKey, forceRestart = false) {
        if (this.currentAnim !== animKey || forceRestart) {
            this.sprite.play(animKey, true);
            this.currentAnim = animKey;
        }
    }
    // دوال مساعدة للحصول على إحداثيات الهجوم والتتبع والضرر للاعب
    getLastAttackHitbox() {
        return this.lastAttackHitbox && this.lastAttackHitbox.active ? this.lastAttackHitbox : null;
    }

    hasHitTarget(target) {
        return this.attackHitTargets.includes(target);
    }

    addHitTarget(target) {
        this.attackHitTargets.push(target);
    }
}
