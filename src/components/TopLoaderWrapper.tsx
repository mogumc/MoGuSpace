'use client';
import NextTopLoader from 'nextjs-toploader';
import { useTheme } from '@mui/material';

export default function TopLoaderWrapper() {
  const theme = useTheme();
  return <NextTopLoader color={theme.palette.primary.main} showSpinner={false} height={3} />;
}
