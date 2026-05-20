"use client";
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user session exists on browser load/reload
    useEffect(() => {
        const storedUser = localStorage.getItem("mq-user");
        const storedToken = localStorage.getItem("mq-token");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Logout function to clean up browser cache
    const logout = () => {
        localStorage.removeItem("mq-token");
        localStorage.removeItem("mq-user");
        setUser(null);
    };

    const authInfo = {
        user,
        setUser,
        loading,
        logout
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};