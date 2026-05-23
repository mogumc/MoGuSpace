'use client';

import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material';

type LoadingTrigger = () => void;
const LoadingContext = createContext<LoadingTrigger>(() => {});

export function useLoadingTrigger() {
  return useContext(LoadingContext);
}

export default function TopLoader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const theme = useTheme();

  const startLoading = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(true);
  }, []);

  const stopLoading = useCallback(() => {
    timerRef.current = setTimeout(() => setVisible(false), 200);
  }, []);

  // pathname 变化时隐藏进度条
  const prevPathname = useRef(pathname);
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      stopLoading();
    }
  }, [pathname, stopLoading]);

  // 浏览器前进/后退时立即显示
  useEffect(() => {
    const handlePopState = () => startLoading();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [startLoading]);

  return (
    <LoadingContext.Provider value={startLoading}>
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
