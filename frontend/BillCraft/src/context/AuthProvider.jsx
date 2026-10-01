import { useState } from "react";
import { AuthContext } from "./authContext.js";

const readStoredAuth = () => {
    try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (token && storedUser) {
            const user = JSON.parse(storedUser);
            if (user && typeof user === "object") {
                return { user, isAuthenticated: true };
            }
        }
    } catch (error) {
        console.error("Authentication state could not be restored:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { user: null, isAuthenticated: false };
};

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(readStoredAuth);

    const login = (token, user) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setAuth({ user, isAuthenticated: true });
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");
        setAuth({ user: null, isAuthenticated: false });
    };

    const updateUser = (user) => {
        localStorage.setItem("user", JSON.stringify(user));
        setAuth((current) => ({ ...current, user }));
    };

    return (
        <AuthContext.Provider value={{ ...auth, loading: false, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;