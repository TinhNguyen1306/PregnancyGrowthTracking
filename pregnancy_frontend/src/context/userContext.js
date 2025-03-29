import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userEmail, setUserEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userRole, setUserRole] = useState(""); // Thêm state cho userRole
    const [userObject, setUserObject] = useState(null); // Nếu bạn đã thêm state này
    const navigate = useNavigate();

    useEffect(() => {
        const savedUserInfo = localStorage.getItem("userInfo");

        if (savedUserInfo) {
            try {
                const user = JSON.parse(savedUserInfo);
                setUserEmail(user.email || "");
                setFirstName(user.firstName || "");
                setLastName(user.lastName || "");
                setUserRole(user.role || ""); // Lấy role từ user info
                setUserObject(user); // Nếu bạn đã thêm state này
            } catch (error) {
                console.error("Error parsing userInfo:", error);
            }
        }
    }, []);

    const login = (user) => {
        if (!user) return;

        try {
            localStorage.setItem("userInfo", JSON.stringify(user));

            setUserEmail(user.email || "");
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            setUserRole(user.role || ""); // Cập nhật role khi login
            setUserObject(user); // Nếu bạn đã thêm state này
        } catch (error) {
            console.error("Error in login function:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");

        setUserEmail("");
        setFirstName("");
        setLastName("");
        setUserRole(""); // Reset role khi logout
        setUserObject(null); // Nếu bạn đã thêm state này
        navigate("/");
    };

    // Hàm tiện ích để kiểm tra quyền
    const isAdmin = () => userRole === 'admin';
    const isUser = () => userRole === 'user';
    const hasRole = (role) => userRole === role;

    return (
        <UserContext.Provider value={{
            userEmail,
            firstName,
            lastName,
            userRole, // Thêm userRole vào context
            // Các hàm tiện ích cho phân quyền
            isAdmin,
            isUser,
            hasRole,
            // Nếu bạn đã thêm userObject
            user: userObject,
            login,
            logout
        }}>
            {children}
        </UserContext.Provider>
    );
};