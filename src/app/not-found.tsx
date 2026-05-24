'use client';
import { Box, Typography, Button } from '@mui/material';
import NextLink from 'next/link';

export default function NotFound() {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
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
        <Button variant="outlined" size="large">
          返回首页
        </Button>
      </MuiLink>
    </Box>
  );
}
