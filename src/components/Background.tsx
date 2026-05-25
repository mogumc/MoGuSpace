'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme, useMediaQuery } from '@mui/material';
import { useRef, useEffect, useState } from 'react';

interface BackgroundProps {
  src?: string;
}

export default function Background({ src }: BackgroundProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isTouch = useMediaQuery('(pointer: coarse) and (max-width: 768px)');
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
          transform: isTouch ? 'translateZ(0) scale(1.25)' : 'translateZ(0)',
          contain: 'paint layout style',
        }}
      />
    );
  }

  return <ImageBackground src={src} isDark={isDark} isTouch={isTouch} />;
}

function ImageBackground({ src, isDark, isTouch }: { src: string; isDark: boolean; isTouch: boolean }) {
  const { scrollYProgress } = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgHeight, setImgHeight] = useState('100dvh');

  useEffect(() => {
    if (!isTouch) return;
    const setHeight = () => {
      setImgHeight(`${window.innerHeight}px`);
    };
    setHeight();
    window.addEventListener('resize', setHeight);
    return () => window.removeEventListener('resize', setHeight);
  }, [isTouch]);

  const mask = useTransform(scrollYProgress, [0, 1], [
    'linear-gradient(to bottom, black 100%, transparent 100%)',
    'linear-gradient(to bottom, black 0%, transparent 100%)',
  ]);

  const blur = useTransform(
    scrollYProgress,
    [0, 0.08, 0.09, 1],
    ['blur(0px)', 'blur(0px)', 'blur(3px)', 'blur(6px)'],
  );
  const bwFilter = useTransform(
    blur,
    (b) => `grayscale(100%) brightness(0.8) ${b}`,
  );

  const scale = isTouch ? 'translateZ(0) scale(1.25)' : 'translateZ(0)';

  return (
    <>
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100dvw',
          height: imgHeight,
          pointerEvents: 'none',
          willChange: 'transform',
          transform: scale,
          contain: 'paint layout style',
          zIndex: 0,
        }}
      >
        <motion.img
          src={src}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            filter: bwFilter,
            willChange: 'filter',
          }}
        />
      </div>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100dvw',
          height: imgHeight,
          pointerEvents: 'none',
          willChange: 'transform',
          transform: scale,
          contain: 'paint layout style',
          zIndex: 1,
        }}
      >
        <motion.img
          src={src}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            WebkitMaskImage: mask,
            maskImage: mask,
            filter: blur,
            willChange: 'filter',
          }}
        />
      </div>
    </>
  );
}
