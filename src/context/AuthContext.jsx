import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Mock Admin Credentials
    const MOCK_ADMIN = {
        username: "admin",
        password: "admin",
        name: "Admin User",
        avatar: "https://i.pravatar.cc/150?u=admin_logo_energy"
    };

    const login = (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === MOCK_ADMIN.username && password === MOCK_ADMIN.password) {
                    const userData = { username: MOCK_ADMIN.username, name: MOCK_ADMIN.name, avatar: MOCK_ADMIN.avatar, role: 'admin' };
                    setUser(userData);
                    setIsAuthenticated(true);
                    localStorage.setItem('user', JSON.stringify(userData));
                    resolve(userData);
                } else {
                    reject(new Error("Invalid credentials"));
                }
            }, 800); // Mock network delay
        });
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
    };

    // Check for persisted user on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

