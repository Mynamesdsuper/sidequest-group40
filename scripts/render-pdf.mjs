#!/usr/bin/env node
// Markdown -> PDF renderer (GFM tables, code blocks, Mermaid diagrams, TOC, header/footer).
// Usage: node scripts/render-pdf.mjs --title "Title" --out file.pdf a.md [b.md ...]
//        add --html <file> to keep the intermediate HTML (useful to inspect the layout).
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { marked } from 'marked';
import { chromium } from 'playwright';
import { ROOT } from './lib.mjs';

function parseArgs(argv) {
  const o = { title: 'Document', out: 'out.pdf', html: null, lang: 'en', inputs: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--title') o.title = argv[++i];
    else if (a === '--lang') o.lang = argv[++i];
    else if (a === '--out') o.out = argv[++i];
    else if (a === '--html') o.html = argv[++i];
    else o.inputs.push(a);
  }
  return o;
}

const slugify = (s) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const CSS = `
@page { size: A4; margin: 20mm 18mm; }
@page wide { size: A4 landscape; margin: 20mm 18mm; }
.landscape { page: wide; }
* { box-sizing: border-box; }
body { font-family: "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 10.5pt; line-height: 1.45; color: #1f2328; }
h1, h2, h3, h4 { line-height: 1.25; break-after: avoid; }
h1 { font-size: 20pt; margin: 0 0 8pt; padding-bottom: 4pt; border-bottom: 2px solid #1f6feb; break-before: page; }
h2 { font-size: 14.5pt; margin: 18pt 0 6pt; }
h3 { font-size: 12pt; margin: 14pt 0 4pt; }
h4 { font-size: 10.5pt; margin: 10pt 0 3pt; }
p, ul, ol { margin: 0 0 7pt; }
li { margin: 1.5pt 0; }
a { color: #0550ae; text-decoration: none; }
code { font-family: Consolas, "Courier New", monospace; font-size: 9pt; background: #eef1f4; padding: 0 2pt; border-radius: 2pt; }
pre { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 4pt; padding: 6pt 8pt; overflow-wrap: anywhere; white-space: pre-wrap; break-inside: avoid; font-size: 8.5pt; }
pre code { background: none; padding: 0; font-size: inherit; }
table { border-collapse: collapse; width: 100%; margin: 6pt 0 10pt; font-size: 9pt; }
th, td { border: 1px solid #b6bec7; padding: 3pt 5pt; vertical-align: top; text-align: left; overflow-wrap: break-word; }
td code { overflow-wrap: anywhere; }
th { background: #eaeef2; }
tr { break-inside: avoid; }
thead { display: table-header-group; }
blockquote { margin: 6pt 0; padding: 2pt 10pt; border-left: 3px solid #d0d7de; color: #57606a; }
hr { border: 0; border-top: 1px solid #d0d7de; margin: 12pt 0; }
pre.mermaid { background: #fff; border: 1px solid #d0d7de; text-align: center; white-space: normal; font-size: 10pt; padding: 6pt; }
pre.mermaid svg { max-width: 100%; height: auto; }
.cover { text-align: center; padding-top: 70mm; break-after: page; }
.cover h1 { border: 0; break-before: avoid; font-size: 28pt; }
.cover p { color: #57606a; font-size: 12pt; }
.toc { break-after: page; }
.toc h2 { margin-top: 0; }
.toc ul { list-style: none; padding-left: 0; }
.toc ul ul { padding-left: 14pt; }
.toc li.l1 { font-weight: 600; margin-top: 4pt; }
.toc li.l2 { font-weight: 400; font-size: 9.5pt; }
`;

async function launch() {
  const tries = [{}, { channel: 'chrome' }, { channel: 'msedge' }];
  let last;
  for (const t of tries) {
    try {
      return await chromium.launch(t);
    } catch (e) {
      last = e;
    }
  }
  throw new Error(`No Chromium available. Run "npx playwright install chromium". ${last?.message ?? ''}`);
}

async function main() {
  const o = parseArgs(process.argv.slice(2));
  if (!o.inputs.length) {
    console.error('Usage: node scripts/render-pdf.mjs --title "T" --out out.pdf in1.md [in2.md ...]');
    process.exit(2);
  }
  const md = o.inputs.map((f) => readFileSync(resolve(f), 'utf8').replace(/\r\n/g, '\n')).join('\n\n');
  let html = marked.parse(md, { gfm: true });

  // Mermaid blocks -> <pre class="mermaid">
  html = html.replace(/<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g, (_, code) => `<pre class="mermaid">${code}</pre>`);

  // Headings get ids; collect the TOC (h1/h2).
  const toc = [];
  const used = new Set();
  html = html.replace(/<h([1-4])>([\s\S]*?)<\/h\1>/g, (m, lvl, inner) => {
    let id = slugify(inner) || 'section';
    while (used.has(id)) id += '-x';
    used.add(id);
    if (lvl === '1' || lvl === '2') toc.push({ lvl: Number(lvl), id, text: inner.replace(/<[^>]+>/g, '') });
    return `<h${lvl} id="${id}">${inner}</h${lvl}>`;
  });
  const L = o.lang === 'it' ? { contents: 'Indice', group: 'Gruppo 40', generated: 'Generato il' } : { contents: 'Contents', group: 'Group 40', generated: 'Generated' };
  const tocHtml = `<div class="toc"><h2>${L.contents}</h2><ul>${toc.map((t) => `<li class="l${t.lvl}"><a href="#${t.id}">${escapeHtml(t.text)}</a></li>`).join('')}</ul></div>`;
  const date = new Date().toISOString().slice(0, 10);
  const cover = `<div class="cover"><h1>${escapeHtml(o.title)}</h1><p>Università degli Studi di Napoli Federico II · A.A. 2026/27 · ${L.group}</p><p>${L.generated} ${date}</p></div>`;

  const mermaidJs = pathToFileURL(join(ROOT, 'node_modules/mermaid/dist/mermaid.min.js')).href;
  const doc = `<!doctype html><html lang="${o.lang === 'it' ? 'it' : 'en'}"><head><meta charset="utf-8"><title>${escapeHtml(o.title)}</title><style>${CSS}</style></head><body>${cover}${tocHtml}${html}<script src="${mermaidJs}"></script></body></html>`;

  const tmp = mkdtempSync(join(tmpdir(), 'sq-pdf-'));
  const htmlPath = join(tmp, 'doc.html');
  writeFileSync(htmlPath, doc);
  if (o.html) {
    mkdirSync(dirname(resolve(o.html)), { recursive: true });
    writeFileSync(resolve(o.html), doc);
  }

  const browser = await launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1000, height: 1400 } });
    page.on('pageerror', (e) => console.error('page error:', e.message));
    await page.goto(pathToFileURL(htmlPath).href);
    const count = await page.locator('pre.mermaid').count();
    if (count) {
      await page.evaluate(async () => {
        // eslint-disable-next-line no-undef
        mermaid.initialize({ startOnLoad: false, securityLevel: 'loose', theme: 'default', flowchart: { useMaxWidth: true, htmlLabels: true }, gantt: { useMaxWidth: true } });
        // eslint-disable-next-line no-undef
        await mermaid.run({ querySelector: 'pre.mermaid' });
      });
      await page.waitForFunction(
        () => [...document.querySelectorAll('pre.mermaid')].every((e) => e.querySelector('svg')),
        null,
        { timeout: 60000 },
      );
      const errs = await page.locator('pre.mermaid svg[aria-roledescription="error"], pre.mermaid .error-icon').count();
      if (errs) throw new Error('A Mermaid diagram failed to render (syntax error).');
    }
    mkdirSync(dirname(resolve(o.out)), { recursive: true });
    const esc = escapeHtml(o.title);
    await page.pdf({
      path: resolve(o.out),
      preferCSSPageSize: true,
      printBackground: true,
      displayHeaderFooter: true,
      margin: { top: '20mm', bottom: '20mm', left: '18mm', right: '18mm' },
      headerTemplate: `<div style="font-size:8px;width:100%;padding:0 18mm;color:#57606a;text-align:left">${esc}</div>`,
      footerTemplate: `<div style="font-size:8px;width:100%;padding:0 18mm;color:#57606a;text-align:right">page <span class="pageNumber"></span> of <span class="totalPages"></span></div>`,
    });
    console.log(`PDF written: ${o.out} (${count} diagram(s))`);
  } finally {
    await browser.close();
    rmSync(tmp, { recursive: true, force: true });
  }
}
void existsSync;
main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
