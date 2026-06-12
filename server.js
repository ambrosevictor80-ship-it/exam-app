const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

console.log("🚀 Starting Exam Pro Backend...");

// ========================================
// FILE-BASED DATABASE (No bcrypt needed)
// ========================================
const USERS_FILE = path.join(__dirname, "users.json");
const HISTORY_FILE = path.join(__dirname, "history.json");

// Load existing data
let users = [];
let examHistory = [];

try {
    if (fs.existsSync(USERS_FILE)) {
        users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
        console.log(`✅ Loaded ${users.length} users`);
    }
} catch(e) { console.error("Error loading users:", e); }

try {
    if (fs.existsSync(HISTORY_FILE)) {
        examHistory = JSON.parse(fs.readFileSync(HISTORY_FILE, "utf8"));
        console.log(`✅ Loaded ${examHistory.length} exam records`);
    }
} catch(e) { console.error("Error loading history:", e); }

function saveData() {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(examHistory, null, 2));
        console.log("💾 Data saved");
    } catch(e) { console.error("Error saving data:", e); }
}

// ========================================
// SIMPLE QUESTIONS DATA
// ========================================
const questions = {
    mathematics: {
        easy: [
            { id: 1, question: "What is 5 + 3?", options: { A: "6", B: "7", C: "8", D: "9" }, answer: "C" },
            { id: 2, question: "What is 10 - 4?", options: { A: "5", B: "6", C: "7", D: "8" }, answer: "B" },
            { id: 3, question: "What is 4 × 3?", options: { A: "10", B: "11", C: "12", D: "13" }, answer: "C" }
        ],
        medium: [],
        hard: []
    },
    english: {
        easy: [
            { id: 1, question: "Choose the synonym of 'happy'", options: { A: "Sad", B: "Joyful", C: "Angry", D: "Tired" }, answer: "B" }
        ],
        medium: [],
        hard: []
    },
    physics: { easy: [], medium: [], hard: [] },
    biology: { easy: [], medium: [], hard: [] },
    chemistry: { easy: [], medium: [], hard: [] },
    computerscience: { easy: [], medium: [], hard: [] }
};

// ========================================
// HEALTH CHECK
// ========================================
app.get("/", (req, res) => {
    res.send("🎉 Exam Pro API is running! Use /api/test to verify.");
});

app.get("/api/test", (req, res) => {
    res.json({ 
        message: "Backend is working!", 
        users: users.length,
        exams: examHistory.length,
        status: "online"
    });
});

// ========================================
// SIGNUP (Simplified - No password hashing)
// ========================================
app.post("/api/signup", (req, res) => {
    console.log("📝 Signup request received");
    const { fullname, email, password } = req.body;
    
    if (!fullname || !email || !password) {
        return res.status(400).json({ error: "All fields required" });
    }
    
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: "Email already registered" });
    }
    
    try {
        const newUser = {
            id: users.length + 1,
            fullname,
            email,
            password: password, // Store as plain text for now (fix later)
            created_at: new Date().toISOString()
        };
        users.push(newUser);
        saveData();
        console.log("✅ User created:", email);
        res.json({ message: "Account created successfully!" });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Server error: " + error.message });
    }
});

// ========================================
// LOGIN (Simplified)
// ========================================
app.post("/api/login", (req, res) => {
    console.log("🔐 Login request received");
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
    }
    
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
    }
    
    if (user.password !== password) {
        return res.status(401).json({ error: "Invalid email or password" });
    }
    
    console.log("✅ User logged in:", email);
    res.json({
        message: "Login successful!",
        user: { fullname: user.fullname, email: user.email }
    });
});

// ========================================
// GET QUESTIONS
// ========================================
app.get("/questions/:subject/:level", (req, res) => {
    const { subject, level } = req.params;
    console.log(`📚 Questions requested: ${subject}/${level}`);
    
    if (!questions[subject] || !questions[subject][level]) {
        return res.json([]);
    }
    
    res.json(questions[subject][level]);
});

// ========================================
// SUBMIT EXAM
// ========================================
app.post("/submit", (req, res) => {
    console.log("📝 Submit exam request");
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

// ========================================
// GET HISTORY
// ========================================
app.get("/api/history/:email", (req, res) => {
    const history = examHistory.filter(h => h.user_email === req.params.email);
    res.json(history);
});

// ========================================
// ADMIN ENDPOINTS
// ========================================
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
    console.log(`\n✅ Server running on port ${PORT}`);
    console.log(`👥 ${users.length} users registered`);
    console.log(`📝 ${examHistory.length} exam records`);
    console.log(`\n🌐 Ready to accept requests!\n`);
});