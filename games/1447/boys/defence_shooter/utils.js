
//Check for the gold amount --> subtract the old value when buying items 
function isGoldSuffecient(scene, currentCost) {
  if (gold >= currentCost) {
    gold -= currentCost;
    scene.gold = gold;
    scene.goldText.setText(`Gold: ${gold}`);
    return false;
  }
  return true;
}

//Gold phrases

function notEnoughGoldPhrases(currentCost, currentGold) {
  const phrases = [
    `Not enough gold! Need ${currentCost}G`,
    "Not enough gold!",
    `Need ${currentCost}G`,
    `I require Gold ${currentCost}G`,
    `MORE GOLD ${currentCost}G`,
    `MOREEE  ${currentCost}G`,
    `You need ${currentCost - currentGold } you poor !!`,
  ];
  const randomNumber =Math.floor (Math.random() *  phrases.length );
  console.log(randomNumber);
  
  const phrase = phrases[randomNumber];

  return phrase;
}


//SoundTracks///

// let currentMusic = 0;

// const musicKeys = [
//   'MainST',
//   'MainST-NoteC',
//   'MainST-NoteD'
// ];

// function playRandomMusic(scene) {

//   if (!scene.sound.locked) {
//     if (currentMusic) {
//       currentMusic.stop();
//       currentMusic.destroy();
//     }

//     const key = Phaser.Utils.Array.GetRandom(musicKeys);

//     currentMusic = scene.sound.add(key, {
//       loop: true,
//       volume: 0.5
//     });

//     currentMusic.play();
//   }
// }

//Didn't work so we decided on playing one song on loop 
