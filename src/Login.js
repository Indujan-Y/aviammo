import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { db } from './db/firebaseconfig';
import { ref, onValue } from 'firebase/database';
import AdminPage from './AdminPage';
import './Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();

    const handleLogin = () => {
        const adminRef = ref(db, 'admin');
        onValue(adminRef, (snapshot) => {
            const adminData = snapshot.val();
            if (adminData && adminData.name === username && adminData.password === password) {
                history.push('/admin');
            } else {
                setError('Invalid username or password');
            }
        });
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <h2>Admin Login</h2>
                {error && <p className="error">{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
}

export default Login;
