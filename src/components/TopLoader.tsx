'use client';

import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material';

type LoadingContextType = {
  start: () => void;
  stop: () => void;
};
const LoadingContext = createContext<LoadingContextType>({
  start: () => {},
  stop: () => {},
});

export function useLoadingTrigger() {
  return useContext(LoadingContext).start;
}

export function useLoadingComplete() {
  return useContext(LoadingContext).stop;
}

const AUTO_STOP_MS = 5000;

export default function TopLoader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const theme = useTheme();

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startLoading = useCallback(() => {
    clearTimer();
    setVisible(true);
    timerRef.current = setTimeout(() => setVisible(false), AUTO_STOP_MS);
  }, [clearTimer]);

  const stopLoading = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => setVisible(false), 200);
  }, [clearTimer]);

  const prevPathname = useRef(pathname);
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      stopLoading();
    }
  }, [pathname, stopLoading]);

  const lastPathname = useRef(typeof window !== 'undefined' ? window.location.pathname : '');
  useEffect(() => {
    const handlePopState = () => {
      const cur = window.location.pathname;
      if (cur !== lastPathname.current) {
        lastPathname.current = cur;
        startLoading();
      }
    };
    const handlePageShow = () => stopLoading();
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [startLoading, stopLoading]);

  return (
    <LoadingContext.Provider value={{ start: startLoading, stop: stopLoading }}>
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 0.8, opacity: 1 }}
            exit={{ scaleX: 1, opacity: 0 }}
            transition={{
              scaleX: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.15 },
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
              backgroundSize: '200% 100%',
              transformOrigin: 'left',
              zIndex: 9999,
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
    </LoadingContext.Provider>
  );
}
