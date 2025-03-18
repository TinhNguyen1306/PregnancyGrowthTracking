const Navbar = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
    }, []);

    return (
        <nav className="navbar">
            <div className="container">
                <h1>Pregnancy Tracker</h1>
                <div className="nav-links">
                    {user ? (
                        <div className="user-info">
                            <img src={user.avatar || "/default-avatar.png"} alt="User Avatar" className="avatar" />
                            <span>{user.name}</span>
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
