import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
});

const registerUser = async (req, res) => {
    const {
        name,
        email,
        password,
        businessName,
        address,
        phone
    } = req.body || {};

    try {

        // 1. Check required fields
        if (typeof name !== "string" || !name.trim() ||
            typeof email !== "string" || !email.trim() ||
            typeof password !== "string" || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        // 2. Check password length
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        // 3. Check if user already exists
        const normalizedEmail = email.trim().toLowerCase();
        const userExists = await User.findOne({ email: normalizedEmail });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // 4. Create new user
        const user = await User.create({
            name,
            email: normalizedEmail,
            password,
            businessName,
            address,
            phone
        });

        // 5. Generate JWT token
        const token = generateToken(user._id);

        // 6. Send response
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                businessName: user.businessName,
                address: user.address,
                phone: user.phone
            }
        });

    } catch (error) {

        if (error.code === 11000) {
            return res.status(409).json({ message: "User already exists" });
        }
        console.error("Registration failed:", error);
        res.status(500).json({ message: "Registration failed" });

    }
};


const loginUser = async (req, res) => {

    const { email, password } = req.body || {};

    try {

        // 1. Check email and password
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // 2. Find user and include password
        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() })
            .select("+password");

        // 3. Check user and password
        if (user && await user.comparePassword(password)) {

            // 4. Generate JWT token
            const token = generateToken(user._id);

            // 5. Send response
            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: token,

                businessName: user.businessName || "",
                address: user.address || "",
                phone: user.phone || ""
            });
        }

        // 6. Invalid credentials
        return res.status(401).json({
            message: "Invalid email or password"
        });

    } catch (error) {

        console.error("Login failed:", error);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

const getMe = async (req, res) => {

    try {

        // Get logged-in user
        const user = await User.findById(req.user.id);

        // If user doesn't exist
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Send user information
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,

            businessName: user.businessName || "",
            address: user.address || "",
            phone: user.phone || ""
        });

    } catch (error) {

        console.error("Profile lookup failed:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

const updateUserProfile = async (req, res) => {

    try {

        // Find logged-in user
        const user = await User.findById(req.user.id);

        // Check if user exists
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Update user information
        for (const field of ["name", "businessName", "address", "phone"]) {
            if (Object.hasOwn(req.body || {}, field)) {
                if (typeof req.body[field] !== "string") {
                    return res.status(400).json({ message: `${field} must be a string` });
                }
                user[field] = req.body[field].trim();
            }
        }

        // Save updated user
        const updatedUser = await user.save();

        // Send updated user
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            businessName: updatedUser.businessName,
            address: updatedUser.address,
            phone: updatedUser.phone
        });

    } catch (error) {

        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        console.error("Profile update failed:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};







export {
    registerUser,loginUser,getMe,updateUserProfile
};