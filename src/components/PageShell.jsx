import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageShell({ children, className = '' }) {
  const { pathname } = useLocation();

  useEffect(() => {
    document.querySelector('.main-content')?.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <div className={`page-shell ${className}`} key={pathname}>
      {children}
    </div>
  );
}
