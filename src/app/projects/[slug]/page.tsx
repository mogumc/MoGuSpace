import { notFound } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { marked } from 'marked';
import { getProjectBySlug, getAllProjects, extractHeadings } from '@/lib/projects';
import { siteConfig } from '@/lib/config.server';
import { highlightCodeBlocks } from '@/lib/highlight';
import ProjectToc from '@/components/ProjectToc';
import TechStackBox from '@/components/TechStackBox';
import BackToHome from '@/components/BackToHome';
import ProjectInfo from '@/components/ProjectInfo';
import ProjectCarousel from '@/components/ProjectCarousel';
import Footer from '@/components/Footer';

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
  
  // 使用配置的 siteUrl 作为基础，如果没有配置则使用相对路径
  const pageUrl = siteConfig.siteUrl ? `${siteConfig.siteUrl}/projects/${slug}` : `/projects/${slug}`;
  
  // 使用文章内的 description 和 imageUrl
  const description = project.description;
  const imageUrl = project.imageUrl; // 只有有图片时才添加到 OpenGraph
  
  // og:title 使用 title | project.title 格式
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

  // 预处理：用 Shiki 高亮所有代码块，替换为带语法高亮的 HTML
  const preHighlighted = await highlightCodeBlocks(project.content);

  const renderer = new marked.Renderer();
  renderer.heading = function ({ text, depth }: { text: string; depth: number }) {
    const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '');
    return `<h${depth} id="${id}">${text}</h${depth}>`;
  };

  const htmlContent = marked.parse(preHighlighted, { renderer }) as string;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: '80px', pb: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
      {/* 返回首页 */}
      <Box sx={{ maxWidth: '900px', mx: 'auto', mb: 3 }}>
        <BackToHome />
      </Box>

      {/* 内容容器：左侧文章框 + 右侧 TOC */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        gap: 4,
        maxWidth: '1200px',
        mx: 'auto',
        position: 'relative',
      }}>
        {/* 文章外框 */}
        <Box sx={{ 
          flex: 1,
          maxWidth: '900px',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          minWidth: 0,
        }}>
          {/* 顶部项目图片 */}
          {project.imageUrl && (
            <Box sx={{ position: 'relative', width: '100%', height: { xs: '180px', md: '280px' }, overflow: 'hidden' }}>
              <Box
                component="img"
                src={project.imageUrl}
                alt={project.title}
                fetchPriority="high"
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </Box>
          )}

          {/* 内容区域 */}
          <Box sx={{ px: { xs: 3, md: 5 }, py: 4 }}>
            {/* 标题 */}
            <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold', fontSize: { xs: '1.5rem', md: '2rem' } }}>
              {project.title}
            </Typography>
            
            {/* 描述 */}
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {project.description}
            </Typography>

            {/* 日期和分类 */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, color: 'text.secondary', fontSize: '0.875rem' }}>
              <Typography variant="body2">{project.date}</Typography>
              <Typography variant="body2">·</Typography>
              <Typography variant="body2">{project.category}</Typography>
            </Box>

            {/* 技术栈 */}
            {project.techStack.length > 0 && (
              <TechStackBox techStack={project.techStack} />
            )}

            {/* 文章内容 */}
            {/* Shiki 双主题切换：在 MUI 暗色模式下使用 VSCode Dark+ 配色 */}
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
                '& p': { mt: 0, mb: 1.5 },
                '& ul': { pl: 3, mb: 1.5 },
                '& li': { mb: 0.5 },
                '& h1': { mt: 3, mb: 1.5, fontSize: '1.75rem', fontWeight: 'bold' },
                '& h2': { mt: 2.5, mb: 1, fontSize: '1.5rem', fontWeight: 'bold', borderBottom: '1px solid', borderColor: 'divider', pb: 0.5 },
                '& h3': { mt: 2, mb: 0.5, fontSize: '1.25rem', fontWeight: 'bold' },
                '& strong': { fontWeight: 'bold' },
                '& code': {
                  bgcolor: 'action.hover',
                  px: 0.5,
                  py: 0.25,
                  borderRadius: 1,
                  fontFamily: '"Cascadia Code", "Fira Code", "JetBrains Mono", Consolas, monospace',
                  fontSize: '0.875em',
                },
                // 代码块容器
                '& .code-block-wrapper': {
                  position: 'relative',
                  my: 2,
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                },
                // 语言标签
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
                // Shiki 生成的 pre
                '& .code-block-wrapper pre': {
                  m: 0,
                  p: '1.25rem 1.5rem',
                  overflowX: 'auto',
                  fontSize: '0.85rem',
                  lineHeight: 1.65,
                  fontFamily: '"Cascadia Code", "Fira Code", "JetBrains Mono", Consolas, monospace',
                },
                // 行内 code 在 pre 内部不加背景
                '& .code-block-wrapper code': {
                  bgcolor: 'transparent',
                  px: 0,
                  py: 0,
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                },
              }}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* 项目信息 */}
            <ProjectInfo
              title={project.title}
              author={siteConfig.name}
              date={project.date}
              projectUrl={project.projectUrl}
            />
          </Box>
        </Box>

        {/* 右侧 TOC */}
        <Box sx={{
          width: '200px',
          flexShrink: 0,
          display: { xs: 'none', lg: 'block' },
        }}>
          <ProjectToc headings={headings} title={project.title} />
        </Box>
      </Box>

      {/* 项目轮播 */}
      <Box sx={{ mt: 6, px: { xs: 2, md: 4 } }}>
        <ProjectCarousel 
          projects={allProjects.map(p => ({ slug: p.slug, title: p.title, description: p.description, imageUrl: p.imageUrl || siteConfig.siteImage, category: p.category, techStack: p.techStack }))} 
          currentSlug={slug} 
        />
      </Box>

      {/* 页脚 */}
      <Footer config={siteConfig} />
    </Box>
  );
}
