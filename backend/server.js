const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
        return;
    }
    console.log('✅ Database connected!');
});

// =================== ROOT ROUTE ===================
app.get('/', (req, res) => {
    res.json({ 
        message: '🐾 Pet Adoption API is running!',
        status: 'active',
        endpoints: {
            register: 'POST /api/register',
            login: 'POST /api/login'
        }
    });
});

// =================== REGISTER ===================
app.post('/api/register', async (req, res) => {
    try {
        const { email, password, full_name, role } = req.body;

        // Check if user exists
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            
            if (result.length > 0) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user
            db.query(
                'INSERT INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)',
                [email, hashedPassword, full_name, role || 'adopter'],
                (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });

                    // Generate token
                    const token = jwt.sign(
                        { user_id: result.insertId, email: email },
                        process.env.JWT_SECRET,
                        { expiresIn: '7d' }
                    );

                    res.status(201).json({
                        message: 'Registration successful',
                        token: token,
                        user: {
                            user_id: result.insertId,
                            email: email,
                            full_name: full_name,
                            role: role || 'adopter'
                        }
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// =================== LOGIN ===================
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            
            if (result.length === 0) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const user = result[0];

            // Check password
            const isMatch = await bcrypt.compare(password, user.password);
            
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Generate token
            const token = jwt.sign(
                { user_id: user.user_id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.status(200).json({
                message: 'Login successful',
                token: token,
                user: {
                    user_id: user.user_id,
                    email: user.email,
                    full_name: user.full_name,
                    role: user.role
                }
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});