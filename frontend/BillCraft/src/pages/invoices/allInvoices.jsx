import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpDown,
  Check,
  CheckCircle2,
  Eye,
  FilePlus2,
  FileText,
  LoaderCircle,
  Search,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
};

const getInvoiceStatus = (invoice) => {
  if (invoice.status === "Paid") return "Paid";
  if (!invoice.dueDate) return "Unpaid";
  const dueDate = new Date(invoice.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return !Number.isNaN(dueDate.getTime()) && dueDate < today ? "Overdue" : "Unpaid";
};

const statusClasses = {
  Paid: "bg-[#eaf3eb] text-[#477253]",
  Unpaid: "bg-[#f2f3ee] text-[#66746a]",
  Overdue: "bg-[#fff0e9] text-[#b9512d]",
};

const csvCell = (value) => {
  const text = String(value ?? "");
  const safeText = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safeText.replaceAll('"', '""')}"`;
};

const AllInvoices = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("newest");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [createdInvoice, setCreatedInvoice] = useState(() => location.state?.createdInvoice || "");

  useEffect(() => {
    let active = true;
    axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES)
      .then(({ data }) => {
        if (!active) return;
        if (!Array.isArray(data.invoices)) throw new Error("The invoice list response was unexpected.");
        setInvoices(data.invoices);
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "Invoices couldn't be loaded. Check your connection and try again.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reloadKey]);

  useEffect(() => {
    if (!selectedInvoice && !deleteTarget) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !deleting) {
        setSelectedInvoice(null);
        setDeleteTarget(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedInvoice, deleteTarget, deleting]);

  const counts = useMemo(() => invoices.reduce((result, invoice) => {
    result.All += 1;
    result[getInvoiceStatus(invoice)] += 1;
    return result;
  }, { All: 0, Paid: 0, Unpaid: 0, Overdue: 0 }), [invoices]);

  const filteredInvoices = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = invoices.filter((invoice) => {
      const matchesFilter = filter === "All" || getInvoiceStatus(invoice) === filter;
      const matchesSearch = !term || [invoice.invoiceNumber, invoice.billTo?.clientName, invoice.billTo?.email]
        .some((value) => String(value || "").toLowerCase().includes(term));
      return matchesFilter && matchesSearch;
    });

    return filtered.sort((left, right) => {
      if (sort === "oldest") return new Date(left.invoiceDate || left.createdAt) - new Date(right.invoiceDate || right.createdAt);
      if (sort === "highest") return (Number(right.total) || 0) - (Number(left.total) || 0);
      if (sort === "lowest") return (Number(left.total) || 0) - (Number(right.total) || 0);
      return new Date(right.invoiceDate || right.createdAt) - new Date(left.invoiceDate || left.createdAt);
    });
  }, [invoices, search, filter, sort]);

  const totalOutstanding = invoices.filter((invoice) => invoice.status !== "Paid")
    .reduce((sum, invoice) => sum + (Number(invoice.total) || 0), 0);

  const updateStatus = async (invoice) => {
    const nextStatus = invoice.status === "Paid" ? "Unpaid" : "Paid";
    setUpdatingId(invoice._id);
    setActionError("");
    try {
      const { data } = await axiosInstance.put(API_PATHS.INVOICE.UPDATE_INVOICE(invoice._id), { status: nextStatus });
      setInvoices((current) => current.map((item) => item._id === invoice._id ? data.invoice : item));
      setSelectedInvoice((current) => current?._id === invoice._id ? data.invoice : current);
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || "Payment status couldn't be updated.");
    } finally {
      setUpdatingId("");
    }
  };

  const deleteInvoice = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setActionError("");
    try {
      await axiosInstance.delete(API_PATHS.INVOICE.DELETE_INVOICE(deleteTarget._id));
      setInvoices((current) => current.filter((invoice) => invoice._id !== deleteTarget._id));
      if (selectedInvoice?._id === deleteTarget._id) setSelectedInvoice(null);
      setDeleteTarget(null);
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || "Invoice couldn't be deleted. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const exportCsv = () => {
    const header = ["Invoice number", "Client", "Client email", "Issue date", "Due date", "Status", "Total INR"];
    const rows = filteredInvoices.map((invoice) => [
      invoice.invoiceNumber,
      invoice.billTo?.clientName,
      invoice.billTo?.email,
      formatDate(invoice.invoiceDate),
      formatDate(invoice.dueDate),
      getInvoiceStatus(invoice),
      Number(invoice.total) || 0,
    ]);
    const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "billcraft-invoices.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const filters = ["All", "Unpaid", "Overdue", "Paid"];

  return (
    <div className="mx-auto max-w-[1240px]">
      <section className="flex flex-col justify-between gap-4 border-b border-[#e0e7df] pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-[9px] font-extrabold tracking-[1.2px] text-[#87948a]">BILLING WORKSPACE</p>
          <h1 className="text-[26px] font-extrabold tracking-normal text-[#20372c] sm:text-[30px]">All invoices</h1>
          <p className="mt-1 text-[12px] text-[#829086]">Review, follow up, and keep your billing in order.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={exportCsv} disabled={!filteredInvoices.length} className="inline-flex h-9 items-center gap-2 border border-[#dce5dc] bg-white px-3 text-[10px] font-bold text-[#617368] transition-colors hover:bg-[#f5f8f4] disabled:cursor-not-allowed disabled:opacity-45"><ArrowDownToLine size={14} /> Export CSV</button>
          <Link to="/create-invoice" className="inline-flex h-9 items-center gap-2 bg-[#e87643] px-3 text-[10px] font-extrabold text-white transition-colors hover:bg-[#d86636]"><FilePlus2 size={14} /> New invoice</Link>
        </div>
      </section>

      {createdInvoice && (
        <div className="mt-4 flex items-center justify-between gap-3 border border-[#d2e5d2] bg-[#f0f7ef] px-4 py-3 text-[11px] text-[#406b4b]" role="status">
          <span className="flex items-center gap-2"><CheckCircle2 size={15} /> Invoice <strong>{createdInvoice}</strong> was created successfully.</span>
          <button type="button" aria-label="Dismiss notification" onClick={() => { setCreatedInvoice(""); navigate(location.pathname, { replace: true, state: null }); }} className="grid h-7 w-7 place-items-center text-[#648269] hover:bg-[#e2eee0]"><X size={14} /></button>
        </div>
      )}

      <section aria-label="Invoice totals" className="mt-5 grid grid-cols-2 border border-[#e3e9e2] bg-white sm:grid-cols-4">
        <div className="border-b border-r border-[#edf0ec] px-4 py-3.5 sm:border-b-0 sm:px-5"><p className="text-[9px] font-extrabold tracking-[.65px] text-[#91a096]">TOTAL INVOICES</p><p className="mt-1 text-[19px] font-extrabold tabular-nums text-[#2d4436]">{loading ? "—" : counts.All}</p></div>
        <div className="border-b border-[#edf0ec] px-4 py-3.5 sm:border-b-0 sm:border-r sm:px-5"><p className="text-[9px] font-extrabold tracking-[.65px] text-[#91a096]">PAID</p><p className="mt-1 text-[19px] font-extrabold tabular-nums text-[#4c7956]">{loading ? "—" : counts.Paid}</p></div>
        <div className="border-r border-[#edf0ec] px-4 py-3.5 sm:px-5"><p className="text-[9px] font-extrabold tracking-[.65px] text-[#91a096]">NEEDS FOLLOW-UP</p><p className="mt-1 text-[19px] font-extrabold tabular-nums text-[#bb6841]">{loading ? "—" : counts.Unpaid + counts.Overdue}</p></div>
        <div className="px-4 py-3.5 sm:px-5"><p className="text-[9px] font-extrabold tracking-[.65px] text-[#91a096]">OPEN BALANCE</p><p className="mt-1 truncate text-[16px] font-extrabold tabular-nums text-[#2d4436]">{loading ? "—" : currency.format(totalOutstanding)}</p></div>
      </section>

      <section className="mt-5 border border-[#e3e9e2] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#edf0ec] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex flex-wrap items-center gap-1" role="tablist" aria-label="Filter invoices by payment status">
            {filters.map((value) => (
              <button key={value} type="button" role="tab" aria-selected={filter === value} onClick={() => setFilter(value)} className={`inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-extrabold transition-colors ${filter === value ? "bg-[#eaf1e9] text-[#365e43]" : "text-[#829087] hover:bg-[#f5f7f3] hover:text-[#45594b]"}`}>
                {value}<span className={`text-[9px] ${filter === value ? "text-[#60816a]" : "text-[#a2ada4]"}`}>{loading ? "–" : counts[value]}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative min-w-0 sm:w-[230px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98a49b]" />
              <input aria-label="Search invoices" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search number or client" className="h-9 w-full border border-[#e1e7e1] bg-[#fbfcfa] pl-9 pr-3 text-[10px] text-[#405246] outline-none placeholder:text-[#a0aaa2] focus:border-[#7b9a80]" />
            </label>
            <label className="relative">
              <ArrowUpDown size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#89978d]" />
              <select aria-label="Sort invoices" value={sort} onChange={(event) => setSort(event.target.value)} className="h-9 w-full appearance-none border border-[#e1e7e1] bg-[#fbfcfa] pl-8 pr-8 text-[10px] font-semibold text-[#5d6e62] outline-none focus:border-[#7b9a80] sm:w-[145px]">
                <option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="highest">Highest amount</option><option value="lowest">Lowest amount</option>
              </select>
            </label>
          </div>
        </div>

        {error ? (
          <div className="flex flex-col items-center px-5 py-12 text-center">
            <TriangleAlert size={22} className="text-[#c2764e]" />
            <p role="alert" className="mt-3 max-w-md text-[11px] text-[#8b5942]">{error}</p>
            <button type="button" onClick={() => { setLoading(true); setError(""); setReloadKey((key) => key + 1); }} className="mt-3 text-[10px] font-extrabold text-[#456e50] underline underline-offset-2">Try again</button>
          </div>
        ) : loading ? (
          <div className="space-y-3 p-5" aria-label="Loading invoices">
            {[0, 1, 2, 3].map((item) => <div key={item} className="h-11 animate-pulse bg-[#f1f4ef]" />)}
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-12 text-center">
            <span className="grid h-11 w-11 place-items-center bg-[#edf3ed] text-[#52765b]">{invoices.length ? <Search size={19} /> : <FileText size={19} />}</span>
            <h2 className="mt-3 text-[13px] font-extrabold text-[#354a3d]">{invoices.length ? "No invoices match this view" : "No invoices yet"}</h2>
            <p className="mt-1 max-w-sm text-[10px] leading-5 text-[#89958c]">{invoices.length ? "Try another search term or payment filter." : "Create your first invoice to start tracking client billing and payments."}</p>
            {invoices.length === 0 && <Link to="/create-invoice" className="mt-4 inline-flex h-9 items-center gap-2 bg-[#e87643] px-3 text-[10px] font-extrabold text-white"><FilePlus2 size={14} /> Create invoice</Link>}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[790px] border-collapse text-left">
                <thead><tr className="bg-[#fafbf9] text-[9px] font-extrabold tracking-[.8px] text-[#98a39a]"><th className="px-5 py-3">INVOICE</th><th className="px-4 py-3">CLIENT</th><th className="px-4 py-3">ISSUED</th><th className="px-4 py-3">DUE</th><th className="px-4 py-3 text-right">AMOUNT</th><th className="px-4 py-3">STATUS</th><th className="px-4 py-3 text-right">ACTIONS</th></tr></thead>
                <tbody className="divide-y divide-[#eef1ed]">
                  {filteredInvoices.map((invoice) => {
                    const status = getInvoiceStatus(invoice);
                    return (
                      <tr key={invoice._id} className="transition-colors hover:bg-[#fbfcfa]">
                        <td className="px-5 py-3.5"><button type="button" onClick={() => { setSelectedInvoice(invoice); setActionError(""); }} className="text-left text-[11px] font-extrabold text-[#385b47] hover:text-[#df6d3d]">{invoice.invoiceNumber || "Untitled"}</button></td>
                        <td className="px-4 py-3.5"><span className="block max-w-[180px] truncate text-[11px] font-semibold text-[#46574c]">{invoice.billTo?.clientName || "Client"}</span><span className="block max-w-[180px] truncate text-[9px] text-[#97a198]">{invoice.billTo?.email || ""}</span></td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-[10px] text-[#7d8a80]">{formatDate(invoice.invoiceDate)}</td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-[10px] text-[#7d8a80]">{formatDate(invoice.dueDate)}</td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-right text-[11px] font-bold tabular-nums text-[#283d31]">{currency.format(Number(invoice.total) || 0)}</td>
                        <td className="px-4 py-3.5"><span className={`inline-flex px-2 py-1 text-[9px] font-extrabold ${statusClasses[status]}`}>{status}</span></td>
                        <td className="px-4 py-3.5"><div className="flex justify-end gap-1">
                          <button type="button" onClick={() => { setSelectedInvoice(invoice); setActionError(""); }} aria-label={`View ${invoice.invoiceNumber}`} className="grid h-7 w-7 place-items-center text-[#87958b] hover:bg-[#edf3ed] hover:text-[#3e674b]"><Eye size={14} /></button>
                          <button type="button" disabled={updatingId === invoice._id} onClick={() => updateStatus(invoice)} aria-label={invoice.status === "Paid" ? `Mark ${invoice.invoiceNumber} unpaid` : `Mark ${invoice.invoiceNumber} paid`} title={invoice.status === "Paid" ? "Mark unpaid" : "Mark paid"} className="grid h-7 w-7 place-items-center text-[#87958b] hover:bg-[#eaf3eb] hover:text-[#477253] disabled:opacity-50">{updatingId === invoice._id ? <LoaderCircle size={14} className="animate-spin" /> : <Check size={15} />}</button>
                          <button type="button" onClick={() => { setDeleteTarget(invoice); setActionError(""); }} aria-label={`Delete ${invoice.invoiceNumber}`} className="grid h-7 w-7 place-items-center text-[#9a9690] hover:bg-[#fff0ed] hover:text-[#bd543d]"><Trash2 size={14} /></button>
                        </div></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-[#edf0ec] px-5 py-3 text-[9px] text-[#8e9a91]"><span>Showing {filteredInvoices.length} of {invoices.length} invoices</span><span className="flex items-center gap-1"><ArrowRight size={11} /> Amounts in INR</span></div>
          </>
        )}
      </section>

      {actionError && !selectedInvoice && <p role="alert" className="mt-3 border-l-[3px] border-[#c25a46] bg-[#fff3ef] px-3 py-2.5 text-[10px] text-[#9e4939]">{actionError}</p>}

      {selectedInvoice && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#10261f]/55 p-4" onClick={() => setSelectedInvoice(null)}>
          <section role="dialog" aria-modal="true" aria-labelledby="invoice-preview-title" className="max-h-[90vh] w-full max-w-[620px] overflow-y-auto border border-[#dce4dc] bg-[#f7f9f6] shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-[#e4eae3] bg-white px-5 py-4 sm:px-6">
              <div><p className="text-[9px] font-extrabold tracking-[1px] text-[#92a096]">INVOICE PREVIEW</p><h2 id="invoice-preview-title" className="mt-1 text-[18px] font-extrabold text-[#263d30]">{selectedInvoice.invoiceNumber}</h2></div>
              <button type="button" aria-label="Close invoice preview" onClick={() => setSelectedInvoice(null)} className="grid h-8 w-8 place-items-center text-[#7f8e83] hover:bg-[#f0f4ef]"><X size={17} /></button>
            </div>
            <div className="space-y-5 p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><p className="mb-1.5 text-[9px] font-extrabold tracking-[.7px] text-[#94a096]">FROM</p><p className="text-[11px] font-bold text-[#3c5143]">{selectedInvoice.billFrom?.businessName || "Business"}</p><p className="text-[10px] text-[#7f8b82]">{selectedInvoice.billFrom?.email}</p><p className="whitespace-pre-line text-[10px] text-[#7f8b82]">{selectedInvoice.billFrom?.address}</p></div>
                <div><p className="mb-1.5 text-[9px] font-extrabold tracking-[.7px] text-[#94a096]">BILL TO</p><p className="text-[11px] font-bold text-[#3c5143]">{selectedInvoice.billTo?.clientName || "Client"}</p><p className="text-[10px] text-[#7f8b82]">{selectedInvoice.billTo?.email}</p><p className="whitespace-pre-line text-[10px] text-[#7f8b82]">{selectedInvoice.billTo?.address}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-3 border-y border-[#e3e9e2] py-3 sm:grid-cols-4"><div><p className="text-[8px] font-extrabold text-[#9aa59c]">ISSUED</p><p className="mt-1 text-[10px] font-semibold text-[#4b5d50]">{formatDate(selectedInvoice.invoiceDate)}</p></div><div><p className="text-[8px] font-extrabold text-[#9aa59c]">DUE DATE</p><p className="mt-1 text-[10px] font-semibold text-[#4b5d50]">{formatDate(selectedInvoice.dueDate)}</p></div><div><p className="text-[8px] font-extrabold text-[#9aa59c]">TERMS</p><p className="mt-1 text-[10px] font-semibold text-[#4b5d50]">{selectedInvoice.paymentTerms || "—"}</p></div><div><p className="text-[8px] font-extrabold text-[#9aa59c]">STATUS</p><span className={`mt-1 inline-flex px-2 py-1 text-[8px] font-extrabold ${statusClasses[getInvoiceStatus(selectedInvoice)]}`}>{getInvoiceStatus(selectedInvoice)}</span></div></div>
              <div className="overflow-x-auto"><table className="w-full min-w-[420px] text-left"><thead><tr className="border-b border-[#e5eae4] text-[8px] font-extrabold tracking-[.7px] text-[#9aa59c]"><th className="py-2">DESCRIPTION</th><th className="py-2 text-right">QTY</th><th className="py-2 text-right">UNIT PRICE</th><th className="py-2 text-right">TOTAL</th></tr></thead><tbody className="divide-y divide-[#e9eee8]">{(selectedInvoice.items || []).map((item, index) => <tr key={item._id || index} className="text-[10px] text-[#536357]"><td className="py-2.5 font-semibold">{item.name}</td><td className="py-2.5 text-right tabular-nums">{item.quantity}</td><td className="py-2.5 text-right tabular-nums">{currency.format(Number(item.unitPrice) || 0)}</td><td className="py-2.5 text-right font-bold tabular-nums">{currency.format(Number(item.total) || 0)}</td></tr>)}</tbody></table></div>
              <div className="ml-auto max-w-[240px] space-y-2 border-t border-[#e1e7e0] pt-3 text-[10px]"><div className="flex justify-between text-[#819087]"><span>Subtotal</span><span>{currency.format(Number(selectedInvoice.subtotal) || 0)}</span></div><div className="flex justify-between text-[#819087]"><span>Tax</span><span>{currency.format(Number(selectedInvoice.taxTotal) || 0)}</span></div><div className="flex justify-between border-t border-[#e5eae4] pt-2 font-extrabold text-[#2f4939]"><span>Total due</span><span>{currency.format(Number(selectedInvoice.total) || 0)}</span></div></div>
              {selectedInvoice.notes && <div className="border-l-2 border-[#e87643] bg-white px-3 py-2.5"><p className="text-[8px] font-extrabold tracking-[.7px] text-[#9aa59c]">NOTE</p><p className="mt-1 whitespace-pre-line text-[10px] leading-5 text-[#586a5d]">{selectedInvoice.notes}</p></div>}
              {actionError && <p role="alert" className="text-[10px] text-[#a44837]">{actionError}</p>}
              <div className="flex flex-wrap justify-end gap-2 border-t border-[#e4eae3] pt-4">
                <button type="button" onClick={() => setDeleteTarget(selectedInvoice)} className="mr-auto inline-flex h-8 items-center gap-1.5 border border-[#eadbd6] px-2.5 text-[9px] font-bold text-[#a65340] hover:bg-[#fff2ee]"><Trash2 size={13} /> Delete</button>
                <button type="button" onClick={() => updateStatus(selectedInvoice)} disabled={updatingId === selectedInvoice._id} className="inline-flex h-8 items-center gap-1.5 border border-[#dce5dc] px-2.5 text-[9px] font-bold text-[#426b50] hover:bg-[#edf4ec] disabled:opacity-50">{updatingId === selectedInvoice._id ? <LoaderCircle size={13} className="animate-spin" /> : <Check size={13} />}{selectedInvoice.status === "Paid" ? "Mark unpaid" : "Mark paid"}</button>
                <button type="button" onClick={() => { setSelectedInvoice(null); navigate(`/invoice/${selectedInvoice._id}`); }} className="inline-flex h-8 items-center gap-1.5 bg-[#315b46] px-2.5 text-[9px] font-bold text-white hover:bg-[#244734]">Full page <ArrowRight size={13} /></button>
              </div>
            </div>
          </section>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#10261f]/55 p-4" onClick={() => !deleting && setDeleteTarget(null)}>
          <section role="alertdialog" aria-modal="true" aria-labelledby="delete-invoice-title" className="w-full max-w-[380px] border border-[#e6e9e3] bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <span className="grid h-9 w-9 place-items-center bg-[#fff0ed] text-[#b85640]"><Trash2 size={16} /></span>
            <h2 id="delete-invoice-title" className="mt-3 text-[15px] font-extrabold text-[#33473a]">Delete {deleteTarget.invoiceNumber}?</h2>
            <p className="mt-1.5 text-[10px] leading-5 text-[#78867c]">This removes the invoice for {deleteTarget.billTo?.clientName || "this client"}. This action cannot be undone.</p>
            {actionError && <p role="alert" className="mt-3 text-[10px] text-[#a44837]">{actionError}</p>}
            <div className="mt-5 flex justify-end gap-2"><button type="button" disabled={deleting} onClick={() => { setDeleteTarget(null); setActionError(""); }} className="h-8 border border-[#dfe6df] px-3 text-[10px] font-bold text-[#66766b] hover:bg-[#f5f7f4]">Cancel</button><button type="button" disabled={deleting} onClick={deleteInvoice} className="inline-flex h-8 items-center gap-2 bg-[#bd543d] px-3 text-[10px] font-bold text-white hover:bg-[#a94431] disabled:opacity-60">{deleting ? <LoaderCircle size={13} className="animate-spin" /> : <Trash2 size={13} />} Delete invoice</button></div>
          </section>
        </div>
      )}
    </div>
  );
};

export default AllInvoices;