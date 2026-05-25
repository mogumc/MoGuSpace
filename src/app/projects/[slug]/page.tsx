import { notFound } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { marked } from 'marked';
import dynamicImport from 'next/dynamic';
import { getProjectBySlug, getAllProjects, extractHeadings } from '@/lib/projects';
import { siteConfig } from '@/lib/config.server';
import { highlightCodeBlocks } from '@/lib/highlight';

const ProjectToc = dynamicImport(() => import('@/components/ProjectToc'));
const TechStackBox = dynamicImport(() => import('@/components/TechStackBox'));
const BackToHome = dynamicImport(() => import('@/components/BackToHome'));
const ProjectInfo = dynamicImport(() => import('@/components/ProjectInfo'));
const ProjectCarousel = dynamicImport(() => import('@/components/ProjectCarousel'));
const Footer = dynamicImport(() => import('@/components/Footer'));

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: 'Not Found' };

  const pageUrl = siteConfig.siteUrl ? `${siteConfig.siteUrl}/projects/${slug}` : `/projects/${slug}`;
  const description = project.description;
  const imageUrl = project.imageUrl;
  const ogTitle = `${siteConfig.title} | ${project.title}`;

  return {
    title: `${siteConfig.title} | ${project.title}`,
    description: description,
    openGraph: {
      title: ogTitle,
      description: description,
      url: pageUrl,
      siteName: siteConfig.title || "MoGuSpace",
      ...(imageUrl && { images: [imageUrl] }),
      locale: siteConfig.siteLocale || "zh-CN",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const headings = extractHeadings(project.content);
  const allProjects = getAllProjects();
  const pageUrl = siteConfig.siteUrl ? `${siteConfig.siteUrl}/projects/${slug}` : `/projects/${slug}`;

  const preHighlighted = await highlightCodeBlocks(project.content);

  const renderer = new marked.Renderer();
  renderer.heading = function ({ text, depth }: { text: string; depth: number }) {
    const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '');
    return `<h${depth} id="${id}">${text}</h${depth}>`;
  };

  const htmlContent = marked.parse(preHighlighted, { renderer }) as string;
  const lazyHtmlContent = htmlContent.replace(/<img(?![^>]*?\s+loading\s*=)/gi, '<img loading="lazy"');

  return (
    <Box sx={{ minHeight: { xs: '100vh', md: '100dvh' }, bgcolor: 'background.default', pt: '80px', pb: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: '900px', mx: 'auto', mb: 3 }}>
        <BackToHome />
      </Box>

      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: 4,
        maxWidth: '1200px',
        mx: 'auto',
        position: 'relative',
      }}>
        <Box sx={{
          flex: 1,
          maxWidth: '900px',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          minWidth: 0,
          wordBreak: 'break-word',
        }}>
          {project.imageUrl && (
            <Box sx={{ position: 'relative', width: '100%', height: { xs: '180px', md: '280px' }, overflow: 'hidden' }}>
              <Box
                component="img"
                src={project.imageUrl}
                alt={project.title}
                fetchPriority="high"
                loading="eager"
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </Box>
          )}

          <Box sx={{ px: { xs: 3, md: 5 }, py: 4 }}>
            <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold', fontSize: { xs: '1.5rem', md: '2rem' } }}>
              {project.title}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {project.description}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 4, color: 'text.secondary', fontSize: '0.875rem' }}>
              <Typography variant="body2">{project.date}</Typography>
              <Typography variant="body2">·</Typography>
              <Typography variant="body2">{project.category}</Typography>
            </Box>

            {project.techStack.length > 0 && (
              <TechStackBox techStack={project.techStack} />
            )}

            <style>{`
              [data-mui-color-scheme="dark"] .shiki,
              [data-mui-color-scheme="dark"] .shiki span {
                color: var(--shiki-dark, inherit) !important;
                background-color: var(--shiki-dark-bg, inherit) !important;
                --shiki-dark-font-style: inherit;
              }
            `}</style>
            <Box
              sx={{
                lineHeight: 1.6,
                overflowX: 'auto',
                '& p': { mt: 0, mb: 1.5 },
                '& ul': { pl: 3, mb: 1.5 },
                '& li': { mb: 0.5 },
                '& h1': { mt: 3, mb: 1.5, fontSize: '1.75rem', fontWeight: 'bold', scrollMarginTop: '80px' },
                '& h2': { mt: 2.5, mb: 1, fontSize: '1.5rem', fontWeight: 'bold', borderBottom: '1px solid', borderColor: 'divider', pb: 0.5, scrollMarginTop: '80px' },
                '& h3': { mt: 2, mb: 0.5, fontSize: '1.25rem', fontWeight: 'bold', scrollMarginTop: '80px' },
                '& strong': { fontWeight: 'bold' },
                '& code': {
                  bgcolor: 'action.hover',
                  px: 0.5,
                  py: 0.25,
                  borderRadius: 1,
                  fontFamily: '"Cascadia Code", "Fira Code", "JetBrains Mono", Consolas, monospace',
                  fontSize: '0.875em',
                },
                '& .code-block-wrapper': {
                  position: 'relative',
                  my: 2,
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                },
                '& .code-lang': {
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  zIndex: 1,
                  px: 1.5,
                  py: 0.5,
                  fontSize: '0.7rem',
                  fontFamily: 'monospace',
                  color: '#888',
                  textTransform: 'lowercase',
                  bgcolor: 'rgba(0,0,0,0.15)',
                  borderBottomLeftRadius: 6,
                },
                '& .code-block-wrapper pre': {
                  m: 0,
                  p: '1.25rem 1.5rem',
                  overflowX: 'auto',
                  fontSize: '0.85rem',
                  lineHeight: 1.65,
                  fontFamily: '"Cascadia Code", "Fira Code", "JetBrains Mono", Consolas, monospace',
                },
                '& .code-block-wrapper code': {
                  bgcolor: 'transparent',
                  px: 0,
                  py: 0,
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                },
              }}
              dangerouslySetInnerHTML={{ __html: lazyHtmlContent }}
            />

            <ProjectInfo
              title={project.title}
              author={project.author || siteConfig.name}
              date={project.date}
              projectUrl={project.projectUrl}
              pageUrl={pageUrl}
            />
          </Box>
        </Box>

        <Box sx={{
          width: '200px',
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
        }}>
          <ProjectToc headings={headings} title={project.title} />
        </Box>
      </Box>

      <Box sx={{ mt: 6, px: { xs: 2, md: 4 } }}>
        <ProjectCarousel
          projects={allProjects.map(p => ({ slug: p.slug, title: p.title, description: p.description, imageUrl: p.imageUrl || siteConfig.siteImage, category: p.category, techStack: p.techStack }))}
          currentSlug={slug}
        />
      </Box>

      <Footer config={siteConfig} />
    </Box>
  );
}
