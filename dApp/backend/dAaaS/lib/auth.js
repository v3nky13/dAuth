const crypto = require("crypto");
const { ethers } = require("ethers");
const dotenv = require("dotenv");
dotenv.config();
// Initialize blockchain provider and contract

const { HARDHAT_URL, PRIVATE_KEY, CONTRACT_ADDRESS } = process.env;
const provider = new ethers.JsonRpcProvider(HARDHAT_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const CONTRACT_ABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_username",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_password",
          "type": "string"
        }
      ],
      "name": "register",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_username",
          "type": "string"
        }
      ],
      "name": "getData",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "anonymous": true,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "username",
          "type": "string"
        }
      ],
      "name": "Registered",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_username",
          "type": "string"
        }
      ],
      "name": "userPasswords",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_username",
          "type": "string"
        }
      ],
      "name": "registered",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
];
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

async function registerUser(username, password) {
    const derivedKey = crypto.pbkdf2Sync(username + password, '', 100000, 32, 'sha256').toString('hex');
    const cipher = crypto.createCipher('aes-256-ctr', derivedKey);
    const encryptedPassword = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
    const tx = await contract.register(username, encryptedPassword);
    await tx.wait();
    return tx.hash;
}

async function validateUser(username, password) {
    const [isValid, encryptedPassword] = await contract.getData(username);
    if (!isValid) throw new Error("User not registered");

    const derivedKey = crypto.pbkdf2Sync(username + password, '', 100000, 32, 'sha256').toString('hex');
    const decipher = crypto.createDecipher('aes-256-ctr', derivedKey);
    const decryptedPassword = decipher.update(encryptedPassword, 'hex', 'utf8') + decipher.final('utf8');
    return decryptedPassword === password;
}

module.exports = { registerUser, validateUser };
