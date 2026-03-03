// pages/DashboardPage.tsx

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './DashboardPage.module.css';

const STATS = [
  { icon: '📡', label: 'Devices', value: '—', color: 'blue' },
  { icon: '🏗️', label: 'Assets', value: '—', color: 'green' },
  { icon: '⚠️', label: 'Active Alarms', value: '—', color: 'amber' },
  { icon: '📶', label: 'Online', value: '—', color: 'red' },
] as const;

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const displayName =
    user?.firstName
      ? `${user.firstName} ${user.lastName}`.trim()
      : user?.email ?? 'User';

  return (
    <div className={styles.page}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navBrand}>
          <span className={styles.navBrandIcon}>⚡</span>
          Iotrix Platform
        </div>
        <div className={styles.navRight}>
          <span className={styles.userBadge}>
            Signed in as{' '}
            <span className={styles.userEmail}>{user?.email}</span>
          </span>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className={styles.content}>
        <h1 className={styles.greeting}>Welcome back, {displayName} 👋</h1>
        <p className={styles.greetingSub}>
          Here's your IIoT platform overview
        </p>

        <div className={styles.statsGrid}>
          {STATS.map(({ icon, label, value, color }) => (
            <div key={label} className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles[color]}`}>
                {icon}
              </div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{value}</div>
                <div className={styles.statLabel}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.comingSoon}>
          📊 &nbsp; Telemetry charts, asset maps, and alarm tables coming soon
        </div>
      </main>
    </div>
  );
}
