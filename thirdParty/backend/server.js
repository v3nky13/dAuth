const express = require('express');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors({origin: '*'}));
app.use(bodyParser.json());

const SECRET_KEY = 'my_secret_key'; // Use a secure key in production

// Hardhat local blockchain details
const HARDHAT_URL = 'http://127.0.0.1:8545'; // Default Hardhat local URL
const PRIVATE_KEY = '0x47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942dd'; // Replace with a private key from Hardhat accounts
const CONTRACT_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3'; // Replace with the deployed contract address

// Contract ABI based on your Solidity contract
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
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      }
    ],
    "name": "register",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
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
        "indexed": true,
        "internalType": "string",
        "name": "username",
        "type": "string"
      }
    ],
    "name": "Registered",
    "type": "event"
  }
];

// Connect to Hardhat local network
const provider = new ethers.JsonRpcProvider(HARDHAT_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

// API endpoint for user registration
app.post('/register', async (req, res) => {
    const { name, username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        // Generate key from username and password
        const derivedKey = crypto.pbkdf2Sync(username + password, '', 100000, 32, 'sha256').toString('hex');

        // Encrypt the password using the derived key
        const cipher = crypto.createCipher('aes-256-ctr', derivedKey);
        const encrypted_password = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');

        // Call the register function on the smart contract
        const tx = await contract.register(username, encrypted_password.toString(), name);
        await tx.wait(); // Wait for the transaction to be mined

        if (!tx) {
          return res.status(401).send('User already registered');
        }

        return res.status(200).send('User registered successfully');
    } catch (error) {
        console.error('Error calling contract:', error);
        return res.status(500).send('Error connecting to the blockchain');
    }
});

// API endpoint for login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        // Call the login function on the smart contract
        const [isValid, encrypted_password, name] = await contract.getData(username);

        if (!isValid) {
            return res.status(401).send('User not registered');
        }

        // Decrypt the password using the derived key
        const derivedKey = crypto.pbkdf2Sync(username + password, '', 100000, 32, 'sha256').toString('hex'); // 256-bit key
        const decipher = crypto.createDecipher('aes-256-ctr', derivedKey);
        const decrypted_password = decipher.update(encrypted_password, 'hex', 'utf8') + decipher.final('utf8');

        if (decrypted_password === password) {
            // Generate JWT token for the user
            const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
            // console.log(token);

            // res.redirect(`http://localhost:5173/landing?name=${name}`);
            return res.json({ token, name });
        } else {
            return res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error('Error calling contract:', error);
        return res.status(500).send('Error connecting to the blockchain');
    }
});

// Start the server
app.listen(4000, () => {
    console.log('Backend running on http://localhost:4000');
});

app.get('/validate', async (req, res) => {
  console.log('Validate request received');
    const token = req.headers['authorization'].split(' ')[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.json({ isValid: true });
    } catch (error) {
        res.json({ isValid: false });
    }
});

