export const ROUTES = {
  home: '/',
  email: '/email',
  url: '/url',
  job: '/job',
  message: '/message',
  document: '/document',
  breach: '/breach',
  history: '/history',
  settings: '/settings',
  about: '/about',
};

export const NAV_ITEMS = [
  { path: ROUTES.home, label: 'Home', icon: 'Home', simple: true },
  {
    path: ROUTES.email,
    label: 'Email Analyzer',
    subtitle: 'Detect email scams',
    icon: 'Mail',
    module: 'email',
  },
  {
    path: ROUTES.url,
    label: 'URL Scanner',
    subtitle: 'Check website safety',
    icon: 'Link',
    module: 'url',
  },
  {
    path: ROUTES.job,
    label: 'Job Offer Analyzer',
    subtitle: 'Analyze job offers',
    icon: 'Briefcase',
    module: 'job',
  },
  {
    path: ROUTES.message,
    label: 'Message Analyzer',
    subtitle: 'Scan suspicious messages',
    icon: 'MessageSquare',
    module: 'message',
  },
  {
    path: ROUTES.document,
    label: 'Document Analyzer',
    subtitle: 'Analyze documents',
    icon: 'FileText',
    module: 'document',
  },
  {
    path: ROUTES.breach,
    label: 'Breach Checker',
    subtitle: 'Check data breaches',
    icon: 'Shield',
    module: 'breach',
  },
];

export const SECONDARY_NAV = [
  {
    path: ROUTES.history,
    label: 'History',
    subtitle: 'View past analyses',
    icon: 'History',
  },
  {
    path: ROUTES.settings,
    label: 'Settings',
    subtitle: 'Customize preferences',
    icon: 'Settings',
  },
  {
    path: ROUTES.about,
    label: 'About Sicura AI',
    subtitle: 'Learn more about us',
    icon: 'Info',
  },
];

export const ANALYZER_CONFIG = {
  email: {
    title: 'Email Analyzer',
    tagline: 'Detect phishing, spoofing, and deceptive links in emails.',
    placeholder: 'Paste the full email body or headers here…',
    hints: ['Sender domain mismatch', 'Urgency language', 'Hidden redirect links'],
    inputType: 'textarea',
  },
  url: {
    title: 'URL Scanner',
    tagline: 'Check domain reputation, redirects, and live threat intelligence.',
    placeholder: 'Paste a suspicious URL here…',
    hints: ['Look-alike domains', 'Redirect chains', 'Known phishing kits'],
    inputType: 'text',
  },
  job: {
    title: 'Job Offer Analyzer',
    tagline: 'Spot fake internships, upfront fees, and brand impersonation.',
    placeholder: 'Paste the job offer or internship letter here…',
    hints: ['Upfront fees', 'Free email providers', 'Too-good-to-be-true salary'],
    inputType: 'textarea',
  },
  message: {
    title: 'Message Analyzer',
    tagline: 'Scan SMS, chat, and social messages for social-engineering patterns.',
    placeholder: 'Paste the suspicious message here…',
    hints: ['Verification code requests', 'Vague urgency', 'Unknown senders'],
    inputType: 'textarea',
  },
  document: {
    title: 'Document Analyzer',
    tagline: 'Review contracts, PDFs, and attachments for scam indicators.',
    placeholder: 'Paste document text or describe the file…',
    hints: ['Payment demands', 'Fake letterheads', 'Macro-enabled attachments'],
    inputType: 'textarea',
  },
};
