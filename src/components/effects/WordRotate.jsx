import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/utils/cn';

/** Cycles through words with a blur/slide swap — adapted from Magic UI "Word Rotate" (21st.dev). */
export default function WordRotate({ words, interval = 2200, className }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  return (
    <span className={cn('word-rotate', className)} aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[index]}
          className="word-rotate__word"
          initial={{ opacity: 0, y: '60%', filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: '0%', filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: '-60%', filter: 'blur(8px)' }}
          transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
