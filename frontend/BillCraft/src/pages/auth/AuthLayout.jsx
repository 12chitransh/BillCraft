import { ArrowUpRight, FileText, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import "./auth.css";

const AuthLayout = ({ eyebrow, title, description, children }) => (
  <main className="auth-page">
    <section className="auth-story" aria-label="BillCraft invoice preview">
      <Link className="auth-brand" to="/" aria-label="BillCraft home">
        <span className="auth-brand-mark"><FileText size={21} strokeWidth={2.2} /></span>
        <span className="auth-brand-name">BillCraft<span>.</span></span>
      </Link>

      <div className="auth-story-copy">
        <div className="auth-kicker"><Sparkles size={14} /> THE SMARTER WAY TO BILL</div>
        <h1>Less admin.<br />More <span>momentum.</span></h1>
        <p>Turn the work you do into invoices that are ready to send.</p>

        <div className="auth-invoice" aria-label="Sample AI-created invoice">
          <div className="auth-invoice-top">
            <div className="auth-invoice-brand"><span><FileText size={15} /></span> NORTHSTAR STUDIO</div>
            <div className="auth-invoice-number">INVOICE <strong>#1048</strong></div>
          </div>
          <div className="auth-invoice-client">
            <div><small>BILL TO</small><strong>Juniper & Co.</strong><span>juniper.co</span></div>
            <div className="auth-invoice-date"><small>ISSUED</small><strong>28 SEP 2026</strong></div>
          </div>
          <div className="auth-invoice-lines">
            <div className="auth-line-heading"><span>DESCRIPTION</span><span>AMOUNT</span></div>
            <div className="auth-line-item"><span><b>Brand identity</b><small>Strategy + visual system</small></span><strong>$1,850.00</strong></div>
            <div className="auth-line-item"><span><b>Launch assets</b><small>Digital campaign kit</small></span><strong>$640.00</strong></div>
          </div>
          <div className="auth-invoice-total"><span>TOTAL DUE</span><strong>$2,490.00</strong></div>
          <div className="auth-ai-stamp"><span className="auth-ai-spark"><Sparkles size={14} /></span><span><b>Draft shaped by AI</b><small>Details checked · ready to review</small></span><ArrowUpRight size={16} /></div>
        </div>
      </div>

      <div className="auth-story-foot"><span>BUILT FOR PEOPLE WHO BUILD THINGS</span><span>01 <i /> 03</span></div>
    </section>

    <section className="auth-form-side">
      <div className="auth-mobile-brand"><Link className="auth-brand" to="/" aria-label="BillCraft home"><span className="auth-brand-mark"><FileText size={21} /></span><span className="auth-brand-name">BillCraft<span>.</span></span></Link></div>
      <div className="auth-form-wrap">
        <div className="auth-form-heading">
          <span>{eyebrow}</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {children}
        <p className="auth-legal">Your invoices and client details stay in your private workspace.</p>
      </div>
      <div className="auth-form-foot"><span>© 2026 BillCraft</span><Link to="/">Back to home <ArrowUpRight size={13} /></Link></div>
    </section>
  </main>
);

export default AuthLayout;