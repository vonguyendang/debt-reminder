import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Clock, Mail, Search, Bell, Sun, Moon } from 'lucide-react';
import { ApiClient } from '../api/client';
import { useToast } from './Toast';
import { useThemeLang } from '../contexts/ThemeLangContext';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { theme, toggleTheme, lang, setLang, t } = useThemeLang();

  const handleLogout = () => {
    ApiClient.clearToken();
    navigate('/login');
  };

  // Helper to get title for header
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return t('Dashboard');
      case '/customers': return t('Customers');
      case '/receivables': return t('Receivables');
      case '/rules': return t('Rules');
      case '/templates': return t('Templates');
      default: return t('Overview');
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <Clock size={28} />
          </div>
          <span>DEBT<span style={{color: 'var(--text-muted)'}}>REMIND</span></span>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
            <LayoutDashboard size={20} /> {t('Dashboard')}
          </NavLink>
          <NavLink to="/customers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users size={20} /> {t('Customers')}
          </NavLink>
          <NavLink to="/receivables" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FileText size={20} /> {t('Receivables')}
          </NavLink>
          <NavLink to="/rules" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Settings size={20} /> {t('Rules')}
          </NavLink>
          <NavLink to="/templates" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Mail size={20} /> {t('Templates')}
          </NavLink>
        </nav>

        <button onClick={handleLogout} className="nav-item" style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', fontFamily: 'inherit', fontSize: '0.95rem' }}>
          <LogOut size={20} /> {t('Logout')}
        </button>
      </aside>

      <div className="main-wrapper">
        <header className="top-header">
          <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{getPageTitle()}</div>
          
          <div className="header-actions">
            <button className="icon-btn" onClick={() => setLang(lang === 'en' ? 'vi' : 'en')} style={{ fontWeight: 600, fontSize: '0.9rem' }}>
              {lang.toUpperCase()}
            </button>
            <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="icon-btn" onClick={() => showToast(t('Search coming soon!'), 'info')}><Search size={20} /></button>
            <button className="icon-btn" onClick={() => showToast(t('No new notifications'), 'info')}><Bell size={20} /></button>
            
            <div className="user-profile" onClick={() => showToast(t('Profile settings coming soon!'), 'info')}>
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=00E5FF&color=000" alt="Avatar" className="avatar" />
              <div className="user-info">
                <span className="user-name">Admin User</span>
                <span className="user-role">Manager</span>
              </div>
            </div>
          </div>
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
