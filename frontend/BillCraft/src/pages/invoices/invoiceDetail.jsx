import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  FileText,
  LoaderCircle,
  Printer,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import InvoiceReminderEmail from "../../components/invoices/InvoiceReminderEmail";
import "./invoiceDetail.css";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });
const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "long", year: "numeric" }).format(date);
};
const inputStatus = (invoice) => {
  if (invoice.status === "Paid") return "Paid";
  const due = invoice.dueDate ? new Date(invoice.dueDate) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due && !Number.isNaN(due.getTime()) && due < today ? "Overdue" : "Unpaid";
};

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    axiosInstance.get(API_PATHS.INVOICE.GET_INVOICE_BY_ID(id))
      .then(({ data }) => { if (active) { setInvoice(data.invoice); setError(""); } })
      .catch((requestError) => { if (active) setError(requestError.response?.data?.message || "Invoice could not be loaded."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const updateStatus = async () => {
    if (!invoice) return;
    setUpdating(true);
    setActionError("");
    try {
      const status = invoice.status === "Paid" ? "Unpaid" : "Paid";
      const { data } = await axiosInstance.put(API_PATHS.INVOICE.UPDATE_INVOICE(id), { status });
      setInvoice(data.invoice);
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || "Payment status could not be updated.");
    } finally {
      setUpdating(false);
    }
  };

  const deleteInvoice = async () => {
    setDeleting(true);
    setActionError("");
    try {
      await axiosInstance.delete(API_PATHS.INVOICE.DELETE_INVOICE(id));
      navigate("/invoices", { replace: true, state: { deletedInvoice: invoice?.invoiceNumber } });
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || "Invoice could not be deleted.");
      setDeleting(false);
    }
  };

  if (loading || invoice?._id !== id) {
    return <div className="space-y-4" aria-label="Loading invoice"><div className="h-8 w-56 animate-pulse bg-[#e8ede7]" /><div className="h-56 animate-pulse border border-[#e3e9e2] bg-white" /><div className="h-64 animate-pulse border border-[#e3e9e2] bg-white" /></div>;
  }

  if (error || !invoice) {
    return <section className="mx-auto max-w-[680px] border border-[#e3e9e2] bg-white px-6 py-12 text-center"><TriangleAlert size={22} className="mx-auto text-[#bb6841]" /><h1 className="mt-3 text-[16px] font-extrabold text-[#33483a]">Invoice unavailable</h1><p className="mt-2 text-[11px] text-[#819087]">{error || "This invoice could not be found."}</p><Link to="/invoices" className="mt-5 inline-flex h-9 items-center gap-2 bg-[#315b46] px-3 text-[10px] font-bold text-white"><ArrowLeft size={13} /> Back to invoices</Link></section>;
  }

  const status = inputStatus(invoice);
  const statusStyle = status === "Paid" ? "bg-[#eaf3eb] text-[#477253]" : status === "Overdue" ? "bg-[#fff0e9] text-[#b9512d]" : "bg-[#f2f3ee] text-[#69766d]";

  return (
    <div className="mx-auto max-w-[1060px]">
      <div className="invoice-print-hide mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#e0e7df] pb-4">
        <div><Link to="/invoices" className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold text-[#748379] hover:text-[#365b43]"><ArrowLeft size={13} /> All invoices</Link><h1 className="text-[24px] font-extrabold text-[#20372c]">{invoice.invoiceNumber}</h1></div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => window.print()} className="inline-flex h-9 items-center gap-2 border border-[#dce5dc] bg-white px-3 text-[10px] font-bold text-[#5e7063] hover:bg-[#f5f8f4]"><Printer size={14} /> Print</button>
          <button type="button" onClick={updateStatus} disabled={updating} className="inline-flex h-9 items-center gap-2 bg-[#315b46] px-3 text-[10px] font-bold text-white hover:bg-[#244734] disabled:opacity-50">{updating ? <LoaderCircle size={14} className="animate-spin" /> : <Check size={14} />} Mark {invoice.status === "Paid" ? "unpaid" : "paid"}</button>
          <button type="button" onClick={() => setDeleteOpen(true)} aria-label="Delete invoice" className="grid h-9 w-9 place-items-center border border-[#eadbd6] bg-white text-[#a65340] hover:bg-[#fff2ee]"><Trash2 size={15} /></button>
        </div>
      </div>

      {actionError && <p role="alert" className="invoice-print-hide mb-4 border-l-[3px] border-[#c25a46] bg-[#fff3ef] px-3 py-2.5 text-[10px] text-[#9e4939]">{actionError}</p>}

      <article className="invoice-paper border border-[#e1e7e0] bg-white p-5 shadow-[0_8px_28px_rgba(26,48,34,.045)] sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-start justify-between gap-5 border-b border-[#e9eee8] pb-6">
          <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center bg-[#315b46] text-white"><FileText size={21} /></span><div><p className="text-[14px] font-extrabold text-[#294336]">{invoice.billFrom?.businessName || "Your business"}</p><p className="mt-1 text-[10px] text-[#7e8d82]">{invoice.billFrom?.email}</p></div></div>
          <div className="text-left sm:text-right"><p className="text-[9px] font-extrabold tracking-[1.2px] text-[#929e94]">INVOICE</p><h2 className="mt-1 text-[24px] font-extrabold text-[#273d31]">{invoice.invoiceNumber}</h2><span className={`mt-2 inline-flex px-2 py-1 text-[9px] font-extrabold ${statusStyle}`}>{status}</span></div>
        </div>

        <div className="grid gap-6 border-b border-[#e9eee8] py-6 sm:grid-cols-2">
          <div><p className="mb-2 text-[9px] font-extrabold tracking-[.9px] text-[#96a198]">BILL TO</p><p className="text-[12px] font-bold text-[#344b3b]">{invoice.billTo?.clientName || "Client"}</p><p className="mt-1 text-[10px] text-[#7d8b81]">{invoice.billTo?.email}</p><p className="mt-1 whitespace-pre-line text-[10px] leading-5 text-[#7d8b81]">{invoice.billTo?.address}</p><p className="mt-1 text-[10px] text-[#7d8b81]">{invoice.billTo?.phone}</p></div>
          <div className="grid grid-cols-2 gap-4 sm:justify-self-end sm:text-right"><div><p className="text-[9px] font-extrabold tracking-[.8px] text-[#96a198]">ISSUED</p><p className="mt-2 text-[10px] font-semibold text-[#485b4d]">{formatDate(invoice.invoiceDate)}</p></div><div><p className="text-[9px] font-extrabold tracking-[.8px] text-[#96a198]">DUE DATE</p><p className="mt-2 text-[10px] font-semibold text-[#485b4d]">{formatDate(invoice.dueDate)}</p></div><div><p className="text-[9px] font-extrabold tracking-[.8px] text-[#96a198]">PAYMENT TERMS</p><p className="mt-2 text-[10px] font-semibold text-[#485b4d]">{invoice.paymentTerms || "—"}</p></div></div>
        </div>

        <div className="overflow-x-auto py-5"><table className="w-full min-w-[500px] border-collapse text-left"><thead><tr className="border-b border-[#e4eae3] text-[9px] font-extrabold tracking-[.8px] text-[#91a096]"><th className="py-3">DESCRIPTION</th><th className="py-3 text-right">QTY</th><th className="py-3 text-right">UNIT PRICE</th><th className="py-3 text-right">TAX</th><th className="py-3 text-right">AMOUNT</th></tr></thead><tbody className="divide-y divide-[#edf0ec]">{(invoice.items || []).map((item, index) => <tr key={item._id || index} className="text-[10px] text-[#526257]"><td className="py-3 font-semibold">{item.name}</td><td className="py-3 text-right tabular-nums">{item.quantity}</td><td className="py-3 text-right tabular-nums">{currency.format(Number(item.unitPrice) || 0)}</td><td className="py-3 text-right tabular-nums">{Number(item.taxPercent) || 0}%</td><td className="py-3 text-right font-bold tabular-nums text-[#33483a]">{currency.format(Number(item.total) || 0)}</td></tr>)}</tbody></table></div>

        <div className="flex flex-col justify-between gap-6 border-t border-[#e9eee8] pt-5 sm:flex-row">
          <div className="max-w-sm"><p className="text-[9px] font-extrabold tracking-[.8px] text-[#96a198]">NOTES</p><p className="mt-2 whitespace-pre-line text-[10px] leading-5 text-[#748278]">{invoice.notes || "Thank you for your business."}</p></div>
          <div className="w-full space-y-2 sm:max-w-[250px]"><div className="flex justify-between text-[10px] text-[#7d8b81]"><span>Subtotal</span><span>{currency.format(Number(invoice.subtotal) || 0)}</span></div><div className="flex justify-between text-[10px] text-[#7d8b81]"><span>Tax</span><span>{currency.format(Number(invoice.taxTotal) || 0)}</span></div><div className="flex justify-between border-t border-[#e7ece6] pt-3 text-[12px] font-extrabold text-[#2d4938]"><span>Total due</span><span>{currency.format(Number(invoice.total) || 0)}</span></div><p className="text-right text-[8px] text-[#9ca69e]">Amounts in INR</p></div>
        </div>
      </article>

      {invoice.status !== "Paid" && <InvoiceReminderEmail key={invoice._id} invoice={invoice} />}

      {deleteOpen && <div className="invoice-print-hide fixed inset-0 z-[80] flex items-center justify-center bg-[#10261f]/55 p-4" onClick={() => !deleting && setDeleteOpen(false)}><section role="alertdialog" aria-modal="true" aria-labelledby="detail-delete-title" className="w-full max-w-[370px] bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}><span className="grid h-9 w-9 place-items-center bg-[#fff0ed] text-[#b85640]"><Trash2 size={16} /></span><h2 id="detail-delete-title" className="mt-3 text-[14px] font-extrabold text-[#33473a]">Delete this invoice?</h2><p className="mt-1.5 text-[10px] leading-5 text-[#78867c]">This action cannot be undone.</p><div className="mt-5 flex justify-end gap-2"><button type="button" disabled={deleting} onClick={() => setDeleteOpen(false)} className="h-8 border border-[#dfe6df] px-3 text-[10px] font-bold text-[#66766b]">Cancel</button><button type="button" disabled={deleting} onClick={deleteInvoice} className="inline-flex h-8 items-center gap-2 bg-[#bd543d] px-3 text-[10px] font-bold text-white disabled:opacity-60">{deleting ? <LoaderCircle size={13} className="animate-spin" /> : <Trash2 size={13} />} Delete invoice</button></div></section></div>}
    </div>
  );
};

export default InvoiceDetail;