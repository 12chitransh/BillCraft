import { useState } from "react";
import { Check, Copy, LoaderCircle, Mail, RefreshCw, Send, Sparkles } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";

const inputClass = "h-10 w-full border border-[#dfe6df] bg-white px-3 text-[12px] text-[#314539] outline-none transition placeholder:text-[#a4aea6] focus:border-[#6e9578] focus:ring-2 focus:ring-[#719477]/15";
const labelClass = "mb-1.5 block text-[10px] font-extrabold tracking-[.55px] text-[#5b6c60]";

const InvoiceReminderEmail = ({ invoice }) => {
  const [recipient, setRecipient] = useState(invoice.billTo?.email || "");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const generateDraft = async () => {
    setLoading(true);
    setError("");
    setCopied(false);
    setSent(false);
    try {
      const { data } = await axiosInstance.post(
        API_PATHS.AI.GENERATE_REMINDER(invoice._id),
        {},
        { timeout: 60000 }
      );
      if (typeof data.subject !== "string" || !data.subject.trim() ||
          typeof data.body !== "string" || !data.body.trim()) {
        throw new Error("The AI returned an incomplete draft. Please try again.");
      }
      setSubject(data.subject.trim());
      setBody(data.body.trim());
      setIsFallback(Boolean(data.fallback));
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "The reminder could not be generated. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async () => {
    if (!validRecipient || !subject.trim() || !body.trim()) {
      setError("Add a valid recipient, subject, and message before sending.");
      return;
    }

    setSending(true);
    setError("");
    setSent(false);
    try {
      await axiosInstance.post(
        API_PATHS.AI.SEND_REMINDER(invoice._id),
        { to: recipient.trim(), subject: subject.trim(), body: body.trim() },
        { timeout: 30000 }
      );
      setSent(true);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Email could not be sent. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const copyDraft = async () => {
    try {
      await navigator.clipboard.writeText(`Subject: ${subject.trim()}\n\n${body.trim()}`);
      setCopied(true);
      setError("");
    } catch {
      setError("Copy is unavailable in this browser. You can select and copy the draft text instead.");
    }
  };

  const validRecipient = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient.trim());
  const mailto = `mailto:${encodeURIComponent(recipient.trim())}?subject=${encodeURIComponent(subject.trim())}&body=${encodeURIComponent(body.trim())}`;

  return (
    <section className="invoice-print-hide mt-5 border border-[#dce7dc] bg-white p-4 sm:p-5" aria-labelledby="reminder-email-heading">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center bg-[#edf4ed] text-[#416b4b]"><Sparkles size={16} /></span>
          <div>
            <h2 id="reminder-email-heading" className="text-[13px] font-extrabold text-[#31473a]">AI payment reminder</h2>
            <p className="mt-1 text-[10px] leading-4 text-[#829086]">Create an editable draft. BillCraft will not send it for you.</p>
          </div>
        </div>
        <button type="button" onClick={generateDraft} disabled={loading} className="inline-flex h-9 items-center gap-2 bg-[#315b46] px-3 text-[10px] font-extrabold text-white transition-colors hover:bg-[#244734] disabled:cursor-wait disabled:opacity-60">
          {loading ? <LoaderCircle size={14} className="animate-spin" /> : subject || body ? <RefreshCw size={13} /> : <Sparkles size={13} />}
          {loading ? "Writing draft..." : subject || body ? "Regenerate draft" : "Generate draft"}
        </button>
      </div>

      {error && <p role="alert" className="mt-4 border-l-[3px] border-[#c25a46] bg-[#fff3ef] px-3 py-2.5 text-[10px] leading-4 text-[#9e4939]">{error}</p>}
      {isFallback && <p role="status" className="mt-4 border-l-[3px] border-[#d3a24d] bg-[#fff8e9] px-3 py-2.5 text-[10px] leading-4 text-[#80612b]">Gemini is temporarily unavailable. This is a basic invoice-based draft; review and edit it before use.</p>}

      {(subject || body || loading) && (
        <div className="mt-4 grid gap-3 border-t border-[#edf0ec] pt-4">
          {loading && !subject && !body && <p role="status" className="flex items-center gap-2 text-[10px] text-[#7b897f]"><LoaderCircle size={13} className="animate-spin" /> Preparing a reminder using this invoice’s details...</p>}
          <div>
            <label htmlFor={`reminder-to-${invoice._id}`} className={labelClass}>TO</label>
            <input id={`reminder-to-${invoice._id}`} className={inputClass} type="email" autoComplete="email" value={recipient} onChange={(event) => { setRecipient(event.target.value); setCopied(false); setSent(false); }} placeholder="client@example.com" />
          </div>
          <div>
            <label htmlFor={`reminder-subject-${invoice._id}`} className={labelClass}>SUBJECT</label>
            <input id={`reminder-subject-${invoice._id}`} className={inputClass} maxLength={160} value={subject} onChange={(event) => { setSubject(event.target.value); setCopied(false); setSent(false); }} placeholder="Payment reminder" />
          </div>
          <div>
            <label htmlFor={`reminder-body-${invoice._id}`} className={labelClass}>MESSAGE</label>
            <textarea id={`reminder-body-${invoice._id}`} className="min-h-40 w-full resize-y border border-[#dfe6df] bg-white px-3 py-2.5 text-[11px] leading-5 text-[#314539] outline-none transition placeholder:text-[#a4aea6] focus:border-[#6e9578] focus:ring-2 focus:ring-[#719477]/15" maxLength={5000} value={body} onChange={(event) => { setBody(event.target.value); setCopied(false); setSent(false); }} placeholder="Your reminder message will appear here." />
          </div>

          {(subject || body) && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button type="button" onClick={copyDraft} disabled={!subject.trim() || !body.trim()} className="inline-flex h-9 items-center gap-2 border border-[#dce5dc] bg-white px-3 text-[10px] font-bold text-[#506356] hover:bg-[#f5f8f4] disabled:opacity-50">
                {copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Copied" : "Copy draft"}
              </button>
              {validRecipient && subject.trim() && body.trim() && (
                <button type="button" onClick={sendEmail} disabled={sending} className="inline-flex h-9 items-center gap-2 bg-[#315b46] px-3 text-[10px] font-extrabold text-white hover:bg-[#244734] disabled:cursor-wait disabled:opacity-60">
                  {sending ? <LoaderCircle size={14} className="animate-spin" /> : <Send size={14} />}{sending ? "Sending..." : "Send email"}
                </button>
              )}
              {validRecipient && subject.trim() && body.trim() ? (
                <a href={mailto} className="inline-flex h-9 items-center gap-2 bg-[#e87643] px-3 text-[10px] font-extrabold text-white hover:bg-[#d86636]"><Mail size={14} /> Open in email</a>
              ) : (
                <span className="text-[10px] text-[#8b978d]">Enter a valid recipient email to open this draft.</span>
              )}
            </div>
          )}
        </div>
      )}
      {sent && <p role="status" className="mt-4 border-l-[3px] border-[#6c936c] bg-[#edf5ec] px-3 py-2.5 text-[10px] leading-4 text-[#42634a]">Reminder email sent to {recipient.trim()}.</p>}
    </section>
  );
};

export default InvoiceReminderEmail;