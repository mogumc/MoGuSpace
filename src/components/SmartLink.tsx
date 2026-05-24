'use client';
import { Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useLoadingTrigger } from '@/components/TopLoader';

function isExternal(url: string): boolean {
  return /^https?:\/\//.test(url);
}

interface SmartLinkProps {
  href: string;
  children: React.ReactNode;
  [key: string]: any;
}

export default function SmartLink({ href, children, ...props }: SmartLinkProps) {
  const pathname = usePathname();
  const triggerLoading = useLoadingTrigger();

  if (isExternal(href)) {
    return (
      <MuiLink href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </MuiLink>
    );
  }

  return (
    <MuiLink
      href={href}
      component={NextLink}
      onClick={() => { if (href !== pathname) triggerLoading(); }}
      {...props}
    >
      {children}
    </MuiLink>
  );
}
