
// global variables
let fireRateLevel = 0;
let bulletDamageLevel = 0;
let ammoLevel = 0;
let hasInfiniteAmmo = false;

const baseFireRate = 1000;
const minFireRate = 150;
const baseBulletDamage = 10;

function openShop(scene) {
    if (scene.shopContainer) {
        closeShop(scene);
    }

    const shopItems = [
        {
            name: "Faster Fire Rate",
      cost: () => Math.floor(5 * Math.pow(2.5, fireRateLevel)),
      action: function () {
        const currentCost = this.cost();
        const isGoldNotEnough = isGoldSuffecient(scene, currentCost);

        if (isGoldNotEnough) return notEnoughGoldPhrases(currentCost,gold);

        fireRateLevel++;
        let newFireRate = baseFireRate / (1 + fireRateLevel * 0.3);
        if (newFireRate < minFireRate) newFireRate = minFireRate;

        scene.fireRate = fireRate = Math.floor(newFireRate);
        let attacksPerSecond = (1000 / newFireRate).toFixed(1);
        updateStatsDisplay(scene);
        
        return `Fire Rate Level ${fireRateLevel}! (${attacksPerSecond} shots/sec)`;
            }
        },
        {
           name: "Extra Gold Gain",
      cost: () => 40,
      action: function () {
        const currentCost = this.cost();
        const isGoldNotEnough = isGoldSuffecient(scene, currentCost);
        if (isGoldNotEnough) return notEnoughGoldPhrases(currentCost,gold);

        scene.goldPerKill += 2;
        goldPerKill = scene.goldPerKill;
        return "Gold gain increased!";
            }
        },
       
        {
             name: "Tower Health",
      cost: () => 40,
      action: function () {
        const currentCost = this.cost();
        const isGoldNotEnough = isGoldSuffecient(scene, currentCost);
        if (isGoldNotEnough) return notEnoughGoldPhrases(currentCost,gold);

        maxTowerHealth += 20;
        towerHealth += 20;
        scene.healthText.setText(`Health: ${towerHealth}/${maxTowerHealth}`);
        updateStatsDisplay(scene);
        return "Tower health increased!"
            }
        },
        {
            name: "Bullet Damage",
      cost: () => Math.floor(9 + bulletDamageLevel * 17),
      action: function () {
        const currentCost = this.cost();
        const isGoldNotEnough = isGoldSuffecient(scene, currentCost);
        if (isGoldNotEnough) return notEnoughGoldPhrases(currentCost,gold);

        bulletDamageLevel++;
        let damageIncrease = 5 + bulletDamageLevel * 7.5;
        bulletDamage = baseBulletDamage + damageIncrease;
        scene.bulletDamage = bulletDamage;

        updateStatsDisplay(scene);
        return `Bullet Damage Level ${bulletDamageLevel}! (${bulletDamage} damage, +${damageIncrease})`;
                return `Need ${currentCost}G`;
            }
        },
        {
         name: "Ammo Pack (+2 Max)",
      cost: () => 30 + ammoLevel * 10,
      action: function () {
        if (hasInfiniteAmmo) return "You already have Infinite Ammo!";
        
                const currentCost = this.cost();
                const isGoldNotEnough = isGoldSuffecient(scene, currentCost)
                if (isGoldNotEnough) return notEnoughGoldPhrases(currentCost,gold);


                ammoLevel++;
                maxAmmo += 2;
                scene.maxAmmo = maxAmmo;
                scene.currentAmmo = maxAmmo;
                currentAmmo = maxAmmo;
                
                updateStatsDisplay(scene);
                return `Ammo Capacity Level ${ammoLevel}! (${maxAmmo} max ammo)`;
            }
        },
        {
            name: "Infinite Ammo",
            // the cost is '3' gold for testing purposes 
            cost: 3,
            action: function() {
                if (hasInfiniteAmmo) return "You already have Infinite Ammo!";
                
                if (gold >= this.cost) {
                    gold -= this.cost;
                    scene.gold = gold;
                    scene.goldText.setText(`Gold: ${gold}`);
                    
                    hasInfiniteAmmo = true;
                    maxAmmo = Infinity;
                    scene.maxAmmo = maxAmmo;
                    scene.currentAmmo = Infinity;
                    currentAmmo = Infinity;
                    
                    updateStatsDisplay(scene);
                    return "INFINITE AMMO UNLOCKED! No more reloading!";
                }
                return "Need 3G for Infinite Ammo!";
            }
        },
        {
            name: "Exit Shop",
            cost: 0,
            action: function() {
                closeShop(scene);
                return "";
            }
        }
    ];

    // shop UI
    scene.shopContainer = scene.add.container(400, 300);
    
    const bg = scene.add.rectangle(0, 0, 600, 600, 0x000000, 0.9);
    bg.setStrokeStyle(2, 0xffee00);
    scene.shopContainer.add(bg);
    
    const title = scene.add.text(0, -160, "SHOP", { 
        fontSize: "28px", 
        color: "#FFFF00",
        fontFamily: "Arial"
    }).setOrigin(0.5);
    scene.shopContainer.add(title);
    
    // Shop items
    scene.shopTexts = [];
    
    shopItems.forEach((item, i) => {
        const yPos = -100 + i * 40;
        const cost = typeof item.cost === 'function' ? item.cost() : item.cost;
        
        let color = "#aaaaaa";
        let fontSize = "18px";
        
        if (item.name === "Infinite Ammo") {
            color = hasInfiniteAmmo ? "#00ff00" : "#ffaa00";
            fontSize = "20px";
        } else if (hasInfiniteAmmo && item.name === "Ammo Pack (+2 Max)") {
            color = "#666666";
        }
        
        const itemText = scene.add.text(0, yPos, `${item.name} - ${cost}G`, {
            fontSize: fontSize,
            color: color,
            fontFamily: "Arial"
        }).setOrigin(0.5);
        
        scene.shopContainer.add(itemText);
        scene.shopTexts.push(itemText);
    });

    let selected = 0;
    highlightOption();

    scene.shopUpHandler = () => {
        selected = (selected - 1 + shopItems.length) % shopItems.length;
        highlightOption();
    };
    
    scene.shopDownHandler = () => {
        selected = (selected + 1) % shopItems.length;
        highlightOption();
    };
    
    scene.shopSpaceHandler = () => {
        const result = shopItems[selected].action();
        if (result) {
            showMessage(scene, result);
            refreshShopDisplay();
        }
    };

    scene.input.keyboard.on("keydown-UP", scene.shopUpHandler);
    scene.input.keyboard.on("keydown-DOWN", scene.shopDownHandler);
    scene.input.keyboard.on("keydown-SPACE", scene.shopSpaceHandler);

    function highlightOption() {
        scene.shopTexts.forEach((text, i) => {
            if (i === selected) {
                text.setColor("#00ff00");
                text.setFontSize(hasInfiniteAmmo && shopItems[i].name === "Infinite Ammo" ? "22px" : "20px");
            } else {
                const item = shopItems[i];
                if (item.name === "Infinite Ammo") {
                    text.setColor(hasInfiniteAmmo ? "#00ff00" : "#ffaa00");
                } else if (hasInfiniteAmmo && item.name === "Ammo Pack (+2 Max)") {
                    text.setColor("#666666");
                } else {
                    text.setColor("#aaaaaa");
                }
                text.setFontSize(hasInfiniteAmmo && item.name === "Infinite Ammo" ? "20px" : "18px");
            }
        });
    }

    function refreshShopDisplay() {
        shopItems.forEach((item, i) => {
            const cost = typeof item.cost === 'function' ? item.cost() : item.cost;
            scene.shopTexts[i].setText(`${item.name} - ${cost}G`);
            
            if (item.name === "Infinite Ammo") {
                scene.shopTexts[i].setColor(hasInfiniteAmmo ? "#00ff00" : "#ffaa00");
            } else if (hasInfiniteAmmo && item.name === "Ammo Pack (+2 Max)") {
                scene.shopTexts[i].setColor("#666666");
            }
        });
        highlightOption();
    }

    function showMessage(scene, msg) {
        if (msg) {
            if (scene.shopMessage) {
                scene.shopMessage.destroy();
            }
            scene.shopMessage = scene.add.text(0, 220, msg, {
                fontSize: "16px",
                color: "#ffff00",
                fontFamily: "Arial"
            }).setOrigin(0.5);
            scene.shopContainer.add(scene.shopMessage);
            
            scene.time.delayedCall(2000, () => {
                if (scene.shopMessage) {
                    scene.shopMessage.destroy();
                    scene.shopMessage = null;
                }
            });
        }
    }

    scene.shopData = {
        items: shopItems,
        selected: selected
    };
}

function closeShop(scene) {
    if (scene.shopUpHandler) {
        scene.input.keyboard.off("keydown-UP", scene.shopUpHandler);
        scene.input.keyboard.off("keydown-DOWN", scene.shopDownHandler);
        scene.input.keyboard.off("keydown-SPACE", scene.shopSpaceHandler);
    }
    
    if (scene.shopMessage) {
        scene.shopMessage.destroy();
        scene.shopMessage = null;
    }
    
    scene.shopUpHandler = null;
    scene.shopDownHandler = null;
    scene.shopSpaceHandler = null;
    scene.shopData = null;
    scene.shopTexts = null;
    
    if (scene.shopContainer) {
        scene.shopContainer.destroy();
        scene.shopContainer = null;
    }
    
    shopOpen = false;
    scene.wave++;
    wave = scene.wave;
    scene.time.delayedCall(100, () => {
        startWave.call(scene);
    });
}

function initializeShopStats(scene) {
    scene.fireRate = baseFireRate;
    fireRate = baseFireRate;
    scene.bulletDamage = baseBulletDamage;
    bulletDamage = baseBulletDamage;
    scene.maxAmmo = maxAmmo;
    scene.currentAmmo = currentAmmo;
}