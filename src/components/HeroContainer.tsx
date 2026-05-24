'use client';
import { Box } from '@mui/material';

interface HeroContainerProps {
  children: React.ReactNode;
}

export default function HeroContainer({ children }: HeroContainerProps) {
  return (
    <Box sx={{ position: 'relative', width: '100%', minHeight: { xs: '100vh', md: '100dvh' }, zIndex: 1 }}>
      {children}
    </Box>
  );
}
