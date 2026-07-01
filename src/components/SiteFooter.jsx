import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import SicuraLogo from './SicuraLogo';
import { ROUTES } from '../config/navigation';

export default function SiteFooter({ shifted = false }) {
  return (
    <footer className={`site-footer ${shifted ? 'footer-shifted' : ''}`}>
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">
            <SicuraLogo size={70} className="logo-icon" />
            <span className="logo-text">Sicura <span className="logo-ai">AI</span></span>
          </div>
          <p className="footer-tagline">TRUSTED. INTELLIGENT. AWARE.</p>
        </div>

        <div className="footer-columns">
          <div className="footer-col">
            <h4>Tools</h4>
            <ul>
              <li><Link to={ROUTES.email}>Email Analyzer</Link></li>
              <li><Link to={ROUTES.url}>URL Scanner</Link></li>
              <li><Link to={ROUTES.job}>Job Offer Analyzer</Link></li>
              <li><Link to={ROUTES.message}>Message Analyzer</Link></li>
              <li><Link to={ROUTES.document}>Document Analyzer</Link></li>
              <li><Link to={ROUTES.breach}>Breach Checker</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li><Link to={ROUTES.home}>Crypto Bound Encryption</Link></li>
              <li><Link to={ROUTES.home}>Recent Audit Logs</Link></li>
              <li><Link to={ROUTES.home}>Threat Analysis Verdict</Link></li>
              <li><Link to={ROUTES.history}>History</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li><a href="https://docs.armoriq.ai/platform" target="_blank" rel="noreferrer">ArmorIQ Docs</a></li>
              <li><Link to={ROUTES.about}>About Sicura AI</Link></li>
              <li><Link to={ROUTES.settings}>Settings</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link to={ROUTES.about}>About Sicura AI</Link></li>
              <li><Link to={ROUTES.settings}>Upgrade to Pro</Link></li>
              <li><Link to={ROUTES.about}>Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Sicura AI. All rights reserved.</span>
        <span className="footer-encrypted">
          <Lock size={12} /> Your data is encrypted • Private • Never stored
        </span>
      </div>
    </footer>
  );
}
