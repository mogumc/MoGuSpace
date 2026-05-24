import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'out');
const contentDir = path.join(rootDir, 'content');
const configPath = path.join(contentDir, 'config.yml');

// 读取站点配置
const configRaw = fs.readFileSync(configPath, 'utf8');
const config = yaml.load(configRaw);

const siteUrl = (config.siteUrl || '').replace(/\/+$/, '');

if (!siteUrl || siteUrl === 'https://yoursite.com') {
  console.warn('[sitemap] siteUrl 未配置或为默认值，请先在 content/config.yml 中设置真实的 siteUrl');
  process.exit(0);
}

// 读取所有 markdown 项目
const projectSlugs = [];
if (fs.existsSync(contentDir)) {
  const files = fs.readdirSync(contentDir);
  for (const file of files) {
    if (file.endsWith('.md')) {
      projectSlugs.push(file.replace(/\.md$/, ''));
    }
  }
}

// 静态页面（不含 404）
const staticPages = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
];

// 项目页面
const projectPages = projectSlugs.map(slug => ({
  path: `/projects/${slug}/`,
  changefreq: 'monthly',
  priority: '0.7',
}));

const allPages = [...staticPages, ...projectPages];

// 生成 XML
const xmlEntries = allPages.map(({ path: p, changefreq, priority }) => {
  const loc = `${siteUrl}${p}`;
  // 项目页面用 markdown 文件的 mtime
  return `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>
`;

// 写入 out 目录
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const sitemapPath = path.join(outDir, 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemap, 'utf8');
console.log(`[sitemap] 已生成: ${sitemapPath} (${allPages.length} 个页面)`);
