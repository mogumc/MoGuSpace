'use client';
import { Box, Typography, useTheme } from '@mui/material';
import SocialLinks from '@/components/SocialLinks';

interface IntroProps {
  name: string;
  hasBackground: boolean;
  config: any;
}

export default function Intro({ name, hasBackground, config }: IntroProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const textColor = isDark ? '#f5f0e8' : (hasBackground ? 'white' : 'black');

  return (
    <Box id="intro" sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      p: 8,
      color: textColor
    }}>
      <Typography variant="h1" sx={{
        fontSize: { xs: 'clamp(1.5rem, 8vw, 7rem)' },
        wordBreak: 'break-word',
        lineHeight: 1.2
      }}>HELLO, I AM {name}</Typography>
      <SocialLinks config={config} />
    </Box>
  );
}
