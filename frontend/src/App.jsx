import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [page, setPage] = useState('login');
    const [user, setUser] = useState(null);
    
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regRole, setRegRole] = useState('adopter');
    
    const [error, setError] = useState('');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
            setPage('home');
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                email: loginEmail,
                password: loginPassword
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setUser(response.data.user);
            setPage('home');
            alert('✅ Login successful!');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/register', {
                full_name: regName,
                email: regEmail,
                password: regPassword,
                role: regRole
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setUser(response.data.user);
            setPage('home');
            alert('✅ Registration successful!');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setPage('login');
        alert('👋 Logged out!');
    };

    // LOGIN PAGE
    if (page === 'login') {
        return (
            <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto', fontFamily: 'Arial' }}>
                <h2 style={{ color: '#4A90E2' }}>🐾 Pet Adoption - Login</h2>
                {error && <p style={{ color: 'red', background: '#ffe6e6', padding: '10px', borderRadius: '5px' }}>{error}</p>}
                
                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontWeight: 'bold' }}>Email:</label><br/>
                        <input
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                            style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ddd' }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontWeight: 'bold' }}>Password:</label><br/>
                        <input
                            type="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                            style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ddd' }}
                        />
                    </div>

                    <button type="submit" style={{ width: '100%', padding: '12px', fontSize: '16px', background: '#4A90E2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Login
                    </button>
                </form>

                <p style={{ marginTop: '20px', textAlign: 'center' }}>
                    Don't have an account? 
                    <button onClick={() => setPage('register')} style={{ marginLeft: '10px', padding: '8px 15px', cursor: 'pointer', background: '#50C878', color: 'white', border: 'none', borderRadius: '5px' }}>
                        Register
                    </button>
                </p>
            </div>
        );
    }

    // REGISTER PAGE
    if (page === 'register') {
        return (
            <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto', fontFamily: 'Arial' }}>
                <h2 style={{ color: '#50C878' }}>🐾 Pet Adoption - Register</h2>
                {error && <p style={{ color: 'red', background: '#ffe6e6', padding: '10px', borderRadius: '5px' }}>{error}</p>}
                
                <form onSubmit={handleRegister}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontWeight: 'bold' }}>Full Name:</label><br/>
                        <input
                            type="text"
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            required
                            placeholder="Enter your full name"
                            style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ddd' }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontWeight: 'bold' }}>Email:</label><br/>
                        <input
                            type="email"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                            style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ddd' }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontWeight: 'bold' }}>Password:</label><br/>
                        <input
                            type="password"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            required
                            placeholder="At least 6 characters"
                            style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ddd' }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontWeight: 'bold' }}>I am a:</label><br/>
                        <select 
                            value={regRole} 
                            onChange={(e) => setRegRole(e.target.value)}
                            style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ddd' }}
                        >
                            <option value="adopter">Pet Adopter 🏠</option>
                            <option value="shelter_admin">Shelter Admin 🏢</option>
                            <option value="vet">Veterinarian 🩺</option>
                        </select>
                    </div>

                    <button type="submit" style={{ width: '100%', padding: '12px', fontSize: '16px', background: '#50C878', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Register
                    </button>
                </form>

                <p style={{ marginTop: '20px', textAlign: 'center' }}>
                    Already have an account? 
                    <button onClick={() => setPage('login')} style={{ marginLeft: '10px', padding: '8px 15px', cursor: 'pointer', background: '#4A90E2', color: 'white', border: 'none', borderRadius: '5px' }}>
                        Login
                    </button>
                </p>
            </div>
        );
    }

    // HOME PAGE
    if (page === 'home' && user) {
        return (
            <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial' }}>
                <h1 style={{ color: '#50C878' }}>🎉 Welcome, {user.full_name}!</h1>
                <div style={{ marginTop: '30px', fontSize: '18px', background: '#f0f8ff', padding: '30px', borderRadius: '10px', maxWidth: '500px', margin: '30px auto' }}>
                    <p><strong>📧 Email:</strong> {user.email}</p>
                    <p><strong>👤 Role:</strong> {user.role}</p>
                    <p><strong>🆔 User ID:</strong> {user.user_id}</p>
                </div>
                <button 
                    onClick={handleLogout} 
                    style={{ padding: '12px 30px', marginTop: '20px', fontSize: '16px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Logout
                </button>
            </div>
        );
    }

    return <div>Loading...</div>;
}

export default App;