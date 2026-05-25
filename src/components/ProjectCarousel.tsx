'use client';
import { Box, Typography, IconButton, useTheme } from '@mui/material';
import Link from 'next/link';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useState, useRef, useEffect } from 'react';

interface Project {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  techStack?: { name: string }[];
}

interface ProjectCarouselProps {
  projects: Project[];
  currentSlug: string;
}

function tokenize(text: string): Set<string> {
  const tokens = new Set<string>();
  const chinese = text.match(/[\u4e00-\u9fa5]+/g) || [];
  chinese.forEach(w => {
    for (let i = 0; i < w.length; i++) {
      for (let j = i + 1; j <= Math.min(i + 4, w.length); j++) {
        tokens.add(w.slice(i, j));
      }
    }
  });
  const english = text.toLowerCase().match(/[a-z]+/g) || [];
  english.forEach(w => tokens.add(w));
  return tokens;
}

function similarity(a: Set<string>, b: Set<string>): number {
  const intersection = new Set([...a].filter(x => b.has(x)));
  const union = new Set([...a, ...b]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

function findSimilar(projects: Project[], current: Project, limit: number): Project[] {
  const currentTokens = tokenize(`${current.title} ${current.description} ${current.category} ${(current.techStack || []).map(t => t.name).join(' ')}`);
  return projects
    .filter(p => p.slug !== current.slug)
    .map(p => {
      const tokens = tokenize(`${p.title} ${p.description} ${p.category} ${(p.techStack || []).map(t => t.name).join(' ')}`);
      const categoryBonus = p.category === current.category ? 0.3 : 0;
      return { project: p, score: similarity(currentTokens, tokens) + categoryBonus };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.project);
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

export default function ProjectCarousel({ projects, currentSlug }: ProjectCarouselProps) {
  const currentProject = projects.find(p => p.slug === currentSlug);
  if (!currentProject) return null;

  const similarProjects = findSimilar(projects, currentProject, 3);
  if (similarProjects.length === 0) return null;

  const count = similarProjects.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const getItemOffset = (itemIdx: number): number => {
    const raw = itemIdx - activeIndex;
    if (raw > count / 2) return raw - count;
    if (raw < -count / 2) return raw + count;
    return raw;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimating) return;
      if (e.deltaY > 0 || e.deltaX > 0) handleNext();
      else handlePrev();
    };

    container.addEventListener('wheel', wheelHandler, { passive: false });
    return () => container.removeEventListener('wheel', wheelHandler);
  }, [activeIndex, isAnimating]);

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(prev => mod(prev - 1, count));
    setTimeout(() => setIsAnimating(false), 400);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(prev => mod(prev + 1, count));
    setTimeout(() => setIsAnimating(false), 400);
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    dragStartX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const endX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = dragStartX.current - endX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 8, borderTop: '1px solid', borderColor: 'divider', pt: 4, pb: 8 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        相关项目
      </Typography>
      
      <Box sx={{ position: 'relative', px: { xs: 6, sm: 8 } }}>
        <IconButton onClick={handlePrev} sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
          <ChevronLeftIcon />
        </IconButton>

        <Box 
          ref={containerRef}
          sx={{ 
            position: 'relative',
            height: { xs: '280px', sm: '350px' },
            overflow: 'hidden',
            cursor: 'grab',
            userSelect: 'none',
            '&:active': { cursor: 'grabbing' },
          }}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onMouseLeave={() => { isDragging.current = false; }}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
        >
          {/* 渲染所有项目，通过 transform 控制位置 */}
          {similarProjects.map((project, idx) => {
            const offset = getItemOffset(idx);
            const absOffset = Math.abs(offset);
            const isVisible = absOffset <= 1;

            return (
              <Link key={project.slug} href={`/projects/${project.slug}/`} passHref>
                <Box
                  component="a"
                  onClick={(e) => {
                    if (isDragging.current || Math.abs(dragStartX.current - (e as any).clientX) > 10) {
                      e.preventDefault();
                    }
                  }}
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    top: 0,
                    width: { xs: '75%', sm: '50%' },
                    height: '100%',
                    borderRadius: 2,
                    overflow: 'hidden',
                    textDecoration: 'none',
                    color: 'inherit',
                    bgcolor: 'background.paper',
                    zIndex: 10 - absOffset,
                    opacity: isVisible ? 1 - absOffset * 0.3 : 0,
                    transform: `translateX(calc(-50% + ${offset * 40}%)) scale(${isVisible ? 0.85 - absOffset * 0.15 : 0.65})`,
                    transition: 'all 0.4s ease',
                    boxShadow: absOffset === 0 ? 4 : 0,
                    pointerEvents: absOffset === 0 ? 'auto' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      position: 'relative',
                    }}
                  >
                    <Box
                      component="img"
                      src={project.imageUrl}
                      alt={project.title}
                      loading="lazy"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', inset: 0 }}
                    />
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0, left: 0, right: 0,
                      height: '50%',
                      background: isDark
                        ? 'linear-gradient(to top, rgba(18,18,18,0.95) 0%, rgba(18,18,18,0.7) 40%, transparent 100%)'
                        : 'linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 40%, transparent 100%)',
                    }} />

                    <Box sx={{
                      position: 'absolute',
                      bottom: 0, left: 0, right: 0,
                      p: 3, zIndex: 1,
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                        {project.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        {project.category}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Link>
            );
          })}
        </Box>

        <IconButton onClick={handleNext} sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
        {similarProjects.map((_, idx) => (
          <Box
            key={idx}
            onClick={() => {
              if (idx !== activeIndex) {
                setIsAnimating(true);
                setActiveIndex(idx);
                setTimeout(() => setIsAnimating(false), 400);
              }
            }}
            sx={{
              width: activeIndex === idx ? 24 : 8,
              height: 8,
              borderRadius: 4,
              bgcolor: activeIndex === idx ? 'text.primary' : 'action.hover',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
