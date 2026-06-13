const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

console.log("🚀 Starting Exam Pro Backend with Brevo Email...");

// ========================================
// EMAIL CONFIGURATION (Brevo - Works for ANY email)
// ========================================
// 🔴 REPLACE with your actual Brevo credentials
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: true,
    auth: {
        user: "ambrosevictor80@gmail.com",     // ← Replace with your Brevo login
        pass: "bclh fsnw lvfj hakb"   // ← Replace with your Brevo password
    }
});

async function sendVerificationEmail(email, fullname, token) {
    const verificationUrl = `https://1yeet.netlify.app/verify.html?token=${token}&email=${email}`;
    
    const mailOptions = {
        from: '"Exam Pro System" <aecd5c001@smtp-brevo.com>',
        to: email,
        subject: "Verify Your Email - Exam Pro",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #667eea;">📚 Exam Pro</h1>
                <h2>Hello ${fullname}!</h2>
                <p>Thank you for signing up for Exam Pro System.</p>
                <p>Please click the button below to verify your email address and start taking exams:</p>
                <a href="${verificationUrl}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; display: inline-block; margin: 20px 0;">
                    Verify Email Address
                </a>
                <p>Or copy this link: ${verificationUrl}</p>
                <p>This link expires in 24 hours.</p>
                <hr>
                <p style="font-size: 12px; color: #999;">Exam Pro System - Your path to success</p>
            </div>
        `
    };
    
    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Verification email sent to ${email}`);
        return true;
    } catch (error) {
        console.error("❌ Email error:", error);
        return false;
    }
}

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
// COMPLETE QUESTIONS - MATHEMATICS (25 each level)
// ========================================
const mathematicsQuestions = {
    easy: [
        { id: 1, question: "What is 5 + 3?", options: { A: "6", B: "7", C: "8", D: "9" }, answer: "C" },
        { id: 2, question: "What is 10 - 4?", options: { A: "5", B: "6", C: "7", D: "8" }, answer: "B" },
        { id: 3, question: "What is 4 × 3?", options: { A: "10", B: "11", C: "12", D: "13" }, answer: "C" },
        { id: 4, question: "What is 15 ÷ 3?", options: { A: "3", B: "4", C: "5", D: "6" }, answer: "C" },
        { id: 5, question: "What is 7 + 8?", options: { A: "13", B: "14", C: "15", D: "16" }, answer: "C" },
        { id: 6, question: "What is 20 - 9?", options: { A: "9", B: "10", C: "11", D: "12" }, answer: "C" },
        { id: 7, question: "What is 6 × 4?", options: { A: "22", B: "23", C: "24", D: "25" }, answer: "C" },
        { id: 8, question: "What is 18 ÷ 2?", options: { A: "7", B: "8", C: "9", D: "10" }, answer: "C" },
        { id: 9, question: "What is 9 + 12?", options: { A: "19", B: "20", C: "21", D: "22" }, answer: "C" },
        { id: 10, question: "What is 25 - 10?", options: { A: "13", B: "14", C: "15", D: "16" }, answer: "C" },
        { id: 11, question: "What is 5 × 5?", options: { A: "20", B: "21", C: "24", D: "25" }, answer: "D" },
        { id: 12, question: "What is 30 ÷ 5?", options: { A: "5", B: "6", C: "7", D: "8" }, answer: "B" },
        { id: 13, question: "What is 11 + 14?", options: { A: "23", B: "24", C: "25", D: "26" }, answer: "C" },
        { id: 14, question: "What is 40 - 15?", options: { A: "25", B: "26", C: "27", D: "28" }, answer: "A" },
        { id: 15, question: "What is 7 × 3?", options: { A: "20", B: "21", C: "22", D: "23" }, answer: "B" },
        { id: 16, question: "What is 24 ÷ 4?", options: { A: "4", B: "5", C: "6", D: "7" }, answer: "C" },
        { id: 17, question: "What is 16 + 9?", options: { A: "23", B: "24", C: "25", D: "26" }, answer: "C" },
        { id: 18, question: "What is 50 - 20?", options: { A: "28", B: "29", C: "30", D: "31" }, answer: "C" },
        { id: 19, question: "What is 8 × 2?", options: { A: "14", B: "15", C: "16", D: "17" }, answer: "C" },
        { id: 20, question: "What is 36 ÷ 6?", options: { A: "5", B: "6", C: "7", D: "8" }, answer: "B" },
        { id: 21, question: "What is 13 + 17?", options: { A: "28", B: "29", C: "30", D: "31" }, answer: "C" },
        { id: 22, question: "What is 45 - 18?", options: { A: "25", B: "26", C: "27", D: "28" }, answer: "C" },
        { id: 23, question: "What is 9 × 3?", options: { A: "24", B: "25", C: "26", D: "27" }, answer: "D" },
        { id: 24, question: "What is 42 ÷ 7?", options: { A: "5", B: "6", C: "7", D: "8" }, answer: "B" },
        { id: 25, question: "What is 19 + 6?", options: { A: "23", B: "24", C: "25", D: "26" }, answer: "C" }
    ],
    medium: [
        { id: 1, question: "What is 15% of 200?", options: { A: "25", B: "30", C: "35", D: "40" }, answer: "B" },
        { id: 2, question: "Solve: 3x + 5 = 20", options: { A: "3", B: "4", C: "5", D: "6" }, answer: "C" },
        { id: 3, question: "What is the area of a circle with radius 7cm?", options: { A: "144cm²", B: "154cm²", C: "164cm²", D: "174cm²" }, answer: "B" },
        { id: 4, question: "What is 2⁵?", options: { A: "16", B: "24", C: "28", D: "32" }, answer: "D" },
        { id: 5, question: "What is the square root of 144?", options: { A: "10", B: "11", C: "12", D: "13" }, answer: "C" },
        { id: 6, question: "If a = 4, b = 6, what is a² + b²?", options: { A: "42", B: "48", C: "52", D: "58" }, answer: "C" },
        { id: 7, question: "What is the perimeter of a rectangle 12cm × 8cm?", options: { A: "30cm", B: "35cm", C: "40cm", D: "45cm" }, answer: "C" },
        { id: 8, question: "Solve: 4(x - 2) = 12", options: { A: "3", B: "4", C: "5", D: "6" }, answer: "C" },
        { id: 9, question: "What is 3/4 + 2/5?", options: { A: "1.15", B: "1.2", C: "1.25", D: "1.3" }, answer: "A" },
        { id: 10, question: "What is 20% of 250?", options: { A: "45", B: "50", C: "55", D: "60" }, answer: "B" },
        { id: 11, question: "What is the value of π to 2 decimals?", options: { A: "3.12", B: "3.14", C: "3.16", D: "3.18" }, answer: "B" },
        { id: 12, question: "Solve: 2x² = 32", options: { A: "3", B: "4", C: "5", D: "6" }, answer: "B" },
        { id: 13, question: "What is the volume of a cube with side 5cm?", options: { A: "100cm³", B: "115cm³", C: "125cm³", D: "135cm³" }, answer: "C" },
        { id: 14, question: "What is 7! (7 factorial)?", options: { A: "4920", B: "5000", C: "5040", D: "5080" }, answer: "C" },
        { id: 15, question: "What is 30% of 180?", options: { A: "52", B: "54", C: "56", D: "58" }, answer: "B" },
        { id: 16, question: "Solve: 5x - 7 = 3x + 9", options: { A: "6", B: "7", C: "8", D: "9" }, answer: "C" },
        { id: 17, question: "What is the area of a triangle base 10cm height 8cm?", options: { A: "30cm²", B: "35cm²", C: "40cm²", D: "45cm²" }, answer: "C" },
        { id: 18, question: "What is 2/3 × 3/4?", options: { A: "0.4", B: "0.5", C: "0.6", D: "0.7" }, answer: "B" },
        { id: 19, question: "What is 15²?", options: { A: "215", B: "220", C: "225", D: "230" }, answer: "C" },
        { id: 20, question: "What is the circumference of a circle radius 14cm?", options: { A: "80cm", B: "84cm", C: "88cm", D: "92cm" }, answer: "C" },
        { id: 21, question: "Solve: x/4 + 3 = 7", options: { A: "14", B: "15", C: "16", D: "17" }, answer: "C" },
        { id: 22, question: "What is 45% of 300?", options: { A: "130", B: "135", C: "140", D: "145" }, answer: "B" },
        { id: 23, question: "What is the mean of 12, 15, 18, 21, 24?", options: { A: "16", B: "17", C: "18", D: "19" }, answer: "C" },
        { id: 24, question: "What is 5³?", options: { A: "100", B: "115", C: "125", D: "135" }, answer: "C" },
        { id: 25, question: "What is the distance between (2,3) and (5,7)?", options: { A: "3", B: "4", C: "5", D: "6" }, answer: "C" }
    ],
    hard: [
        { id: 1, question: "What is the derivative of x²?", options: { A: "x", B: "2x", C: "x²", D: "2x²" }, answer: "B" },
        { id: 2, question: "Solve: log₂(8) = ?", options: { A: "2", B: "3", C: "4", D: "5" }, answer: "B" },
        { id: 3, question: "What is sin(90°)?", options: { A: "0", B: "0.5", C: "1", D: "1.5" }, answer: "C" },
        { id: 4, question: "What is the sum of angles in a pentagon?", options: { A: "450°", B: "480°", C: "520°", D: "540°" }, answer: "D" },
        { id: 5, question: "What is the quadratic formula solution?", options: { A: "x = (-b ± √(b²-4ac))/2a", B: "x = (b ± √(b²-4ac))/2a", C: "x = (-b ± √(4ac-b²))/2a", D: "x = (-b ± √(b²+4ac))/2a" }, answer: "A" },
        { id: 6, question: "What is the value of e to 2 decimals?", options: { A: "2.71", B: "2.72", C: "2.73", D: "2.74" }, answer: "A" },
        { id: 7, question: "What is the integral of 2x dx?", options: { A: "x² + C", B: "2x² + C", C: "x²/2 + C", D: "x³ + C" }, answer: "A" },
        { id: 8, question: "What is cos(0°)?", options: { A: "0", B: "0.5", C: "1", D: "1.5" }, answer: "C" },
        { id: 9, question: "What is the probability of rolling a 6 twice?", options: { A: "1/36", B: "1/12", C: "1/6", D: "1/3" }, answer: "A" },
        { id: 10, question: "What is the volume of a sphere radius 3cm?", options: { A: "36π cm³", B: "32π cm³", C: "28π cm³", D: "24π cm³" }, answer: "A" },
        { id: 11, question: "What is tan(45°)?", options: { A: "0", B: "0.5", C: "1", D: "1.5" }, answer: "C" },
        { id: 12, question: "Solve: 2^x = 32", options: { A: "3", B: "4", C: "5", D: "6" }, answer: "C" },
        { id: 13, question: "What is the standard deviation of 2,4,6,8?", options: { A: "2", B: "2.2", C: "2.4", D: "2.6" }, answer: "B" },
        { id: 14, question: "What is the inverse of f(x) = 2x + 3?", options: { A: "f⁻¹(x) = (x-3)/2", B: "f⁻¹(x) = (x+3)/2", C: "f⁻¹(x) = 2x-3", D: "f⁻¹(x) = 3-2x" }, answer: "A" },
        { id: 15, question: "What is the limit of 1/x as x→∞?", options: { A: "0", B: "1", C: "∞", D: "undefined" }, answer: "A" },
        { id: 16, question: "What is the value of i² (imaginary unit)?", options: { A: "1", B: "-1", C: "i", D: "-i" }, answer: "B" },
        { id: 17, question: "What is the determinant of [[2,3],[4,5]]?", options: { A: "-1", B: "-2", C: "1", D: "2" }, answer: "B" },
        { id: 18, question: "What is log₁₀(1000)?", options: { A: "2", B: "3", C: "4", D: "5" }, answer: "B" },
        { id: 19, question: "What is the surface area of a sphere radius 7cm?", options: { A: "616cm²", B: "606cm²", C: "596cm²", D: "586cm²" }, answer: "A" },
        { id: 20, question: "What is the 5th Fibonacci number?", options: { A: "3", B: "5", C: "8", D: "13" }, answer: "B" },
        { id: 21, question: "What is the sum of first 10 natural numbers?", options: { A: "45", B: "50", C: "55", D: "60" }, answer: "C" },
        { id: 22, question: "What is the value of sin²θ + cos²θ?", options: { A: "0", B: "0.5", C: "1", D: "1.5" }, answer: "C" },
        { id: 23, question: "What is the mode of 1,2,2,3,3,3,4,4,4,4?", options: { A: "2", B: "3", C: "4", D: "None" }, answer: "C" },
        { id: 24, question: "Solve: x² - 5x + 6 = 0", options: { A: "x = 2,3", B: "x = 1,6", C: "x = 2,4", D: "x = 3,4" }, answer: "A" },
        { id: 25, question: "What is the slope of line y = 3x + 2?", options: { A: "2", B: "3", C: "4", D: "5" }, answer: "B" }
    ]
};

// ========================================
// COMPLETE QUESTIONS - ENGLISH (25 each level)
// ========================================
const englishQuestions = {
    easy: [
        { id: 1, question: "What is the synonym of 'happy'?", options: { A: "Sad", B: "Joyful", C: "Angry", D: "Tired" }, answer: "B" },
        { id: 2, question: "What is the antonym of 'hot'?", options: { A: "Warm", B: "Cold", C: "Burning", D: "Fire" }, answer: "B" },
        { id: 3, question: "Which word is a noun?", options: { A: "Run", B: "Beautiful", C: "Table", D: "Quickly" }, answer: "C" },
        { id: 4, question: "What is the past tense of 'walk'?", options: { A: "Walked", B: "Walking", C: "Walks", D: "Walken" }, answer: "A" },
        { id: 5, question: "Choose the correct spelling", options: { A: "Recieve", B: "Receive", C: "Reeceive", D: "Receeve" }, answer: "B" },
        { id: 6, question: "What does 'big' mean?", options: { A: "Small", B: "Large", C: "Tiny", D: "Short" }, answer: "B" },
        { id: 7, question: "Choose the correct article: ___ apple", options: { A: "A", B: "An", C: "The", D: "None" }, answer: "B" },
        { id: 8, question: "What is the plural of 'cat'?", options: { A: "Cats", B: "Cates", C: "Caties", D: "Cats" }, answer: "A" },
        { id: 9, question: "What is the opposite of 'fast'?", options: { A: "Quick", B: "Rapid", C: "Slow", D: "Swift" }, answer: "C" },
        { id: 10, question: "Which word is a verb?", options: { A: "House", B: "Car", C: "Run", D: "Blue" }, answer: "C" },
        { id: 11, question: "What does 'small' mean?", options: { A: "Big", B: "Large", C: "Tiny", D: "Huge" }, answer: "C" },
        { id: 12, question: "Choose the correct sentence", options: { A: "He go school", B: "He goes to school", C: "He going school", D: "He gone school" }, answer: "B" },
        { id: 13, question: "What is the synonym of 'smart'?", options: { A: "Dumb", B: "Intelligent", C: "Slow", D: "Lazy" }, answer: "B" },
        { id: 14, question: "What is the antonym of 'young'?", options: { A: "New", B: "Old", C: "Fresh", D: "Modern" }, answer: "B" },
        { id: 15, question: "Which word is an adjective?", options: { A: "Quickly", B: "Beautiful", C: "Run", D: "House" }, answer: "B" },
        { id: 16, question: "What is the past tense of 'play'?", options: { A: "Played", B: "Playing", C: "Plays", D: "Plyed" }, answer: "A" },
        { id: 17, question: "Choose the correct spelling", options: { A: "Wensday", B: "Wenesday", C: "Wednesday", D: "Wensday" }, answer: "C" },
        { id: 18, question: "What does 'sad' mean?", options: { A: "Happy", B: "Joyful", C: "Unhappy", D: "Excited" }, answer: "C" },
        { id: 19, question: "What is the plural of 'dog'?", options: { A: "Doges", B: "Dogs", C: "Dogs", D: "Dogies" }, answer: "B" },
        { id: 20, question: "What is the opposite of 'up'?", options: { A: "Above", B: "High", C: "Down", D: "Top" }, answer: "C" },
        { id: 21, question: "Which word is a pronoun?", options: { A: "John", B: "Table", C: "They", D: "Run" }, answer: "C" },
        { id: 22, question: "Choose the correct article: ___ university", options: { A: "A", B: "An", C: "The", D: "None" }, answer: "A" },
        { id: 23, question: "What is the synonym of 'begin'?", options: { A: "End", B: "Finish", C: "Start", D: "Stop" }, answer: "C" },
        { id: 24, question: "What is the past tense of 'eat'?", options: { A: "Eated", B: "Ate", C: "Eaten", D: "Eating" }, answer: "B" },
        { id: 25, question: "What does 'quick' mean?", options: { A: "Slow", B: "Fast", C: "Lazy", D: "Sleepy" }, answer: "B" }
    ],
    medium: [
        { id: 1, question: "What is the synonym of 'difficult'?", options: { A: "Easy", B: "Simple", C: "Hard", D: "Light" }, answer: "C" },
        { id: 2, question: "What is the antonym of 'ancient'?", options: { A: "Old", B: "Modern", C: "Aged", D: "Historic" }, answer: "B" },
        { id: 3, question: "Choose the correct preposition: 'I am interested ___ music'", options: { A: "On", B: "At", C: "In", D: "For" }, answer: "C" },
        { id: 4, question: "What is the comparative form of 'good'?", options: { A: "Gooder", B: "Better", C: "Best", D: "More good" }, answer: "B" },
        { id: 5, question: "What does 'abandon' mean?", options: { A: "Keep", B: "Leave", C: "Love", D: "Help" }, answer: "B" },
        { id: 6, question: "Which word is an adverb?", options: { A: "Quick", B: "Quickly", C: "Quickness", D: "Quicken" }, answer: "B" },
        { id: 7, question: "What is the past tense of 'write'?", options: { A: "Writed", B: "Wrote", C: "Written", D: "Writing" }, answer: "B" },
        { id: 8, question: "Choose the correct sentence", options: { A: "She don't like pizza", B: "She doesn't likes pizza", C: "She doesn't like pizza", D: "She don't likes pizza" }, answer: "C" },
        { id: 9, question: "What is the synonym of 'brave'?", options: { A: "Scared", B: "Fearless", C: "Weak", D: "Cowardly" }, answer: "B" },
        { id: 10, question: "What is the antonym of 'victory'?", options: { A: "Win", B: "Success", C: "Defeat", D: "Triumph" }, answer: "C" },
        { id: 11, question: "What does 'wealthy' mean?", options: { A: "Poor", B: "Rich", C: "Sad", D: "Happy" }, answer: "B" },
        { id: 12, question: "Choose the correct spelling", options: { A: "Neccessary", B: "Necesary", C: "Necessary", D: "Nessecary" }, answer: "C" },
        { id: 13, question: "What is the plural of 'child'?", options: { A: "Childs", B: "Child's", C: "Children", D: "Childes" }, answer: "C" },
        { id: 14, question: "What is the past tense of 'go'?", options: { A: "Goed", B: "Went", C: "Gone", D: "Going" }, answer: "B" },
        { id: 15, question: "Choose the correct article: ___ honest man", options: { A: "A", B: "An", C: "The", D: "None" }, answer: "B" },
        { id: 16, question: "What does 'benevolent' mean?", options: { A: "Evil", B: "Kind", C: "Sad", D: "Angry" }, answer: "B" },
        { id: 17, question: "Which word is a conjunction?", options: { A: "Run", B: "And", C: "Beautiful", D: "Quickly" }, answer: "B" },
        { id: 18, question: "What is the superlative form of 'big'?", options: { A: "Bigger", B: "Biggest", C: "More big", D: "Most big" }, answer: "B" },
        { id: 19, question: "Choose the correct sentence", options: { A: "I have went home", B: "I have gone home", C: "I have go home", D: "I have going home" }, answer: "B" },
        { id: 20, question: "What is the synonym of 'ancient'?", options: { A: "New", B: "Modern", C: "Old", D: "Young" }, answer: "C" },
        { id: 21, question: "What is the antonym of 'expensive'?", options: { A: "Costly", B: "Cheap", C: "High", D: "Valuable" }, answer: "B" },
        { id: 22, question: "What does 'fragile' mean?", options: { A: "Strong", B: "Breakable", C: "Heavy", D: "Solid" }, answer: "B" },
        { id: 23, question: "Choose the correct preposition: 'The book is ___ the table'", options: { A: "In", B: "At", C: "On", D: "Under" }, answer: "C" },
        { id: 24, question: "What is the past tense of 'swim'?", options: { A: "Swimmed", B: "Swam", C: "Swum", D: "Swimming" }, answer: "B" },
        { id: 25, question: "What does 'curious' mean?", options: { A: "Bored", B: "Interested", C: "Lazy", D: "Sleepy" }, answer: "B" }
    ],
    hard: [
        { id: 1, question: "What is the synonym of 'ubiquitous'?", options: { A: "Rare", B: "Everywhere", C: "Hidden", D: "Scarce" }, answer: "B" },
        { id: 2, question: "What is the antonym of 'ephemeral'?", options: { A: "Temporary", B: "Permanent", C: "Short", D: "Brief" }, answer: "B" },
        { id: 3, question: "What does 'mellifluous' mean?", options: { A: "Harsh", B: "Sweet sounding", C: "Loud", D: "Quiet" }, answer: "B" },
        { id: 4, question: "Choose the correct sentence", options: { A: "Neither John nor Mary are coming", B: "Neither John nor Mary is coming", C: "Neither John nor Mary am coming", D: "Neither John nor Mary be coming" }, answer: "B" },
        { id: 5, question: "What is the plural of 'cactus'?", options: { A: "Cactuses", B: "Cacti", C: "Cactus", D: "Cactuss" }, answer: "B" },
        { id: 6, question: "What is the past participle of 'begin'?", options: { A: "Begun", B: "Began", C: "Beginned", D: "Beginning" }, answer: "A" },
        { id: 7, question: "What does 'ostentatious' mean?", options: { A: "Modest", B: "Showy", C: "Quiet", D: "Simple" }, answer: "B" },
        { id: 8, question: "Choose the correct spelling", options: { A: "Accommodate", B: "Acommodate", C: "Accomodate", D: "Acommodate" }, answer: "A" },
        { id: 9, question: "What is the synonym of 'cogent'?", options: { A: "Weak", B: "Convincing", C: "Foolish", D: "Silly" }, answer: "B" },
        { id: 10, question: "What is the antonym of 'gregarious'?", options: { A: "Social", B: "Outgoing", C: "Shy", D: "Friendly" }, answer: "C" },
        { id: 11, question: "What does 'serendipity' mean?", options: { A: "Bad luck", B: "Accidental discovery", C: "Planned event", D: "Disaster" }, answer: "B" },
        { id: 12, question: "Choose the correct sentence", options: { A: "He is one of those who always arrives late", B: "He is one of those who always arrive late", C: "He is one of those who always arriving late", D: "He is one of those who always arrived late" }, answer: "B" },
        { id: 13, question: "What is the plural of 'phenomenon'?", options: { A: "Phenomenons", B: "Phenomena", C: "Phenomenas", D: "Phenomenae" }, answer: "B" },
        { id: 14, question: "What is the past tense of 'fly'?", options: { A: "Flied", B: "Flew", C: "Flown", D: "Flying" }, answer: "B" },
        { id: 15, question: "What does 'quintessential' mean?", options: { A: "Imperfect", B: "Perfect example", C: "Average", D: "Common" }, answer: "B" },
        { id: 16, question: "What is the synonym of 'loquacious'?", options: { A: "Quiet", B: "Talkative", C: "Silent", D: "Reserved" }, answer: "B" },
        { id: 17, question: "What is the antonym of 'meticulous'?", options: { A: "Careful", B: "Precise", C: "Sloppy", D: "Detailed" }, answer: "C" },
        { id: 18, question: "What does 'equivocate' mean?", options: { A: "Speak clearly", B: "Be direct", C: "Use vague language", D: "Be honest" }, answer: "C" },
        { id: 19, question: "Choose the correct spelling", options: { A: "Consensus", B: "Concensus", C: "Consencus", D: "Consenssus" }, answer: "A" },
        { id: 20, question: "What is the plural of 'analysis'?", options: { A: "Analyses", B: "Analysis", C: "Analysiss", D: "Analysies" }, answer: "A" },
        { id: 21, question: "What does 'idiosyncrasy' mean?", options: { A: "Common trait", B: "Quirky habit", C: "Normal behavior", D: "Regular pattern" }, answer: "B" },
        { id: 22, question: "What is the synonym of 'capricious'?", options: { A: "Predictable", B: "Steady", C: "Whimsical", D: "Constant" }, answer: "C" },
        { id: 23, question: "What is the antonym of 'laudatory'?", options: { A: "Praising", B: "Complimentary", C: "Critical", D: "Approving" }, answer: "C" },
        { id: 24, question: "What does 'Sisyphean' mean?", options: { A: "Easy task", B: "Futile task", C: "Quick task", D: "Simple task" }, answer: "B" },
        { id: 25, question: "Choose the correct sentence", options: { A: "The data is clear", B: "The data are clear", C: "The data be clear", D: "The data were clear" }, answer: "A" }
    ]
};

// ========================================
// COMPLETE QUESTIONS - PHYSICS (25 each level)
// ========================================
const physicsQuestions = {
    easy: [
        { id: 1, question: "What is the unit of force?", options: { A: "Joule", B: "Watt", C: "Newton", D: "Pascal" }, answer: "C" },
        { id: 2, question: "What is the speed of light?", options: { A: "300,000 km/s", B: "150,000 km/s", C: "450,000 km/s", D: "600,000 km/s" }, answer: "A" },
        { id: 3, question: "What is the formula for density?", options: { A: "Mass/Volume", B: "Volume/Mass", C: "Mass × Volume", D: "Mass + Volume" }, answer: "A" },
        { id: 4, question: "What is the unit of energy?", options: { A: "Newton", B: "Pascal", C: "Joule", D: "Watt" }, answer: "C" },
        { id: 5, question: "What is the boiling point of water?", options: { A: "90°C", B: "95°C", C: "100°C", D: "105°C" }, answer: "C" },
        { id: 6, question: "What is the freezing point of water?", options: { A: "-10°C", B: "-5°C", C: "0°C", D: "5°C" }, answer: "C" },
        { id: 7, question: "What is the unit of power?", options: { A: "Joule", B: "Newton", C: "Watt", D: "Pascal" }, answer: "C" },
        { id: 8, question: "What is the SI unit of length?", options: { A: "Meter", B: "Centimeter", C: "Kilometer", D: "Millimeter" }, answer: "A" },
        { id: 9, question: "What is the SI unit of mass?", options: { A: "Gram", B: "Kilogram", C: "Milligram", D: "Ton" }, answer: "B" },
        { id: 10, question: "What is the SI unit of time?", options: { A: "Minute", B: "Hour", C: "Second", D: "Day" }, answer: "C" },
        { id: 11, question: "What is the unit of electric current?", options: { A: "Volt", B: "Ohm", C: "Ampere", D: "Watt" }, answer: "C" },
        { id: 12, question: "What is the unit of resistance?", options: { A: "Volt", B: "Ohm", C: "Ampere", D: "Watt" }, answer: "B" },
        { id: 13, question: "What is the unit of voltage?", options: { A: "Volt", B: "Ohm", C: "Ampere", D: "Watt" }, answer: "A" },
        { id: 14, question: "What is the formula for speed?", options: { A: "Distance/Time", B: "Time/Distance", C: "Distance × Time", D: "Distance + Time" }, answer: "A" },
        { id: 15, question: "What is the acceleration due to gravity on Earth?", options: { A: "8.8 m/s²", B: "9.8 m/s²", C: "10.8 m/s²", D: "11.8 m/s²" }, answer: "B" },
        { id: 16, question: "What is the unit of pressure?", options: { A: "Newton", B: "Joule", C: "Pascal", D: "Watt" }, answer: "C" },
        { id: 17, question: "What is the unit of frequency?", options: { A: "Hertz", B: "Watt", C: "Joule", D: "Newton" }, answer: "A" },
        { id: 18, question: "What is the formula for work?", options: { A: "Force × Distance", B: "Force/Distance", C: "Distance/Force", D: "Force + Distance" }, answer: "A" },
        { id: 19, question: "What is the unit of work?", options: { A: "Newton", B: "Pascal", C: "Joule", D: "Watt" }, answer: "C" },
        { id: 20, question: "What is the formula for force?", options: { A: "Mass × Acceleration", B: "Mass/Acceleration", C: "Acceleration/Mass", D: "Mass + Acceleration" }, answer: "A" },
        { id: 21, question: "What is the unit of mass?", options: { A: "Kilogram", B: "Meter", C: "Second", D: "Ampere" }, answer: "A" },
        { id: 22, question: "What is sound?", options: { A: "Longitudinal wave", B: "Transverse wave", C: "Electromagnetic wave", D: "Radio wave" }, answer: "A" },
        { id: 23, question: "What is light?", options: { A: "Longitudinal wave", B: "Transverse wave", C: "Sound wave", D: "Water wave" }, answer: "B" },
        { id: 24, question: "What is the unit of temperature?", options: { A: "Celsius", B: "Kelvin", C: "Fahrenheit", D: "All of the above" }, answer: "D" },
        { id: 25, question: "What is the melting point of ice?", options: { A: "0°C", B: "100°C", C: "50°C", D: "-50°C" }, answer: "A" }
    ],
    medium: [
        { id: 1, question: "What is Ohm's law formula?", options: { A: "V = I/R", B: "V = I × R", C: "V = R/I", D: "V = I + R" }, answer: "B" },
        { id: 2, question: "What is the acceleration due to gravity?", options: { A: "8.8 m/s²", B: "9.8 m/s²", C: "10.8 m/s²", D: "11.8 m/s²" }, answer: "B" },
        { id: 3, question: "What is the unit of power?", options: { A: "Joule", B: "Newton", C: "Watt", D: "Pascal" }, answer: "C" },
        { id: 4, question: "What is the formula for kinetic energy?", options: { A: "½mv²", B: "mv²", C: "mgh", D: "½mgh" }, answer: "A" },
        { id: 5, question: "What is the unit of frequency?", options: { A: "Hertz", B: "Watt", C: "Joule", D: "Newton" }, answer: "A" },
        { id: 6, question: "What is the formula for potential energy?", options: { A: "½mv²", B: "mv²", C: "mgh", D: "½mgh" }, answer: "C" },
        { id: 7, question: "What is the unit of momentum?", options: { A: "kg·m/s", B: "N·m", C: "J/s", D: "W/m²" }, answer: "A" },
        { id: 8, question: "What is the formula for power?", options: { A: "Work/Time", B: "Work × Time", C: "Force × Distance", D: "Mass × Acceleration" }, answer: "A" },
        { id: 9, question: "What is the unit of electric charge?", options: { A: "Coulomb", B: "Ampere", C: "Volt", D: "Ohm" }, answer: "A" },
        { id: 10, question: "What is the formula for resistance?", options: { A: "V/I", B: "V × I", C: "I/V", D: "V + I" }, answer: "A" },
        { id: 11, question: "What is the unit of capacitance?", options: { A: "Farad", B: "Henry", C: "Tesla", D: "Weber" }, answer: "A" },
        { id: 12, question: "What is the formula for frequency?", options: { A: "1/Time period", B: "Time period", C: "2π/Time period", D: "Time period/2π" }, answer: "A" },
        { id: 13, question: "What is the unit of magnetic field?", options: { A: "Tesla", B: "Henry", C: "Farad", D: "Coulomb" }, answer: "A" },
        { id: 14, question: "What is the formula for wavelength?", options: { A: "Speed/Frequency", B: "Speed × Frequency", C: "Frequency/Speed", D: "Speed + Frequency" }, answer: "A" },
        { id: 15, question: "What is the unit of inductance?", options: { A: "Henry", B: "Farad", C: "Tesla", D: "Weber" }, answer: "A" },
        { id: 16, question: "What is the formula for efficiency?", options: { A: "(Output/Input) × 100%", B: "(Input/Output) × 100%", C: "Output - Input", D: "Input + Output" }, answer: "A" },
        { id: 17, question: "What is the first law of motion?", options: { A: "Inertia", B: "F = ma", C: "Action-Reaction", D: "Conservation of energy" }, answer: "A" },
        { id: 18, question: "What is the second law of motion?", options: { A: "F = ma", B: "Inertia", C: "Action-Reaction", D: "Conservation of momentum" }, answer: "A" },
        { id: 19, question: "What is the third law of motion?", options: { A: "Action-Reaction", B: "F = ma", C: "Inertia", D: "Conservation of energy" }, answer: "A" },
        { id: 20, question: "What is the law of conservation of energy?", options: { A: "Energy cannot be created or destroyed", B: "Energy can be created", C: "Energy can be destroyed", D: "Energy is always lost" }, answer: "A" },
        { id: 21, question: "What is the unit of luminous intensity?", options: { A: "Candela", B: "Lumen", C: "Lux", D: "Watt" }, answer: "A" },
        { id: 22, question: "What is the formula for pressure?", options: { A: "Force/Area", B: "Area/Force", C: "Force × Area", D: "Force + Area" }, answer: "A" },
        { id: 23, question: "What is the unit of viscosity?", options: { A: "Poise", B: "Pascal", C: "Newton", D: "Joule" }, answer: "A" },
        { id: 24, question: "What is the formula for torque?", options: { A: "Force × Distance", B: "Force/Distance", C: "Distance/Force", D: "Force + Distance" }, answer: "A" },
        { id: 25, question: "What is the unit of angular velocity?", options: { A: "rad/s", B: "m/s", C: "kg/s", D: "N/s" }, answer: "A" }
    ],
    hard: [
        { id: 1, question: "What is the value of Planck's constant?", options: { A: "6.626 × 10⁻³⁴ J·s", B: "6.626 × 10⁻³² J·s", C: "6.626 × 10⁻³⁶ J·s", D: "6.626 × 10⁻³⁸ J·s" }, answer: "A" },
        { id: 2, question: "What is the formula for gravitational force?", options: { A: "F = Gm₁m₂/r²", B: "F = Gm₁m₂r²", C: "F = G(m₁+m₂)/r²", D: "F = G(m₁×m₂)r²" }, answer: "A" },
        { id: 3, question: "What is the speed of sound in air at 20°C?", options: { A: "343 m/s", B: "330 m/s", C: "350 m/s", D: "360 m/s" }, answer: "A" },
        { id: 4, question: "What is the unit of magnetic flux?", options: { A: "Weber", B: "Tesla", C: "Henry", D: "Farad" }, answer: "A" },
        { id: 5, question: "What is the formula for efficiency?", options: { A: "Output/Input × 100%", B: "Input/Output × 100%", C: "Output - Input × 100%", D: "Input + Output × 100%" }, answer: "A" },
        { id: 6, question: "What is the value of the gas constant R?", options: { A: "8.314 J/(mol·K)", B: "8.314 J/(g·K)", C: "8.314 J/(kg·K)", D: "8.314 J/(L·K)" }, answer: "A" },
        { id: 7, question: "What is the first law of thermodynamics?", options: { A: "ΔU = Q - W", B: "ΔU = Q + W", C: "ΔU = W - Q", D: "ΔU = Q × W" }, answer: "A" },
        { id: 8, question: "What is the second law of thermodynamics?", options: { A: "Entropy increases", B: "Energy is conserved", C: "Heat flows from cold to hot", D: "Perpetual motion possible" }, answer: "A" },
        { id: 9, question: "What is the unit of entropy?", options: { A: "J/K", B: "J·K", C: "J/s", D: "N·m" }, answer: "A" },
        { id: 10, question: "What is the formula for the speed of light?", options: { A: "c = λf", B: "c = λ/f", C: "c = f/λ", D: "c = λ + f" }, answer: "A" },
        { id: 11, question: "What is the value of the Stefan-Boltzmann constant?", options: { A: "5.67 × 10⁻⁸ W/m²K⁴", B: "5.67 × 10⁻⁶ W/m²K⁴", C: "5.67 × 10⁻¹⁰ W/m²K⁴", D: "5.67 × 10⁻¹² W/m²K⁴" }, answer: "A" },
        { id: 12, question: "What is the formula for the de Broglie wavelength?", options: { A: "λ = h/p", B: "λ = p/h", C: "λ = hE", D: "λ = E/h" }, answer: "A" },
        { id: 13, question: "What is the value of the fine structure constant?", options: { A: "1/137", B: "1/100", C: "1/200", D: "1/50" }, answer: "A" },
        { id: 14, question: "What is the formula for the period of a simple pendulum?", options: { A: "T = 2π√(L/g)", B: "T = 2π√(g/L)", C: "T = √(L/g)", D: "T = √(g/L)" }, answer: "A" },
        { id: 15, question: "What is the unit of activity in radioactivity?", options: { A: "Becquerel", B: "Curie", C: "Gray", D: "Sievert" }, answer: "A" },
        { id: 16, question: "What is the formula for the half-life?", options: { A: "t½ = ln(2)/λ", B: "t½ = λ/ln(2)", C: "t½ = ln(2) × λ", D: "t½ = 1/λ" }, answer: "A" },
        { id: 17, question: "What is the value of the Rydberg constant?", options: { A: "1.097 × 10⁷ m⁻¹", B: "1.097 × 10⁶ m⁻¹", C: "1.097 × 10⁸ m⁻¹", D: "1.097 × 10⁹ m⁻¹" }, answer: "A" },
        { id: 18, question: "What is the formula for the photoelectric effect?", options: { A: "E = hf - φ", B: "E = hf + φ", C: "E = φ - hf", D: "E = hf/φ" }, answer: "A" },
        { id: 19, question: "What is the unit of electric field?", options: { A: "N/C", B: "V/m", C: "Both A and B", D: "Neither" }, answer: "C" },
        { id: 20, question: "What is the formula for the capacitance of a parallel plate capacitor?", options: { A: "C = ε₀A/d", B: "C = ε₀d/A", C: "C = A/(ε₀d)", D: "C = ε₀Ad" }, answer: "A" },
        { id: 21, question: "What is the value of the permittivity of free space?", options: { A: "8.85 × 10⁻¹² F/m", B: "8.85 × 10⁻¹⁰ F/m", C: "8.85 × 10⁻¹⁴ F/m", D: "8.85 × 10⁻¹⁶ F/m" }, answer: "A" },
        { id: 22, question: "What is the formula for the magnetic force on a moving charge?", options: { A: "F = qvB sinθ", B: "F = qvB cosθ", C: "F = qvB tanθ", D: "F = qvB" }, answer: "A" },
        { id: 23, question: "What is the unit of magnetic field strength?", options: { A: "A/m", B: "T", C: "Wb", D: "H" }, answer: "A" },
        { id: 24, question: "What is the formula for the skin depth?", options: { A: "δ = √(2/ωμσ)", B: "δ = √(ωμσ/2)", C: "δ = ωμσ/2", D: "δ = 2/ωμσ" }, answer: "A" },
        { id: 25, question: "What is the value of the Bohr radius?", options: { A: "5.29 × 10⁻¹¹ m", B: "5.29 × 10⁻¹⁰ m", C: "5.29 × 10⁻¹² m", D: "5.29 × 10⁻¹³ m" }, answer: "A" }
    ]
};

// ========================================
// COMPLETE QUESTIONS - BIOLOGY (25 each level)
// ========================================
const biologyQuestions = {
    easy: [
        { id: 1, question: "What is the basic unit of life?", options: { A: "Atom", B: "Molecule", C: "Cell", D: "Tissue" }, answer: "C" },
        { id: 2, question: "What is the powerhouse of the cell?", options: { A: "Nucleus", B: "Mitochondria", C: "Ribosome", D: "Golgi" }, answer: "B" },
        { id: 3, question: "What organ pumps blood?", options: { A: "Brain", B: "Liver", C: "Heart", D: "Lungs" }, answer: "C" },
        { id: 4, question: "What is the largest organ in the human body?", options: { A: "Heart", B: "Liver", C: "Skin", D: "Brain" }, answer: "C" },
        { id: 5, question: "What is the function of red blood cells?", options: { A: "Fight infection", B: "Carry oxygen", C: "Clot blood", D: "Digest food" }, answer: "B" },
        { id: 6, question: "What is the normal human body temperature?", options: { A: "36.5°C", B: "37.5°C", C: "38.5°C", D: "39.5°C" }, answer: "A" },
        { id: 7, question: "What is the process of plants making food?", options: { A: "Respiration", B: "Photosynthesis", C: "Digestion", D: "Fermentation" }, answer: "B" },
        { id: 8, question: "What is the hardest substance in the human body?", options: { A: "Bone", B: "Tooth enamel", C: "Cartilage", D: "Skin" }, answer: "B" },
        { id: 9, question: "What is the function of the lungs?", options: { A: "Pump blood", B: "Exchange gases", C: "Digest food", D: "Filter waste" }, answer: "B" },
        { id: 10, question: "What is the scientific name for humans?", options: { A: "Homo erectus", B: "Homo sapiens", C: "Homo habilis", D: "Homo neanderthalensis" }, answer: "B" },
        { id: 11, question: "What is the green pigment in plants?", options: { A: "Chlorophyll", B: "Melanin", C: "Hemoglobin", D: "Carotene" }, answer: "A" },
        { id: 12, question: "What is the function of the kidney?", options: { A: "Pump blood", B: "Filter blood", C: "Digest food", D: "Produce hormones" }, answer: "B" },
        { id: 13, question: "What is the longest bone in the human body?", options: { A: "Femur", B: "Tibia", C: "Fibula", D: "Humerus" }, answer: "A" },
        { id: 14, question: "What is the function of white blood cells?", options: { A: "Carry oxygen", B: "Fight infection", C: "Clot blood", D: "Transport nutrients" }, answer: "B" },
        { id: 15, question: "What is the main function of the nervous system?", options: { A: "Pump blood", B: "Control body functions", C: "Digest food", D: "Filter waste" }, answer: "B" },
        { id: 16, question: "What is the process of cell division called?", options: { A: "Mitosis", B: "Meiosis", C: "Fission", D: "Budding" }, answer: "A" },
        { id: 17, question: "What is the function of the stomach?", options: { A: "Absorb nutrients", B: "Digest food", C: "Filter blood", D: "Produce hormones" }, answer: "B" },
        { id: 18, question: "What is the largest artery in the body?", options: { A: "Aorta", B: "Pulmonary artery", C: "Carotid artery", D: "Femoral artery" }, answer: "A" },
        { id: 19, question: "What is the function of the liver?", options: { A: "Filter blood", B: "Produce bile", C: "Store glucose", D: "All of the above" }, answer: "D" },
        { id: 20, question: "What is the basic building block of proteins?", options: { A: "Glucose", B: "Amino acid", C: "Fatty acid", D: "Nucleotide" }, answer: "B" },
        { id: 21, question: "What is the function of the skeleton?", options: { A: "Support body", B: "Protect organs", C: "Produce blood cells", D: "All of the above" }, answer: "D" },
        { id: 22, question: "What is the normal resting heart rate for adults?", options: { A: "60-100 bpm", B: "100-140 bpm", C: "40-60 bpm", D: "140-180 bpm" }, answer: "A" },
        { id: 23, question: "What is the function of the pancreas?", options: { A: "Produce insulin", B: "Digest food", C: "Both A and B", D: "Neither" }, answer: "C" },
        { id: 24, question: "What is the smallest bone in the human body?", options: { A: "Stapes", B: "Malleus", C: "Incus", D: "Femur" }, answer: "A" },
        { id: 25, question: "What is the function of the rib cage?", options: { A: "Protect heart and lungs", B: "Protect brain", C: "Protect stomach", D: "Protect kidneys" }, answer: "A" }
    ],
    medium: [
        { id: 1, question: "What is the process of DNA replication?", options: { A: "Copying DNA", B: "Making RNA", C: "Making protein", D: "Cell division" }, answer: "A" },
        { id: 2, question: "What is the function of the mitochondria?", options: { A: "Energy production", B: "Protein synthesis", C: "Waste removal", D: "Cell division" }, answer: "A" },
        { id: 3, question: "What is the blood type known as the universal donor?", options: { A: "A", B: "B", C: "AB", D: "O" }, answer: "D" },
        { id: 4, question: "What is the function of the ribosome?", options: { A: "Protein synthesis", B: "Lipid synthesis", C: "DNA replication", D: "Energy production" }, answer: "A" },
        { id: 5, question: "What is the process of converting glucose to energy?", options: { A: "Cellular respiration", B: "Photosynthesis", C: "Fermentation", D: "Digestion" }, answer: "A" },
        { id: 6, question: "What is the function of the Golgi apparatus?", options: { A: "Modify and package proteins", B: "Produce energy", C: "Store DNA", D: "Synthesize lipids" }, answer: "A" },
        { id: 7, question: "What is the blood type known as the universal recipient?", options: { A: "A", B: "B", C: "AB", D: "O" }, answer: "C" },
        { id: 8, question: "What is the function of the nucleus?", options: { A: "Store DNA", B: "Produce energy", C: "Synthesize proteins", D: "Transport materials" }, answer: "A" },
        { id: 9, question: "What is the process of making RNA from DNA?", options: { A: "Transcription", B: "Translation", C: "Replication", D: "Mutation" }, answer: "A" },
        { id: 10, question: "What is the function of the endoplasmic reticulum?", options: { A: "Protein and lipid synthesis", B: "Energy production", C: "Waste removal", D: "Cell division" }, answer: "A" },
        { id: 11, question: "What is the process of making protein from RNA?", options: { A: "Translation", B: "Transcription", C: "Replication", D: "Mutation" }, answer: "A" },
        { id: 12, question: "What is the function of lysosomes?", options: { A: "Waste breakdown", B: "Energy production", C: "Protein synthesis", D: "DNA storage" }, answer: "A" },
        { id: 13, question: "What is the hormone that regulates blood sugar?", options: { A: "Insulin", B: "Adrenaline", C: "Estrogen", D: "Testosterone" }, answer: "A" },
        { id: 14, question: "What is the function of the cerebellum?", options: { A: "Balance and coordination", B: "Memory", C: "Vision", D: "Hearing" }, answer: "A" },
        { id: 15, question: "What is the hormone that causes fight or flight response?", options: { A: "Adrenaline", B: "Insulin", C: "Melatonin", D: "Serotonin" }, answer: "A" },
        { id: 16, question: "What is the function of the hypothalamus?", options: { A: "Body temperature regulation", B: "Memory", C: "Vision", D: "Balance" }, answer: "A" },
        { id: 17, question: "What is the pigment that gives skin its color?", options: { A: "Melanin", B: "Chlorophyll", C: "Hemoglobin", D: "Carotene" }, answer: "A" },
        { id: 18, question: "What is the function of the myelin sheath?", options: { A: "Insulate nerve fibers", B: "Produce energy", C: "Store nutrients", D: "Fight infection" }, answer: "A" },
        { id: 19, question: "What is the hormone that regulates sleep?", options: { A: "Melatonin", B: "Insulin", C: "Adrenaline", D: "Estrogen" }, answer: "A" },
        { id: 20, question: "What is the function of the alveoli?", options: { A: "Gas exchange", B: "Filter blood", C: "Digest food", D: "Produce hormones" }, answer: "A" },
        { id: 21, question: "What is the process of programmed cell death?", options: { A: "Apoptosis", B: "Necrosis", C: "Mitosis", D: "Meiosis" }, answer: "A" },
        { id: 22, question: "What is the function of the enzyme?", options: { A: "Speed up reactions", B: "Store energy", C: "Transport nutrients", D: "Fight infection" }, answer: "A" },
        { id: 23, question: "What is the hormone that regulates metabolism?", options: { A: "Thyroxine", B: "Insulin", C: "Adrenaline", D: "Melatonin" }, answer: "A" },
        { id: 24, question: "What is the function of the vaccine?", options: { A: "Build immunity", B: "Kill bacteria", C: "Relieve pain", D: "Reduce fever" }, answer: "A" },
        { id: 25, question: "What is the process of natural selection?", options: { A: "Survival of the fittest", B: "Survival of the largest", C: "Survival of the fastest", D: "Survival of the strongest" }, answer: "A" }
    ],
    hard: [
        { id: 1, question: "What is the function of the enzyme DNA polymerase?", options: { A: "DNA replication", B: "RNA synthesis", C: "Protein synthesis", D: "Lipid synthesis" }, answer: "A" },
        { id: 2, question: "What is the process of the Krebs cycle?", options: { A: "Energy production", B: "DNA replication", C: "Protein synthesis", D: "Cell division" }, answer: "A" },
        { id: 3, question: "What is the function of the hormone calcitonin?", options: { A: "Lower blood calcium", B: "Raise blood sugar", C: "Lower blood pressure", D: "Raise metabolism" }, answer: "A" },
        { id: 4, question: "What is the process of glycolysis?", options: { A: "Glucose breakdown", B: "Fatty acid synthesis", C: "Protein synthesis", D: "DNA replication" }, answer: "A" },
        { id: 5, question: "What is the function of the hormone erythropoietin?", options: { A: "Red blood cell production", B: "White blood cell production", C: "Platelet production", D: "Antibody production" }, answer: "A" },
        { id: 6, question: "What is the process of oxidative phosphorylation?", options: { A: "ATP production", B: "Glucose synthesis", C: "Protein folding", D: "DNA repair" }, answer: "A" },
        { id: 7, question: "What is the function of the tumor suppressor gene p53?", options: { A: "Prevent cancer", B: "Promote cell growth", C: "Repair DNA", D: "Both A and C" }, answer: "D" },
        { id: 8, question: "What is the process of DNA repair?", options: { A: "Fix DNA damage", B: "Copy DNA", C: "Make RNA", D: "Make protein" }, answer: "A" },
        { id: 9, question: "What is the function of the blood-brain barrier?", options: { A: "Protect brain", B: "Allow nutrients in", C: "Remove waste", D: "All of the above" }, answer: "D" },
        { id: 10, question: "What is the process of phagocytosis?", options: { A: "Cell eating", B: "Cell drinking", C: "Cell division", D: "Cell movement" }, answer: "A" },
        { id: 11, question: "What is the function of the hormone leptin?", options: { A: "Appetite control", B: "Sleep regulation", C: "Growth regulation", D: "Stress response" }, answer: "A" },
        { id: 12, question: "What is the process of crossing over in meiosis?", options: { A: "Genetic exchange", B: "Cell division", C: "DNA replication", D: "Protein synthesis" }, answer: "A" },
        { id: 13, question: "What is the function of the CRISPR-Cas9 system?", options: { A: "Gene editing", B: "Protein synthesis", C: "Cell division", D: "Energy production" }, answer: "A" },
        { id: 14, question: "What is the process of angiogenesis?", options: { A: "Blood vessel formation", B: "Nerve formation", C: "Bone formation", D: "Muscle formation" }, answer: "A" },
        { id: 15, question: "What is the function of the telomere?", options: { A: "Protect chromosome ends", B: "Store genetic info", C: "Produce energy", D: "Synthesize protein" }, answer: "A" },
        { id: 16, question: "What is the process of epigenetics?", options: { A: "Gene expression regulation", B: "DNA sequence change", C: "Protein folding", D: "Cell division" }, answer: "A" },
        { id: 17, question: "What is the function of the microbiome?", options: { A: "Digestion and immunity", B: "Energy production", C: "Oxygen transport", D: "Nerve signaling" }, answer: "A" },
        { id: 18, question: "What is the process of chemotaxis?", options: { A: "Cell movement toward chemicals", B: "Cell death", C: "Cell division", D: "Cell differentiation" }, answer: "A" },
        { id: 19, question: "What is the function of the hormone ghrelin?", options: { A: "Stimulate appetite", B: "Reduce appetite", C: "Regulate sleep", D: "Control growth" }, answer: "A" },
        { id: 20, question: "What is the process of autophagy?", options: { A: "Cellular self-cleaning", B: "Cell division", C: "Cell movement", D: "Cell death" }, answer: "A" },
        { id: 21, question: "What is the function of the enzyme telomerase?", options: { A: "Extend telomeres", B: "Cut DNA", C: "Repair DNA", D: "Copy DNA" }, answer: "A" },
        { id: 22, question: "What is the process of stem cell differentiation?", options: { A: "Cell specialization", B: "Cell division", C: "Cell death", D: "Cell movement" }, answer: "A" },
        { id: 23, question: "What is the function of the blood-clotting cascade?", options: { A: "Stop bleeding", B: "Prevent clotting", C: "Dissolve clots", D: "Carry oxygen" }, answer: "A" },
        { id: 24, question: "What is the process of adaptive immunity?", options: { A: "Specific immune response", B: "General immune response", C: "Inflammation", D: "Fever" }, answer: "A" },
        { id: 25, question: "What is the function of the microbiome-gut-brain axis?", options: { A: "Gut-brain communication", B: "Digestion only", C: "Immunity only", D: "None of the above" }, answer: "A" }
    ]
};

// ========================================
// COMPLETE QUESTIONS - CHEMISTRY (25 each level)
// ========================================
const chemistryQuestions = {
    easy: [
        { id: 1, question: "What is the chemical symbol for water?", options: { A: "CO₂", B: "O₂", C: "H₂O", D: "NaCl" }, answer: "C" },
        { id: 2, question: "What is the pH of pure water?", options: { A: "5", B: "6", C: "7", D: "8" }, answer: "C" },
        { id: 3, question: "What is the atomic number of carbon?", options: { A: "4", B: "5", C: "6", D: "7" }, answer: "C" },
        { id: 4, question: "What is the chemical symbol for gold?", options: { A: "Go", B: "Gd", C: "Au", D: "Ag" }, answer: "C" },
        { id: 5, question: "What is the formula for table salt?", options: { A: "NaCl", B: "KCl", C: "CaCl", D: "MgCl" }, answer: "A" },
        { id: 6, question: "What is the most abundant gas in Earth's atmosphere?", options: { A: "Oxygen", B: "Carbon dioxide", C: "Nitrogen", D: "Argon" }, answer: "C" },
        { id: 7, question: "What is the chemical symbol for iron?", options: { A: "Ir", B: "Fe", C: "In", D: "Io" }, answer: "B" },
        { id: 8, question: "What is the formula for carbon dioxide?", options: { A: "CO", B: "CO₂", C: "C₂O", D: "C₂O₂" }, answer: "B" },
        { id: 9, question: "What is the atomic number of oxygen?", options: { A: "6", B: "7", C: "8", D: "9" }, answer: "C" },
        { id: 10, question: "What is the chemical symbol for silver?", options: { A: "Si", B: "Sv", C: "Ag", D: "Au" }, answer: "C" },
        { id: 11, question: "What is the pH of an acid?", options: { A: "Below 7", B: "Above 7", C: "7", D: "0" }, answer: "A" },
        { id: 12, question: "What is the chemical symbol for sodium?", options: { A: "So", B: "Na", C: "Sd", D: "N" }, answer: "B" },
        { id: 13, question: "What is the formula for methane?", options: { A: "CH₄", B: "C₂H₆", C: "C₃H₈", D: "C₄H₁₀" }, answer: "A" },
        { id: 14, question: "What is the chemical symbol for potassium?", options: { A: "P", B: "K", C: "Po", D: "Pt" }, answer: "B" },
        { id: 15, question: "What is the pH of a base?", options: { A: "Below 7", B: "Above 7", C: "7", D: "0" }, answer: "B" },
        { id: 16, question: "What is the chemical symbol for lead?", options: { A: "Le", B: "Ld", C: "Pb", D: "Pl" }, answer: "C" },
        { id: 17, question: "What is the formula for ammonia?", options: { A: "NH₃", B: "NH₄", C: "NO₂", D: "NO₃" }, answer: "A" },
        { id: 18, question: "What is the chemical symbol for calcium?", options: { A: "Ca", B: "Cl", C: "C", D: "Co" }, answer: "A" },
        { id: 19, question: "What is the atomic number of hydrogen?", options: { A: "0", B: "1", C: "2", D: "3" }, answer: "B" },
        { id: 20, question: "What is the chemical symbol for mercury?", options: { A: "Me", B: "Mr", C: "Hg", D: "Hy" }, answer: "C" },
        { id: 21, question: "What is the formula for glucose?", options: { A: "C₆H₁₂O₆", B: "C₆H₁₂O₅", C: "C₅H₁₀O₅", D: "C₆H₁₀O₆" }, answer: "A" },
        { id: 22, question: "What is the chemical symbol for tin?", options: { A: "Ti", B: "Tn", C: "Sn", D: "St" }, answer: "C" },
        { id: 23, question: "What is the formula for hydrogen peroxide?", options: { A: "H₂O", B: "H₂O₂", C: "HO₂", D: "H₂O₃" }, answer: "B" },
        { id: 24, question: "What is the chemical symbol for copper?", options: { A: "Co", B: "Cp", C: "Cu", D: "Cr" }, answer: "C" },
        { id: 25, question: "What is the atomic number of nitrogen?", options: { A: "5", B: "6", C: "7", D: "8" }, answer: "C" }
    ],
    medium: [
        { id: 1, question: "What is the formula for sulfuric acid?", options: { A: "H₂SO₄", B: "H₂SO₃", C: "HNO₃", D: "HCl" }, answer: "A" },
        { id: 2, question: "What is the atomic number of sodium?", options: { A: "10", B: "11", C: "12", D: "13" }, answer: "B" },
        { id: 3, question: "What is the formula for hydrochloric acid?", options: { A: "HCl", B: "H₂SO₄", C: "HNO₃", D: "CH₃COOH" }, answer: "A" },
        { id: 4, question: "What is the chemical symbol for tungsten?", options: { A: "Tu", B: "W", C: "Tg", D: "Tn" }, answer: "B" },
        { id: 5, question: "What is the formula for nitric acid?", options: { A: "HNO₂", B: "HNO₃", C: "H₂NO₃", D: "HNO₄" }, answer: "B" },
        { id: 6, question: "What is the atomic number of chlorine?", options: { A: "15", B: "16", C: "17", D: "18" }, answer: "C" },
        { id: 7, question: "What is the formula for acetic acid?", options: { A: "CH₃COOH", B: "CH₃OH", C: "C₂H₅OH", D: "CH₃COOCH₃" }, answer: "A" },
        { id: 8, question: "What is the chemical symbol for platinum?", options: { A: "Pl", B: "Pt", C: "Pm", D: "Pd" }, answer: "B" },
        { id: 9, question: "What is the formula for ammonia?", options: { A: "NH₃", B: "NH₄", C: "NO₃", D: "NO₂" }, answer: "A" },
        { id: 10, question: "What is the atomic number of calcium?", options: { A: "18", B: "19", C: "20", D: "21" }, answer: "C" },
        { id: 11, question: "What is the formula for sodium hydroxide?", options: { A: "NaCl", B: "NaOH", C: "Na₂O", D: "NaH" }, answer: "B" },
        { id: 12, question: "What is the chemical symbol for uranium?", options: { A: "Ur", B: "Un", C: "U", D: "Um" }, answer: "C" },
        { id: 13, question: "What is the formula for potassium permanganate?", options: { A: "KMnO₄", B: "K₂MnO₄", C: "KMnO₃", D: "K₂MnO₃" }, answer: "A" },
        { id: 14, question: "What is the atomic number of iron?", options: { A: "24", B: "25", C: "26", D: "27" }, answer: "C" },
        { id: 15, question: "What is the formula for calcium carbonate?", options: { A: "CaCO₂", B: "CaCO₃", C: "CaC₂O₄", D: "CaCO" }, answer: "B" },
        { id: 16, question: "What is the chemical symbol for chromium?", options: { A: "Cr", B: "Ch", C: "Cm", D: "C" }, answer: "A" },
        { id: 17, question: "What is the formula for benzene?", options: { A: "C₆H₅", B: "C₆H₆", C: "C₆H₁₂", D: "C₆H₄" }, answer: "B" },
        { id: 18, question: "What is the atomic number of potassium?", options: { A: "17", B: "18", C: "19", D: "20" }, answer: "C" },
        { id: 19, question: "What is the formula for ethanol?", options: { A: "CH₃OH", B: "C₂H₅OH", C: "CH₃COOH", D: "C₃H₇OH" }, answer: "B" },
        { id: 20, question: "What is the chemical symbol for manganese?", options: { A: "Ma", B: "Mn", C: "Mg", D: "Md" }, answer: "B" },
        { id: 21, question: "What is the formula for baking soda?", options: { A: "NaCl", B: "Na₂CO₃", C: "NaHCO₃", D: "NaOH" }, answer: "C" },
        { id: 22, question: "What is the atomic number of zinc?", options: { A: "28", B: "29", C: "30", D: "31" }, answer: "C" },
        { id: 23, question: "What is the formula for hydrogen sulfide?", options: { A: "H₂S", B: "H₂SO₄", C: "HS", D: "H₂S₂" }, answer: "A" },
        { id: 24, question: "What is the chemical symbol for antimony?", options: { A: "An", B: "At", C: "Sb", D: "Sn" }, answer: "C" },
        { id: 25, question: "What is the formula for calcium hydroxide?", options: { A: "CaOH", B: "Ca(OH)₂", C: "CaO", D: "Ca₂OH" }, answer: "B" }
    ],
    hard: [
        { id: 1, question: "What is the formula for the compound formed by sodium and oxygen?", options: { A: "NaO", B: "Na₂O", C: "NaO₂", D: "Na₂O₂" }, answer: "B" },
        { id: 2, question: "What is the hybridization of carbon in methane?", options: { A: "sp", B: "sp²", C: "sp³", D: "dsp²" }, answer: "C" },
        { id: 3, question: "What is the formula for the compound formed by aluminum and oxygen?", options: { A: "AlO", B: "Al₂O", C: "AlO₂", D: "Al₂O₃" }, answer: "D" },
        { id: 4, question: "What is the bond angle in a water molecule?", options: { A: "90°", B: "104.5°", C: "109.5°", D: "120°" }, answer: "B" },
        { id: 5, question: "What is the formula for the compound formed by magnesium and nitrogen?", options: { A: "MgN", B: "Mg₂N", C: "MgN₂", D: "Mg₃N₂" }, answer: "D" },
        { id: 6, question: "What is the oxidation state of sulfur in H₂SO₄?", options: { A: "+4", B: "+5", C: "+6", D: "+7" }, answer: "C" },
        { id: 7, question: "What is the formula for the compound formed by calcium and phosphorus?", options: { A: "CaP", B: "Ca₂P", C: "CaP₂", D: "Ca₃P₂" }, answer: "D" },
        { id: 8, question: "What is the molecular geometry of carbon dioxide?", options: { A: "Bent", B: "Linear", C: "Trigonal planar", D: "Tetrahedral" }, answer: "B" },
        { id: 9, question: "What is the formula for the compound formed by iron(III) and oxygen?", options: { A: "FeO", B: "Fe₂O", C: "FeO₂", D: "Fe₂O₃" }, answer: "D" },
        { id: 10, question: "What is the oxidation state of chromium in K₂Cr₂O₇?", options: { A: "+3", B: "+4", C: "+5", D: "+6" }, answer: "D" },
        { id: 11, question: "What is the formula for the compound formed by lead(IV) and oxygen?", options: { A: "PbO", B: "PbO₂", C: "Pb₂O", D: "Pb₂O₃" }, answer: "B" },
        { id: 12, question: "What is the molecular geometry of ammonia?", options: { A: "Trigonal planar", B: "Trigonal pyramidal", C: "Bent", D: "Tetrahedral" }, answer: "B" },
        { id: 13, question: "What is the formula for the compound formed by copper(II) and sulfate?", options: { A: "CuSO₃", B: "CuSO₄", C: "Cu₂SO₄", D: "Cu(SO₄)₂" }, answer: "B" },
        { id: 14, question: "What is the oxidation state of manganese in KMnO₄?", options: { A: "+5", B: "+6", C: "+7", D: "+8" }, answer: "C" },
        { id: 15, question: "What is the formula for the compound formed by zinc and phosphate?", options: { A: "ZnPO₄", B: "Zn₂PO₄", C: "Zn₃(PO₄)₂", D: "Zn(PO₄)₂" }, answer: "C" },
        { id: 16, question: "What is the bond angle in methane?", options: { A: "90°", B: "104.5°", C: "109.5°", D: "120°" }, answer: "C" },
        { id: 17, question: "What is the formula for the compound formed by silver and nitrate?", options: { A: "AgNO₂", B: "AgNO₃", C: "Ag₂NO₃", D: "Ag(NO₃)₂" }, answer: "B" },
        { id: 18, question: "What is the oxidation state of nitrogen in HNO₃?", options: { A: "+3", B: "+4", C: "+5", D: "+6" }, answer: "C" },
        { id: 19, question: "What is the formula for the compound formed by barium and hydroxide?", options: { A: "BaOH", B: "Ba(OH)₂", C: "Ba₂OH", D: "Ba(OH)₃" }, answer: "B" },
        { id: 20, question: "What is the molecular geometry of water?", options: { A: "Linear", B: "Bent", C: "Trigonal planar", D: "Tetrahedral" }, answer: "B" },
        { id: 21, question: "What is the formula for the compound formed by chromium(III) and chloride?", options: { A: "CrCl₂", B: "CrCl₃", C: "CrCl₄", D: "Cr₂Cl₃" }, answer: "B" },
        { id: 22, question: "What is the oxidation state of chlorine in KClO₄?", options: { A: "+3", B: "+5", C: "+7", D: "+9" }, answer: "C" },
        { id: 23, question: "What is the formula for the compound formed by tin(IV) and hydroxide?", options: { A: "SnOH", B: "Sn(OH)₂", C: "Sn(OH)₄", D: "Sn₂(OH)₄" }, answer: "C" },
        { id: 24, question: "What is the bond angle in a tetrahedral molecule?", options: { A: "90°", B: "104.5°", C: "109.5°", D: "120°" }, answer: "C" },
        { id: 25, question: "What is the formula for the compound formed by mercury(II) and oxide?", options: { A: "HgO", B: "Hg₂O", C: "HgO₂", D: "Hg₂O₂" }, answer: "A" }
    ]
};

// ========================================
// COMPLETE QUESTIONS - COMPUTER SCIENCE (25 each level)
// ========================================
const computerScienceQuestions = {
    easy: [
        { id: 1, question: "What does CPU stand for?", options: { A: "Central Processing Unit", B: "Computer Personal Unit", C: "Central Program Utility", D: "Core Processing Unit" }, answer: "A" },
        { id: 2, question: "What is the brain of the computer?", options: { A: "RAM", B: "Hard Drive", C: "CPU", D: "Motherboard" }, answer: "C" },
        { id: 3, question: "What does RAM stand for?", options: { A: "Readily Available Memory", B: "Random Access Memory", C: "Read Access Memory", D: "Rapid Access Memory" }, answer: "B" },
        { id: 4, question: "What does ROM stand for?", options: { A: "Read Only Memory", B: "Random Only Memory", C: "Read Only Mode", D: "Run Only Memory" }, answer: "A" },
        { id: 5, question: "Which of these is a programming language?", options: { A: "HTML", B: "Python", C: "CSS", D: "HTTP" }, answer: "B" },
        { id: 6, question: "What does 'www' stand for?", options: { A: "World Web Wide", B: "Web World Wide", C: "World Wide Web", D: "Wide World Web" }, answer: "C" },
        { id: 7, question: "What is the base of binary number system?", options: { A: "2", B: "8", C: "10", D: "16" }, answer: "A" },
        { id: 8, question: "Which key is used to refresh a webpage?", options: { A: "F1", B: "F3", C: "F5", D: "F7" }, answer: "C" },
        { id: 9, question: "What does USB stand for?", options: { A: "Universal Serial Bus", B: "Universal System Bus", C: "United Serial Bus", D: "Universal Serial Byte" }, answer: "A" },
        { id: 10, question: "Which of these is an operating system?", options: { A: "Windows", B: "Python", C: "Java", D: "Chrome" }, answer: "A" },
        { id: 11, question: "What does HTTP stand for?", options: { A: "HyperText Transfer Protocol", B: "High Transfer Text Protocol", C: "Hyper Transfer Text Protocol", D: "High Text Transfer Protocol" }, answer: "A" },
        { id: 12, question: "What is the smallest unit of data?", options: { A: "Byte", B: "Bit", C: "KB", D: "MB" }, answer: "B" },
        { id: 13, question: "Which company created Windows?", options: { A: "Apple", B: "Google", C: "Microsoft", D: "IBM" }, answer: "C" },
        { id: 14, question: "What does 'Ctrl + C' do?", options: { A: "Paste", B: "Cut", C: "Copy", D: "Save" }, answer: "C" },
        { id: 15, question: "Which of these is a search engine?", options: { A: "Facebook", B: "Google", C: "Instagram", D: "Twitter" }, answer: "B" },
        { id: 16, question: "What does PDF stand for?", options: { A: "Portable Document Format", B: "Printable Document Format", C: "Portable Data Format", D: "Printable Data Format" }, answer: "A" },
        { id: 17, question: "Which language is used for web design?", options: { A: "Python", B: "Java", C: "HTML", D: "C++" }, answer: "C" },
        { id: 18, question: "What does 'Ctrl + V' do?", options: { A: "Copy", B: "Cut", C: "Paste", D: "Save" }, answer: "C" },
        { id: 19, question: "What is the default extension for Word?", options: { A: ".txt", B: ".docx", C: ".pdf", D: ".ppt" }, answer: "B" },
        { id: 20, question: "What does IP stand for?", options: { A: "Internet Protocol", B: "Internal Protocol", C: "Internet Program", D: "Internal Program" }, answer: "A" },
        { id: 21, question: "Who is the father of computers?", options: { A: "Bill Gates", B: "Steve Jobs", C: "Charles Babbage", D: "Alan Turing" }, answer: "C" },
        { id: 22, question: "What does 'Ctrl + Z' do?", options: { A: "Redo", B: "Undo", C: "Cut", D: "Copy" }, answer: "B" },
        { id: 23, question: "Which of these is an output device?", options: { A: "Keyboard", B: "Mouse", C: "Monitor", D: "Scanner" }, answer: "C" },
        { id: 24, question: "What does URL stand for?", options: { A: "Uniform Resource Locator", B: "Universal Resource Locator", C: "Uniform Response Locator", D: "Universal Response Locator" }, answer: "A" },
        { id: 25, question: "What is the latest Windows OS?", options: { A: "Windows 8", B: "Windows 10", C: "Windows 11", D: "Windows XP" }, answer: "C" }
    ],
    medium: [
        { id: 1, question: "What does SQL stand for?", options: { A: "Structured Query Language", B: "Simple Query Language", C: "Structured Question Language", D: "Simple Question Language" }, answer: "A" },
        { id: 2, question: "What is an algorithm?", options: { A: "A programming language", B: "Step-by-step procedure", C: "A type of computer", D: "A software" }, answer: "B" },
        { id: 3, question: "What does 'bug' mean in computing?", options: { A: "Insect", B: "Error in code", C: "Virus", D: "Hardware issue" }, answer: "B" },
        { id: 4, question: "What is the cloud?", options: { A: "Weather phenomenon", B: "Internet-based computing", C: "Physical storage", D: "Type of server" }, answer: "B" },
        { id: 5, question: "What does AI stand for?", options: { A: "Artificial Intelligence", B: "Automated Intelligence", C: "Artificial Interface", D: "Automated Interface" }, answer: "A" },
        { id: 6, question: "What is a firewall?", options: { A: "Security system", B: "Web browser", C: "Operating system", D: "Programming tool" }, answer: "A" },
        { id: 7, question: "What does HTML stand for?", options: { A: "HyperText Markup Language", B: "HighText Markup Language", C: "HyperText Markdown Language", D: "HighText Markdown Language" }, answer: "A" },
        { id: 8, question: "What is a compiler?", options: { A: "Converts code to machine language", B: "Web browser", C: "Text editor", D: "Database" }, answer: "A" },
        { id: 9, question: "What does VPN stand for?", options: { A: "Virtual Private Network", B: "Virtual Public Network", C: "Very Private Network", D: "Virtual Protected Network" }, answer: "A" },
        { id: 10, question: "What is JavaScript used for?", options: { A: "Database management", B: "Web interactivity", C: "Operating system", D: "Hardware control" }, answer: "B" },
        { id: 11, question: "What does API stand for?", options: { A: "Application Programming Interface", B: "Application Program Interface", C: "Application Programming Input", D: "Application Program Input" }, answer: "A" },
        { id: 12, question: "What is a loop in programming?", options: { A: "Repeating code", B: "Single execution", C: "Condition check", D: "Variable storage" }, answer: "A" },
        { id: 13, question: "What does DBMS stand for?", options: { A: "Database Management System", B: "Data Base Management System", C: "Database Maintenance System", D: "Data Basic Management System" }, answer: "A" },
        { id: 14, question: "What is a kilobyte?", options: { A: "1000 bytes", B: "1024 bytes", C: "1000 bits", D: "1024 bits" }, answer: "B" },
        { id: 15, question: "What does SSD stand for?", options: { A: "Solid State Drive", B: "Solid System Drive", C: "Super Speed Drive", D: "System State Drive" }, answer: "A" },
        { id: 16, question: "What is a function in programming?", options: { A: "Reusable code block", B: "Variable name", C: "Loop structure", D: "Conditional statement" }, answer: "A" },
        { id: 17, question: "What does IDE stand for?", options: { A: "Integrated Development Environment", B: "Integrated Design Environment", C: "Internal Development Environment", D: "Interface Development Environment" }, answer: "A" },
        { id: 18, question: "What is an array?", options: { A: "Collection of variables", B: "Single variable", C: "Function", D: "Loop" }, answer: "A" },
        { id: 19, question: "What does DNS stand for?", options: { A: "Domain Name System", B: "Digital Name System", C: "Domain Network System", D: "Digital Network System" }, answer: "A" },
        { id: 20, question: "What is a hacker?", options: { A: "Security expert", B: "Someone who breaks into systems", C: "Software developer", D: "Hardware engineer" }, answer: "B" },
        { id: 21, question: "What does CSS stand for?", options: { A: "Cascading Style Sheets", B: "Computer Style Sheets", C: "Creative Style Sheets", D: "Coded Style Sheets" }, answer: "A" },
        { id: 22, question: "What is a server?", options: { A: "Computer that provides services", B: "Desktop computer", C: "Laptop", D: "Smartphone" }, answer: "A" },
        { id: 23, question: "What does IoT stand for?", options: { A: "Internet of Things", B: "Internet of Technology", C: "Interface of Things", D: "Integration of Things" }, answer: "A" },
        { id: 24, question: "What is encryption?", options: { A: "Converting data to code", B: "Deleting data", C: "Copying data", D: "Moving data" }, answer: "A" },
        { id: 25, question: "What does GB stand for?", options: { A: "Gigabyte", B: "Gigabit", C: "Giga Byte", D: "Giga Bit" }, answer: "A" }
    ],
    hard: [
        { id: 1, question: "What is the time complexity of binary search?", options: { A: "O(n)", B: "O(log n)", C: "O(n²)", D: "O(1)" }, answer: "B" },
        { id: 2, question: "What does TCP/IP stand for?", options: { A: "Transmission Control Protocol/Internet Protocol", B: "Transfer Control Protocol/Internet Protocol", C: "Transmission Control Program/Internet Program", D: "Transfer Control Program/Internet Program" }, answer: "A" },
        { id: 3, question: "What is a deadlock?", options: { A: "Two processes waiting for each other", B: "Program crash", C: "Memory leak", D: "CPU overload" }, answer: "A" },
        { id: 4, question: "What does ACID stand for in databases?", options: { A: "Atomicity, Consistency, Isolation, Durability", B: "Atomicity, Consistency, Integrity, Durability", C: "Atomicity, Concurrency, Isolation, Durability", D: "Atomicity, Consistency, Isolation, Data" }, answer: "A" },
        { id: 5, question: "What is the difference between HTTP and HTTPS?", options: { A: "Encryption", B: "Speed", C: "Port number", D: "Protocol type" }, answer: "A" },
        { id: 6, question: "What is a DDoS attack?", options: { A: "Distributed Denial of Service", B: "Direct Denial of Service", C: "Digital Denial of Service", D: "Data Denial of Service" }, answer: "A" },
        { id: 7, question: "What is a cryptographic hash function?", options: { A: "One-way encryption", B: "Two-way encryption", C: "Data compression", D: "Data backup" }, answer: "A" },
        { id: 8, question: "What is the maximum value of a 32-bit integer?", options: { A: "2,147,483,647", B: "4,294,967,295", C: "1,073,741,823", D: "65,535" }, answer: "A" },
        { id: 9, question: "What is the difference between TCP and UDP?", options: { A: "Connection vs connectionless", B: "Fast vs slow", C: "Secure vs insecure", D: "Reliable vs more reliable" }, answer: "A" },
        { id: 10, question: "What does OOP stand for?", options: { A: "Object-Oriented Programming", B: "Object-Oriented Protocol", C: "Object-Ordered Programming", D: "Object-Ordered Protocol" }, answer: "A" },
        { id: 11, question: "What is polymorphism in OOP?", options: { A: "Many forms", B: "Single form", C: "Data hiding", D: "Code reuse" }, answer: "A" },
        { id: 12, question: "What does MVC stand for?", options: { A: "Model-View-Controller", B: "Model-View-Container", C: "Main-View-Controller", D: "Model-View-Control" }, answer: "A" },
        { id: 13, question: "What is a race condition?", options: { A: "Unpredictable outcome due to timing", B: "Speed comparison", C: "Competition for resources", D: "Program crash" }, answer: "A" },
        { id: 14, question: "What does JSON stand for?", options: { A: "JavaScript Object Notation", B: "Java Object Notation", C: "JavaScript Oriented Notation", D: "Java Oriented Notation" }, answer: "A" },
        { id: 15, question: "What is a NoSQL database?", options: { A: "Non-relational database", B: "Non-SQL database", C: "Not Only SQL database", D: "New SQL database" }, answer: "C" },
        { id: 16, question: "What is the difference between stack and queue?", options: { A: "LIFO vs FIFO", B: "FIFO vs LIFO", C: "Fast vs slow", D: "Slow vs fast" }, answer: "A" },
        { id: 17, question: "What does CAP theorem state?", options: { A: "Consistency, Availability, Partition tolerance", B: "Consistency, Availability, Performance", C: "Consistency, Accuracy, Performance", D: "Consistency, Accuracy, Partition tolerance" }, answer: "A" },
        { id: 18, question: "What is a binary tree?", options: { A: "Tree with max 2 children per node", B: "Tree with 2 nodes", C: "Binary search structure", D: "Data structure" }, answer: "A" },
        { id: 19, question: "What does REST stand for?", options: { A: "Representational State Transfer", B: "Representational State Transport", C: "Representative State Transfer", D: "Representative State Transport" }, answer: "A" },
        { id: 20, question: "What is a virtual machine?", options: { A: "Software emulating a computer", B: "Physical computer", C: "Cloud server", D: "Network device" }, answer: "A" },
        { id: 21, question: "What is the kernel?", options: { A: "Core of operating system", B: "Security software", C: "User interface", D: "File system" }, answer: "A" },
        { id: 22, question: "What is a microservice?", options: { A: "Small independent service", B: "Microprocessor", C: "Small database", D: "Microcontroller" }, answer: "A" },
        { id: 23, question: "What is a container?", options: { A: "Packaged application with dependencies", B: "Storage device", C: "Virtual machine", D: "Database container" }, answer: "A" },
        { id: 24, question: "What does RISC stand for?", options: { A: "Reduced Instruction Set Computer", B: "Reduced Integration Set Computer", C: "Reduced Instruction System Computer", D: "Reduced Integration System Computer" }, answer: "A" },
        { id: 25, question: "What is a quantum bit?", options: { A: "Qubit - superposition of 0 and 1", B: "Quantum byte", C: "Quantum processing unit", D: "Quantum system" }, answer: "A" }
    ]
};

// Combine all questions
const questions = {
    mathematics: mathematicsQuestions,
    english: englishQuestions,
    physics: physicsQuestions,
    biology: biologyQuestions,
    chemistry: chemistryQuestions,
    computerscience: computerScienceQuestions
};

console.log("✅ Questions loaded:");
console.log(`   Mathematics: Easy ${mathematicsQuestions.easy.length}, Medium ${mathematicsQuestions.medium.length}, Hard ${mathematicsQuestions.hard.length}`);
console.log(`   English: Easy ${englishQuestions.easy.length}, Medium ${englishQuestions.medium.length}, Hard ${englishQuestions.hard.length}`);
console.log(`   Physics: Easy ${physicsQuestions.easy.length}, Medium ${physicsQuestions.medium.length}, Hard ${physicsQuestions.hard.length}`);
console.log(`   Biology: Easy ${biologyQuestions.easy.length}, Medium ${biologyQuestions.medium.length}, Hard ${biologyQuestions.hard.length}`);
console.log(`   Chemistry: Easy ${chemistryQuestions.easy.length}, Medium ${chemistryQuestions.medium.length}, Hard ${chemistryQuestions.hard.length}`);
console.log(`   Computer Science: Easy ${computerScienceQuestions.easy.length}, Medium ${computerScienceQuestions.medium.length}, Hard ${computerScienceQuestions.hard.length}`);

// ========================================
// API ENDPOINTS
// ========================================

app.get("/", (req, res) => {
    res.send("🎉 Exam Pro API is running! Use /api/test to verify.");
});

app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is working!", users: users.length, exams: examHistory.length, status: "online" });
});

// SIGNUP WITH EMAIL VERIFICATION
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
        const verificationToken = crypto.randomBytes(32).toString("hex");
        
        const newUser = {
            id: users.length + 1,
            fullname,
            email,
            password: password,
            verified: false,
            verificationToken: verificationToken,
            created_at: new Date().toISOString()
        };
        users.push(newUser);
        saveData();
        
        await sendVerificationEmail(email, fullname, verificationToken);
        
        console.log("✅ User created - verification email sent:", email);
        res.json({ 
            message: "Account created! Please check your email to verify your account.",
            requiresVerification: true
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// VERIFY EMAIL
app.get("/api/verify", (req, res) => {
    const { token, email } = req.query;
    console.log(`🔐 Verification request for ${email}`);
    
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(400).json({ error: "Invalid verification link" });
    }
    
    if (user.verified) {
        return res.json({ message: "Email already verified! You can now login." });
    }
    
    if (user.verificationToken !== token) {
        return res.status(400).json({ error: "Invalid or expired verification token" });
    }
    
    user.verified = true;
    user.verificationToken = null;
    saveData();
    
    console.log(`✅ Email verified for ${email}`);
    res.json({ message: "Email verified successfully! You can now login." });
});

// LOGIN
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
    
    if (!user.verified) {
        return res.status(401).json({ error: "Please verify your email before logging in. Check your inbox." });
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

// RESEND VERIFICATION
app.post("/api/resend-verification", async (req, res) => {
    const { email } = req.body;
    const user = users.find(u => u.email === email);
    
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    
    if (user.verified) {
        return res.status(400).json({ error: "Email already verified" });
    }
    
    const newToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = newToken;
    saveData();
    
    await sendVerificationEmail(email, user.fullname, newToken);
    res.json({ message: "Verification email resent! Check your inbox." });
});

// GET QUESTIONS
app.get("/questions/:subject/:level", (req, res) => {
    const { subject, level } = req.params;
    console.log(`📚 Questions requested: ${subject}/${level}`);
    
    if (!questions[subject] || !questions[subject][level]) {
        return res.json([]);
    }
    
    res.json(questions[subject][level]);
});

// SUBMIT EXAM
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
        verified: u.verified || false,
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
    console.log(`📧 Brevo email verification enabled!`);
    console.log(`📚 ${mathematicsQuestions.easy.length + mathematicsQuestions.medium.length + mathematicsQuestions.hard.length + englishQuestions.easy.length + englishQuestions.medium.length + englishQuestions.hard.length + physicsQuestions.easy.length + physicsQuestions.medium.length + physicsQuestions.hard.length + biologyQuestions.easy.length + biologyQuestions.medium.length + biologyQuestions.hard.length + chemistryQuestions.easy.length + chemistryQuestions.medium.length + chemistryQuestions.hard.length + computerScienceQuestions.easy.length + computerScienceQuestions.medium.length + computerScienceQuestions.hard.length} total questions loaded!`);
    console.log(`\n🌐 Ready to accept requests!\n`);
});