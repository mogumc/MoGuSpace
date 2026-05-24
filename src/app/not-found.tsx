'use client';
import NextLink from 'next/link';
import { Box, Typography, Button, Link as MuiLink } from '@mui/material';
import { useLoadingTrigger } from '@/components/TopLoader';

export default function NotFound() {
  const triggerLoading = useLoadingTrigger();
  return (
    <Box sx={{ 
      minHeight: { xs: '100vh', md: '100dvh' }, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: 'background.default',
      color: 'text.primary',
    }}>
      <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', mb: 2 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mb: 4, color: 'text.secondary' }}>
        页面不存在
      </Typography>
      <MuiLink href="/" component={NextLink} underline="none">
        <Button onClick={triggerLoading} variant="outlined" size="large">
          返回首页
        </Button>
      </MuiLink>
    </Box>
  );
}
