'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '@mui/material';

interface BackgroundProps {
  src?: string;
}

export default function Background({ src }: BackgroundProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const fallbackColor = isDark ? '#1a1a1a' : '#ffffff';

  if (!src) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100dvw',
          height: '100dvh',
          background: fallbackColor,
          pointerEvents: 'none',
          willChange: 'transform',
          transform: 'translateZ(0)',
          contain: 'paint layout style',
        }}
      />
    );
  }

  return <ImageBackground src={src} />;
}

function ImageBackground({ src }: { src: string }) {
  const { scrollYProgress } = useScroll();

  const mask = useTransform(scrollYProgress, [0, 1], [
    'linear-gradient(to bottom, black 100%, transparent 100%)',
    'linear-gradient(to bottom, black 0%, transparent 100%)',
  ]);

  const blur = useTransform(
    scrollYProgress,
    [0, 0.08, 0.09, 1],
    ['blur(0px)', 'blur(0px)', 'blur(5px)', 'blur(10px)'],
  );
  const bwFilter = useTransform(
    blur,
    (b) => `grayscale(100%) brightness(0.8) ${b}`,
  );

  return (
    <>
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100dvw',
          height: '100dvh',
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: bwFilter,
          pointerEvents: 'none',
          willChange: 'transform',
          transform: 'translateZ(0)',
          contain: 'paint layout style',
        }}
      />
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100dvw',
          height: '100dvh',
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          WebkitMaskImage: mask,
          maskImage: mask,
          filter: blur,
          pointerEvents: 'none',
          willChange: 'transform',
          transform: 'translateZ(0)',
          contain: 'paint layout style',
        }}
      />
    </>
  );
}
