const user_id = Math.floor(Math.random()*1000000); // En Telegram Web App usar user_id real
const username = "Jugador"; // En Telegram Web App usar username real

const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 400,
    parent: 'game-container',
    physics: { default: 'arcade', arcade: { gravity: { y: 1000 } } },
    scene: { preload, create, update }
};

let player, cursors, obstacles, distance = 0, gameOver = false, distanceText;

const game = new Phaser.Game(config);

function preload() {
    this.load.image('player', 'https://i.imgur.com/4AiXzf8.png');
    this.load.image('obstacle', 'https://i.imgur.com/5PL9c5k.png');
}

function create() {
    player = this.physics.add.sprite(100, 300, 'player').setScale(0.5);
    player.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();
    obstacles = this.physics.add.group();

    this.time.addEvent({
        delay: 1500,
        callback: () => {
            const obstacle = obstacles.create(600, 350, 'obstacle').setScale(0.5);
            obstacle.setVelocityX(-200);
            obstacle.setImmovable(true);
        },
        loop: true
    });

    distanceText = this.add.text(10, 10, 'Distancia: 0', { font: '20px Arial', fill: '#000' });

    this.physics.add.collider(player, obstacles, hitObstacle, null, this);
}

function update() {
    if (gameOver) return;
    distance += 1;
    distanceText.setText(`Distancia: ${distance}`);

    if (cursors.space.isDown && player.body.touching.down) {
        player.setVelocityY(-500);
    }

    obstacles.children.iterate(ob => {
        if (ob.x < -50) ob.destroy();
    });
}

function hitObstacle() {
    gameOver = true;
    sendDistance();
    this.add.text(200, 200, '¡Game Over!', { font: '40px Arial', fill: '#f00' });
}

function sendDistance() {
    fetch('https://saltar-al-top.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, username, distance })
    })
    .then(res => res.json())
    .then(data => {
        alert(`Distancia: ${distance}\nTop 5:\n${data.top5.map(u => u.username + ': ' + u.distance).join('\n')}`);
        if (data.inTop5) alert('¡Estás en el Top 5!');
    });
}
