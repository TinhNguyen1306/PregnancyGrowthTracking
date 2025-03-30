import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userRole, setUserRole] = useState("");
    const [userObject, setUserObject] = useState(null);
    const [membership, setMembership] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedUserInfo = localStorage.getItem("userInfo");

        if (savedUserInfo) {
            try {
                const user = JSON.parse(savedUserInfo);
                setUserId(user.id || null);
                setUserEmail(user.email || "");
                setFirstName(user.firstName || "");
                setLastName(user.lastName || "");
                setUserRole(user.role || "");
                setUserObject(user);
                fetchMembershipStatus();
            } catch (error) {
                console.error("Error parsing userInfo:", error);
            }
        }
    }, []);

    const fetchMembershipStatus = async () => {
        const token = localStorage.getItem("userToken");
        if (!token) return;

        try {
            const response = await fetch("http://localhost:5001/api/members/status", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Không thể lấy trạng thái hội viên");
            }

            const data = await response.json();

            // Kiểm tra và set lại trạng thái hội viên
            setMembership(data.isSubscribed ? {
                isSubscribed: data.isSubscribed,
                subscriptionPlan: data.subscriptionPlan,
                subscriptionExpiry: data.subscriptionExpiry
            } : null);
        } catch (error) {
            console.error("Error fetching membership status:", error);
            setMembership(null);
        }
    };

    const login = (user) => {
        if (!user) return;

        try {
            localStorage.setItem("userInfo", JSON.stringify(user));
            setUserId(user.id || null)
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
        setUserId(null);
        setUserEmail("");
        setFirstName("");
        setLastName("");
        setUserRole("");
        setUserObject(null);
        setMembership(null);
        navigate("/");
    };

    // Các hàm tiện ích để kiểm tra quyền
    const isAdmin = () => userRole === 'admin';
    const isUser = () => userRole === 'user';
    const hasRole = (role) => userRole === role;

    return (
        <UserContext.Provider value={{
            userId,
            userEmail,
            firstName,
            lastName,
            userRole,
            user: userObject,
            membership,
            login,
            logout,
            isAdmin,
            isUser,
            hasRole,
        }}>
            {children}
        </UserContext.Provider>
    );
};
