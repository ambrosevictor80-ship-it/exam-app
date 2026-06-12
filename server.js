const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// ========================================
// FILE-BASED DATABASE (No MySQL needed!)
// ========================================
const USERS_FILE = "users.json";
const HISTORY_FILE = "history.json";

// Load existing data
let users = [];
let examHistory = [];

if (fs.existsSync(USERS_FILE)) {
    try {
        users = JSON.parse(fs.readFileSync(USERS_FILE));
    } catch(e) { users = []; }
}
if (fs.existsSync(HISTORY_FILE)) {
    try {
        examHistory = JSON.parse(fs.readFileSync(HISTORY_FILE));
    } catch(e) { examHistory = []; }
}

function saveData() {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(examHistory, null, 2));
}

// ========================================
// QUESTIONS DATA
// ========================================
const questions = {
    mathematics: {
        easy: [
            { id: 1, question: "What is 5 + 3?", options: { A: "6", B: "7", C: "8", D: "9" }, answer: "C" },
            { id: 2, question: "What is 10 - 4?", options: { A: "5", B: "6", C: "7", D: "8" }, answer: "B" },
            { id: 3, question: "What is 4 × 3?", options: { A: "10", B: "11", C: "12", D: "13" }, answer: "C" },
            { id: 4, question: "What is 15 ÷ 3?", options: { A: "3", B: "4", C: "5", D: "6" }, answer: "C" },
            { id: 5, question: "What is 7 + 8?", options: { A: "13", B: "14", C: "15", D: "16" }, answer: "C" }
        ],
        medium: [
            { id: 1, question: "What is 15% of 200?", options: { A: "25", B: "30", C: "35", D: "40" }, answer: "B" },
            { id: 2, question: "Solve: 3x + 5 = 20", options: { A: "3", B: "4", C: "5", D: "6" }, answer: "C" }
        ],
        hard: [
            { id: 1, question: "What is the derivative of x²?", options: { A: "x", B: "2x", C: "x²", D: "2x²" }, answer: "B" }
        ]
    },
    english: {
        easy: [
            { id: 1, question: "Choose the synonym of 'happy'", options: { A: "Sad", B: "Joyful", C: "Angry", D: "Tired" }, answer: "B" },
            { id: 2, question: "What is the antonym of 'hot'?", options: { A: "Warm", B: "Cold", C: "Burning", D: "Fire" }, answer: "B" }
        ],
        medium: [
            { id: 1, question: "What is the synonym of 'difficult'?", options: { A: "Easy", B: "Simple", C: "Hard", D: "Light" }, answer: "C" }
        ],
        hard: []
    },
    physics: { easy: [], medium: [], hard: [] },
    biology: { easy: [], medium: [], hard: [] },
    chemistry: { easy: [], medium: [], hard: [] },
    computerscience: { easy: [], medium: [], hard: [] }
};

// ========================================
// API ENDPOINTS
// ========================================

app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is working!" });
});

app.get("/", (req, res) => {
    res.send("🎉 Exam Pro API is running! Use /api/test to verify.");
});

// SIGNUP
app.post("/api/signup", async (req, res) => {
    const { fullname, email, password } = req.body;
    
    if (!fullname || !email || !password) {
        return res.status(400).json({ error: "All fields required" });
    }
    
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: "Email already registered" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({
        id: users.length + 1,
        fullname,
        email,
        password: hashedPassword,
        created_at: new Date().toISOString()
    });
    saveData();
    res.json({ message: "Account created successfully!" });
});

// LOGIN
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
    }
    
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return res.status(401).json({ error: "Invalid email or password" });
    }
    
    res.json({
        message: "Login successful!",
        user: { fullname: user.fullname, email: user.email }
    });
});

// GET QUESTIONS
app.get("/questions/:subject/:level", (req, res) => {
    const { subject, level } = req.params;
    
    if (!questions[subject] || !questions[subject][level]) {
        return res.json([]);
    }
    
    res.json(questions[subject][level]);
});

// SUBMIT EXAM
app.post("/submit", (req, res) => {
    const { answers, subject, level, userEmail } = req.body;
    
    const subjectQuestions = questions[subject]?.[level] || [];
    
    let score = 0;
    answers.forEach(userAnswer => {
        const q = subjectQuestions.find(q => q.id === userAnswer.id);
        if (q && q.answer === userAnswer.answer) {
            score++;
        }
    });
    
    const total = subjectQuestions.length;
    const percent = total > 0 ? Math.round((score / total) * 100) : 0;
    
    if (userEmail) {
        examHistory.push({
            user_email: userEmail,
            subject,
            level,
            score,
            total,
            percent,
            date: new Date().toISOString()
        });
        saveData();
    }
    
    let message = percent >= 70 ? "Great job!" : "Keep practicing!";
    if (percent === 100) message = "Perfect score! Excellent!";
    
    res.json({ score, total, percent, message });
});

// GET HISTORY
app.get("/api/history/:email", (req, res) => {
    const history = examHistory.filter(h => h.user_email === req.params.email);
    res.json(history);
});

// ADMIN ENDPOINTS
app.get("/api/admin/users", (req, res) => {
    const safeUsers = users.map(u => ({
        id: u.id,
        fullname: u.fullname,
        email: u.email,
        created_at: u.created_at
    }));
    res.json(safeUsers);
});

app.get("/api/admin/history", (req, res) => {
    res.json(examHistory);
});

// ========================================
// START SERVER
// ========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📁 Data saved to JSON files`);
    console.log(`👥 ${users.length} users registered`);
});