import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FileText, Menu, X } from "lucide-react";
import { useAuth } from "../../context/useAuth.js";

import ProfileDropdown from "../landing/profileDropdown";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const { isAuthenticated, user, logout: signOut } = useAuth();
  const location = useLocation();
  const sectionHref = (section) => location.pathname === "/" ? `#${section}` : `/#${section}`;

  const handleLogout = () => {
    signOut();
    setProfileDropdownOpen(false);
  };

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between">

          {/* ================= LOGO ================= */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-orange-400 blur-lg opacity-30 group-hover:opacity-50 transition" />

              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Bill<span className="text-orange-500">Craft</span>
              </h1>

              <p className="text-[10px] uppercase tracking-widest text-gray-400">
                AI Invoice Platform
              </p>
            </div>
          </Link>

          {/* ================= DESKTOP NAVIGATION ================= */}
          <nav className="hidden lg:flex items-center gap-1">

            <a
              href={sectionHref("features")}
              className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition"
            >
              Features
            </a>

            <Link
              to="/how-it-works"
              className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition"
            >
              How It Works
            </Link>

            <a
              href={sectionHref("testimonials")}
              className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition"
            >
              Testimonials
            </a>

            <a
              href={sectionHref("faq")}
              className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition"
            >
              FAQ
            </a>

          </nav>

          {/* ================= RIGHT SIDE ================= */}
          <div className="hidden lg:flex items-center gap-4">

            {isAuthenticated ? (
              <ProfileDropdown
                isOpen={profileDropdownOpen}
                onToggle={(e) => {
                  e.stopPropagation();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }}
                avatar={user.avatar}
                companyName={user?.businessName || user?.name || "Your workspace"}
                email={user?.email || ""}
                onLogout={handleLogout}
              />
            ) : (
              <>
                {/* Login */}
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
                >
                  Login
                </Link>

                {/* Sign Up */}
                <Link
                  to="/signup"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Get Started
                </Link>
              </>
            )}

          </div>

          {/* ================= MOBILE MENU BUTTON ================= */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

        </div>

        {/* ================= MOBILE MENU ================= */}
        {isMenuOpen && (
          <div className="lg:hidden pb-5">
            <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xl">

              <div className="flex flex-col gap-1">

                <a
                  href={sectionHref("features")}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
                >
                  Features
                </a>

                <Link
                  to="/how-it-works"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
                >
                  How It Works
                </Link>

                <a
                  href={sectionHref("testimonials")}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
                >
                  Testimonials
                </a>

                <a
                  href={sectionHref("faq")}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
                >
                  FAQ
                </a>

                <div className="h-px bg-gray-200 my-2" />

                {!isAuthenticated && (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-3 text-center rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
                    >
                      Login
                    </Link>

                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-3 text-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold shadow-lg"
                    >
                      Get Started
                    </Link>
                  </>
                )}

              </div>

            </div>
          </div>
        )}

      </div>
    </header>
  );
};

export default Header;

// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { FileText, Menu, X, Sparkles, ChevronDown } from "lucide-react";

// const Header = () => {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

//   const isAuthenticated = false;

//   const user = {
//     name: "chitransh",
//     email: "chitransh!12@gmail.com",
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setProfileDropdownOpen(false);
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };

//     window.addEventListener("scroll", handleScroll);

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   return (
//     <header
//       className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
//         isScrolled
//           ? "bg-white/80 backdrop-blur-xl border-b border-gray-200/70 shadow-sm"
//           : "bg-white/60 backdrop-blur-md border-b border-transparent"
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="h-20 flex items-center justify-between">

//           {/* Logo */}
//           <Link
//             to="/"
//             className="flex items-center gap-3 group"
//           >
//             <div className="relative">
//               <div className="absolute inset-0 bg-orange-400 blur-lg opacity-30 group-hover:opacity-60 transition-opacity" />

//               <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
//                 <FileText className="w-6 h-6 text-white" />
//               </div>
//             </div>

//             <div className="flex flex-col">
//               <span className="text-xl font-bold tracking-tight text-gray-900">
//                 Bill<span className="text-orange-500">Craft</span>
//               </span>

//               <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-400">
//                 AI Invoice Platform
//               </span>
//             </div>
//           </Link>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center gap-1">

//             <a
//               href="#features"
//               className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100/80 transition-all"
//             >
//               Features
//             </a>

//             <a
//               href="#how-it-works"
//               className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100/80 transition-all"
//             >
//               How It Works
//             </a>

//             <a
//               href="#testimonials"
//               className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100/80 transition-all"
//             >
//               Testimonials
//             </a>

//             <a
//               href="#faq"
//               className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100/80 transition-all"
//             >
//               FAQ
//             </a>
//           </nav>

//           {/* Desktop Right Side */}
//           <div className="hidden md:flex items-center gap-3">

//             {!isAuthenticated ? (
//               <>
//                 <Link
//                   to="/login"
//                   className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
//                 >
//                   Log in
//                 </Link>

//                 <Link
//                   to="/signup"
//                   className="group relative flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300"
//                 >
//                   <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />

//                   Get Started

//                   <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
//                 </Link>
//               </>
//             ) : (
//               <div className="relative">

//                 <button
//                   onClick={() =>
//                     setProfileDropdownOpen(!profileDropdownOpen)
//                   }
//                   className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition"
//                 >
//                   <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold shadow-md">
//                     {user.name.charAt(0)}
//                   </div>

//                   <span className="text-sm font-semibold text-gray-700">
//                     {user.name}
//                   </span>

//                   <ChevronDown
//                     className={`w-4 h-4 text-gray-400 transition-transform ${
//                       profileDropdownOpen ? "rotate-180" : ""
//                     }`}
//                   />
//                 </button>

//                 {profileDropdownOpen && (
//                   <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-xl shadow-gray-900/10">

//                     <div className="px-4 py-4 bg-gray-50 border-b">
//                       <p className="font-semibold text-gray-900">
//                         {user.name}
//                       </p>

//                       <p className="text-xs text-gray-500 mt-1">
//                         {user.email}
//                       </p>
//                     </div>

//                     <div className="p-2">
//                       <Link
//                         to="/profile"
//                         className="block px-3 py-2.5 text-sm text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition"
//                       >
//                         Profile
//                       </Link>

//                       <button
//                         onClick={logout}
//                         className="w-full text-left px-3 py-2.5 text-sm text-red-500 rounded-lg hover:bg-red-50 transition"
//                       >
//                         Logout
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
//           >
//             {isMenuOpen ? (
//               <X className="w-5 h-5" />
//             ) : (
//               <Menu className="w-5 h-5" />
//             )}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         <div
//           className={`md:hidden overflow-hidden transition-all duration-300 ${
//             isMenuOpen
//               ? "max-h-[500px] opacity-100 pb-5"
//               : "max-h-0 opacity-0"
//           }`}
//         >
//           <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-gray-200 shadow-xl">

//             <div className="flex flex-col gap-1">

//               <a
//                 href="#features"
//                 onClick={() => setIsMenuOpen(false)}
//                 className="px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition"
//               >
//                 Features
//               </a>

//               <a
//                 href="#how-it-works"
//                 onClick={() => setIsMenuOpen(false)}
//                 className="px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition"
//               >
//                 How It Works
//               </a>

//               <a
//                 href="#testimonials"
//                 onClick={() => setIsMenuOpen(false)}
//                 className="px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition"
//               >
//                 Testimonials
//               </a>

//               <a
//                 href="#faq"
//                 onClick={() => setIsMenuOpen(false)}
//                 className="px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition"
//               >
//                 FAQ
//               </a>

//               <div className="h-px bg-gray-200 my-2" />

//               {!isAuthenticated && (
//                 <>
//                   <Link
//                     to="/login"
//                     onClick={() => setIsMenuOpen(false)}
//                     className="px-4 py-3 text-center text-sm font-semibold text-gray-700 rounded-xl hover:bg-gray-100 transition"
//                   >
//                     Log in
//                   </Link>

//                   <Link
//                     to="/signup"
//                     onClick={() => setIsMenuOpen(false)}
//                     className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20"
//                   >
//                     <Sparkles className="w-4 h-4" />
//                     Get Started
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
