import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { readIconSvg } from './icons.server';

const contentDirectory = path.join(process.cwd(), 'content');

export interface TechStack {
  name: string;
  icon?: string;
  iconSvg?: string;
  url?: string;
}

export interface ProjectData {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  date: string;
  category: string;
  techStack: TechStack[];
  content: string;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

function normalizeDateString(raw: string): string | null {
  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}:${m[6]}`;
  return null;
}

function getDate(data: any, mtime: Date): string {
  if (data.date) {
    if (typeof data.date === 'string') {
      // YAML 按字符串解析：直接正则提取，绕过 Date 构造函数
      const parsed = normalizeDateString(data.date);
      if (parsed) return parsed;
    }
    // YAML 已解析为 Date 对象
    if (data.date instanceof Date && !isNaN(data.date.getTime())) {
      return data.date.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
    }
    // 兜底：其他格式尝试 new Date()
    const d = new Date(data.date);
    if (!isNaN(d.getTime())) return formatDate(d);
  }
  return formatDate(mtime);
}

function resolveIconSvg(techStack: TechStack[]): TechStack[] {
  return techStack.map(item => ({
    ...item,
    iconSvg: item.icon ? readIconSvg(item.icon) : undefined,
  }));
}

export function getAllProjects(): ProjectData[] {
  if (!fs.existsSync(contentDirectory)) return [];
  const fileNames = fs.readdirSync(contentDirectory);
  return fileNames.filter(fileName => fileName.endsWith('.md')).map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const stats = fs.statSync(fullPath);
    return {
      slug,
      title: data.title || 'Untitled',
      description: data.description || '',
      imageUrl: data.imageUrl || '',
      projectUrl: data.projectUrl || '',
      date: getDate(data, stats.mtime),
      category: data.category || 'Uncategorized',
      techStack: resolveIconSvg(data.techStack || []),
      content,
    };
  });
}

export function getProjectBySlug(slug: string): ProjectData | null {
  const fullPath = path.join(contentDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const stats = fs.statSync(fullPath);
  return {
    slug,
    title: data.title || 'Untitled',
    description: data.description || '',
    imageUrl: data.imageUrl || '',
    projectUrl: data.projectUrl || '',
    date: getDate(data, stats.mtime),
    category: data.category || 'Uncategorized',
    techStack: resolveIconSvg(data.techStack || []),
    content,
  };
}

export function extractHeadings(markdown: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const lines = markdown.split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '');
      headings.push({ id, text, level });
    }
  }
  return headings;
}
