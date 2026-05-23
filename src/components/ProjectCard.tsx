'use client';
import { Box, Typography, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useRef } from 'react';
import { useLoadingTrigger } from './TopLoader';

interface ProjectCardProps {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
}

export default function ProjectCard({ slug, title, description, imageUrl }: ProjectCardProps) {
  const router = useRouter();
  const prefetched = useRef(false);
  const triggerLoading = useLoadingTrigger();

  const handleMouseEnter = useCallback(() => {
    if (prefetched.current) return;
    prefetched.current = true;
    router.prefetch(`/projects/${slug}/`);
  }, [router, slug]);

  return (
    <Card
      onMouseEnter={handleMouseEnter}
      sx={{
        width: '100%',
        height: 450,
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #e0e0e0',
        borderRadius: 0,
        boxShadow: 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: '#000',
          boxShadow: 2,
          transform: 'translateY(-4px)',
        }
      }}
    >
      <Link href={`/projects/${slug}/`} passHref legacyBehavior>
        <CardActionArea onClick={triggerLoading} sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
          <CardMedia
            component="img"
            height="200"
            image={imageUrl}
            alt={title}
            loading="lazy"
            sx={{ borderBottom: '1px solid #e0e0e0' }}
          />
          <CardContent sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            <Box sx={{
              height: '7.5em',
              overflow: 'hidden',
              position: 'relative',
              maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
            }}>
              <Typography variant="body1" color="text.secondary">
                {description}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}
