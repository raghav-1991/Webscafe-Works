import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import Footer from './Footer';

/** Every route renders inside this: enter/exit page transition, scroll reset and the footer. */
export default function PageWrapper({ title, children }) {
  useDocumentTitle(title);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
      <Footer />
    </motion.div>
  );
}
