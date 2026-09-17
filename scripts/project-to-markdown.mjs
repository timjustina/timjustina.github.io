#!/usr/bin/env node
/**
 * Convert a project Vue view into AI-friendly Markdown.
 *
 * Usage:
 *   node scripts/project-to-markdown.mjs                 # all ProjectDetail views
 *   node scripts/project-to-markdown.mjs DashboardDesign # one project
 *
 * Exits non-zero if any source text chunk is missing from the output.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const viewsDir = path.join(root, 'src/views')
const outDir = path.join(root, 'src/data')

const SKIP_VIEWS = new Set(['Portfolio.vue', 'ProjectDetail.vue'])

function listProjectViews() {
  return fs
    .readdirSync(viewsDir)
    .filter((name) => name.endsWith('.vue') && !SKIP_VIEWS.has(name))
    .filter((name) => {
      const src = fs.readFileSync(path.join(viewsDir, name), 'utf8')
      return src.includes('ProjectDetail')
    })
}

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
}

/** Collapse HTML formatting whitespace inside a text run (keeps non-breaking structure). */
function collapseWs(text) {
  return decodeEntities(text).replace(/\s+/g, ' ').trim()
}

/**
 * Convert inline HTML to markdown.
 * Tags are removed without inserting spaces, so `</strong>s` stays `**…**s`.
 */
function inlineToMarkdown(html) {
  let s = decodeEntities(html)

  // Preserve intentional line breaks
  s = s.replace(/<br\s*\/?>/gi, '{{BR}}')

  // Emphasis first (may wrap strong in some docs); then strong
  s = s.replace(/<em\b[^>]*>([\s\S]*?)<\/em>/gi, (_, inner) => `*${collapseWs(inner)}*`)
  s = s.replace(/<i\b[^>]*>([\s\S]*?)<\/i>/gi, (_, inner) => `*${collapseWs(inner)}*`)
  s = s.replace(/<strong\b[^>]*>([\s\S]*?)<\/strong>/gi, (_, inner) => `**${collapseWs(inner)}**`)
  s = s.replace(/<b\b[^>]*>([\s\S]*?)<\/b>/gi, (_, inner) => `**${collapseWs(inner)}**`)

  // Drop any remaining tags without adding spaces
  s = s.replace(/<[^>]+>/g, '')

  // Collapse whitespace from template indentation; restore <br>
  s = s.replace(/\s+/g, ' ').trim()
  s = s.replace(/\{\{BR\}\}/g, '\n')

  // Clean spaces introduced by indentation before punctuation
  s = s.replace(/\s+([,.;:!?])/g, '$1')

  return s
}

function plainText(htmlOrMd) {
  return collapseWs(
    decodeEntities(htmlOrMd)
      .replace(/\{\{BR\}\}/g, ' ')
      .replace(/\*\*/g, '')
      .replace(/(?<!\*)\*(?!\*)/g, '')
      .replace(/^#+\s*/gm, '')
      .replace(/^[-*]\s+/gm, '')
      .replace(/^\d+\.\s+/gm, '')
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]+>/g, '') // no spaces — adjacent letters stay adjacent
      .replace(/\s+/g, ' ')
      .replace(/\s+([,.;:!?])/g, '$1')
  ).toLowerCase()
}

function attr(tag, name) {
  const re = new RegExp(`${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i')
  const m = tag.match(re)
  return m ? collapseWs(m[2]) : ''
}

function extractHeader(src) {
  const m = src.match(/<ProjectDetailHeader\b([\s\S]*?)\/>/)
  if (!m) return { title: '', client: '', period: '' }
  const tag = m[0]
  return {
    title: attr(tag, 'title'),
    client: attr(tag, 'client'),
    period: attr(tag, 'period'),
  }
}

function extractSummaryItems(src) {
  const m = src.match(
    /(?:const|let|var)\s+tldrSummaryItems\s*=\s*(\[[\s\S]*?\n\])/
  )
  if (!m) return []
  try {
    // eslint-disable-next-line no-new-func
    return Function(`"use strict"; return (${m[1]})`)()
  } catch {
    return []
  }
}

function extractBody(src) {
  const m = src.match(
    /<div\s+class="project-body"\s*>([\s\S]*?)<\/div>\s*<\/ProjectDetail>/
  )
  return m ? m[1] : ''
}

function convertListItem(liHtml) {
  let rest = liHtml
  const nestedParas = []
  rest = rest.replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi, (_, p) => {
    nestedParas.push(inlineToMarkdown(p))
    return ''
  })
  const lead = inlineToMarkdown(rest)
  if (!nestedParas.length) return `- ${lead}`
  if (!lead) return nestedParas.map((p, i) => (i === 0 ? `- ${p}` : `  ${p}`)).join('\n\n')
  return `- ${lead}\n\n${nestedParas.map((p) => `  ${p}`).join('\n\n')}`
}

function convertBody(bodyHtml) {
  let html = bodyHtml.replace(/<ProjectTldrButton\b[\s\S]*?\/>/g, '')

  // Media components → caption as italic line
  html = html.replace(
    /<(ZoomableImage|VideoPair|VideoPoster)\b([\s\S]*?)\/>/g,
    (_, _comp, attrs) => {
      const caption = attr(`x ${attrs}`, 'caption')
      const alt = attr(`x ${attrs}`, 'alt')
      const label = caption || alt
      return label ? `\n\n*${label}*\n\n` : '\n\n'
    }
  )

  html = html.replace(
    /<figure\b[^>]*class="[^"]*full-image[^"]*"[^>]*>[\s\S]*?<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>[\s\S]*?<\/figure>/gi,
    (_, cap) => `\n\n*${inlineToMarkdown(cap)}*\n\n`
  )
  html = html.replace(
    /<div\b[^>]*class="[^"]*full-image[^"]*"[^>]*>[\s\S]*?<p\b[^>]*class="[^"]*caption[^"]*"[^>]*>([\s\S]*?)<\/p>[\s\S]*?<\/div>/gi,
    (_, cap) => `\n\n*${inlineToMarkdown(cap)}*\n\n`
  )

  html = html.replace(/<(img|video|source)\b[^>]*\/?>/gi, '')
  html = html.replace(/<picture\b[^>]*>[\s\S]*?<\/picture>/gi, '')

  html = html.replace(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `\n\n## ${inlineToMarkdown(t)}\n\n`)
  html = html.replace(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `\n\n### ${inlineToMarkdown(t)}\n\n`)

  html = html.replace(/<ul\b[^>]*>([\s\S]*?)<\/ul>/gi, (_, list) => {
    const items = [...list.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((m) =>
      convertListItem(m[1])
    )
    return `\n\n${items.join('\n')}\n\n`
  })

  html = html.replace(/<ol\b[^>]*>([\s\S]*?)<\/ol>/gi, (_, list) => {
    const items = [...list.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map(
      (m, i) => `${i + 1}. ${inlineToMarkdown(m[1])}`
    )
    return `\n\n${items.join('\n')}\n\n`
  })

  html = html.replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi, (_, p) => `\n\n${inlineToMarkdown(p)}\n\n`)

  html = html.replace(/<\/?(section|div|span|figure|figcaption|header|main)[^>]*>/gi, '')
  html = html.replace(/<!--[\s\S]*?-->/g, '')

  return html
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function toOutName(viewFile) {
  const base = viewFile.replace(/\.vue$/, '')
  return `${base.charAt(0).toLowerCase()}${base.slice(1)}CaseStudy.md`
}

function collectSourceChunks(src) {
  const header = extractHeader(src)
  const summaryItems = extractSummaryItems(src)
  const body = extractBody(src).replace(/<ProjectTldrButton\b[\s\S]*?\/>/g, '')
  const chunks = []

  if (header.title) chunks.push({ kind: 'title', text: header.title })
  if (header.client) chunks.push({ kind: 'client', text: header.client })
  if (header.period) chunks.push({ kind: 'period', text: header.period })

  for (const item of summaryItems) {
    chunks.push({ kind: 'summary-lead', text: item.lead })
    chunks.push({ kind: 'summary-body', text: item.body })
  }

  for (const m of body.matchAll(/<(h2|h3|p|li|figcaption)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const text = plainText(m[2])
    if (text) chunks.push({ kind: m[1].toLowerCase(), text: m[2] })
  }
  for (const m of body.matchAll(/\bcaption="([^"]+)"/g)) {
    if (plainText(m[1])) chunks.push({ kind: 'caption', text: m[1] })
  }
  for (const m of body.matchAll(/<strong\b[^>]*>([\s\S]*?)<\/strong>/gi)) {
    if (plainText(m[1])) chunks.push({ kind: 'strong', text: m[1] })
  }

  return chunks
}

function chunkPresentInMarkdown(chunkHtmlOrText, mdPlain) {
  const n = plainText(chunkHtmlOrText)
  if (!n) return true
  return mdPlain.includes(n)
}

function verifyMarkdown(src, md, viewFile) {
  const mdPlain = plainText(md)
  const chunks = collectSourceChunks(src)
  const missing = []

  for (const chunk of chunks) {
    if (!chunkPresentInMarkdown(chunk.text, mdPlain)) {
      missing.push({
        kind: chunk.kind,
        preview: plainText(chunk.text).slice(0, 120),
      })
    }
  }

  if (missing.length) {
    const lines = missing
      .slice(0, 20)
      .map((c) => `  - [${c.kind}] ${c.preview}${c.preview.length >= 120 ? '…' : ''}`)
    throw new Error(
      `Accuracy check failed for ${viewFile}: ${missing.length} source chunk(s) missing from markdown.\n${lines.join('\n')}`
    )
  }

  return chunks.length
}

function buildMarkdown(src, viewFile) {
  const header = extractHeader(src)
  const summaryItems = extractSummaryItems(src)
  const body = convertBody(extractBody(src))

  const parts = []
  if (header.title) parts.push(`# ${header.title}`)
  else parts.push(`# ${viewFile.replace(/\.vue$/, '')}`)

  const meta = []
  if (header.client) meta.push(`**Client:** ${header.client}`)
  if (header.period) meta.push(`**Period:** ${header.period}`)
  if (meta.length) parts.push(meta.join('  \n'))

  if (summaryItems.length) {
    parts.push('## Summary')
    parts.push(
      summaryItems
        .map((item) => `- **${item.lead}** – ${item.body}`)
        .join('\n')
    )
  }

  if (body) parts.push(body)

  return `${parts.join('\n\n').trim()}\n`
}

function convertView(viewFile) {
  const srcPath = path.join(viewsDir, viewFile)
  const src = fs.readFileSync(srcPath, 'utf8')
  if (!src.includes('project-body')) {
    console.warn(`skip ${viewFile}: no project-body`)
    return null
  }
  const md = buildMarkdown(src, viewFile)
  const checked = verifyMarkdown(src, md, viewFile)
  const outName = toOutName(viewFile)
  const outPath = path.join(outDir, outName)
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(outPath, md, 'utf8')
  return { outPath, checked }
}

function main() {
  const arg = process.argv[2]
  const views = arg
    ? [`${arg.replace(/\.vue$/, '')}.vue`]
    : listProjectViews()

  if (!views.length) {
    console.error('No project views found.')
    process.exit(1)
  }

  let failed = false
  for (const view of views) {
    const srcPath = path.join(viewsDir, view)
    if (!fs.existsSync(srcPath)) {
      console.error(`Missing view: ${view}`)
      process.exit(1)
    }
    try {
      const result = convertView(view)
      if (result) {
        console.log(
          `wrote ${path.relative(root, result.outPath)} (verified ${result.checked} chunks)`
        )
      }
    } catch (err) {
      failed = true
      console.error(err.message || err)
    }
  }
  if (failed) process.exit(1)
}

main()
