import {
  ArrowRight,
  Check,
  FilePlus2,
  FileText,
  LayoutDashboard,
  Mail,
  Sparkles,
  UserRound,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth.js";
import Footer from "../../components/landing/footer";
import Header from "../../components/landing/header";

const workflow = [
  {
    number: "01",
    icon: UserRound,
    title: "Set up your workspace",
    description: "Create an account and add your business details. BillCraft can reuse them when you prepare an invoice.",
  },
  {
    number: "02",
    icon: FilePlus2,
    title: "Create an invoice",
    description: "Enter a client, services, quantities, prices, dates, and tax rates yourself, or start with text and ask AI to extract selected details.",
  },
  {
    number: "03",
    icon: LayoutDashboard,
    title: "Keep billing in view",
    description: "Review invoices by payment status, search and sort your list, and use the dashboard to see collected and outstanding amounts.",
  },
  {
    number: "04",
    icon: Mail,
    title: "Follow up with confidence",
    description: "Print an invoice, mark it paid when payment arrives, or prepare an editable reminder for an unpaid invoice.",
  },
];

const aiCapabilities = [
  {
    icon: FileText,
    title: "Invoice text extraction",
    description: "Turn pasted quote or email text into suggested client contact fields and line items. Review and correct every value before saving.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard insights",
    description: "Receive concise observations based on your invoice totals, payment statuses, and recent activity.",
  },
  {
    icon: Mail,
    title: "Payment reminder drafts",
    description: "Generate an editable subject and message from an unpaid invoice. You decide whether to change, copy, or send it.",
  },
];

const HowItWorks = () => {
  const { isAuthenticated } = useAuth();
  const primaryLink = isAuthenticated ? "/create-invoice" : "/signup";

  return (
    <div className="bg-white text-[#48574d]">
      <Header />
      <main className="pt-20">
        <section className="border-b border-[#e7e8df] bg-[#f7f7f2]">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:py-20">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-extrabold tracking-[1.5px] text-[#b85f3c]">
                <span className="h-px w-7 bg-[#e87643]" /> HOW BILLCRAFT WORKS
              </p>
              <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-[1.08] text-[#24392e] sm:text-5xl lg:text-[58px]">
                Billing, made clear from first draft to follow-up.
              </h1>
              <p className="mt-5 max-w-xl text-[16px] leading-7 text-[#6f7c71]">
                Create professional invoices, keep payment progress organized, and use AI for focused assistance. You stay in control of every detail and every decision.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to={primaryLink} className="inline-flex h-11 items-center gap-2 bg-[#e87643] px-5 text-[12px] font-extrabold text-white transition-colors hover:bg-[#d86636]">
                  {isAuthenticated ? "Create an invoice" : "Get started"}<ArrowRight size={15} />
                </Link>
                <a href="#ai-assistance" className="inline-flex h-11 items-center gap-2 border border-[#d8dfd5] bg-white px-5 text-[12px] font-bold text-[#49604f] transition-colors hover:bg-[#f0f3ed]">
                  <Sparkles size={15} /> How AI assists
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[520px] border border-[#dce4d9] bg-white shadow-[0_18px_50px_-34px_rgba(35,57,44,0.38)]" aria-label="Illustration of an invoice in the BillCraft workspace">
              <div className="flex items-center justify-between border-b border-[#edf0e9] px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center bg-[#edf3ed] text-[#426b4b]"><FileText size={17} /></span>
                  <div><p className="text-[12px] font-extrabold text-[#31473a]">New invoice</p><p className="mt-0.5 text-[9px] text-[#8b978d]">BILLING WORKSPACE</p></div>
                </div>
                <span className="border border-[#e4e9e1] px-2 py-1 text-[9px] font-bold text-[#77857a]">DRAFT</span>
              </div>
              <div className="px-5 py-5 sm:px-6">
                <div className="grid grid-cols-2 gap-5 border-b border-[#edf0e9] pb-5">
                  <div><p className="text-[9px] font-extrabold tracking-[.7px] text-[#94a096]">BILL TO</p><p className="mt-1.5 text-[12px] font-bold text-[#354b3d]">Northstar Studio</p><p className="mt-0.5 text-[10px] text-[#89968d]">accounts@example.com</p></div>
                  <div className="text-right"><p className="text-[9px] font-extrabold tracking-[.7px] text-[#94a096]">INVOICE NUMBER</p><p className="mt-1.5 text-[11px] font-bold text-[#354b3d]">INV-2026-014</p><p className="mt-0.5 text-[10px] text-[#89968d]">Due in 15 days</p></div>
                </div>
                <div className="py-4">
                  <div className="mb-2 grid grid-cols-[1fr_auto] border-b border-[#edf0e9] pb-2 text-[9px] font-extrabold tracking-[.7px] text-[#94a096]"><span>DESCRIPTION</span><span>AMOUNT</span></div>
                  <div className="grid grid-cols-[1fr_auto] items-center py-2 text-[11px]"><span className="font-semibold text-[#4b5b50]">Brand identity and design</span><span className="font-bold tabular-nums text-[#354b3d]">INR 24,000</span></div>
                  <div className="grid grid-cols-[1fr_auto] items-center py-2 text-[11px]"><span className="font-semibold text-[#4b5b50]">Website consultation</span><span className="font-bold tabular-nums text-[#354b3d]">INR 6,000</span></div>
                </div>
                <div className="flex items-end justify-between border-t border-[#edf0e9] pt-4">
                  <p className="text-[9px] font-extrabold tracking-[.7px] text-[#94a096]">TOTAL DUE</p>
                  <p className="text-[21px] font-extrabold tabular-nums text-[#263e31]">INR 30,000</p>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t border-[#edf0e9] bg-[#f7faf6] px-5 py-3 text-[10px] font-semibold text-[#55745d] sm:px-6">
                <Check size={13} /> Review the details, then save your invoice
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20" aria-labelledby="workflow-heading">
          <div className="max-w-2xl">
            <p className="text-[10px] font-extrabold tracking-[1.3px] text-[#b85f3c]">THE BILLING WORKFLOW</p>
            <h2 id="workflow-heading" className="mt-3 text-3xl font-extrabold text-[#263c30] sm:text-[38px]">Four steps. One organized workspace.</h2>
            <p className="mt-3 text-[14px] leading-6 text-[#7a867c]">The essentials stay straightforward, whether you create one invoice or manage billing every day.</p>
          </div>
          <div className="mt-9 grid border-y border-[#e7ebe4] md:grid-cols-2 xl:grid-cols-4 xl:divide-x xl:divide-[#e7ebe4]">
            {workflow.map(({ number, icon: Icon, title, description }) => (
              <article key={number} className="border-b border-[#e7ebe4] py-6 md:px-6 md:first:pl-0 xl:border-b-0 xl:py-7 xl:first:pl-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold tabular-nums text-[#d06b42]">{number}</span>
                  <Icon size={18} strokeWidth={1.7} className="text-[#59715e]" />
                </div>
                <h3 className="mt-5 text-[16px] font-extrabold text-[#34493b]">{title}</h3>
                <p className="mt-2 text-[12px] leading-5 text-[#7d897f]">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="ai-assistance" className="scroll-mt-20 border-y border-[#e3e9e0] bg-[#f4f7f2]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-18 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8 lg:py-20">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-extrabold tracking-[1.3px] text-[#b85f3c]"><Sparkles size={14} /> AI, WITH YOU IN CONTROL</p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[#263c30] sm:text-[38px]">Useful assistance. Your final say.</h2>
              <p className="mt-4 text-[13px] leading-6 text-[#758277]">BillCraft uses Google Gemini for specific tasks that reduce repetitive typing and help summarize billing activity. AI suggestions stay editable; they do not approve, send, or mark an invoice paid for you.</p>
              <div className="mt-7 border-l-[3px] border-[#e87643] bg-white px-4 py-3.5">
                <p className="text-[11px] font-extrabold text-[#435849]">What happens to pasted text?</p>
                <p className="mt-1.5 text-[11px] leading-5 text-[#7a867d]">When you request extraction, the text you paste is sent to the configured Gemini service. Invoice details are also sent when you request a reminder or dashboard insight. Only submit information you are comfortable processing, and verify generated content before using it.</p>
              </div>
            </div>

            <div className="min-w-0 self-center">
              <div className="mb-3 flex items-center justify-between text-[9px] font-extrabold tracking-[.9px] text-[#849187]"><span>FROM EXISTING TEXT</span><span>TO REVIEWABLE FIELDS</span></div>
              <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-4">
                <div className="min-w-0 border border-[#dfe6dc] bg-white p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-[10px] font-extrabold text-[#4e6654]"><FileText size={14} /> PASTED TEXT</div>
                  <p className="mt-4 text-[12px] leading-6 text-[#69776d]">"2 hours of design support at INR 1,500 per hour for Anika Shah."</p>
                </div>
                <div className="grid place-items-center text-[#d8764a]"><ArrowRight size={18} className="rotate-90 md:rotate-0" /></div>
                <div className="min-w-0 border border-[#dfe6dc] bg-white p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-[10px] font-extrabold text-[#4e6654]"><Sparkles size={14} /> SUGGESTED DETAILS</div>
                  <dl className="mt-3 divide-y divide-[#edf0e9] text-[11px]">
                    <div className="flex justify-between gap-3 py-2"><dt className="text-[#87938a]">Client</dt><dd className="truncate font-bold text-[#405347]">Anika Shah</dd></div>
                    <div className="flex justify-between gap-3 py-2"><dt className="text-[#87938a]">Description</dt><dd className="truncate font-bold text-[#405347]">Design support</dd></div>
                    <div className="flex justify-between gap-3 py-2"><dt className="text-[#87938a]">Quantity / rate</dt><dd className="font-bold text-[#405347]">2 / INR 1,500</dd></div>
                  </dl>
                </div>
              </div>
              <p className="mt-3 text-[10px] leading-5 text-[#859187]">Illustrative example. Extraction covers client contact details and line items; dates, payment terms, tax rates, and other invoice fields remain yours to complete and check.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20" aria-labelledby="ai-tools-heading">
          <div className="flex flex-col justify-between gap-4 border-b border-[#e7ebe4] pb-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-extrabold tracking-[1.3px] text-[#b85f3c]">THREE PRACTICAL USES</p>
              <h2 id="ai-tools-heading" className="mt-2 text-3xl font-extrabold text-[#263c30] sm:text-[36px]">AI where it saves a step.</h2>
            </div>
            <p className="max-w-md text-[12px] leading-5 text-[#7a867c]">Use the assistance that fits the task. Your invoice records and payment controls remain in your hands.</p>
          </div>
          <div className="mt-2 grid md:grid-cols-3 md:divide-x md:divide-[#e7ebe4]">
            {aiCapabilities.map(({ icon: Icon, title, description }) => (
              <article key={title} className="border-b border-[#e7ebe4] py-6 md:px-6 md:first:pl-0 md:last:pr-0 md:last:border-b-0">
                <Icon size={19} strokeWidth={1.7} className="text-[#d37449]" />
                <h3 className="mt-4 text-[14px] font-extrabold text-[#3a4f40]">{title}</h3>
                <p className="mt-2 text-[11px] leading-5 text-[#7d897f]">{description}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 flex items-start gap-2 text-[10px] leading-5 text-[#849087]"><Zap size={13} className="mt-0.5 shrink-0 text-[#c77a3e]" /> AI can misunderstand source text or produce inaccurate suggestions. Confirm names, quantities, prices, dates, and tax before saving or sending anything.</p>
        </section>

        <section className="border-t border-[#e7e8df] bg-[#f7f7f2]">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 px-4 py-10 sm:px-6 sm:py-12 md:flex-row md:items-center lg:px-8">
            <div><p className="text-[10px] font-extrabold tracking-[1px] text-[#b85f3c]">READY WHEN YOU ARE</p><h2 className="mt-2 text-2xl font-extrabold text-[#263c30]">Bring your billing into focus.</h2></div>
            <Link to={primaryLink} className="inline-flex h-11 items-center gap-2 bg-[#315b46] px-5 text-[12px] font-extrabold text-white transition-colors hover:bg-[#244734]">
              {isAuthenticated ? "Create an invoice" : "Create your account"}<ArrowRight size={15} />
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
};

export default HowItWorks;
