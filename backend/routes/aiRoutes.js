import express from "express";

import {
    parsedText,
    generateReminderEmail,
    sendReminderEmail,
    getDashboardSummary
} from "../controllers/aiController.js";

import protect from "../middleware/authMIddleware.js";

const router = express.Router();

router.post("/parse-invoice", protect, parsedText);

router.post("/:invoiceId/reminder", protect, generateReminderEmail);
router.post("/:invoiceId/reminder/send", protect, sendReminderEmail);

router.get("/dashboard-summary", protect, getDashboardSummary);

export default router;