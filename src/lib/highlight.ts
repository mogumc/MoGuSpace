import { createHighlighter, type Highlighter } from 'shiki';

let highlighter: Highlighter | null = null;

const LANGS = [
  'typescript', 'javascript', 'tsx', 'jsx', 'python', 'go', 'bash', 'shell',
  'json', 'yaml', 'markdown', 'html', 'css', 'scss', 'rust', 'java',
  'lua', 'php', 'sql', 'viml', 'xml', 'toml', 'ini', 'diff',
  'plaintext', 'text',
];

export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['dark-plus', 'light-plus'],
      langs: LANGS,
    });
  }
  return highlighter;
}

export async function highlightCode(code: string, lang?: string): Promise<string> {
  const h = await getHighlighter();
  const language = lang && LANGS.includes(lang) ? lang : 'plaintext';
  return h.codeToHtml(code, {
    lang: language,
    themes: { light: 'light-plus', dark: 'dark-plus' },
  });
}

export async function highlightCodeBlocks(markdown: string): Promise<string> {
  const blocks: Array<{ placeholder: string; lang: string; code: string }> = [];
  let counter = 0;

  let processed = markdown.replace(/```(\w*)\r?\n([\s\S]*?)```/g, (_full, lang, code) => {
    const placeholder = `<!--CODEBLOCK_${counter}-->`;
    blocks.push({ placeholder, lang: lang || 'plaintext', code });
    counter++;
    return placeholder;
  });

  for (const block of blocks) {
    const highlighted = await highlightCode(block.code, block.lang);
    const langLabel = block.lang !== 'plaintext' ? `<span class="code-lang">${block.lang}</span>` : '';
    const html = `<div class="code-block-wrapper">${langLabel}${highlighted}</div>`;
    processed = processed.replace(block.placeholder, html);
  }

  return processed;
}
