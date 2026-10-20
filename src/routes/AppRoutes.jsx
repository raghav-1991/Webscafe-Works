import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import Projects from '@/pages/Projects';

// Our Works is the landing page and ships in the main bundle; About is code-split.
const About = lazy(() => import('@/pages/About'));

/** Home (/) shows Our Works; any other address (old project pages, typos) goes home. */
export default function AppRoutes() {
  const location = useLocation();
  return (
    <MainLayout>
      <Suspense fallback={null}>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/our-works" replace />} />
            <Route path="/our-works" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Navigate to="/our-works" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </MainLayout>
  );
}
