import express from "express";

import {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice
} from "../controllers/invoiceController.js";

import protect from "../middleware/authMIddleware.js";

const router = express.Router();


// Create invoice
router.post("/", protect, createInvoice);


// Get all invoices of logged-in user
router.get("/", protect, getInvoices);


// Get single invoice by ID
router.get("/:id", protect, getInvoiceById);


// Update invoice
router.put("/:id", protect, updateInvoice);


// Delete invoice
router.delete("/:id", protect, deleteInvoice);


export default router;