import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth.js";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import AuthLayout from "./AuthLayout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const destination = location.state?.from?.pathname || "/dashboard";

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const { data } = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email: email.trim(),
        password,
      });
      const user = data.user || {
        id: data._id,
        name: data.name,
        email: data.email,
        businessName: data.businessName,
        address: data.address,
        phone: data.phone,
      };
      await login(data.token, user);
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "We couldn't sign you in. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="WELCOME BACK"
      title="Pick up where you left off."
      description="Sign in to your workspace and keep good work moving."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label htmlFor="login-email">Email address</label>
          <input
            className="auth-input"
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="login-password">Password</label>
          <div className="auth-input-wrap">
            <input
              className="auth-input"
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              className="auth-password-toggle"
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button className="auth-submit" type="submit" disabled={submitting}>
          {submitting ? <><LoaderCircle size={17} className="auth-spinner" /> Signing in...</> : <>Sign in <ArrowRight size={17} /></>}
        </button>
      </form>

      <p className="auth-switch">New to BillCraft? <Link className="auth-text-link" to="/signup">Create your account</Link></p>
    </AuthLayout>
  );
};

export default Login;