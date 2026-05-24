'use client';
import { Box, Typography, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useState, useEffect } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface ProjectTocProps {
  headings: Heading[];
  title?: string;
}

const NAVBAR_HEIGHT = 80;

export default function ProjectToc({ headings, title }: ProjectTocProps) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      for (let i = headings.length - 1; i >= 0; i--) {
        const el = document.getElementById(headings[i].id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= NAVBAR_HEIGHT + 20) {
          setActiveId(headings[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT - 10;
    window.scrollTo({ top: y, behavior: 'smooth' });
    // 同步更新 URL hash，方便分享
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <Box sx={{
      position: 'sticky',
      top: `${NAVBAR_HEIGHT + 20}px`,
    }}>
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: 'text.secondary' }}>
        目录
      </Typography>

      {title && (
        <Typography variant="body2" color="text.primary" sx={{ mb: 1, fontWeight: 'bold', fontSize: '0.875rem' }}>
          {title}
        </Typography>
      )}

      {headings.length > 0 && (
        <List dense disablePadding>
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            return (
              <ListItem key={heading.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => scrollToHeading(heading.id)}
                  sx={{
                    py: 0.5,
                    pl: (heading.level - 1) * 1 + 2,
                  }}
                >
                  <ListItemText
                    primary={heading.text}
                    primaryTypographyProps={{
                      fontSize: '0.8rem',
                      color: isActive ? 'text.primary' : 'text.secondary',
                      fontWeight: isActive ? 700 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
}
