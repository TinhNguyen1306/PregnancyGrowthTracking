import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userEmail, setUserEmail] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);

    useEffect(() => {
        const savedEmail = localStorage.getItem("userEmail");
        const savedFirstName = localStorage.getItem("firstName");
        const savedLastName = localStorage.getItem("lastName");

        if (savedEmail) setUserEmail(savedEmail);
        if (savedFirstName) setFirstName(savedFirstName);
        if (savedLastName) setLastName(savedLastName);
    }, []);

    const login = (email, firstName, lastName) => {
        localStorage.setItem("userEmail", email);
        localStorage.setItem("firstName", firstName);
        localStorage.setItem("lastName", lastName);

        setUserEmail(email);
        setFirstName(firstName);
        setLastName(lastName);
    };
    const logout = () => {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");

        setUserEmail(null);
        setFirstName(null);
        setLastName(null);
    };

    return (
        <UserContext.Provider value={{ userEmail, firstName, lastName, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
