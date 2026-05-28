import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../api/auth.api";
import { loginUser, registerUser } from "../api/auth.api";
import { initSocket, disconnectSocket } from "../socket/socket";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in on app load
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            getMe()
                .then((data) => {
                    setUser(data); // not data.user
                    initSocket(token);
                })
                .catch(() => {
                    localStorage.removeItem("token");
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (credentials) => {
        const data = await loginUser(credentials);
        console.log("Login response:", data); // ADD THIS
        const { token, ...user } = data;
        localStorage.setItem("token", token);
        setUser(user);
        initSocket(token);
        return data;
    };

    const register = async (credentials) => {
        const data = await registerUser(credentials);
        const { token, ...user } = data;
        localStorage.setItem("token", token);
        setUser(user);
        initSocket(token);
        return data;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        disconnectSocket();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);