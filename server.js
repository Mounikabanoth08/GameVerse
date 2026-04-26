const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// 1. Middlewares
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// 2. SQLite Database Connection
const db = new sqlite3.Database('./College_portal_info.db', (err) => {
    if (err) console.error("❌ Database Connection Error:", err.message);
    else console.log("✅ Connected to College_portal_info.db");
});

// 3. LOGIN API
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.get(sql, [email, password], (err, user) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ success: false, error: "Database error" });
        } else if (user) {
           
            res.json({ 
                success: true, 
                user: { name: user.name, email: user.email } 
            });
        } else {
            
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    });
});

// 4. Page Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/auth', (req, res) => res.sendFile(path.join(__dirname, 'public/auth.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public/dashboard.html')));
app.get('/arena', (req, res) => res.sendFile(path.join(__dirname, 'public/arena.html')));

// 5. Start Server
app.listen(PORT, () => {
    console.log(`🚀 NEBULA Server Running: http://localhost:${PORT}`);
});