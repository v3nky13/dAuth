import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserIcon from "../../assets/profile.png";

const Header = () => {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                navigate('/'); // Redirect to login if token is missing
                return;
            }

            try {
                const response = await fetch('http://localhost:4000/validate', {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await response.json();
                if (!data.isValid) {
                    localStorage.removeItem('username');
                    localStorage.removeItem('token');
                    navigate('/');
                }
            } catch (error) {
                console.error('Token validation failed:', error);
                localStorage.removeItem('username');
                localStorage.removeItem('token');
                navigate('/');
            }
        };

        validateToken();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        navigate('/home');
    };

    return (
        <div className="header-container">
            {/* Logo */}
            <Link to="/" className="logo-container">
                <h1 className="logo-text">
                    Snap<span className="highlight-text">work</span>
                </h1>
            </Link>

            {/* User Info */}
            <div className="user-info">
                <img src={UserIcon} alt="User Icon" className="user-icon" />
                <span className="user-name">
                    {username ? `Welcome, ${username}` : 'Guest'}
                </span>
                {username && (
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                )}
            </div>
        </div>
    );
};

export default Header;
