'use client';
import NextLink from 'next/link';
import { Typography } from '@mui/material';
import { useLoadingTrigger } from './TopLoader';

export default function BackToHome() {
  const triggerLoading = useLoadingTrigger();
  return (
    <NextLink
      href="/"
      passHref
      legacyBehavior
    >
      <Typography
        variant="body2"
        component="a"
        onClick={triggerLoading}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          color: 'text.secondary',
          textDecoration: 'none',
          '&:hover': { color: 'text.primary' },
          transition: 'color 0.2s',
        }}
      >
        ← 返回首页
      </Typography>
    </NextLink>
  );
}
