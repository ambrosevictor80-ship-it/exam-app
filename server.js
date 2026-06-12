const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

console.log("🚀 Starting backend...");

// ========================================
// DATABASE CONNECTION
// ========================================
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "exam_db",
    port: process.env.DB_PORT || 3306
});

db.connect((err) => {
    if (err) {
        console.error("❌ MySQL Error:", err.message);
        return;
    }
    console.log("✅ MySQL Connected!");
    createTables();
});

function createTables() {
    const tables = [
        `CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            fullname VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS exam_history (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_email VARCHAR(255) NOT NULL,
            subject VARCHAR(50) NOT NULL,
            level VARCHAR(20) NOT NULL,
            score INT NOT NULL,
            total INT NOT NULL,
            percent INT NOT NULL,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    ];
    
    tables.forEach(sql => {
        db.query(sql, (err) => {
            if (err) console.error("Table error:", err);
        });
    });
    
    console.log("✅ Tables ready");
    
    // Insert sample questions if tables are empty
    seedQuestions();
}

function seedQuestions() {
    // Check if mathematics table has data
    db.query("SELECT COUNT(*) as count FROM mathematics_questions", (err, result) => {
        if (err || result[0].count > 0) return;
        
        // Sample math easy questions
        const mathEasy = [
            { level: "easy", question: "What is 5 + 3?", opt_a: "6", opt_b: "7", opt_c: "8", opt_d: "9", answer: "C" },
            { level: "easy", question: "What is 10 - 4?", opt_a: "5", opt_b: "6", opt_c: "7", opt_d: "8", answer: "B" },
            { level: "easy", question: "What is 4 × 3?", opt_a: "10", opt_b: "11", opt_c: "12", opt_d: "13", answer: "C" }
        ];
        
        mathEasy.forEach(q => {
            db.query(`INSERT INTO mathematics_questions (level, question, option_a, option_b, option_c, option_d, answer) 
                      VALUES (?, ?, ?, ?, ?, ?, ?)`,
                      [q.level, q.question, q.opt_a, q.opt_b, q.opt_c, q.opt_d, q.answer]);
        });
        console.log("✅ Sample math questions added");
    });
}

// ========================================
// API ENDPOINTS
// ========================================

app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is working!" });
});

app.get("/", (req, res) => {
    res.send("🎉 Exam Pro API is running! Use /api/test to verify.");
});

// ========================================
// START SERVER
// ========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});