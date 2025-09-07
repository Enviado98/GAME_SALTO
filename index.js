const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const DB_FILE = 'db.json';
let db = { users: [] };

if (fs.existsSync(DB_FILE)) {
    db = JSON.parse(fs.readFileSync(DB_FILE));
}

function saveDB() {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

app.post('/submit', (req, res) => {
    const { user_id, username, distance } = req.body;
    let user = db.users.find(u => u.user_id === user_id);
    if (!user) {
        user = { user_id, username, distance };
        db.users.push(user);
    } else {
        if (distance > user.distance) user.distance = distance;
    }
    saveDB();

    const top5 = [...db.users].sort((a,b) => b.distance - a.distance).slice(0,5);
    const inTop5 = top5.find(u => u.user_id === user_id) ? true : false;

    res.json({ top5, inTop5 });
});

app.listen(PORT, () => console.log(`Backend corriendo en puerto ${PORT}`));