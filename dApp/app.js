const express = require("express");
const { ethers } = require("ethers");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());

// Smart contract ABI and address
const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // Replace with your testnet contract address
const abi = [
    {
        "inputs": [
            { "internalType": "string", "name": "email", "type": "string" },
            { "internalType": "string", "name": "hashedPassword", "type": "string" }
        ],
        "name": "registerUser",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "userAddress", "type": "address" },
            { "internalType": "string", "name": "inputHashedPassword", "type": "string" }
        ],
        "name": "validateLogin",
        "outputs": [
            { "internalType": "bool", "name": "", "type": "bool" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "", "type": "address" }
        ],
        "name": "users",
        "outputs": [
            { "internalType": "string", "name": "email", "type": "string" },
            { "internalType": "string", "name": "hashedPassword", "type": "string" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "userAddress", "type": "address" },
            { "indexed": false, "internalType": "string", "name": "email", "type": "string" }
        ],
        "name": "UserRegistered",
        "type": "event"
    }
]

// Testnet RPC URL and wallet setup
const provider = new ethers.JsonRpcProvider("https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID"); // Goerli testnet
const signer = new ethers.Wallet("YOUR_PRIVATE_KEY", provider); // Testnet wallet private key
const contract = new ethers.Contract(contractAddress, abi, signer);

// User registration endpoint
app.post("/register-user", async (req, res) => {
    const { email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Register the user on the blockchain
        const tx = await contract.registerUser(email, hashedPassword);
        await tx.wait(); // Wait for transaction to be mined

        res.json({ status: "success", message: "User registered successfully" });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
});

// Start the server
app.listen(4000, () => console.log("Server running on port 4000"));
