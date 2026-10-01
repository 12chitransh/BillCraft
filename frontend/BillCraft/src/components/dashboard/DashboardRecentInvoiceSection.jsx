import { ArrowRight, ArrowUpRight, FilePlus2, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const shortDate = (value) => {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
};

const invoiceStatus = (invoice) => {
  if (invoice.status === "Paid") return "Paid";
  if (invoice.dueDate) {
    const due = new Date(invoice.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!Number.isNaN(due.getTime()) && due < today) return "Overdue";
  }
  return "Unpaid";
};

const DashboardRecentInvoiceSection = ({ invoices = [], loading = false }) => (
  <section className="overflow-hidden border border-[#e3e9e2] bg-white" aria-labelledby="recent-invoices-heading">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0eb] px-5 py-4 sm:px-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="h-4 w-[3px] bg-[#e87643]" />
          <h2 id="recent-invoices-heading" className="text-[15px] font-extrabold text-[#23382d]">Recent invoices</h2>
        </div>
        <p className="mt-1 text-[11px] text-[#88958b]">Your latest billing activity</p>
      </div>
      <Link to="/invoices" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#3b6a50] transition-colors hover:text-[#214332]">
        All invoices <ArrowRight size={14} />
      </Link>
    </div>

    {loading ? (
      <div className="space-y-4 px-6 py-5" aria-label="Loading recent invoices">
        {[0, 1, 2].map((row) => <div key={row} className="h-10 animate-pulse bg-[#f1f4ef]" />)}
      </div>
    ) : invoices.length === 0 ? (
      <div className="flex flex-col items-center px-5 py-11 text-center">
        <span className="mb-3 grid h-11 w-11 place-items-center bg-[#edf3ed] text-[#4d775c]"><FileText size={20} /></span>
        <h3 className="text-[13px] font-bold text-[#34493d]">Your first invoice is a few clicks away</h3>
        <p className="mt-1 max-w-xs text-[11px] leading-5 text-[#859188]">Create a polished invoice and keep every payment in view.</p>
        <Link to="/create-invoice" className="mt-4 inline-flex h-9 items-center gap-2 bg-[#e87643] px-3 text-[11px] font-bold text-white transition-colors hover:bg-[#d86636]">
          <FilePlus2 size={14} /> Create invoice <ArrowUpRight size={13} />
        </Link>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[690px] border-collapse text-left">
          <thead>
            <tr className="bg-[#fafbf9] text-[9px] font-extrabold tracking-[.85px] text-[#98a39a]">
              <th className="px-6 py-3">INVOICE</th>
              <th className="px-4 py-3">CLIENT</th>
              <th className="px-4 py-3">ISSUED</th>
              <th className="px-4 py-3">DUE DATE</th>
              <th className="px-4 py-3 text-right">TOTAL</th>
              <th className="px-6 py-3">STATUS</th>
              <th className="px-3 py-3"><span className="sr-only">Open invoice</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eef1ed]">
            {invoices.slice(0, 5).map((invoice) => {
              const status = invoiceStatus(invoice);
              const statusStyle = status === "Paid"
                ? "bg-[#eaf3eb] text-[#477253]"
                : status === "Overdue"
                  ? "bg-[#fff0e9] text-[#b9512d]"
                  : "bg-[#f2f3ee] text-[#69766d]";
              return (
                <tr key={invoice._id} className="group transition-colors hover:bg-[#fbfcfa]">
                  <td className="px-6 py-3.5">
                    <Link to={`/invoice/${invoice._id}`} className="text-[11px] font-extrabold text-[#385b47] hover:text-[#df6d3d]">{invoice.invoiceNumber || "Untitled"}</Link>
                  </td>
                  <td className="max-w-[180px] truncate px-4 py-3.5 text-[11px] font-semibold text-[#46574c]">{invoice.billTo?.clientName || "Client"}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-[10px] text-[#7d8a80]">{shortDate(invoice.invoiceDate)}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-[10px] text-[#7d8a80]">{shortDate(invoice.dueDate)}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-right text-[11px] font-bold tabular-nums text-[#283d31]">{currency.format(Number(invoice.total) || 0)}</td>
                  <td className="px-6 py-3.5"><span className={`inline-flex px-2 py-1 text-[9px] font-extrabold ${statusStyle}`}>{status}</span></td>
                  <td className="px-3 py-3.5">
                    <Link to={`/invoice/${invoice._id}`} aria-label={`Open invoice ${invoice.invoiceNumber}`} className="grid h-7 w-7 place-items-center text-[#a2aea4] transition-colors hover:bg-[#edf3ed] hover:text-[#41684e]"><ArrowUpRight size={15} /></Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )}
  </section>
);

export default DashboardRecentInvoiceSection;