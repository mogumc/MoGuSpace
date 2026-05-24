'use client';
import { Box, Typography, useTheme } from '@mui/material';

interface Skill {
  name: string;
  icon?: string;
  iconSvg?: string;
  url?: string;
}

interface SkillSectionProps {
  skills?: Skill[];
}

export default function SkillSection({ skills = [] }: SkillSectionProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const borderColor = isDark ? '#555' : '#000';
  const textColor = isDark ? '#e0e0e0' : '#000';

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, border: `1px solid ${borderColor}`, mb: 0, bgcolor: 'transparent' }}>
      <Typography variant="h4" sx={{ mb: 3, letterSpacing: '-0.02em', color: textColor }}>SKILLS</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        {skills.map((skill) => {
          const isLink = skill.url && skill.url !== '#';
          const Component = isLink ? 'a' : 'span';
          return (
            <Box
              key={skill.name}
              component={Component}
              {...(isLink ? { href: skill.url, target: '_blank', rel: 'noopener noreferrer' } : {})}
              sx={{
                px: 1.5,
                py: 0.5,
                border: `1px solid ${borderColor}`,
                color: textColor,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                textDecoration: 'none',
                transition: 'all 0.2s',
                cursor: isLink ? 'pointer' : 'default',
                fontSize: '0.875rem',
                minWidth: 'fit-content',
                '&:hover': {
                  bgcolor: textColor,
                  color: isDark ? '#000' : '#fff',
                }
              }}
            >
              {skill.iconSvg ? (
                <Box
                  component="span"
                  sx={{ display: 'flex', '& svg': { width: 20, height: 20 } }}
                  dangerouslySetInnerHTML={{ __html: skill.iconSvg }}
                />
              ) : null}
              <Typography variant="body1">{skill.name}</Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
