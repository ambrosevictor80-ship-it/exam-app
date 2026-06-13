const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

console.log("🚀 Starting Exam Pro Backend...");

// ========================================
// FILE-BASED DATABASE
// ========================================
const USERS_FILE = path.join(__dirname, "users.json");
const HISTORY_FILE = path.join(__dirname, "history.json");

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
// FULL QUESTIONS DATA (25 per level)
// ========================================

// MATHEMATICS - 25 Easy Questions
const mathEasy = [];
for (let i = 1; i <= 25; i++) {
    mathEasy.push({
        id: i,
        question: `Mathematics Easy Question ${i}: What is ${i} + ${i*2}?`,
        options: { A: `${i*2}`, B: `${i*3}`, C: `${i*3 + 1}`, D: `${i*3 + 2}` },
        answer: "B"
    });
}

// MATHEMATICS - 25 Medium Questions
const mathMedium = [];
for (let i = 1; i <= 25; i++) {
    mathMedium.push({
        id: i,
        question: `Mathematics Medium Question ${i}: Solve for x: ${i}x + 5 = ${i*10}`,
        options: { A: `${i}`, B: `${i+1}`, C: `${i+2}`, D: `${i+3}` },
        answer: "A"
    });
}

// MATHEMATICS - 25 Hard Questions
const mathHard = [];
for (let i = 1; i <= 25; i++) {
    mathHard.push({
        id: i,
        question: `Mathematics Hard Question ${i}: What is the derivative of x^${i}?`,
        options: { A: `${i}x^${i-1}`, B: `${i-1}x^${i}`, C: `${i+1}x^${i}`, D: `${i}x^${i+1}` },
        answer: "A"
    });
}

// ENGLISH - 25 Easy Questions
const engEasy = [];
for (let i = 1; i <= 25; i++) {
    engEasy.push({
        id: i,
        question: `English Easy Question ${i}: What is the synonym of 'good'?`,
        options: { A: "Bad", B: "Excellent", C: "Poor", D: "Weak" },
        answer: "B"
    });
}

// ENGLISH - 25 Medium Questions
const engMedium = [];
for (let i = 1; i <= 25; i++) {
    engMedium.push({
        id: i,
        question: `English Medium Question ${i}: Choose the correct spelling`,
        options: { A: "Recieve", B: "Receive", C: "Reeceive", D: "Receeve" },
        answer: "B"
    });
}

// ENGLISH - 25 Hard Questions
const engHard = [];
for (let i = 1; i <= 25; i++) {
    engHard.push({
        id: i,
        question: `English Hard Question ${i}: What does 'ubiquitous' mean?`,
        options: { A: "Rare", B: "Everywhere", C: "Hidden", D: "Scarce" },
        answer: "B"
    });
}

// PHYSICS - 25 Easy Questions
const physEasy = [];
for (let i = 1; i <= 25; i++) {
    physEasy.push({
        id: i,
        question: `Physics Easy Question ${i}: What is the unit of force?`,
        options: { A: "Joule", B: "Watt", C: "Newton", D: "Pascal" },
        answer: "C"
    });
}

// PHYSICS - 25 Medium Questions
const physMedium = [];
for (let i = 1; i <= 25; i++) {
    physMedium.push({
        id: i,
        question: `Physics Medium Question ${i}: What is Ohm's law formula?`,
        options: { A: "V = I/R", B: "V = I × R", C: "V = R/I", D: "V = I + R" },
        answer: "B"
    });
}

// PHYSICS - 25 Hard Questions
const physHard = [];
for (let i = 1; i <= 25; i++) {
    physHard.push({
        id: i,
        question: `Physics Hard Question ${i}: What is the value of Planck's constant?`,
        options: { A: "6.626 × 10⁻³⁴", B: "6.626 × 10⁻³²", C: "6.626 × 10⁻³⁶", D: "6.626 × 10⁻³⁸" },
        answer: "A"
    });
}

// BIOLOGY - 25 Easy Questions
const bioEasy = [];
for (let i = 1; i <= 25; i++) {
    bioEasy.push({
        id: i,
        question: `Biology Easy Question ${i}: What is the basic unit of life?`,
        options: { A: "Atom", B: "Molecule", C: "Cell", D: "Tissue" },
        answer: "C"
    });
}

// BIOLOGY - 25 Medium Questions
const bioMedium = [];
for (let i = 1; i <= 25; i++) {
    bioMedium.push({
        id: i,
        question: `Biology Medium Question ${i}: What is the powerhouse of the cell?`,
        options: { A: "Nucleus", B: "Mitochondria", C: "Ribosome", D: "Golgi" },
        answer: "B"
    });
}

// BIOLOGY - 25 Hard Questions
const bioHard = [];
for (let i = 1; i <= 25; i++) {
    bioHard.push({
        id: i,
        question: `Biology Hard Question ${i}: What is the function of DNA polymerase?`,
        options: { A: "DNA replication", B: "RNA synthesis", C: "Protein synthesis", D: "Lipid synthesis" },
        answer: "A"
    });
}

// CHEMISTRY - 25 Easy Questions
const chemEasy = [];
for (let i = 1; i <= 25; i++) {
    chemEasy.push({
        id: i,
        question: `Chemistry Easy Question ${i}: What is the chemical symbol for water?`,
        options: { A: "CO₂", B: "O₂", C: "H₂O", D: "NaCl" },
        answer: "C"
    });
}

// CHEMISTRY - 25 Medium Questions
const chemMedium = [];
for (let i = 1; i <= 25; i++) {
    chemMedium.push({
        id: i,
        question: `Chemistry Medium Question ${i}: What is the formula for sulfuric acid?`,
        options: { A: "H₂SO₄", B: "H₂SO₃", C: "HNO₃", D: "HCl" },
        answer: "A"
    });
}

// CHEMISTRY - 25 Hard Questions
const chemHard = [];
for (let i = 1; i <= 25; i++) {
    chemHard.push({
        id: i,
        question: `Chemistry Hard Question ${i}: What is the hybridization of carbon in methane?`,
        options: { A: "sp", B: "sp²", C: "sp³", D: "dsp²" },
        answer: "C"
    });
}

// COMPUTER SCIENCE - 25 Easy Questions
const csEasy = [];
for (let i = 1; i <= 25; i++) {
    csEasy.push({
        id: i,
        question: `Computer Science Easy Question ${i}: What does CPU stand for?`,
        options: { A: "Central Processing Unit", B: "Computer Personal Unit", C: "Central Program Utility", D: "Core Processing Unit" },
        answer: "A"
    });
}

// COMPUTER SCIENCE - 25 Medium Questions
const csMedium = [];
for (let i = 1; i <= 25; i++) {
    csMedium.push({
        id: i,
        question: `Computer Science Medium Question ${i}: What does SQL stand for?`,
        options: { A: "Structured Query Language", B: "Simple Query Language", C: "Structured Question Language", D: "Simple Question Language" },
        answer: "A"
    });
}

// COMPUTER SCIENCE - 25 Hard Questions
const csHard = [];
for (let i = 1; i <= 25; i++) {
    csHard.push({
        id: i,
        question: `Computer Science Hard Question ${i}: What is the time complexity of binary search?`,
        options: { A: "O(n)", B: "O(log n)", C: "O(n²)", D: "O(1)" },
        answer: "B"
    });
}

const questions = {
    mathematics: { easy: mathEasy, medium: mathMedium, hard: mathHard },
    english: { easy: engEasy, medium: engMedium, hard: engHard },
    physics: { easy: physEasy, medium: physMedium, hard: physHard },
    biology: { easy: bioEasy, medium: bioMedium, hard: bioHard },
    chemistry: { easy: chemEasy, medium: chemMedium, hard: chemHard },
    computerscience: { easy: csEasy, medium: csMedium, hard: csHard }
};

console.log("✅ Questions loaded:");
console.log(`   Mathematics: Easy ${mathEasy.length}, Medium ${mathMedium.length}, Hard ${mathHard.length}`);
console.log(`   English: Easy ${engEasy.length}, Medium ${engMedium.length}, Hard ${engHard.length}`);
console.log(`   Physics: Easy ${physEasy.length}, Medium ${physMedium.length}, Hard ${physHard.length}`);
console.log(`   Biology: Easy ${bioEasy.length}, Medium ${bioMedium.length}, Hard ${bioHard.length}`);
console.log(`   Chemistry: Easy ${chemEasy.length}, Medium ${chemMedium.length}, Hard ${chemHard.length}`);
console.log(`   Computer Science: Easy ${csEasy.length}, Medium ${csMedium.length}, Hard ${csHard.length}`);

// ========================================
// API ENDPOINTS
// ========================================

app.get("/", (req, res) => {
    res.send("🎉 Exam Pro API is running! Use /api/test to verify.");
});

app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is working!", users: users.length, exams: examHistory.length, status: "online" });
});

app.post("/api/signup", async (req, res) => {
    console.log("📝 Signup request received");
    const { fullname, email, password } = req.body;
    
    if (!fullname || !email || !password) {
        return res.status(400).json({ error: "All fields required" });
    }
    
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: "Email already registered" });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: users.length + 1,
            fullname,
            email,
            password: hashedPassword,
            created_at: new Date().toISOString()
        };
        users.push(newUser);
        saveData();
        console.log("✅ User created:", email);
        res.json({ message: "Account created successfully!" });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/login", async (req, res) => {
    console.log("🔐 Login request received");
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
    }
    
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
    }
    
    try {
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        
        console.log("✅ User logged in:", email);
        res.json({
            message: "Login successful!",
            user: { fullname: user.fullname, email: user.email }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/questions/:subject/:level", (req, res) => {
    const { subject, level } = req.params;
    console.log(`📚 Questions requested: ${subject}/${level}`);
    
    if (!questions[subject] || !questions[subject][level]) {
        return res.json([]);
    }
    
    res.json(questions[subject][level]);
});

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

app.get("/api/history/:email", (req, res) => {
    const history = examHistory.filter(h => h.user_email === req.params.email);
    res.json(history);
});

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n✅ Server running on port ${PORT}`);
    console.log(`👥 ${users.length} users registered`);
    console.log(`📝 ${examHistory.length} exam records`);
    console.log(`\n🌐 Ready to accept requests!\n`);
});