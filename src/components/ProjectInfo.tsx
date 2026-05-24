'use client';
import { Box, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

interface ProjectInfoProps {
  title: string;
  author?: string;
  date: string;
  projectUrl?: string;
  pageUrl: string;
}

export default function ProjectInfo({ title, author, date, projectUrl, pageUrl }: ProjectInfoProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [shareUrl, setShareUrl] = useState(pageUrl);

  useEffect(() => {
    const realUrl = window.location.origin + window.location.pathname;
    if (realUrl !== pageUrl) {
      setShareUrl(realUrl);
    }
  }, [pageUrl]);

  const showStatus = (status: 'success' | 'error') => {
    setCopyStatus(status);
    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showStatus('success');
    } catch {
      showStatus('error');
    }
    document.body.removeChild(textarea);
  };

  const handleCopy = (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showStatus('success');
      }).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  };

  const linkSx = {
    color: 'primary.main',
    textDecoration: 'underline',
    '&:hover': { opacity: 0.8 },
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'block',
    maxWidth: '100%',
  };

  const items = [
    { label: '项目名称', value: title },
    { label: '开发人员', value: author },
    { label: '创建时间', value: date },
    ...(projectUrl ? [{ label: '项目地址', value: projectUrl, href: projectUrl, isLink: true }] : []),
    { label: '链接', value: shareUrl, isCopy: true },
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
            {'isLink' in item && item.isLink ? (
              <Typography
                component="a"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                sx={linkSx}
              >
                {item.value}
              </Typography>
            ) : 'isCopy' in item && item.isCopy ? (
              <Typography
                component="span"
                onClick={() => handleCopy(item.value)}
                sx={{ ...linkSx, cursor: 'pointer' }}
              >
                {copyStatus === 'success' ? '已复制！' : copyStatus === 'error' ? '复制失败' : item.value}
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
