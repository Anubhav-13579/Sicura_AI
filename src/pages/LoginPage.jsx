import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, ShieldAlert } from 'lucide-react';
import SicuraLogo from '../components/SicuraLogo';

export default function LoginPage({ onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const isPasswordInvalid = password.length > 0 && password.length < 4;
  const isSubmitDisabled =
    (mode === 'login' && (!email.trim() || !password.trim() || isPasswordInvalid)) ||
    (mode === 'signup' && (!name.trim() || !email.trim() || !password.trim() || isPasswordInvalid)) ||
    (mode === 'forgot' && !email.trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    if (mode === 'forgot') {
      setForgotSuccess(true);
    } else {
      localStorage.setItem('sicura_is_logged_in', 'true');
      localStorage.setItem('sicura_user_email', email);
      if (mode === 'signup') {
        localStorage.setItem('sicura_user_name', name);
      } else {
        const derivedName = email.split('@')[0]
          .split(/[\._-]/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        localStorage.setItem('sicura_user_name', derivedName || 'Anubhav Saxena');
      }
      onLoginSuccess();
    }
  };

  const handleGoogleLogin = () => {
    localStorage.setItem('sicura_is_logged_in', 'true');
    localStorage.setItem('sicura_user_name', 'Anubhav Saxena');
    localStorage.setItem('sicura_user_email', 'anubhavsaxena13579@gmail.com');
    onLoginSuccess();
  };

  return (
    <div className="login-page-overlay">
      <div className="login-card">
        <div className="login-logo-container">
          <div className="glowing-shield">
            <SicuraLogo size={90} />
          </div>
          <h1 className="main-title" style={{ fontSize: '2rem', marginBottom: 0 }}>
            Sicura <span className="logo-ai">AI</span>
          </h1>
        </div>

        {mode === 'login' && (
          <>
            <h2 className="login-card-title">Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-input-group">
                <label className="login-input-label">Email Address</label>
                <div className="login-input-wrapper">
                  <Mail className="login-input-icon" size={18} />
                  <input
                    type="email"
                    className="login-input"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="login-input-group">
                <label className="login-input-label">Password</label>
                <div className="login-input-wrapper">
                  <Lock className="login-input-icon" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="login-input password-field"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {isPasswordInvalid && (
                <div className="password-warning">
                  <ShieldAlert size={14} />
                  <span>Password must be at least 4 characters</span>
                </div>
              )}

              <div className="login-helpers-row">
                <a
                  href="#forgot"
                  className="forgot-password-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setForgotSuccess(false);
                    setMode('forgot');
                  }}
                >
                  Forgot Password?
                </a>
              </div>

              <button type="submit" className="login-submit-btn" disabled={isSubmitDisabled}>
                <span>Login</span>
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="login-divider-row">OR</div>

            <button type="button" className="google-btn" onClick={handleGoogleLogin}>
              <svg className="google-icon-svg" viewBox="0 0 24 24" width="18" height="18">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <p className="auth-toggle-text">
              New to Sicura AI?
              <a
                href="#signup"
                className="auth-toggle-link"
                onClick={(e) => {
                  e.preventDefault();
                  setMode('signup');
                }}
              >
                Sign Up
              </a>
            </p>
          </>
        )}

        {mode === 'signup' && (
          <>
            <h2 className="login-card-title">Sign Up</h2>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-input-group">
                <label className="login-input-label">Full Name</label>
                <div className="login-input-wrapper">
                  <User className="login-input-icon" size={18} />
                  <input
                    type="text"
                    className="login-input"
                    placeholder="Anubhav Saxena"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="login-input-group">
                <label className="login-input-label">Email Address</label>
                <div className="login-input-wrapper">
                  <Mail className="login-input-icon" size={18} />
                  <input
                    type="email"
                    className="login-input"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="login-input-group">
                <label className="login-input-label">Password</label>
                <div className="login-input-wrapper">
                  <Lock className="login-input-icon" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="login-input password-field"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {isPasswordInvalid && (
                <div className="password-warning">
                  <ShieldAlert size={14} />
                  <span>Password must be at least 4 characters</span>
                </div>
              )}

              <button type="submit" className="login-submit-btn" disabled={isSubmitDisabled}>
                <span>Create Account</span>
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="login-divider-row">OR</div>

            <button type="button" className="google-btn" onClick={handleGoogleLogin}>
              <svg className="google-icon-svg" viewBox="0 0 24 24" width="18" height="18">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <p className="auth-toggle-text">
              Already have an account?
              <a
                href="#login"
                className="auth-toggle-link"
                onClick={(e) => {
                  e.preventDefault();
                  setMode('login');
                }}
              >
                Login
              </a>
            </p>
          </>
        )}

        {mode === 'forgot' && (
          <>
            <h2 className="login-card-title">Reset Password</h2>
            {forgotSuccess ? (
              <div style={{ width: '100%' }}>
                <div className="reset-success-message">
                  We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
                </div>
                <button
                  type="button"
                  className="login-submit-btn"
                  onClick={() => {
                    setForgotSuccess(false);
                    setMode('login');
                  }}
                  style={{ marginTop: '16px' }}
                >
                  <span>Back to Login</span>
                </button>
              </div>
            ) : (
              <form className="login-form" onSubmit={handleSubmit}>
                <div className="login-input-group">
                  <label className="login-input-label">Email Address</label>
                  <div className="login-input-wrapper">
                    <Mail className="login-input-icon" size={18} />
                    <input
                      type="email"
                      className="login-input"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="login-submit-btn" disabled={isSubmitDisabled}>
                  <span>Send Reset Link</span>
                  <ArrowRight size={18} />
                </button>

                <p className="auth-toggle-text" style={{ marginTop: '16px' }}>
                  Remember your password?
                  <a
                    href="#login"
                    className="auth-toggle-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setMode('login');
                    }}
                  >
                    Login
                  </a>
                </p>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
