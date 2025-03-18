const jwt = require("jsonwebtoken");

const googleLogin = async (req, res) => {
    try {
        const { email, name, googleId } = req.user;

        // Kiểm tra user đã tồn tại chưa
        let user = await getUserByEmail(email);
        if (!user) {
            user = await createUser({ email, name, googleId });
        }

        // Tạo JWT Token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ message: "Lỗi đăng nhập Google", error });
    }
};
