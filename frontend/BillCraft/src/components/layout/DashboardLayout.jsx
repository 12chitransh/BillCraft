import { useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  FilePlus2,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth.js";

const navigation = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { label: "Invoices", to: "/invoices", icon: FileText },
  { label: "Profile", to: "/profile", icon: UserRound },
];

const DashboardLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const accountName = user?.businessName || user?.name || "Your workspace";
  const initials = accountName.slice(0, 1).toUpperCase();

  const handleSignOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navLinks = (mobile = false) => navigation.map(({ label, to, icon: Icon }) => (
    <NavLink
      key={to}
      to={to}
      end={to === "/dashboard"}
      onClick={() => mobile && setMobileMenuOpen(false)}
      className={({ isActive }) => `group flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold transition-colors ${
        isActive
          ? "bg-[#315449] text-white"
          : "text-[#b4c4bb] hover:bg-white/7 hover:text-white"
      }`}
    >
      <Icon size={17} strokeWidth={1.9} />
      <span>{label}</span>
      {label === "Invoices" && <ArrowUpRight className="ml-auto opacity-0 transition-opacity group-hover:opacity-70" size={14} />}
    </NavLink>
  ));

  return (
    <div className="min-h-screen bg-[#f3f5f1] text-[#20342b]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[244px] flex-col bg-[#17352d] text-white lg:flex">
        <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-6">
          <span className="grid h-9 w-9 place-items-center rounded-[10px_10px_10px_3px] bg-[#e87643] text-white"><FileText size={19} /></span>
          <span className="text-[19px] font-extrabold tracking-normal">BillCraft<span className="text-[#f29163]">.</span></span>
        </div>

        <div className="px-4 pt-6">
          <Link to="/create-invoice" className="flex h-10 items-center justify-center gap-2 bg-[#e87643] px-3 text-[12px] font-bold text-white transition-colors hover:bg-[#d86636]">
            <FilePlus2 size={16} /> Create invoice
          </Link>
        </div>

        <div className="px-6 pb-2 pt-8 text-[9px] font-extrabold tracking-[1.5px] text-[#7f9a8b]">WORKSPACE</div>
        <nav aria-label="Main navigation" className="space-y-1 px-3">{navLinks()}</nav>

        <div className="mt-auto border-t border-white/10 px-4 py-4">
          <div className="mb-3 flex min-w-0 items-center gap-3 px-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center bg-[#42685a] text-[12px] font-bold text-[#edf4ec]">{initials}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12px] font-bold text-white">{accountName}</span>
              <span className="block truncate text-[10px] text-[#9cb0a4]">{user?.email}</span>
            </span>
          </div>
          <button type="button" onClick={handleSignOut} className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-[12px] font-semibold text-[#b4c4bb] transition-colors hover:bg-white/7 hover:text-white">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[244px]">
        <header className="sticky top-0 z-30 flex h-[66px] items-center justify-between border-b border-[#e4e9e3] bg-[#f8faf7]/95 px-4 backdrop-blur sm:px-7 lg:px-9">
          <div className="flex items-center gap-3">
            <button type="button" aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMobileMenuOpen((open) => !open)} className="grid h-9 w-9 place-items-center border border-[#dfe6df] bg-white text-[#42564a] lg:hidden">
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#87948b]">
              <BarChart3 size={14} className="hidden sm:block" />
              <span className="hidden sm:inline">Workspace</span>
              <span className="hidden text-[#b7c0b9] sm:inline">/</span>
              <span className="text-[#35483d]">{accountName}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-[11px] font-medium text-[#78867c] sm:block">{user?.email}</span>
            <span className="grid h-8 w-8 place-items-center bg-[#e5eee5] text-[11px] font-bold text-[#315b43]">{initials}</span>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-[#10261f]/40 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
            <aside className="flex h-full w-[min(84vw,300px)] flex-col bg-[#17352d] pb-5 text-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
              <div className="flex h-[66px] items-center justify-between border-b border-white/10 px-5">
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-[18px] font-extrabold">BillCraft<span className="text-[#f29163]">.</span></Link>
                <button type="button" aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)} className="grid h-9 w-9 place-items-center text-[#c1d0c6]"><X size={19} /></button>
              </div>
              <div className="px-4 pt-5">
                <Link to="/create-invoice" onClick={() => setMobileMenuOpen(false)} className="flex h-10 items-center justify-center gap-2 bg-[#e87643] text-[12px] font-bold"><FilePlus2 size={16} /> Create invoice</Link>
              </div>
              <div className="px-6 pb-2 pt-7 text-[9px] font-extrabold tracking-[1.5px] text-[#7f9a8b]">WORKSPACE</div>
              <nav aria-label="Mobile navigation" className="space-y-1 px-3">{navLinks(true)}</nav>
              <button type="button" onClick={handleSignOut} className="mt-auto flex items-center gap-3 border-t border-white/10 px-7 pt-5 text-left text-[12px] font-semibold text-[#b4c4bb]"><LogOut size={16} /> Sign out</button>
            </aside>
          </div>
        )}

        <main className="mx-auto w-full max-w-[1500px] px-4 py-7 sm:px-7 sm:py-9 lg:px-9 lg:py-10">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;