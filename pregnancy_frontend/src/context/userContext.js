import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        // Load user từ localStorage khi component mount
        const savedEmail = localStorage.getItem("userEmail");
        if (savedEmail) {
            setUserEmail(savedEmail);
        }
    }, []);

    const login = (email) => {
        localStorage.setItem("userEmail", email);
        setUserEmail(email);
    };

    const logout = () => {
        localStorage.removeItem("userEmail");
        setUserEmail(null);
    };

    return (
        <UserContext.Provider value={{ userEmail, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
