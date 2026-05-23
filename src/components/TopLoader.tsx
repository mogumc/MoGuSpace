'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material';

export default function TopLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const theme = useTheme();

  useEffect(() => {
    // 清除上一次的定时器
    if (timerRef.current) clearTimeout(timerRef.current);

    setVisible(true);
    timerRef.current = setTimeout(() => setVisible(false), 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            scaleX: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
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
  );
}
