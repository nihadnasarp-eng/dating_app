import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// --- CONFIG ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.server') });

const app = express();
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));
app.use(express.json());
app.use(session({
    secret: 'tetra_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'dating_app'
});

// --- AUTH ---
app.post('/api/signup', async (req, res) => {
    const { username, password, gender } = req.body;
    try {
        const hashed = await bcrypt.hash(password, 10);
        const [result] = await db.execute(
            'INSERT INTO profiles (username, password, gender) VALUES (?, ?, ?)',
            [username, hashed, gender]
        );
        req.session.userId = result.insertId;
        res.json({ id: result.insertId, username, gender });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "Username taken or invalid data" });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const [users] = await db.execute('SELECT * FROM profiles WHERE username = ?', [username]);
    if (users.length && await bcrypt.compare(password, users[0].password)) {
        req.session.userId = users[0].id;
        res.json(users[0]);
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

app.get('/api/me', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: "Not logged in" });
    const [users] = await db.execute('SELECT * FROM profiles WHERE id = ?', [req.session.userId]);
    res.json(users[0]);
});

// --- DISCOVERY ---
app.get('/api/profiles', async (req, res) => {
    const { gender, id } = req.query;
    const [profiles] = await db.execute(
        'SELECT id, username, bio, img_url FROM profiles WHERE gender != ? AND id != ? LIMIT 20',
        [gender, id]
    );
    res.json(profiles);
});

app.post('/api/swipe', async (req, res) => {
    const { from_user, to_user, type } = req.body;
    if (type === 'like' && to_user) {
        await db.execute('INSERT INTO likes (from_user, to_user) VALUES (?, ?)', [from_user, to_user]);
    }
    await db.execute('UPDATE profiles SET profiles_viewed = profiles_viewed + 1 WHERE id = ?', [from_user]);
    res.json({ success: true });
});

app.get('/api/matches', async (req, res) => {
    const { userId } = req.query;
    const [matches] = await db.execute(`
        SELECT p.* FROM profiles p
        JOIN likes l ON p.id = l.to_user
        WHERE l.from_user = ?
    `, [userId]);
    res.json(matches);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 MySQL Backend live on port ${PORT}`));
