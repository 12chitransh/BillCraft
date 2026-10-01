import mongoose from "mongoose";
import Invoice from "../model/lnvoiceModel.js";

const calculateItems = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
        const error = new Error("At least one invoice item is required");
        error.status = 400;
        throw error;
    }

    let subtotal = 0;
    let taxTotal = 0;
    const calculatedItems = items.map((item) => {
        const quantity = Number(item?.quantity);
        const unitPrice = Number(item?.unitPrice);
        const taxPercent = Number(item?.taxPercent || 0);
        if (typeof item?.name !== "string" || !item.name.trim() ||
            !Number.isFinite(quantity) || quantity <= 0 ||
            !Number.isFinite(unitPrice) || unitPrice < 0 ||
            !Number.isFinite(taxPercent) || taxPercent < 0 || taxPercent > 100) {
            const error = new Error("Invoice items contain invalid values");
            error.status = 400;
            throw error;
        }

        const lineSubtotal = quantity * unitPrice;
        const lineTax = lineSubtotal * taxPercent / 100;
        subtotal += lineSubtotal;
        taxTotal += lineTax;
        return {
            ...item,
            name: item.name.trim(),
            quantity,
            unitPrice,
            taxPercent,
            total: Math.round((lineSubtotal + lineTax + Number.EPSILON) * 100) / 100
        };
    });

    subtotal = Math.round((subtotal + Number.EPSILON) * 100) / 100;
    taxTotal = Math.round((taxTotal + Number.EPSILON) * 100) / 100;
    return {
        items: calculatedItems,
        subtotal,
        taxTotal,
        total: Math.round((subtotal + taxTotal + Number.EPSILON) * 100) / 100
    };
};

const validateId = (id, res) => {
    if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({ message: "Invalid invoice ID" });
        return false;
    }
    return true;
};

const handleError = (res, error, context) => {
    if (error.status === 400 || error.name === "ValidationError" || error.name === "CastError") {
        return res.status(400).json({ message: error.message });
    }
    console.error(`${context}:`, error);
    return res.status(500).json({ message: context });
};

export const createInvoice = async (req, res) => {
    try {
        const {
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            paymentTerms
        } = req.body || {};

        if (typeof invoiceNumber !== "string" || !invoiceNumber.trim() || !billFrom || !billTo) {
            return res.status(400).json({ message: "Invoice number, sender, and client are required" });
        }

        const totals = calculateItems(items);
        const invoice = await Invoice.create({
            user: req.user._id,
            invoiceNumber: invoiceNumber.trim(),
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            ...totals,
            notes,
            paymentTerms
        });

        return res.status(201).json({ message: "Invoice created successfully", invoice });
    } catch (error) {
        return handleError(res, error, "Error creating invoice");
    }
};

export const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({ user: req.user._id }).sort({ createdAt: -1 });
        return res.status(200).json({ message: "Invoices fetched successfully", invoices });
    } catch (error) {
        return handleError(res, error, "Error fetching invoices");
    }
};

export const getInvoiceById = async (req, res) => {
    if (!validateId(req.params.id, res)) return;

    try {
        const invoice = await Invoice.findOne({ _id: req.params.id, user: req.user._id });
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        return res.status(200).json({ message: "Invoice fetched successfully", invoice });
    } catch (error) {
        return handleError(res, error, "Error fetching invoice");
    }
};

export const updateInvoice = async (req, res) => {
    if (!validateId(req.params.id, res)) return;

    try {
        const body = req.body || {};
        const updates = {};
        for (const field of ["invoiceNumber", "invoiceDate", "dueDate", "billFrom", "billTo", "notes", "paymentTerms", "status"]) {
            if (Object.hasOwn(body, field)) updates[field] = body[field];
        }

        if (updates.invoiceNumber !== undefined) {
            if (typeof updates.invoiceNumber !== "string" || !updates.invoiceNumber.trim()) {
                return res.status(400).json({ message: "Invoice number cannot be empty" });
            }
            updates.invoiceNumber = updates.invoiceNumber.trim();
        }
        if (updates.status !== undefined && !["Paid", "Unpaid"].includes(updates.status)) {
            return res.status(400).json({ message: "Status must be Paid or Unpaid" });
        }
        if (Object.hasOwn(body, "items")) Object.assign(updates, calculateItems(body.items));
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No invoice fields were provided" });
        }

        const invoice = await Invoice.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            updates,
            { returnDocument: "after", runValidators: true }
        );
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        return res.status(200).json({ message: "Invoice updated successfully", invoice });
    } catch (error) {
        return handleError(res, error, "Error updating invoice");
    }
};

export const deleteInvoice = async (req, res) => {
    if (!validateId(req.params.id, res)) return;

    try {
        const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        return res.status(200).json({ message: "Invoice deleted successfully" });
    } catch (error) {
        return handleError(res, error, "Error deleting invoice");
    }
};