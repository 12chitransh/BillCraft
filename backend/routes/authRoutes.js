import express from "express";

import {
    registerUser,
    loginUser,
    getMe,
    updateUserProfile
} from "../controllers/authController.js";

import protect from "../middleware/authMIddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router
    .route("/me")
    .get(protect, getMe)
    .put(protect, updateUserProfile);

export default router;