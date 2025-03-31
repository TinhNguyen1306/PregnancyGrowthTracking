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
    const [loading, setLoading] = useState(true);
    const [userToken, setUserToken] = useState(localStorage.getItem("userToken") || "");
    const navigate = useNavigate();

    // ✅ Định nghĩa hàm fetchMembershipStatus trước khi dùng
    const fetchMembershipStatus = async () => {
        const token = localStorage.getItem("userToken");
        if (!token) return;

        try {
            const response = await fetch("http://localhost:5001/api/members/status", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,  // 🔥 Sửa lỗi backtick
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

    useEffect(() => {
        const savedUserInfo = localStorage.getItem("userInfo");
        const savedToken = localStorage.getItem("userToken");

        console.log("UserContext Mounted");
        console.log("Saved User Info:", savedUserInfo);
        console.log("Saved Token:", savedToken);

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

    useEffect(() => {
        if (userId) {
            fetchMembershipStatus();
        }
    }, [userId]);

    const login = (user) => {
        if (!user || !user.userId) {
            console.error("Login failed: invalid user data", user);
            return;
        }

        try {
            setLoading(true);

            // Lưu vào localStorage
            localStorage.setItem("userInfo", JSON.stringify(user));

            // Cập nhật state
            setUserId(user.userId);
            setUserEmail(user.email || "");
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            setUserRole(user.role || "");
            setUserObject(user);

            console.log("Login thành công, User ID:", user.userId);

            fetchMembershipStatus(); // 🔥 Đảm bảo gọi API sau khi login

            setTimeout(() => {
                setLoading(false);
            }, 100);
        } catch (error) {
            console.error("Error in login function:", error);
            setLoading(false);
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
            loading,
            userToken,  // 🟢 Thêm userToken vào context
            setUserToken,
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
