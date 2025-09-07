const user_id = Telegram.WebApp.initDataUnsafe.user.id;
const username = Telegram.WebApp.initDataUnsafe.user.first_name;

const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 400,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 800 }, debug: false }
  },
  scene: { preload, create, update }
};

let player, cursors, obstacles, score = 0, scoreText, gameOver = false;

const game = new Phaser.Game(config);

function preload() {
  this.load.image('player', 'https://i.imgur.com/6Iej2c3.png');
  this.load.image('obstacle', 'https://i.imgur.com/TK0Xb7y.png');
}

function create() {
  player = this.physics.add.sprite(100, 300, 'player').setScale(0.5);
  player.setCollideWorldBounds(true);

  obstacles = this.physics.add.group();
  this.time.addEvent({
    delay: 1500,
    callback: () => {
      const obs = obstacles.create(600, 350, 'obstacle').setScale(0.5);
      obs.setVelocityX(-200);
      obs.setImmovable();
      obs.body.allowGravity = false;
      obs.checkWorldBounds = true;
      obs.outOfBoundsKill = true;
    },
    loop: true
  });

  cursors = this.input.keyboard.createCursorKeys();
  scoreText = this.add.text(10, 10, 'Distancia: 0', { fontSize: '20px', fill: '#000' });

  this.physics.add.collider(player, obstacles, endGame, null, this);
}

function update() {
  if (gameOver) return;

  if (cursors.space.isDown || this.input.activePointer.isDown) {
    if (player.body.touching.down) player.setVelocityY(-400);
  }

  score += 1;
  scoreText.setText('Distancia: ' + score);

  obstacles.getChildren().forEach(obs => {
    if (obs.x < -50) obs.destroy();
  });
}

function endGame() {
  gameOver = true;
  fetch('https://saltar-al-top.onrender.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, username, distance: score })
  })
  .then(res => res.json())
  .then(data => {
    alert('¡Juego terminado! Tu distancia: ' + score + '\nTop 5:\n' +
      data.top5.map(p => `${p.username}: ${p.record}`).join('\n'));
  });
}
