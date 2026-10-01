import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/auth/protected";
import AuthProvider from "./context/AuthProvider.jsx";

// Landing Page
import LandingPage from "./pages/landingPage/landingPage";
import HowItWorks from "./pages/howItWorks/howItWorks";

// Authentication
import Login from "./pages/auth/login";
import SignUp from "./pages/auth/signUp";

// Dashboard
import Dashboard from "./pages/dashboard/dashboard";

// Invoices
import AllInvoices from "./pages/invoices/allInvoices";
import CreateInvoice from "./pages/invoices/createInvoice";
import InvoiceDetail from "./pages/invoices/invoiceDetail";

// Profile
import ProfilePage from "./pages/profile/profilePage";

const App = () => {
  return (
    <AuthProvider>
    <div>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/invoices" element={<AllInvoices />} />
            <Route path="/create-invoice" element={<CreateInvoice />} />
            <Route path="/invoice/:id" element={<InvoiceDetail />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Catch all routes */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </Router>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </div>
    </AuthProvider>
  );
};

export default App;