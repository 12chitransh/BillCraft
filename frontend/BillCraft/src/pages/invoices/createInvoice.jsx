import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  CircleHelp,
  FileText,
  LoaderCircle,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { useAuth } from "../../context/useAuth.js";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });
const today = new Date();
const localDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const inputClass = "h-10 w-full border border-[#dfe6df] bg-white px-3 text-[12px] text-[#314539] outline-none transition placeholder:text-[#a4aea6] focus:border-[#6e9578] focus:ring-2 focus:ring-[#719477]/15";
const labelClass = "mb-1.5 block text-[10px] font-extrabold tracking-[.55px] text-[#5b6c60]";

const CreateInvoice = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invoiceNumber, setInvoiceNumber] = useState(() => `INV-${Date.now().toString().slice(-7)}`);
  const [invoiceDate, setInvoiceDate] = useState(localDate(today));
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 15);
    return localDate(date);
  });
  const [paymentTerms, setPaymentTerms] = useState("Net 15");
  const [billFrom, setBillFrom] = useState({
    businessName: user?.businessName || user?.name || "",
    email: user?.email || "",
    address: user?.address || "",
    phone: user?.phone || "",
  });
  const [billTo, setBillTo] = useState({ clientName: "", email: "", address: "", phone: "" });
  const [items, setItems] = useState([{ name: "", quantity: "1", unitPrice: "", taxPercent: "0" }]);
  const [notes, setNotes] = useState("");
  const [aiText, setAiText] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiNotice, setAiNotice] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0);
    const tax = items.reduce((sum, item) => {
      const line = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
      return sum + line * (Number(item.taxPercent) || 0) / 100;
    }, 0);
    return {
      subtotal: Math.round((subtotal + Number.EPSILON) * 100) / 100,
      tax: Math.round((tax + Number.EPSILON) * 100) / 100,
      total: Math.round((subtotal + tax + Number.EPSILON) * 100) / 100,
    };
  }, [items]);

  const updateParty = (party, field, value) => {
    setAiNotice("");
    const setParty = party === "billFrom" ? setBillFrom : setBillTo;
    setParty((current) => ({ ...current, [field]: value }));
  };

  const updateItem = (index, field, value) => {
    setAiNotice("");
    setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
  };

  const addItem = () => setItems((current) => [...current, { name: "", quantity: "1", unitPrice: "", taxPercent: "0" }]);
  const removeItem = (index) => setItems((current) => current.length === 1 ? current : current.filter((_, itemIndex) => itemIndex !== index));

  const parseWithAI = async () => {
    if (!aiText.trim()) {
      setAiError("Paste invoice text first.");
      return;
    }
    setAiLoading(true);
    setAiError("");
    setAiNotice("");
    try {
      const { data } = await axiosInstance.post(API_PATHS.AI.PARSE_INVOICE_TEXT, { text: aiText.trim() }, { timeout: 45000 });
      const extracted = data.data;
      if (!extracted || typeof extracted !== "object" || Array.isArray(extracted)) {
        throw new Error("AI returned invalid invoice data. Try again or enter details manually.");
      }
      const hasClientDetails = ["clientName", "email", "address", "phone"].some((field) => typeof extracted[field] === "string" && extracted[field].trim());
      const extractedItems = Array.isArray(extracted.items) ? extracted.items : [];
      if (!hasClientDetails && extractedItems.length === 0) {
        throw new Error("AI couldn't find client details or line items. Add more detail and try again.");
      }
      if (hasClientDetails) {
        setBillTo((current) => ({
          ...current,
          clientName: extracted.clientName || current.clientName,
          email: extracted.email || current.email,
          address: extracted.address || current.address,
          phone: extracted.phone || current.phone,
        }));
      }
      if (extractedItems.length) {
        setItems(extractedItems.map((item) => ({
          name: item.name || "",
          quantity: String(Number(item.quantity) || 1),
          unitPrice: String(Number(item.unitPrice) || 0),
          taxPercent: "0",
        })));
      }
      const changedFields = [];
      if (hasClientDetails) changedFields.push("client details");
      if (extractedItems.length) changedFields.push(`${extractedItems.length} line ${extractedItems.length === 1 ? "item" : "items"}`);
      setAiNotice(`AI filled ${changedFields.join(" and ")}. Review the details and tax rates before saving.`);
      setAiOpen(false);
      setAiText("");
    } catch (error) {
      setAiError(error.response?.data?.message || error.message || "AI couldn't read that text. Try again or enter details manually.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    if (!billFrom.businessName.trim() || !billTo.clientName.trim()) {
      setSubmitError("Add your business name and the client name before saving.");
      return;
    }
    if (items.some((item) => !item.name.trim() || Number(item.quantity) <= 0 || Number(item.unitPrice) < 0 || Number(item.taxPercent) < 0 || Number(item.taxPercent) > 100)) {
      setSubmitError("Check each line item: description is required, quantity must be positive, and tax must be between 0 and 100%.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        invoiceNumber: invoiceNumber.trim(),
        invoiceDate,
        dueDate: dueDate || undefined,
        paymentTerms,
        billFrom,
        billTo,
        items: items.map((item) => ({
          name: item.name.trim(),
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          taxPercent: Number(item.taxPercent) || 0,
        })),
        notes: notes.trim(),
      };
      const { data } = await axiosInstance.post(API_PATHS.INVOICE.CREATE, payload);
      navigate("/invoices", { replace: true, state: { createdInvoice: data.invoice?.invoiceNumber || payload.invoiceNumber } });
    } catch (error) {
      setSubmitError(error.response?.data?.message || "Invoice couldn't be saved. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1160px]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-[#e0e7df] pb-5">
        <div>
          <Link to="/invoices" className="mb-3 inline-flex items-center gap-1.5 text-[10px] font-bold text-[#738379] hover:text-[#365b43]"><ArrowLeft size={13} /> All invoices</Link>
          <p className="text-[9px] font-extrabold tracking-[1.2px] text-[#87948a]">BILLING WORKSPACE</p>
          <h1 className="mt-1 text-[26px] font-extrabold tracking-normal text-[#20372c] sm:text-[30px]">Create an invoice</h1>
          <p className="mt-1 text-[12px] text-[#829086]">Fill in the details, review the totals, and save your draft.</p>
        </div>
        <button type="button" onClick={() => setAiOpen((open) => !open)} className="inline-flex h-9 items-center gap-2 border border-[#d9e5d9] bg-[#edf4ed] px-3 text-[11px] font-extrabold text-[#41674d] transition-colors hover:bg-[#e2eee2]">
          <Sparkles size={14} /> {aiOpen ? "Close AI import" : "Draft from text with AI"} <ChevronDown size={13} className={aiOpen ? "rotate-180" : ""} />
        </button>
      </div>

      {aiOpen && (
        <section className="mb-5 border border-[#dce7dc] bg-[#f4f8f3] p-4 sm:p-5" aria-label="AI invoice text import">
          <div className="mb-3 flex items-start gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center bg-[#e87643] text-white"><Sparkles size={15} /></span>
            <div><h2 className="text-[12px] font-extrabold text-[#314b3b]">Pull details from existing text</h2><p className="mt-1 text-[10px] leading-4 text-[#7a8c7e]">Paste a quote, email, or invoice draft. AI will fill in client and item fields for you to review.</p></div>
          </div>
          <textarea value={aiText} onChange={(event) => setAiText(event.target.value)} maxLength={30000} rows={4} placeholder="Paste invoice or quote text here..." className="w-full resize-y border border-[#d9e4d9] bg-white p-3 text-[11px] leading-5 text-[#33473a] outline-none placeholder:text-[#a1ada3] focus:border-[#6e9578] focus:ring-2 focus:ring-[#719477]/15" />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            {aiError ? <p role="alert" className="text-[10px] text-[#b34e3b]">{aiError}</p> : <p className="text-[9px] text-[#8b998d]">{aiText.length.toLocaleString()} / 30,000 characters</p>}
            <button type="button" onClick={parseWithAI} disabled={aiLoading || !aiText.trim()} className="inline-flex h-8 items-center gap-2 bg-[#315b46] px-3 text-[10px] font-bold text-white hover:bg-[#244734] disabled:cursor-not-allowed disabled:opacity-50">
              {aiLoading ? <><LoaderCircle size={13} className="animate-spin" /> Reading text...</> : <><Sparkles size={13} /> Extract details</>}
            </button>
          </div>
        </section>
      )}

      {aiNotice && <p role="status" className="mb-5 border-l-[3px] border-[#6c936c] bg-[#edf5ec] px-3 py-2.5 text-[10px] leading-4 text-[#42634a]">{aiNotice}</p>}

      <form onSubmit={handleSubmit} className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_290px]">
        <div className="space-y-5">
          <section className="border border-[#e2e8e1] bg-white p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between border-b border-[#edf0ec] pb-3">
              <div className="flex items-center gap-2"><span className="grid h-6 w-6 place-items-center bg-[#eef3ee] text-[10px] font-extrabold text-[#477150]">01</span><h2 className="text-[12px] font-extrabold text-[#31473a]">Invoice details</h2></div>
              <FileText size={16} className="text-[#94a297]" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div><label className={labelClass} htmlFor="invoice-number">INVOICE NUMBER</label><input id="invoice-number" className={inputClass} value={invoiceNumber} onChange={(event) => setInvoiceNumber(event.target.value)} required /></div>
              <div><label className={labelClass} htmlFor="invoice-date">ISSUE DATE</label><input id="invoice-date" className={inputClass} type="date" value={invoiceDate} onChange={(event) => setInvoiceDate(event.target.value)} required /></div>
              <div><label className={labelClass} htmlFor="due-date">DUE DATE</label><input id="due-date" className={inputClass} type="date" min={invoiceDate} value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></div>
              <div><label className={labelClass} htmlFor="payment-terms">PAYMENT TERMS</label><select id="payment-terms" className={inputClass} value={paymentTerms} onChange={(event) => setPaymentTerms(event.target.value)}><option>Due on receipt</option><option>Net 7</option><option>Net 15</option><option>Net 30</option><option>Net 45</option><option>Net 60</option></select></div>
            </div>
          </section>

          <section className="border border-[#e2e8e1] bg-white p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 border-b border-[#edf0ec] pb-3"><span className="grid h-6 w-6 place-items-center bg-[#eef3ee] text-[10px] font-extrabold text-[#477150]">02</span><h2 className="text-[12px] font-extrabold text-[#31473a]">From and to</h2></div>
            <div className="grid gap-5 md:grid-cols-2">
              {[{ title: "YOUR BUSINESS", party: "billFrom", fields: [["businessName", "Business name", true], ["email", "Email", false], ["address", "Address", false], ["phone", "Phone", false]] }, { title: "CLIENT", party: "billTo", fields: [["clientName", "Client name", true], ["email", "Email", false], ["address", "Address", false], ["phone", "Phone", false]] }].map(({ title, party, fields }) => (
                <div key={party}>
                  <h3 className="mb-3 text-[9px] font-extrabold tracking-[.85px] text-[#8a968d]">{title}</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {fields.map(([field, label, required]) => {
                      const id = `${party}-${field}`;
                      return <div key={field} className={field === "address" ? "sm:col-span-2" : ""}><label htmlFor={id} className={labelClass}>{label.toUpperCase()}{required ? " *" : ""}</label><input id={id} className={inputClass} type={field === "email" ? "email" : "text"} value={(party === "billFrom" ? billFrom : billTo)[field]} onChange={(event) => updateParty(party, field, event.target.value)} required={required} placeholder={label} /></div>;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-[#e2e8e1] bg-white p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0ec] pb-3">
              <div className="flex items-center gap-2"><span className="grid h-6 w-6 place-items-center bg-[#eef3ee] text-[10px] font-extrabold text-[#477150]">03</span><h2 className="text-[12px] font-extrabold text-[#31473a]">Line items</h2></div>
              <span className="text-[9px] text-[#8b978e]">Add each product or service</span>
            </div>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="grid gap-2 border-b border-[#f0f2ee] pb-3 last:border-0 last:pb-0 sm:grid-cols-[minmax(150px,1fr)_90px_120px_100px_110px_30px] sm:items-end">
                  <div><label className={labelClass} htmlFor={`item-name-${index}`}>{index === 0 ? "DESCRIPTION" : `ITEM ${index + 1}`}</label><input id={`item-name-${index}`} className={inputClass} value={item.name} onChange={(event) => updateItem(index, "name", event.target.value)} placeholder="Service or product" required /></div>
                  <div><label className={labelClass} htmlFor={`item-qty-${index}`}>QTY</label><input id={`item-qty-${index}`} className={inputClass} type="number" min="0.01" step="0.01" value={item.quantity} onChange={(event) => updateItem(index, "quantity", event.target.value)} required /></div>
                  <div><label className={labelClass} htmlFor={`item-price-${index}`}>UNIT PRICE</label><input id={`item-price-${index}`} className={inputClass} type="number" min="0" step="0.01" value={item.unitPrice} onChange={(event) => updateItem(index, "unitPrice", event.target.value)} placeholder="0.00" required /></div>
                  <div><label className={labelClass} htmlFor={`item-tax-${index}`}>TAX %</label><input id={`item-tax-${index}`} className={inputClass} type="number" min="0" max="100" step="0.01" value={item.taxPercent} onChange={(event) => updateItem(index, "taxPercent", event.target.value)} /></div>
                  <div><span className={`${labelClass} block`}>LINE TOTAL</span><div className="flex h-10 items-center text-[11px] font-extrabold tabular-nums text-[#30483a]">{currency.format((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0) * (1 + (Number(item.taxPercent) || 0) / 100))}</div></div>
                  <button type="button" aria-label={`Remove item ${index + 1}`} disabled={items.length === 1} onClick={() => removeItem(index)} className="grid h-8 w-8 place-items-center self-end text-[#a4aea5] transition-colors hover:bg-[#fff1ed] hover:text-[#bd543d] disabled:cursor-not-allowed disabled:opacity-30"><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addItem} className="mt-4 inline-flex h-8 items-center gap-1.5 border border-[#d9e4d9] px-2.5 text-[10px] font-bold text-[#477150] transition-colors hover:bg-[#f1f6f0]"><Plus size={13} /> Add line item</button>
          </section>

          <section className="border border-[#e2e8e1] bg-white p-4 sm:p-5">
            <label htmlFor="invoice-notes" className={`${labelClass} mb-2`}>NOTES FOR YOUR CLIENT</label>
            <textarea id="invoice-notes" value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={1000} rows={3} placeholder="A thank-you, delivery note, or extra payment detail..." className="w-full resize-y border border-[#dfe6df] px-3 py-2.5 text-[11px] leading-5 text-[#314539] outline-none placeholder:text-[#a4aea6] focus:border-[#6e9578] focus:ring-2 focus:ring-[#719477]/15" />
          </section>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-[88px]">
          <section className="border border-[#e2e8e1] bg-white p-5">
            <div className="mb-4 flex items-center justify-between border-b border-[#edf0ec] pb-3"><h2 className="text-[12px] font-extrabold text-[#31473a]">Summary</h2><CircleHelp size={15} className="text-[#9aa59c]" /></div>
            <div className="space-y-3 text-[11px]">
              <div className="flex justify-between text-[#7d8b80]"><span>Subtotal</span><span className="font-semibold tabular-nums text-[#485b4d]">{currency.format(totals.subtotal)}</span></div>
              <div className="flex justify-between text-[#7d8b80]"><span>Tax</span><span className="font-semibold tabular-nums text-[#485b4d]">{currency.format(totals.tax)}</span></div>
            </div>
            <div className="mt-4 flex items-end justify-between border-t border-[#e9eee8] pt-4"><span className="text-[10px] font-extrabold tracking-[.65px] text-[#67786b]">TOTAL DUE</span><span className="text-[22px] font-extrabold tabular-nums text-[#244334]">{currency.format(totals.total)}</span></div>
            <p className="mt-2 text-right text-[9px] text-[#95a097]">Amounts shown in INR</p>
          </section>

          <div className="border border-[#e2e8e1] bg-white p-4">
            <h3 className="text-[10px] font-extrabold text-[#516457]">Before you save</h3>
            <ul className="mt-2 space-y-2 text-[9px] leading-4 text-[#859187]">
              <li className="flex gap-2"><Check size={12} className="mt-0.5 shrink-0 text-[#5c8c64]" />Your business and client details are included.</li>
              <li className="flex gap-2"><Check size={12} className="mt-0.5 shrink-0 text-[#5c8c64]" />Line totals include each item’s tax rate.</li>
              <li className="flex gap-2"><Check size={12} className="mt-0.5 shrink-0 text-[#5c8c64]" />New invoices are saved as unpaid.</li>
            </ul>
          </div>

          {submitError && <p role="alert" className="border-l-[3px] border-[#c25a46] bg-[#fff3ef] px-3 py-2.5 text-[10px] leading-4 text-[#9e4939]">{submitError}</p>}
          <button type="submit" disabled={saving} className="flex h-11 w-full items-center justify-center gap-2 bg-[#e87643] px-4 text-[11px] font-extrabold text-white transition-colors hover:bg-[#d86636] disabled:cursor-wait disabled:opacity-60">
            {saving ? <><LoaderCircle size={15} className="animate-spin" /> Saving invoice...</> : <><Check size={15} /> Save invoice</>}
          </button>
          <Link to="/invoices" className="flex h-9 w-full items-center justify-center border border-[#dce5dc] bg-white text-[10px] font-bold text-[#6e7e72] transition-colors hover:bg-[#f8faf7]">Cancel</Link>
        </aside>
      </form>
    </div>
  );
};

export default CreateInvoice;