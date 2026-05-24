'use client';
import { Box, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

interface ProjectInfoProps {
  title: string;
  author?: string;
  date: string;
  projectUrl?: string;
  pageUrl: string; // 新增
}

export default function ProjectInfo({ title, author, date, projectUrl, pageUrl }: ProjectInfoProps) {
  const [copied, setCopied] = useState(false);
  // 使用传入的 pageUrl (Canonical) 作为初始状态
  const [shareUrl, setShareUrl] = useState(pageUrl);

  useEffect(() => {
    // 客户端挂载后获取真实地址，并对比更新
    const realUrl = window.location.href;
    if (realUrl !== pageUrl) {
      setShareUrl(realUrl);
    }
  }, [pageUrl]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const items = [
    { label: '项目名称', value: title },
    { label: '开发人员', value: author },
    { label: '创建时间', value: date },
    ...(projectUrl ? [{ label: '项目地址', value: projectUrl, href: projectUrl, isLink: true }] : []),
    { label: '链接', value: shareUrl, isCopy: true }, // 使用动态修正后的 shareUrl
  ];

  return (
    <Box sx={{
      my: 4,
      p: 3,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 1,
      fontSize: '0.875rem',
    }}>
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
        {items.map((item) => (
          <Box key={item.label} component="li" sx={{ py: 0.5, display: 'flex', gap: 1 }}>
            <Typography component="strong" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
              {item.label}:
            </Typography>
            {'isLink' in item && item.isLink ? (
              <Typography
                component="a"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: 'primary.main', 
                  textDecoration: 'underline', 
                  '&:hover': { opacity: 0.8 }, 
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'block',
                  maxWidth: '100%'
                }}
              >
                {item.value}
              </Typography>
            ) : 'isCopy' in item && item.isCopy ? (
              <Typography
                component="span"
                onClick={() => handleCopy(item.value)}
                sx={{ 
                  color: 'primary.main', 
                  textDecoration: 'underline', 
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 }, 
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'block',
                  maxWidth: '100%'
                }}
              >
                {copied ? '已复制！' : item.value}
              </Typography>
            ) : (
              <Typography component="span">{item.value}</Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
