import "dotenv/config";

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
        : "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "1mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "BillCraft API is running"
    });
});

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);

    const status = error.status || error.statusCode || 500;
    if (status >= 500) console.error("Request error:", error);

    res.status(status).json({
        message: status >= 500 ? "Internal server error" : error.message
    });
});

const PORT = Number(process.env.PORT) || 8000;

async function startServer() {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is required");
    }

    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer().catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
});