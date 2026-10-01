import { Lightbulb, RefreshCw, Sparkles } from "lucide-react";

const accents = [
  "border-l-[#e87643]",
  "border-l-[#709273]",
  "border-l-[#d2a34b]",
];

const DashboardAIInsights = ({ insights = [], loading = false, error = "", onRetry }) => (
  <section className="relative overflow-hidden bg-[#17352d] text-white" aria-labelledby="ai-insights-heading">
    <div className="pointer-events-none absolute inset-0 opacity-[.08] [background-image:linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:34px_34px]" />
    <div className="relative px-5 py-5 sm:px-7 sm:py-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center bg-[#e87643] text-white"><Sparkles size={17} /></span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="ai-insights-heading" className="text-[15px] font-extrabold">AI business insights</h2>
              <span className="border border-white/15 px-1.5 py-0.5 text-[8px] font-extrabold tracking-[.9px] text-[#d7e2d8]">BILLCRAFT AI</span>
            </div>
            <p className="mt-1 text-[11px] text-[#b3c5b9]">A fresh read on what your invoices are telling you.</p>
          </div>
        </div>
        {onRetry && (
          <button type="button" onClick={onRetry} disabled={loading} className="inline-flex h-8 items-center gap-2 border border-white/20 px-2.5 text-[10px] font-bold text-[#e0e9e1] transition-colors hover:bg-white/10 disabled:opacity-50">
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh insights
          </button>
        )}
      </div>

      {loading ? (
        <div className="mt-5 grid gap-3 md:grid-cols-3" aria-label="Generating AI insights">
          {[0, 1, 2].map((item) => <div key={item} className="h-[78px] animate-pulse border border-white/10 bg-white/5" />)}
        </div>
      ) : error ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border border-[#f0a582]/30 bg-white/5 px-4 py-3">
          <p className="flex items-center gap-2 text-[11px] leading-5 text-[#f1d5c7]"><Lightbulb size={15} className="shrink-0 text-[#f2a579]" /> {error}</p>
          {onRetry && <button type="button" onClick={onRetry} className="text-[10px] font-bold text-[#ffb389] hover:text-white">Try again</button>}
        </div>
      ) : (
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {(insights.length ? insights : ["Your invoice activity is ready for review. New billing patterns will appear here as your business grows."]).slice(0, 3).map((insight, index) => (
            <article key={`${index}-${insight}`} className={`flex min-h-[82px] items-start gap-3 border border-white/10 border-l-[3px] ${accents[index % accents.length]} bg-white/[.055] px-4 py-3.5 transition-colors hover:bg-white/[.09]`}>
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center bg-white/10 text-[#f0a176]"><Lightbulb size={13} /></span>
              <p className="text-[11px] leading-[1.65] text-[#e0e9e1]">{insight}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  </section>
);

export default DashboardAIInsights;