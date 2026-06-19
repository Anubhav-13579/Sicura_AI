import { Mail, Link, Briefcase, MessageSquare, FileText } from 'lucide-react';
import { useLocation, Navigate } from 'react-router-dom';
import AnalyzerTool from '../components/AnalyzerTool';
import PageShell from '../components/PageShell';
import { ANALYZER_CONFIG } from '../config/navigation';

const ICONS = { Mail, Link, Briefcase, MessageSquare, FileText };

export default function AnalyzerPage() {
  const { pathname } = useLocation();
  const type = pathname.replace(/^\//, '');
  const config = ANALYZER_CONFIG[type];

  if (!config) {
    return <Navigate to="/" replace />;
  }

  const iconName = {
    email: 'Mail',
    url: 'Link',
    job: 'Briefcase',
    message: 'MessageSquare',
    document: 'FileText',
  }[type];

  const Icon = ICONS[iconName];

  return (
    <PageShell className="page-shell-tool">
      <AnalyzerTool
        module={type}
        icon={Icon}
        {...config}
      />
    </PageShell>
  );
}
