'use client';
import { useState, useRef } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Box, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Link as MuiLink, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useLoadingTrigger } from './TopLoader';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';


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
    window.scrollTo(0, start + change * ease);
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
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
          px: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          bgcolor: navbarBg, backdropFilter: 'blur(10px)',
          borderBottom: '1px solid', borderColor: 'divider'
        }}>
          <MuiLink href="/" component={NextLink} color="inherit" underline="none" onClick={handleTitleClick} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {config.showNavbarLogo && (
              <Box component="img" src={config.favicon || "/logo.webp"} alt="Logo" sx={{ height: 32, width: 32 }} />
            )}
            <Typography variant="h6" fontWeight="bold">{config.name}</Typography>
          </MuiLink>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            {navLinks.map((link: { label: string; url: string }) => (
              <MuiLink key={link.label} href={link.url} component={NextLink} color="inherit" underline="hover" onClick={triggerLoading}>{link.label}</MuiLink>
            ))}
          </Box>

          <IconButton sx={{ display: { md: 'none' } }} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
      </motion.div>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: { width: '100%', bgcolor: 'background.paper' } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <MuiLink href="/" component={NextLink} color="inherit" underline="none" onClick={() => setMobileOpen(false)} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {config.showNavbarLogo && (
              <Box component="img" src={config.favicon || "/logo.png"} alt="Logo" sx={{ height: 32, width: 32 }} />
            )}
            <Typography variant="h6" fontWeight="bold">{config.name}</Typography>
          </MuiLink>
          <IconButton onClick={() => setMobileOpen(false)}><CloseIcon /></IconButton>
        </Box>
        <List sx={{ mt: 2 }}>
          {navLinks.map((link: { label: string; url: string }) => (
            <ListItem key={link.label} disablePadding>
              <ListItemButton component="a" href={link.url} onClick={() => { triggerLoading(); setMobileOpen(false); }} sx={{ justifyContent: 'center' }}>
                <ListItemText primary={link.label} sx={{ textAlign: 'center' }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
