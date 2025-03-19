import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userEmail, setUserEmail] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);

    useEffect(() => {
        const savedUserInfo = localStorage.getItem("userInfo");
        if (savedUserInfo) {
            try {
                const user = JSON.parse(savedUserInfo);
                // Đảm bảo email là string
                const email = user.email && typeof user.email === 'string' ? user.email :
                    (user.email ? String(user.email) : "");
                setUserEmail(email);

                // Tương tự cho firstName và lastName
                setFirstName(user.firstName && typeof user.firstName === 'string' ? user.firstName : "");
                setLastName(user.lastName && typeof user.lastName === 'string' ? user.lastName : "");
            } catch (error) {
                console.error("Error parsing userInfo:", error);
            }
        }
    }, []);
    const login = (user) => {
        if (!user) return;

        try {
            localStorage.setItem("userInfo", JSON.stringify(user));

            // Đảm bảo email là string
            const email = user.email && typeof user.email === 'string' ? user.email :
                (user.email ? String(user.email) : "");
            setUserEmail(email);

            // Tương tự cho firstName và lastName
            setFirstName(user.firstName && typeof user.firstName === 'string' ? user.firstName : "");
            setLastName(user.lastName && typeof user.lastName === 'string' ? user.lastName : "");
        } catch (error) {
            console.error("Error in login function:", error);
        }
    };
    const logout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");

        setUserEmail(null);
        setFirstName(null);
        setLastName(null);
    };

    return (
        <UserContext.Provider value={{
            userEmail: userEmail || "",
            firstName: firstName || "",
            lastName: lastName || "",
            login,
            logout
        }}>
            {children}
        </UserContext.Provider>
    );
};
