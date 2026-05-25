'use client';
import { Box, Typography, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import SmartLink from '@/components/SmartLink';

export default function Sidebar({ config, categories }: { config: any, categories: string[] }) {
  const [activeId, setActiveId] = useState(categories[0]);
  const lastScrollY = useRef(0);
  const activeIdRef = useRef(activeId);
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    let rafId: number;
    let pending = false;

    const handleScroll = () => {
      if (pending) return;
      pending = true;
      rafId = requestAnimationFrame(() => {
        pending = false;
        const scrollY = window.scrollY;
        const direction = scrollY > lastScrollY.current ? 'down' : 'up';
        lastScrollY.current = scrollY;

        const triggerLine = window.innerHeight * 0.3;
        const current = activeIdRef.current;
        let nextId = current;

        if (direction === 'down') {
          for (let i = categories.length - 1; i >= 0; i--) {
            const el = document.getElementById(categories[i]);
            if (!el) continue;
            if (el.getBoundingClientRect().top <= triggerLine) {
              nextId = categories[i];
              break;
            }
          }
        } else {
          for (let i = 0; i < categories.length; i++) {
            const el = document.getElementById(categories[i]);
            if (!el) continue;
            if (el.getBoundingClientRect().bottom >= triggerLine) {
              nextId = categories[i];
              break;
            }
          }
        }

        if (nextId !== current) {
          setActiveId(nextId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [categories]);

  return (
    <Box sx={{
      display: { xs: 'none', md: 'flex' },
      flexDirection: 'column',
      position: 'sticky',
      top: '100px',
      width: '200px',
      height: 'fit-content',
      p: 2,
      zIndex: 10,
      bgcolor: 'transparent',
    }}>
      <Typography variant="h6" sx={{ mb: 2 }}>{config.name}</Typography>
      <List>
        {categories.map((category) => (
          <ListItem key={category} disablePadding>
            <ListItemButton component="a" href={`#${category}`} sx={{ 
              borderLeft: activeId === category ? '2px solid #000' : 'none',
              pl: activeId === category ? 1 : 2,
              transition: 'all 0.2s'
            }}>
              <ListItemText primary={category.toUpperCase()} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: activeId === category ? 700 : 400 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {(config.social || []).map((link: any) => (
            <SmartLink key={link.label} href={link.url} color="inherit" underline="hover" fontSize="0.8rem">{link.label}</SmartLink>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
