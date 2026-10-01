import { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CircleDollarSign,
  Clock3,
  FileText,
  Plus,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth.js";
import DashboardAIInsights from "../../components/dashboard/DashboardAIInsights";
import DashboardRecentInvoiceSection from "../../components/dashboard/DashboardRecentInvoiceSection";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const money = (value) => currency.format(Number.isFinite(Number(value)) ? Number(value) : 0);

const MetricCard = ({ label, value, note, icon: Icon, tone, loading }) => (
  <article className="min-w-0 border border-[#e4e9e2] bg-white p-4 sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[10px] font-extrabold tracking-[.7px] text-[#87938a]">{label}</p>
        {loading
          ? <div className="mt-3 h-7 w-28 animate-pulse bg-[#edf1ec]" />
          : <p className="mt-2 truncate text-[22px] font-extrabold tabular-nums tracking-normal text-[#22382d] sm:text-[24px]">{value}</p>}
      </div>
      <span className={`grid h-9 w-9 shrink-0 place-items-center ${tone}`}><Icon size={17} strokeWidth={1.8} /></span>
    </div>
    <p className="mt-3 flex items-center gap-1.5 text-[10px] text-[#8b978d]">
      {label === "Collected" ? <ArrowDownLeft size={12} className="text-[#4e855e]" /> : label === "Past due" ? <TriangleAlert size={12} className="text-[#d67a43]" /> : <ArrowUpRight size={12} className="text-[#809085]" />}
      {note}
    </p>
  </article>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [insights, setInsights] = useState([]);
  const [invoiceLoading, setInvoiceLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [invoiceError, setInvoiceError] = useState("");
  const [insightsError, setInsightsError] = useState("");
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    let active = true;

    axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES)
      .then(({ data }) => {
        if (!active) return;
        if (!Array.isArray(data.invoices)) throw new Error("The invoice list response was unexpected.");
        setInvoices(data.invoices);
        setInvoiceError("");
      })
      .catch((error) => {
        if (active) setInvoiceError(error.response?.data?.message || error.message || "Invoices could not be loaded.");
      })
      .finally(() => {
        if (active) setInvoiceLoading(false);
      });

    axiosInstance.get(API_PATHS.AI.GET_DASHBOARD_SUMMARY, { timeout: 30000 })
      .then(({ data }) => {
        if (!active) return;
        setInsights(Array.isArray(data.insights) ? data.insights : []);
        setInsightsError("");
      })
      .catch((error) => {
        if (active) setInsightsError(error.response?.data?.message || "AI insights are unavailable right now.");
      })
      .finally(() => {
        if (active) setInsightsLoading(false);
      });

    return () => { active = false; };
  }, [requestKey]);

  const paidInvoices = invoices.filter((invoice) => invoice.status === "Paid");
  const unpaidInvoices = invoices.filter((invoice) => invoice.status !== "Paid");
  const paidRevenue = paidInvoices.reduce((sum, invoice) => sum + (Number(invoice.total) || 0), 0);
  const outstanding = unpaidInvoices.reduce((sum, invoice) => sum + (Number(invoice.total) || 0), 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueCount = unpaidInvoices.filter((invoice) => {
    const dueDate = invoice.dueDate ? new Date(invoice.dueDate) : null;
    return dueDate && !Number.isNaN(dueDate.getTime()) && dueDate < today;
  }).length;
  const firstName = user?.name?.trim().split(/\s+/)[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const dateLabel = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const retryDashboard = () => {
    setInvoiceLoading(true);
    setInsightsLoading(true);
    setInvoiceError("");
    setInsightsError("");
    setRequestKey((key) => key + 1);
  };

  return (
    <div className="space-y-6 sm:space-y-7">
      <section className="flex flex-col justify-between gap-4 border-b border-[#e0e7df] pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-[9px] font-extrabold tracking-[1.3px] text-[#89968c]">{dateLabel.toUpperCase()}</p>
          <h1 className="text-[26px] font-extrabold leading-tight tracking-normal text-[#20372c] sm:text-[30px]">{greeting}, {firstName}</h1>
          <p className="mt-1.5 text-[12px] text-[#829086]">Here’s where your business stands today.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={retryDashboard} disabled={invoiceLoading || insightsLoading} aria-label="Refresh dashboard" className="grid h-9 w-9 place-items-center border border-[#dce5dc] bg-white text-[#617468] transition-colors hover:bg-[#eaf0e9] disabled:opacity-50">
            <RefreshCw size={15} className={invoiceLoading || insightsLoading ? "animate-spin" : ""} />
          </button>
          <Link to="/create-invoice" className="inline-flex h-9 items-center justify-center gap-2 bg-[#e87643] px-3.5 text-[11px] font-extrabold text-white transition-colors hover:bg-[#d86636]">
            <Plus size={15} /> New invoice
          </Link>
        </div>
      </section>

      {invoiceError && (
        <div className="flex flex-wrap items-center justify-between gap-3 border border-[#efc7b6] bg-[#fff8f3] px-4 py-3 text-[11px] text-[#925233]" role="alert">
          <span>{invoiceError}</span>
          <button type="button" onClick={retryDashboard} className="font-extrabold underline underline-offset-2">Retry</button>
        </div>
      )}

      <section aria-label="Invoice summary" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Invoices issued" value={invoices.length} note="All invoices in your workspace" icon={FileText} tone="bg-[#eef2ec] text-[#58715e]" loading={invoiceLoading} />
        <MetricCard label="Collected" value={money(paidRevenue)} note={`${paidInvoices.length} marked paid`} icon={CircleDollarSign} tone="bg-[#eaf3eb] text-[#4b805b]" loading={invoiceLoading} />
        <MetricCard label="Outstanding" value={money(outstanding)} note={`${unpaidInvoices.length} awaiting payment`} icon={Clock3} tone="bg-[#fff2e8] text-[#c26e3c]" loading={invoiceLoading} />
        <MetricCard label="Past due" value={overdueCount} note={overdueCount === 1 ? "Invoice needs follow-up" : "Invoices need follow-up"} icon={TriangleAlert} tone="bg-[#f9eeea] text-[#ba5a43]" loading={invoiceLoading} />
      </section>

      <DashboardAIInsights
        insights={insights}
        loading={insightsLoading}
        error={insightsError}
        onRetry={retryDashboard}
      />

      <DashboardRecentInvoiceSection invoices={invoices} loading={invoiceLoading} />

      {!invoiceLoading && invoices.length > 0 && (
        <div className="flex items-center justify-between border-t border-[#e2e8e1] pt-4 text-[10px] text-[#8b978d]">
          <span>Showing your latest {Math.min(invoices.length, 5)} invoices</span>
          <Link to="/invoices" className="font-bold text-[#477151] hover:text-[#274b34]">Manage billing</Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;