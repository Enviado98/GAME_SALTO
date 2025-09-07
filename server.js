const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

const db = new sqlite3.Database('./database.db');

// Crear tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS players (
  user_id TEXT PRIMARY KEY,
  username TEXT,
  record INTEGER DEFAULT 0
)`);

// Recibir puntuación y actualizar ranking
app.post('/submit', (req, res) => {
  const { user_id, username, distance } = req.body;

  db.run(
    `INSERT INTO players (user_id, username, record) 
     VALUES (?, ?, ?) 
     ON CONFLICT(user_id) DO UPDATE SET record = MAX(record, ?)`,
    [user_id, username, distance, distance],
    () => {
      // Obtener top 5
      db.all(`SELECT username, record FROM players ORDER BY record DESC LIMIT 5`, [], (err, rows) => {
        res.json({ top5: rows });
      });
    }
  );
});

// Obtener ranking completo
app.get('/ranking', (req, res) => {
  db.all(`SELECT username, record FROM players ORDER BY record DESC`, [], (err, rows) => {
    res.json(rows);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
