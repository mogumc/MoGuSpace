'use client';
import { Box, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

interface ProjectInfoProps {
  title: string;
  author?: string;
  date: string;
  projectUrl?: string;
}

export default function ProjectInfo({ title, author, date, projectUrl }: ProjectInfoProps) {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const items = [
    { label: '项目名称', value: title },
    { label: '开发人员', value: author },
    { label: '创建时间', value: date },
    ...(projectUrl ? [{ label: '项目地址', value: projectUrl, href: projectUrl }] : []),
    ...(currentUrl ? [{ label: '链接', value: currentUrl, href: currentUrl }] : []),
  ];

  return (
    <Box sx={{
      my: 4,
      p: 3,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 1,
      fontSize: '0.875rem',
    }}>
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
        {items.map((item) => (
          <Box key={item.label} component="li" sx={{ py: 0.5, display: 'flex', gap: 1 }}>
            <Typography component="strong" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
              {item.label}:
            </Typography>
            {'href' in item && item.href ? (
              <Typography
                component="a"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: 'primary.main', 
                  textDecoration: 'underline', 
                  '&:hover': { opacity: 0.8 }, 
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'block',
                  maxWidth: '100%'
                }}
              >
                {item.value}
              </Typography>
            ) : (
              <Typography component="span">{item.value}</Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
