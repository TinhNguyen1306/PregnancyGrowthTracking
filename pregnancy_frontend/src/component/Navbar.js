import { useEffect, useState } from "react";
const Navbar = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            setUser(userInfo || null);
        } catch (error) {
            console.error("Error parsing userInfo:", error);
            setUser(null);
        }
    }, []);
    return (
        <nav className="navbar">
            <div className="container">
                <h1>Pregnancy Tracker</h1>
                <div className="nav-links">
                    {user ? (
                        <div className="user-info">
                            {/* Lỗi: Có thể bạn đang render `user` trực tiếp ở đây */}
                            <img src={user?.avatar || "/default-avatar.png"} alt="User Avatar" className="avatar" />
                            <span>{user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User"}</span>
                        </div>
                    ) : (
                        <>
                            <a href="/login">LOGIN</a>
                            <a href="/register">SIGN UP</a>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
export default Navbar;