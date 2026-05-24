'use client';
import { Box } from '@mui/material';
import SmartLink from '@/components/SmartLink';

interface SocialLinksProps {
  config: any;
}

export default function SocialLinks({ config }: SocialLinksProps) {
  const links = config.social || [];
  return (
    <Box sx={{ mt: 4, display: 'flex', gap: 3 }}>
      {links.map((link: any) => (
        <SmartLink key={link.label} href={link.url} color="inherit" underline="hover">{link.label}</SmartLink>
      ))}
    </Box>
  );
}
