import { Grid, Typography, Box } from '@mui/material';
import ProjectCard from '@/components/ProjectCard';
import SkillSection from '@/components/SkillSection';
import Sidebar from '@/components/Sidebar';
import Intro from '@/components/Intro';
import Footer from '@/components/Footer';
import { getAllProjects } from '@/lib/projects';
import { siteConfig } from '@/lib/config.server';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const title = `${siteConfig.title} | ${siteConfig.description}`;
  return {
    title: title,
    description: siteConfig.description || "A minimal geometric portfolio",
    openGraph: {
      title: title,
      description: siteConfig.description || "A minimal geometric portfolio",
      url: siteConfig.siteUrl || undefined,
      siteName: siteConfig.title || "MoGuSpace",
      ...(siteConfig.siteImage && { images: [siteConfig.siteImage] }),
      locale: siteConfig.siteLocale || "zh-CN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: siteConfig.description || "A minimal geometric portfolio",
      ...(siteConfig.siteImage && { images: [siteConfig.siteImage] }),
    },
  };
}

export default function Home() {
  const projects = getAllProjects();
  const categories = Array.from(new Set(projects.map(p => p.category))).sort((a, b) => {
    if (a === 'Uncategorized') return 1;
    if (b === 'Uncategorized') return -1;
    return a.localeCompare(b);
  });

  return (
    <Box>
      <Intro name={siteConfig.name} hasBackground={!!siteConfig.background} config={siteConfig} />

      <Box id="skills" sx={{ pt: 8, pb: 0, px: { xs: 2, md: 8 }, scrollMarginTop: '80px' }}>
        <SkillSection skills={siteConfig.skills || []} />
      </Box>

      <Box id="projects" sx={{ display: 'flex', pt: 8, px: { xs: 2, md: 8 }, pb: 8, gap: 4 }}>
        <Box sx={{ display: { xs: 'none', md: 'block' }, flexShrink: 0, width: 200 }}>
          <Sidebar config={siteConfig} categories={categories} />
        </Box>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          {categories.map((category) => (
            <Box key={category} id={category} sx={{ mb: 8, scrollMarginTop: '80px' }}>
              <Typography variant="h4" sx={{ mb: 4 }}>{category.toUpperCase()}</Typography>
              <Grid container spacing={2}>
                {projects.filter(p => p.category === category).map((project) => (
                  <Grid item key={project.slug} xs={12} sm={6} lg={4} xl={3}>
                    <ProjectCard
                      slug={project.slug}
                      title={project.title}
                      description={project.description}
                      imageUrl={project.imageUrl || siteConfig.siteImage}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>
      </Box>

      <Footer config={siteConfig} />
    </Box>
  );
}
