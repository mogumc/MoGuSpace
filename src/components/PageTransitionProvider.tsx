'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { usePathname } from 'next/navigation';

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const { scrollY } = useScroll();

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      window.scrollTo(0, 0);
      scrollY.set(0);
      prevPathname.current = pathname;
    }
  }, [pathname, scrollY]);

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
