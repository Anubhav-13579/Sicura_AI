import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Mail, Link, Briefcase, MessageSquare, FileText,
  History, Settings, Info, Menu, Lock, Info as InfoSquare,
} from 'lucide-react';
import SicuraLogo from '../components/SicuraLogo';
import SiteFooter from '../components/SiteFooter';
import { NAV_ITEMS, SECONDARY_NAV, ROUTES } from '../config/navigation';

const ICON_MAP = {
  Home, Mail, Link, Briefcase, MessageSquare, FileText,
  History, Settings, Info, Shield: SicuraLogo,
};

function NavItem({ item, onNavigate }) {
  const Icon = ICON_MAP[item.icon] || Home;
  const isShield = item.icon === 'Shield';

  return (
    <NavLink
      to={item.path}
      end={item.path === ROUTES.home}
      className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      onClick={onNavigate}
    >
      {isShield ? <SicuraLogo size={30} /> : <Icon size={20} />}
      {item.simple ? (
        <span>{item.label}</span>
      ) : (
        <div className="nav-item-text">
          <span className="title">{item.label}</span>
          <span className="subtitle">{item.subtitle}</span>
        </div>
      )}
    </NavLink>
  );
}

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const mainContentRef = useRef(null);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 900) setIsSidebarOpen(false);
  };

  const scrollToSection = (id) => {
    if (location.pathname !== ROUTES.home) {
      navigate(id === 'home' ? ROUTES.home : `${ROUTES.home}?section=${id}`);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get('section');
    if (section && location.pathname === ROUTES.home) {
      setTimeout(() => {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [location]);

  return (
    <div className="app-container">
      <div className="background-effect" />

      {!isSidebarOpen && (
        <button
          className="floating-menu-btn"
          onClick={() => setIsSidebarOpen(true)}
          title="Open menu"
          type="button"
        >
          <Menu size={20} />
        </button>
      )}

      <aside ref={sidebarRef} className={`sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="sidebar-header">
          <div className="menu-btn" onClick={() => setIsSidebarOpen(false)}>
            <Menu size={20} />
          </div>
          <NavLink to={ROUTES.home} className="logo-container" onClick={closeSidebarOnMobile}>
            <SicuraLogo size={40} className="logo-icon" />
            <span className="logo-text">Sicura <span className="logo-ai">AI</span></span>
          </NavLink>
        </div>

        <nav className="nav-menu">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.path} item={item} onNavigate={closeSidebarOnMobile} />
          ))}

          <div className="nav-divider" />

          {SECONDARY_NAV.map((item) => (
            <NavItem key={item.path} item={item} onNavigate={closeSidebarOnMobile} />
          ))}
        </nav>
      </aside>

      <main className="main-content" ref={mainContentRef}>
        <header className={`top-header ${isSidebarOpen ? 'header-shifted' : ''}`}>
          <NavLink to={ROUTES.home} className="header-logo">
            <SicuraLogo size={38} className="logo-icon" />
            <span className="logo-text">Sicura <span className="logo-ai">AI</span></span>
          </NavLink>
          <div className="header-actions">
            <button className="action-btn" title="Encryption" type="button" onClick={() => scrollToSection('crypto')}>
              <Lock size={18} />
            </button>
            <button className="action-btn" title="Recents" type="button" onClick={() => navigate(ROUTES.history)}>
              <History size={18} />
            </button>
            <button className="action-btn" title="Threat Analysis" type="button" onClick={() => scrollToSection('threat')}>
              <InfoSquare size={18} />
            </button>
            <button
              className="action-btn armoriq-btn"
              title="ArmorIQ"
              type="button"
              onClick={() => window.open('https://docs.armoriq.ai/platform', '_blank')}
            >
              <Link size={18} />
            </button>
          </div>
        </header>

        <Outlet />

        <SiteFooter shifted={isSidebarOpen} />
      </main>
    </div>
  );
}
