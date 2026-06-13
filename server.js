const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

console.log("🚀 Starting server...");

// Simple in-memory storage (no files, no bcrypt)
let users = [];

// Test endpoint
app.get("/", (req, res) => {
    res.send("🎉 Exam Pro API is running!");
});

app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is working!", users: users.length });
});

// Signup
app.post("/api/signup", (req, res) => {
    console.log("Signup request:", req.body);
    const { fullname, email, password } = req.body;
    
    if (!fullname || !email || !password) {
        return res.status(400).json({ error: "All fields required" });
    }
    
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: "Email already registered" });
    }
    
    const newUser = {
        id: users.length + 1,
        fullname,
        email,
        password,
        created_at: new Date().toISOString()
    };
    users.push(newUser);
    
    console.log("User created:", email);
    res.json({ message: "Account created successfully!" });
});

// Login
app.post("/api/login", (req, res) => {
    console.log("Login request:", req.body);
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
    if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid email or password" });
    }
    
    res.json({
        message: "Login successful!",
        user: { fullname: user.fullname, email: user.email }
    });
});

// Questions endpoint
app.get("/questions/:subject/:level", (req, res) => {
    res.json([
        { id: 1, question: "What is 5 + 3?", options: { A: "6", B: "7", C: "8", D: "9" }, answer: "C" }
    ]);
});

// Submit endpoint
app.post("/submit", (req, res) => {
    res.json({ score: 1, total: 1, percent: 100, message: "Great job!" });
});

// History endpoint
app.get("/api/history/:email", (req, res) => {
    res.json([]);
});

// Admin endpoints
app.get("/api/admin/users", (req, res) => {
    res.json(users);
});

app.get("/api/admin/history", (req, res) => {
    res.json([]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});