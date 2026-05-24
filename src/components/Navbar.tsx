'use client';
import { useState, useRef } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Box, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Link as MuiLink, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useLoadingTrigger } from '@/components/TopLoader';
import { useColorMode } from '@/components/ThemeProvider';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';


function smoothScrollTo(target: number, duration: number = 500) {
  const start = window.scrollY;
  const change = target - start;
  const startTime = performance.now();

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    window.scrollTo(0, start + change * progress);
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}

function isExternal(url: string): boolean {
  return /^https?:\/\//.test(url);
}

export default function Navbar({ config }: { config: any }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const lastScrollY = useRef(0);
  const theme = useTheme();
  const navbarBg = alpha(theme.palette.background.paper, 0.7);
  const triggerLoading = useLoadingTrigger();
  const { toggleColorMode } = useColorMode();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > lastScrollY.current && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    lastScrollY.current = latest;
  });

  const navLinks = config.navbar || [];

  const handleTitleClick = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      smoothScrollTo(0, 600);
    } else {
      triggerLoading();
    }
  };

  return (
    <>
      <motion.div
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000
        }}
      >
        <Box sx={{
          height: '60px',
          px: { xs: 2, md: 4 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          bgcolor: navbarBg, backdropFilter: 'blur(10px)',
          borderBottom: '1px solid', borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MuiLink href="/" component={NextLink} color="inherit" underline="none" onClick={handleTitleClick} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {config.showNavbarLogo && (
                <Box component="img" src={config.favicon || "/assets/favicon.png"} alt="Logo" sx={{ height: 32, width: 32 }} />
              )}
              <Typography variant="h6" fontWeight="bold">{config.title}</Typography>
            </MuiLink>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
              {navLinks.map((link: { label: string; url: string }) => (
                isExternal(link.url) ? (
                  <MuiLink key={link.label} href={link.url} color="inherit" underline="hover" target="_blank" rel="noopener noreferrer">{link.label}</MuiLink>
                ) : (
                  <MuiLink key={link.label} href={link.url} component={NextLink} color="inherit" underline="hover" onClick={() => { if (link.url !== pathname) triggerLoading(); }}>{link.label}</MuiLink>
                )
              ))}
            </Box>
            <IconButton
              onClick={toggleColorMode}
              aria-label="toggle theme"
            >
              {theme.palette.mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
            <IconButton sx={{ display: { md: 'none' } }} onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
        </Box>
      </motion.div>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: { width: '100%', bgcolor: 'background.paper', display: 'flex', flexDirection: 'column' } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <MuiLink href="/" component={NextLink} color="inherit" underline="none" onClick={(e) => { handleTitleClick(e); setMobileOpen(false); }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {config.showNavbarLogo && (
              <Box component="img" src={config.favicon || "/assets/favicon.png"} alt="Logo" sx={{ height: 32, width: 32 }} />
            )}
            <Typography variant="h6" fontWeight="bold">{config.title}</Typography>
          </MuiLink>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={toggleColorMode} aria-label="toggle theme">
              {theme.palette.mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
            <IconButton onClick={() => setMobileOpen(false)}><CloseIcon /></IconButton>
          </Box>
        </Box>
        <List sx={{ mt: 2, flex: 1 }}>
          {navLinks.map((link: { label: string; url: string }) => (
            <ListItem key={link.label} disablePadding>
              {isExternal(link.url) ? (
                <ListItemButton component="a" href={link.url} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} sx={{ justifyContent: 'center' }}>
                  <ListItemText primary={link.label} sx={{ textAlign: 'center' }} />
                </ListItemButton>
              ) : (
                <ListItemButton component={NextLink} href={link.url} onClick={() => { if (link.url !== pathname) triggerLoading(); setMobileOpen(false); }} sx={{ justifyContent: 'center' }}>
                  <ListItemText primary={link.label} sx={{ textAlign: 'center' }} />
                </ListItemButton>
              )}
            </ListItem>
          ))}
        </List>
        {!isHome && (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <MuiLink href="/" component={NextLink} color="inherit" underline="none" onClick={() => { if (pathname !== '/') triggerLoading(); setMobileOpen(false); }}
              sx={{
                display: 'inline-flex', alignItems: 'center', gap: 0.5,
                color: 'text.secondary', textDecoration: 'none',
                '&:hover': { color: 'text.primary' }, transition: 'color 0.2s',
              }}
            >
              ← 返回首页
            </MuiLink>
          </Box>
        )}
      </Drawer>
    </>
  );
}
