import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import './index.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [timeSpent, setTimeSpent] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        const startTime = performance.now();

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const endTime = performance.now();
            const timeTaken = (endTime - startTime) / 1000;
            setTimeSpent(timeTaken.toFixed(2));

            if (response.ok) {
                const data = await response.json();
                setIsSuccess(true);
                setMessage(`Login successful! Welcome, ${data.name}`);
                localStorage.setItem('username', data.name);
                localStorage.setItem('token', data.token);
                navigate('/landing'); // Redirect to landing page
            } else {
                setIsSuccess(false);
                setMessage('Username or password is incorrect.');
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
                <h3>🔐<br />Login with dAaaS</h3>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                />
                <button onClick={handleLogin} disabled={isLoading}>
                    {isLoading ? (
                        <div className="spinner"></div> // Show spinner while loading
                    ) : (
                        'Login'
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

export default Login;
