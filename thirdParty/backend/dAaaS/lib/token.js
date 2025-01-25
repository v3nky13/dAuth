const jwt = require("jsonwebtoken");

const { SECRET_KEY, REFRESH_SECRET } = process.env;

function generateAccessToken(payload, expiresIn = "15m") {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

function generateRefreshToken(payload) {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
}

function verifyAccessToken(token) {
    return jwt.verify(token, SECRET_KEY);
}

function verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_SECRET);
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};
