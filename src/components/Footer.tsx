'use client';
import { Box, Typography } from '@mui/material';
import SmartLink from '@/components/SmartLink';

interface Friend {
  label: string;
  url: string;
}

export default function Footer({ config }: { config: any }) {
  const friends: Friend[] = config.friends || [];
  return (
    <Box sx={{
      borderTop: '1px solid #e0e0e0',
      py: { xs: 4, md: 6 },
      px: { xs: 2, md: 8 },
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      justifyContent: { xs: 'center', md: 'space-between' },
      alignItems: 'center',
      gap: 2
    }}>
      <Box sx={{ textAlign: { xs: 'center', md: 'left' }, flexShrink: 0 }}>
        <Typography variant="body2" color="text.secondary">
          &copy; {new Date().getFullYear()} {config.name}. All rights reserved.
        </Typography>
      </Box>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: { xs: 'center', md: 'flex-end' },
        alignItems: 'center',
        gap: 1
      }}>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 1, whiteSpace: 'nowrap' }}>友情链接:</Typography>
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: { xs: 'center', md: 'flex-end' },
          gap: 1
        }}>
          {friends.map((link: Friend) => (
            <SmartLink key={link.label} href={link.url} color="inherit" underline="hover" fontSize="0.875rem" sx={{ whiteSpace: 'nowrap' }}>{link.label}</SmartLink>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
