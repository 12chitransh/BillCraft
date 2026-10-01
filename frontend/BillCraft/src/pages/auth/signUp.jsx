import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth.js";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import AuthLayout from "./AuthLayout";

const SignUp = () => {
  const [form, setForm] = useState({ name: "", businessName: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const destination = location.state?.from?.pathname || "/dashboard";

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Your password needs at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Those passwords don't match yet.");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: form.name.trim(),
        businessName: form.businessName.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      await login(data.token, data.user);
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "We couldn't create your account. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="YOUR WORKSPACE STARTS HERE"
      title="Make room for the work."
      description="Create your account and put invoice admin on a shorter leash."
    >
      <form className="auth-form auth-form-signup" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label htmlFor="signup-name">Your name</label>
          <input className="auth-input" id="signup-name" name="name" autoComplete="name" placeholder="Alex Morgan" value={form.name} onChange={updateField} required />
        </div>

        <div className="auth-field">
          <label htmlFor="signup-business">Business name <span className="auth-optional">OPTIONAL</span></label>
          <input className="auth-input" id="signup-business" name="businessName" autoComplete="organization" placeholder="Studio or company" value={form.businessName} onChange={updateField} />
        </div>

        <div className="auth-field">
          <label htmlFor="signup-email">Work email</label>
          <input className="auth-input" id="signup-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" value={form.email} onChange={updateField} required />
        </div>

        <div className="auth-field">
          <label htmlFor="signup-password">Password</label>
          <div className="auth-input-wrap">
            <input className="auth-input" id="signup-password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="At least 6 characters" minLength={6} value={form.password} onChange={updateField} required />
            <button className="auth-password-toggle" type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)}>
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="signup-confirm-password">Confirm password</label>
          <div className="auth-input-wrap">
            <input className="auth-input" id="signup-confirm-password" name="confirmPassword" type={showConfirmation ? "text" : "password"} autoComplete="new-password" placeholder="Enter it once more" value={form.confirmPassword} onChange={updateField} required />
            <button className="auth-password-toggle" type="button" aria-label={showConfirmation ? "Hide confirmation" : "Show confirmation"} onClick={() => setShowConfirmation((visible) => !visible)}>
              {showConfirmation ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button className="auth-submit" type="submit" disabled={submitting}>
          {submitting ? <><LoaderCircle size={17} className="auth-spinner" /> Creating your workspace...</> : <>Create account <ArrowRight size={17} /></>}
        </button>
      </form>

      <p className="auth-switch">Already have a workspace? <Link className="auth-text-link" to="/login">Sign in</Link></p>
    </AuthLayout>
  );
};

export default SignUp;