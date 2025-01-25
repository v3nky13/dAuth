const express = require("express");
const https = require("https");
const fs = require("fs");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { body, validationResult } = require("express-validator");

const { registerUser, validateUser } = require("./lib/auth");
const {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
} = require("./lib/token");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;
const HTTPS_OPTIONS = {
    key: fs.readFileSync(process.env.HTTPS_KEY),
    cert: fs.readFileSync(process.env.HTTPS_CERT),
};

// Register endpoint
app.post(
    "/register",
    [body("username").notEmpty(), body("password").isLength({ min: 6 })],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { username, password } = req.body;
        try {
            await registerUser(username, password);
            res.status(201).send("User registered successfully");
        } catch (err) {
            console.error(err);
            res.status(500).send("Registration failed");
        }
    }
);

// Login endpoint
app.post(
    "/login",
    [body("username").notEmpty(), body("password").notEmpty()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { username, password } = req.body;
        try {
            const isValid = await validateUser(username, password);
            if (!isValid) return res.status(401).send("Invalid credentials");

            const accessToken = generateAccessToken({ username });
            const refreshToken = generateRefreshToken({ username });
            res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
            res.json({ accessToken });
        } catch (err) {
            console.error(err);
            res.status(500).send("Login failed");
        }
    }
);

// Token refresh endpoint
app.post("/token", async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(403).send("Refresh token required");

    try {
        const payload = verifyRefreshToken(refreshToken);
        const newAccessToken = generateAccessToken({ username: payload.username });
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        console.error(err);
        res.status(403).send("Invalid refresh token");
    }
});

// Protected resource endpoint
app.get("/protected", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send("Access token required");
    }

    const token = authHeader.split(" ")[1];
    try {
        const payload = verifyAccessToken(token);
        res.json({ message: `Hello, ${payload.username}` });
    } catch (err) {
        console.error(err);
        res.status(403).send("Invalid access token");
    }
});

// Start server
https.createServer(HTTPS_OPTIONS, app).listen(PORT, () => {
    console.log(`Secure server running at https://localhost:${PORT}`);
});
