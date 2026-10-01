import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

const protect = async (req, res, next) => {
    let token;

    const authorization = req.headers.authorization;
    if (authorization?.startsWith("Bearer ")) {
        token = authorization.slice(7).trim();
    }

    if (!token) {
        return res.status(401).json({
            message: "Not authorized, no token"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User no longer exists" });
        }

        return next();
    } catch {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};

export default protect;