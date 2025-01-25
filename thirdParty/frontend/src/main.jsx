import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register.jsx';
import Login from './Login.jsx';  // Import Login component
// import './index.css';
import App from './App.jsx';
import NavBar from "./pages/LandingPage";
import './indexApp.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />  {/* Main app page */}
        <Route path="/login" element={<Login />} />  {/* Login page */}
        <Route path="/home" element={<App />} />  {/* Login page */}
        <Route path="/landing" element={<NavBar />} />  {/* Login page */}
      </Routes>
    </Router>
  </React.StrictMode>
);
