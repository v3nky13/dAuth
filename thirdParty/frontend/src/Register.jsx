import React, { useState } from 'react';
import './App.css'; // Import App.css for component-specific styles
import './index.css';

const Register = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [reEnterPassword, setReEnterPassword] = useState('');
    const [dob, setDob] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [timeSpent, setTimeSpent] = useState(null); // New state to hold the time spent

    const handleRegister = async () => {
        if (password !== reEnterPassword) {
            setMessage('Passwords do not match.');
            setIsSuccess(false);
            return;
        }

        if (password.length < 8) {
            setMessage('Password must be at least 8 characters.');
            setIsSuccess(false);
            return;
        }

        const startTime = performance.now(); // Start the timer

        setIsLoading(true);

        try {
            console.log('Sending register request...');
            const response = await fetch('http://localhost:4000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, username, password}),
            });

            const endTime = performance.now(); // End the timer
            const timeTaken = (endTime - startTime) / 1000; // Time in seconds

            setTimeSpent(timeTaken.toFixed(2)); // Set the time spent in seconds
            if (response.ok) {
                setIsSuccess(true);
                setMessage('User registered!');
                console.log('User registered successfully!');
            } else {
                setIsSuccess(false);
                setMessage('Username already exists.');
                console.log('Username already exists.');
            }
        } catch (error) {
            setIsSuccess(false);
            setMessage('Error connecting to the server.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="login-box">
                <h3>🔐<br />Register with dAaaS</h3>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name*"
                    required
                />
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username*"
                    required
                />
                <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    placeholder="Enter your date of birth"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password*"
                    required
                />
                <input
                    type="password"
                    value={reEnterPassword}
                    onChange={(e) => setReEnterPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    required
                />
                <button onClick={handleRegister} disabled={isLoading}>
                    {isLoading ? (
                        <div className="spinner"></div> // Show spinner while loading
                    ) : (
                        'Register'
                    )}
                </button>
                {message && (
                    <p className={`message ${isSuccess ? 'success' : 'error'}`}>
                        {message}
                    </p>
                )}
                {timeSpent && (
                    <p className="time-spent">
                        Time spent: {timeSpent} seconds
                    </p>
                )}
            </div>
        </div>
    );
};

export default Register;
