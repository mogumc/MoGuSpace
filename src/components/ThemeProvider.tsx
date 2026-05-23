'use client';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useState, useEffect, createContext, useContext } from 'react';

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const useColorMode = () => useContext(ColorModeContext);

export default function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setMode(prefersDark ? 'dark' : 'light');

    const listener = (e: MediaQueryListEvent) => {
      setMode(e.matches ? 'dark' : 'light');
    };
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener);
    return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-mui-color-scheme', mode);
  }, [mode]);

  const theme = createTheme({
    palette: {
      mode,
      background: {
        default: mode === 'dark' ? '#1a1a1a' : '#ffffff',
        paper: mode === 'dark' ? '#2d2d2d' : '#ffffff',
      },
    },
  });

  return (
    <ColorModeContext.Provider value={{ toggleColorMode: () => setMode(m => m === 'light' ? 'dark' : 'light') }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
