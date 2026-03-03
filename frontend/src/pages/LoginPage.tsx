// pages/LoginPage.tsx

import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to the page the user tried to visit, or dashboard
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ username: username.trim(), password });
      navigate(from, { replace: true });
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setError('Invalid username or password. Please try again.');
      } else if (err?.code === 'ECONNREFUSED' || err?.code === 'ERR_NETWORK') {
        setError('Cannot reach the server. Please check your connection.');
      } else {
        setError(
          err?.response?.data?.message || 'Login failed. Please try again.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandIcon}>⚡</div>
          <div>
            <div className={styles.brandName}>Iotrix</div>
            <div className={styles.brandSub}>IIoT Platform</div>
          </div>
        </div>

        <h1 className={styles.heading}>Sign in</h1>
        <p className={styles.subheading}>
          Enter your credentials to access the platform
        </p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Error alert */}
          {error && (
            <div className={styles.errorAlert} role="alert">
              <span className={styles.errorIcon}>⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Username */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="username">
              Username / Email
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>✉</span>
              <input
                id="username"
                type="email"
                className={`${styles.input} ${error ? styles.inputError : ''}`}
                placeholder="tenant@thingsboard.org"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>🔒</span>
              <input
                id="password"
                type="password"
                className={`${styles.input} ${error ? styles.inputError : ''}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className={styles.btn} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className={styles.spinner} />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div className={styles.footer}>
          Connected to ThingsBoard IoT Platform
        </div>
      </div>
    </div>
  );
}
