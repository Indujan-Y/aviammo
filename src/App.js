import React, { useState } from 'react';
import { db } from './db/firebaseconfig';
import { ref, onValue } from 'firebase/database';
import AdminPage from './AdminPage';
import './App.css';

function App() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => {
        const adminRef = ref(db, 'admin');
        onValue(adminRef, (snapshot) => {
            const adminData = snapshot.val();
            if (adminData && adminData.name === username && adminData.password === password) {
                setIsAuthenticated(true);
            } else {
                setError('Invalid username or password');
            }
        });
    };

    if (isAuthenticated) {
        return <AdminPage />;
    }

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

export default App;
