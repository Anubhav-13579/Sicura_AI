import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layout/AppLayout';

const HomePage = lazy(() => import('./pages/HomePage'));
const AnalyzerPage = lazy(() => import('./pages/AnalyzerPage'));
const BreachCheckerPage = lazy(() => import('./pages/BreachCheckerPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader-ring" />
    </div>
  );
}

function LazyPage({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<LazyPage><HomePage /></LazyPage>} />
          <Route path="email" element={<LazyPage><AnalyzerPage /></LazyPage>} />
          <Route path="url" element={<LazyPage><AnalyzerPage /></LazyPage>} />
          <Route path="job" element={<LazyPage><AnalyzerPage /></LazyPage>} />
          <Route path="message" element={<LazyPage><AnalyzerPage /></LazyPage>} />
          <Route path="document" element={<LazyPage><AnalyzerPage /></LazyPage>} />
          <Route path="breach" element={<LazyPage><BreachCheckerPage /></LazyPage>} />
          <Route path="history" element={<LazyPage><HistoryPage /></LazyPage>} />
          <Route path="settings" element={<LazyPage><SettingsPage /></LazyPage>} />
          <Route path="about" element={<LazyPage><AboutPage /></LazyPage>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
