import {
  Shield, Zap, Eye, Users, Award, ExternalLink,
} from 'lucide-react';
import PageShell from '../components/PageShell';
import SicuraLogo from '../components/SicuraLogo';

const FEATURES = [
  {
    icon: Shield,
    title: 'ArmorIQ Security Gate',
    desc: 'Every request passes policy verification and threat intel before AI analysis.',
  },
  {
    icon: Zap,
    title: 'Sub-Second Verdicts',
    desc: 'Risk score, plain-language explanation, and next steps in under one second.',
  },
  {
    icon: Eye,
    title: '5 Detection Modules',
    desc: 'Email, URL, job scams, messages, documents — plus QR and breach checking.',
  },
];

const STATS = [
  { value: '0–100', label: 'Risk Score' },
  { value: '<1s', label: 'Response Time' },
  { value: '100%', label: 'ArmorIQ Gated' },
];

const TEAM = [
  { name: 'Mavrix', role: 'NeuroX Hackathon — ArmorIQ Track 2' },
];

export default function AboutPage() {
  return (
    <PageShell className="page-shell-tool">
      <div className="about-page">
        <div className="about-hero page-animate-in">
          <div className="about-hero-glow" />
          <div className="about-logo-wrap">
            <SicuraLogo size={100} />
          </div>
          <h1>Sicura <span className="logo-ai">AI</span></h1>
          <p className="about-tagline">Paste anything. Get a verdict.</p>
          <p className="about-mission">
            Sicura AI is an intelligent scam detection platform that protects everyday users
            from phishing emails, fake job offers, malicious URLs, and social-engineering attacks —
            all in one place, with plain-language explanations so you learn, not just react.
          </p>
        </div>

        <div className="about-stats">
          {STATS.map((stat, i) => (
            <div
              className="about-stat-card page-animate-in"
              key={stat.label}
              style={{ animationDelay: `${0.08 + i * 0.06}s` }}
            >
              <span className="about-stat-value">{stat.value}</span>
              <span className="about-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        <section className="about-section page-animate-in" style={{ animationDelay: '0.15s' }}>
          <h2>Why Sicura AI?</h2>
          <p className="about-section-desc">
            Existing tools are too technical, too fragmented, and only alert — they never explain why.
            Sicura AI solves all three in a single dark, modern interface built for real users.
          </p>
          <div className="about-features">
            {FEATURES.map((f, i) => (
              <div
                className="about-feature-card page-animate-in"
                key={f.title}
                style={{ animationDelay: `${0.2 + i * 0.07}s` }}
              >
                <div className="about-feature-icon">
                  <f.icon size={22} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section page-animate-in" style={{ animationDelay: '0.25s' }}>
          <h2><Users size={22} /> Team</h2>
          <div className="about-team-grid">
            {TEAM.map((member) => (
              <div className="about-team-card page-animate-in" key={member.name}>
                <div className="about-team-avatar">{member.name[0]}</div>
                <div>
                  <strong>{member.name}</strong>
                  <span>{member.role}</span>
                </div>
                <Award size={18} className="about-team-badge" />
              </div>
            ))}
          </div>
        </section>

        <section className="about-cta page-animate-in" style={{ animationDelay: '0.3s' }}>
          <h3>Built on ArmorIQ</h3>
          <p>Policy-gated tool execution, full audit logging, and threat intelligence cross-checks.</p>
          <a
            href="https://docs.armoriq.ai/platform"
            target="_blank"
            rel="noreferrer"
            className="about-cta-btn"
          >
            View ArmorIQ Docs <ExternalLink size={16} />
          </a>
        </section>
      </div>
    </PageShell>
  );
}
