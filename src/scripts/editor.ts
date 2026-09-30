import "@shoelace-style/shoelace/dist/shoelace.js";

type BlockType = "heading" | "paragraph" | "image" | "link";
type ReviewStatus = "pending" | "approved" | "needs-work";
type Severity = "error" | "warning" | "info";

interface CommentReply {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

interface CommentItem {
  id: string;
  author: string;
  body: string;
  createdAt: string;
  resolved: boolean;
  replies: CommentReply[];
}

interface ContentBlock {
  id: string;
  type: BlockType;
  text: string;
  accessibleText: string;
  headingLevel?: number;
  imageSrc?: string;
  imageAlt?: string;
  linkHref?: string;
  changeReason: string;
  reviewStatus: ReviewStatus;
  comments: CommentItem[];
  mergeConflict?: MergeConflictState;
}

interface MergeConflictState {
  returnId: string;
  returnFileName: string;
  reviewerValue: string;
  baseValue: string;
  deleted: boolean;
  resolved: boolean;
}

interface ReviewSendBlock {
  id: string;
  type: BlockType;
  text: string;
  accessibleText: string;
  headingLevel?: number;
  imageSrc?: string;
  imageAlt?: string;
  linkHref?: string;
}

interface ReviewSendRecord {
  id: string;
  title: string;
  projectId: string;
  sentAt: string;
  content: string;
  blocks: ReviewSendBlock[];
  mergedAt?: string;
  returnId?: string;
}

interface ReviewReturnRecord {
  id: string;
  fileName: string;
  receivedAt: string;
  content: string;
  projectId?: string;
  sendId?: string;
  chapterTitle?: string;
  matched: boolean;
  rejectedReason?: string[];
  mergedAt?: string;
}

interface DraftArchiveRecord {
  id: string;
  label: string;
  createdAt: string;
  returnId: string;
  returnFileName: string;
  blocks: ContentBlock[];
  glossary: GlossaryTerm[];
}

interface GlossaryTerm {
  id: string;
  source: string;
  preferred: string;
  note: string;
}

interface VersionSnapshot {
  id: string;
  label: string;
  createdAt: string;
  blocks: ContentBlock[];
  glossary: GlossaryTerm[];
}

interface ChapterProject {
  id: string;
  title: string;
  subject: string;
  grade: string;
  blocks: ContentBlock[];
  glossary: GlossaryTerm[];
  versions: VersionSnapshot[];
  reviewSends: ReviewSendRecord[];
  reviewReturns: ReviewReturnRecord[];
  draftArchives: DraftArchiveRecord[];
  lastMergeAt?: string;
  updatedAt: string;
}

type MergeCategory =
  | "unchanged"
  | "editor-only"
  | "reviewer-only"
  | "both-edited"
  | "both-added"
  | "added-by-reviewer"
  | "deleted-by-reviewer"
  | "removed-by-editor"
  | "reviewer-deleted-editor-edited";

interface ParsedReviewBlock {
  id?: string;
  type: BlockType;
  text: string;
  accessibleText: string;
  headingLevel?: number;
  imageSrc?: string;
  imageAlt?: string;
  linkHref?: string;
}

interface MergeRow {
  key: string;
  category: MergeCategory;
  order: number;
  blockId?: string;
  baseBlock?: ReviewSendBlock;
  currentBlock?: ContentBlock;
  returnBlock?: ParsedReviewBlock;
  baseValue: string;
  currentValue: string;
  reviewerValue: string;
  choice?: "current" | "reviewer";
}

interface AccessibilityIssue {
  id: string;
  blockId: string;
  type: "heading" | "link" | "image" | "glossary" | "sentence";
  severity: Severity;
  title: string;
  detail: string;
  suggestion: string;
}

const STORAGE_KEY = "sologsb-1009-accessible-textbook-v1";
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

function createSeedProject(): ChapterProject {
  const blocks: ContentBlock[] = [
    {
      id: "block-h1",
      type: "heading",
      headingLevel: 1,
      text: "第三章 水循环与城市",
      accessibleText: "第三章 水循环与城市",
      changeReason: "",
      reviewStatus: "approved",
      comments: [],
    },
    {
      id: "block-p1",
      type: "paragraph",
      text: "城市中的水并非取之不尽，由于其会通过蒸发、降水以及地表径流等若干复杂过程在自然界中持续循环，因此理解这些过程对于建设具有韧性的城市具有十分重要的意义。",
      accessibleText: "城市里的水会不断循环。它经过蒸发、降水并沿地面流动。了解这些过程，可以帮助我们建设更能适应变化的城市。",
      changeReason: "拆分长句，把抽象表述改为更直接的说明。",
      reviewStatus: "pending",
      comments: [],
    },
    {
      id: "block-h2",
      type: "heading",
      headingLevel: 2,
      text: "一、水从哪里来",
      accessibleText: "一、水从哪里来",
      changeReason: "保留原章节结构。",
      reviewStatus: "approved",
      comments: [],
    },
    {
      id: "block-img",
      type: "image",
      text: "图 3-1 城市水循环示意",
      imageSrc: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='420'%3E%3Crect width='800' height='420' fill='%23dcecf3'/%3E%3Ccircle cx='650' cy='85' r='45' fill='%23f4c95d'/%3E%3Cpath d='M0 300 Q180 240 340 300 T800 280 V420 H0Z' fill='%2389b7d0'/%3E%3Cpath d='M130 285 Q220 170 330 285' fill='none' stroke='%233a7c9e' stroke-width='12'/%3E%3C/svg%3E",
      imageAlt: "",
      accessibleText: "",
      changeReason: "",
      reviewStatus: "needs-work",
      comments: [],
    },
    {
      id: "block-p2",
      type: "paragraph",
      text: "当太阳照射到水面时，水会受热变成水蒸气升到空中。水蒸气冷却后形成云，再以雨或雪的形式落回地面。",
      accessibleText: "太阳照在水面上，水会变成水蒸气升到空中。水蒸气冷却后变成云，最后以雨或雪落回地面。",
      changeReason: "使用较短句子，并明确每个步骤的先后顺序。",
      reviewStatus: "approved",
      comments: [],
    },
    {
      id: "block-link",
      type: "link",
      text: "点击这里",
      linkHref: "/resources/water-cycle",
      accessibleText: "打开水循环互动实验",
      changeReason: "改为说明链接目标的独立文案。",
      reviewStatus: "pending",
      comments: [],
    },
    {
      id: "block-h3",
      type: "heading",
      headingLevel: 3,
      text: "雨水花园怎样工作",
      accessibleText: "雨水花园怎样工作",
      changeReason: "",
      reviewStatus: "approved",
      comments: [],
    },
    {
      id: "block-p3",
      type: "paragraph",
      text: "雨水花园利用土壤和植物的共同作用暂时储存雨水，同时通过下渗补给地下水，并在降雨较集中时减轻城市排水管道所承受的压力。",
      accessibleText: "雨水花园用土壤和植物暂时存住雨水。雨水还会慢慢渗入地下，补充地下水。雨很大时，它可以减轻排水管的压力。",
      changeReason: "把并列成分拆成短句，减少专业术语密度。",
      reviewStatus: "pending",
      comments: [],
    },
  ];

  return {
    id: "accessible-textbook-1009",
    title: "科学（五年级下册）·无障碍改写稿",
    subject: "科学",
    grade: "五年级",
    blocks,
    glossary: [
      { id: "term-1", source: "水循环", preferred: "水循环", note: "全书统一使用" },
      { id: "term-2", source: "地表径流", preferred: "沿地面流动的水", note: "首次出现时使用通俗解释" },
      { id: "term-3", source: "下渗", preferred: "渗入地下", note: "避免单独使用专业词" },
    ],
    versions: [],
    reviewSends: [],
    reviewReturns: [],
    draftArchives: [],
    updatedAt: new Date().toISOString(),
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function parseImportedChapter(input: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const lines = input.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  for (const line of lines) {
    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    if (heading) {
      blocks.push(blankBlock("heading", heading[2], { headingLevel: heading[1].length }));
      continue;
    }
    const image = /^!\[([^\]]*)\]\(([^)]+)\)(?:\s+(.+))?$/.exec(line);
    if (image) {
      blocks.push(blankBlock("image", image[3] || "未命名图片", { imageSrc: image[2], imageAlt: image[1] }));
      continue;
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(line);
    if (link) {
      blocks.push(blankBlock("link", link[1], { linkHref: link[2] }));
      continue;
    }
    blocks.push(blankBlock("paragraph", line));
  }
  return blocks.length ? blocks : [blankBlock("paragraph", input.trim() || "请输入章节内容")];
}

function blankBlock(type: BlockType, text: string, extra: Partial<ContentBlock> = {}): ContentBlock {
  return {
    id: uid("block"),
    type,
    text,
    accessibleText: type === "image" ? extra.imageAlt ?? "" : text,
    changeReason: "",
    reviewStatus: "pending",
    comments: [],
    ...extra,
  };
}

function sentenceLength(text: string) {
  const normalized = text.replace(/\s+/g, "");
  return /[A-Za-z]/.test(text) ? text.trim().split(/\s+/).length : normalized.length;
}

function analyze(project: ChapterProject): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  let lastHeading = 0;
  for (const block of project.blocks) {
    if (block.type === "heading") {
      const level = block.headingLevel ?? 2;
      if (lastHeading && level > lastHeading + 1) {
        issues.push({
          id: `heading-${block.id}`,
          blockId: block.id,
          type: "heading",
          severity: "error",
          title: "标题层级跳跃",
          detail: `从 H${lastHeading} 直接到 H${level}，读屏用户会失去清晰的章节结构。`,
          suggestion: `改为 H${lastHeading + 1}，或补上中间的上级标题。`,
        });
      }
      lastHeading = level;
    }
    if (block.type === "image" && !(block.imageAlt ?? block.accessibleText).trim()) {
      issues.push({
        id: `image-${block.id}`,
        blockId: block.id,
        type: "image",
        severity: "error",
        title: "图片缺少替代文本",
        detail: "视觉用户能看到的图表信息，读屏用户目前无法获得。",
        suggestion: "说明图中主体、变化和结论；纯装饰图片应标记为空替代文本。",
      });
    }
    if (block.type === "link") {
      const label = block.accessibleText || block.text;
      if (/^(点击这里|这里|链接|更多|here|click here|read more)$/i.test(label.trim())) {
        issues.push({
          id: `link-${block.id}`,
          blockId: block.id,
          type: "link",
          severity: "error",
          title: "链接文案缺少目的",
          detail: `“${label}”单独朗读时无法说明会前往哪里。`,
          suggestion: "改成“打开水循环互动实验”等可独立理解的文案。",
        });
      }
    }
    const text = block.type === "image" ? block.text : block.text;
    const sentences = text.split(/(?<=[。！？!?])\s*/).filter(Boolean);
    for (const [index, sentence] of sentences.entries()) {
      if (sentenceLength(sentence) > (/[A-Za-z]/.test(sentence) ? 28 : 42)) {
        issues.push({
          id: `sentence-${block.id}-${index}`,
          blockId: block.id,
          type: "sentence",
          severity: "warning",
          title: "句子过长",
          detail: `该句约 ${sentenceLength(sentence)} ${/[A-Za-z]/.test(sentence) ? "个词" : "个字"}，一次理解的信息较多。`,
          suggestion: "按动作或因果关系拆成 2—3 个短句。",
        });
      }
    }
    const source = `${block.text} ${block.accessibleText}`;
    for (const term of project.glossary) {
      if (source.includes(term.source) && block.accessibleText && !block.accessibleText.includes(term.preferred)) {
        issues.push({
          id: `term-${block.id}-${term.id}`,
          blockId: block.id,
          type: "glossary",
          severity: "info",
          title: `术语“${term.source}”尚未统一`,
          detail: `全书建议表述为“${term.preferred}”。${term.note}`,
          suggestion: `将无障碍文本调整为“${term.preferred}”。`,
        });
      }
    }
  }
  return issues;
}

function simplifyText(input: string, glossary: GlossaryTerm[]) {
  let result = input
    .replaceAll("由于其", "因为")
    .replaceAll("因此", "所以")
    .replaceAll("具有十分重要的意义", "很重要")
    .replaceAll("利用", "使用")
    .replaceAll("共同作用", "一起作用")
    .replaceAll("暂时储存", "暂时存住")
    .replaceAll("所承受的压力", "受到的压力")
    .replace(/([^。！？]{38,}?)[，、]([^。！？]{12,}?[。！？])/g, "$1。$2");
  for (const term of glossary) {
    if (result.includes(term.source)) result = result.replaceAll(term.source, term.preferred);
  }
  result = result
    .split(/(?<=[。！？!?])\s*/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .join("\n");
  return result;
}

function blockRole(block: ContentBlock) {
  if (block.type === "heading") return `H${block.headingLevel ?? 2} 标题`;
  if (block.type === "image") return "图片 / 替代文本";
  if (block.type === "link") return "链接";
  return "正文段落";
}

function statusLabel(status: ReviewStatus) {
  if (status === "approved") return "已通过";
  if (status === "needs-work") return "需修改";
  return "待审核";
}

function severityLabel(severity: Severity) {
  if (severity === "error") return "必须修复";
  if (severity === "warning") return "建议优化";
  return "一致性提醒";
}

function exportHtml(project: ChapterProject) {
  const body = project.blocks.map((block) => {
    if (block.type === "heading") {
      const level = Math.min(6, Math.max(1, block.headingLevel ?? 2));
      return `<h${level}>${escapeHtml(block.accessibleText || block.text)}</h${level}>`;
    }
    if (block.type === "image") {
      return `<figure><img src="${escapeHtml(block.imageSrc ?? "")}" alt="${escapeHtml(block.imageAlt || block.accessibleText)}"><figcaption>${escapeHtml(block.text)}</figcaption></figure>`;
    }
    if (block.type === "link") {
      return `<p><a href="${escapeHtml(block.linkHref ?? "#")}">${escapeHtml(block.accessibleText || block.text)}</a></p>`;
    }
    return `<p>${escapeHtml(block.accessibleText || block.text)}</p>`;
  }).join("\n      ");
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(project.title)} · 无障碍版本</title>
  <style>
    :root { font-family: "Noto Sans SC", sans-serif; font-size: 20px; line-height: 1.85; color: #17231f; background: #fffdf7; }
    body { max-width: 760px; margin: 0 auto; padding: 32px 24px 80px; }
    a { color: #075c9d; text-decoration-thickness: 2px; text-underline-offset: 3px; }
    a:focus-visible, [tabindex]:focus-visible { outline: 4px solid #d08a00; outline-offset: 3px; }
    h1, h2, h3, h4, h5, h6 { line-height: 1.4; margin-top: 1.8em; }
    figure { margin: 2em 0; } img { max-width: 100%; height: auto; } figcaption { font-size: .86em; color: #46554f; }
    .skip { position: absolute; left: -9999px; } .skip:focus { position: static; display: inline-block; padding: .5em; background: #fff; }
  </style>
</head>
<body>
  <a class="skip" href="#main">跳到正文</a>
  <main id="main" tabindex="-1">
      ${body}
  </main>
</body>
</html>`;
}

function download(filename: string, content: string, type = "text/html;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function loadProject(): ChapterProject {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "") as { schema: number; project: ChapterProject };
    if (stored.schema === 2 && stored.project?.blocks?.length) return withReviewDefaults(stored.project);
    if (stored.schema === 1 && stored.project?.blocks?.length) return withReviewDefaults(stored.project);
  } catch {
    // Fall back to the bundled sample.
  }
  return createSeedProject();
}

function withReviewDefaults(loaded: ChapterProject): ChapterProject {
  return {
    ...loaded,
    blocks: loaded.blocks.map((block) => ({ ...block, comments: block.comments ?? [] })),
    reviewSends: loaded.reviewSends ?? [],
    reviewReturns: loaded.reviewReturns ?? [],
    draftArchives: loaded.draftArchives ?? [],
  };
}

/* ------------------------------------------------------------------ */
/* 教研组送审 / 回稿对账                                                */
/* ------------------------------------------------------------------ */

interface BlockLike {
  type: BlockType;
  text: string;
  accessibleText: string;
  headingLevel?: number;
  imageSrc?: string;
  imageAlt?: string;
  linkHref?: string;
}

interface ReviewHeaderMeta {
  v: number;
  id: string;
  t: string;
  at: string;
}

interface ParsedReturn {
  meta?: ReviewHeaderMeta;
  blocks: ParsedReviewBlock[];
}

interface ReturnAssessment {
  matched: boolean;
  reasons: string[];
  send?: ReviewSendRecord;
  parsed: ParsedReviewBlock[];
  metaTitle?: string;
  ratio: number;
}

const REVIEW_HEADER_RE = /^<!--\s*无障碍改写送审标记\s+meta=(\S+?)\s*-->\s*$/;
const REVIEW_MARKER_RE = /^<!--\s*b\s+([\w-]+)\s*-->\s*$/;

function encodeMeta(data: unknown) {
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function decodeMeta(raw: string): ReviewHeaderMeta | undefined {
  try {
    const binary = atob(raw);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as ReviewHeaderMeta;
  } catch {
    return undefined;
  }
}

function reviewValueOf(block: BlockLike): string {
  if (block.type === "image") return (block.imageAlt ?? "").trim() || (block.accessibleText ?? "").trim();
  return (block.accessibleText ?? "").trim() || (block.text ?? "").trim();
}

function normalizeForCompare(value: string) {
  return value.replace(/\s+/g, "").trim();
}

function sameBlockValues(a: BlockLike, b: BlockLike) {
  if (normalizeForCompare(reviewValueOf(a)) !== normalizeForCompare(reviewValueOf(b))) return false;
  // 元信息只在两边都明确给出时才比较，避免留档缺字段造成误判。
  if (a.type === "heading" && a.headingLevel != null && b.headingLevel != null) return a.headingLevel === b.headingLevel;
  if (a.type === "image" && a.imageSrc && b.imageSrc) return a.imageSrc === b.imageSrc;
  if (a.type === "link" && a.linkHref && b.linkHref) return a.linkHref === b.linkHref;
  return true;
}

/** bigram Dice 相似度，用于没有段落标记时的兜底配对。 */
function textSimilarity(a: string, b: string) {
  const left = normalizeForCompare(a);
  const right = normalizeForCompare(b);
  if (!left || !right) return 0;
  if (left === right) return 1;
  const grams = (value: string) => {
    if (value.length < 2) return new Set([value]);
    const set = new Set<string>();
    for (let i = 0; i < value.length - 1; i += 1) set.add(value.slice(i, i + 2));
    return set;
  };
  const ga = grams(left);
  const gb = grams(right);
  let overlap = 0;
  ga.forEach((item) => { if (gb.has(item)) overlap += 1; });
  return (2 * overlap) / (ga.size + gb.size);
}

interface AlignPair<A, B> { ai: number; bi: number; score: number; left: A; right: B }
function alignBlocks<A, B>(left: A[], right: B[], score: (a: A, b: B) => number, threshold = 0.5) {
  const n = left.length;
  const m = right.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = 1; i <= n; i += 1) {
    for (let j = 1; j <= m; j += 1) {
      const similarity = score(left[i - 1], right[j - 1]);
      dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1] + (similarity >= threshold ? similarity : 0));
    }
  }
  const pairs: AlignPair<A, B>[] = [];
  let i = n;
  let j = m;
  while (i > 0 && j > 0) {
    const similarity = score(left[i - 1], right[j - 1]);
    if (similarity >= threshold && Math.abs(dp[i][j] - dp[i - 1][j - 1] - similarity) < 1e-9) {
      pairs.unshift({ ai: i - 1, bi: j - 1, score: similarity, left: left[i - 1], right: right[j - 1] });
      i -= 1;
      j -= 1;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i -= 1;
    } else {
      j -= 1;
    }
  }
  const pairedLeft = new Set(pairs.map((pair) => pair.ai));
  const pairedRight = new Set(pairs.map((pair) => pair.bi));
  return {
    pairs,
    restLeft: left.map((item, index) => ({ item, index })).filter((item) => !pairedLeft.has(item.index)),
    restRight: right.map((item, index) => ({ item, index })).filter((item) => !pairedRight.has(item.index)),
  };
}

function serializeBlockForReview(block: ContentBlock) {
  const marker = `<!-- b ${block.id} -->`;
  if (block.type === "heading") {
    const level = "#".repeat(Math.min(6, Math.max(1, block.headingLevel ?? 2)));
    return `${marker}\n${level} ${block.accessibleText || block.text}`;
  }
  if (block.type === "image") {
    return `${marker}\n![${block.imageAlt ?? block.accessibleText ?? ""}](${block.imageSrc ?? ""}) ${block.text}`;
  }
  if (block.type === "link") {
    return `${marker}\n[${block.accessibleText || block.text}](${block.linkHref ?? "#"})`;
  }
  return `${marker}\n${(block.accessibleText || block.text).split("\n").map((line) => line.trimEnd()).join("\n")}`;
}

function serializeReviewChapter(project: ChapterProject, sentAt: string) {
  const meta = encodeMeta({ v: 1, id: project.id, t: project.title, at: sentAt });
  const body = project.blocks.map(serializeBlockForReview).join("\n\n");
  return `<!-- 无障碍改写送审标记 meta=${meta} -->\n\n${body}\n`;
}

function toReviewSnapshot(blocks: ContentBlock[]): ReviewSendBlock[] {
  return blocks.map((block) => ({
    id: block.id,
    type: block.type,
    text: block.text,
    accessibleText: block.accessibleText,
    headingLevel: block.headingLevel,
    imageSrc: block.imageSrc,
    imageAlt: block.imageAlt,
    linkHref: block.linkHref,
  }));
}

function serializePlainArchive(archive: DraftArchiveRecord) {
  const lines = archive.blocks.map((block) => {
    if (block.type === "heading") return `${"#".repeat(Math.min(6, Math.max(1, block.headingLevel ?? 2)))} ${block.accessibleText || block.text}`;
    if (block.type === "image") return `![${block.imageAlt ?? block.accessibleText ?? ""}](${block.imageSrc ?? ""}) ${block.text}`;
    if (block.type === "link") return `[${block.accessibleText || block.text}](${block.linkHref ?? "#"})`;
    return block.accessibleText || block.text;
  });
  return `# 合并前草稿留档\n\n对应回稿：${archive.returnFileName}\n保存时间：${new Date(archive.createdAt).toLocaleString()}\n\n${lines.join("\n\n")}\n`;
}

function parseSection(section: string, id?: string): ParsedReviewBlock[] {
  const lines = section.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return [];
  const first = lines[0];
  const heading = /^(#{1,6})\s+(.+)$/.exec(first);
  if (heading) {
    return [{ id, type: "heading", text: heading[2], accessibleText: heading[2], headingLevel: heading[1].length }];
  }
  const image = /^!\[([^\]]*)\]\(([^)]+)\)(?:\s+(.+))?$/.exec(first);
  if (image) {
    return [{ id, type: "image", text: image[3] ?? "", accessibleText: image[1], imageAlt: image[1], imageSrc: image[2] }];
  }
  const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(first);
  if (link) {
    return [{ id, type: "link", text: link[1], accessibleText: link[1], linkHref: link[2] }];
  }
  // 带标记分段里的多行纯文本属于同一段，用换行连接。
  const text = lines.join("\n");
  return [{ id, type: "paragraph", text, accessibleText: text }];
}

function parseReviewBlocks(input: string): ParsedReviewBlock[] {
  const lines = input.split(/\r?\n/);
  const hasMarker = lines.some((line) => REVIEW_MARKER_RE.test(line.trim()));

  if (!hasMarker) {
    // 教研组清除了标记：每个非空行按独立内容块解析，再由文本相似度兜底对齐。
    return lines.flatMap((line) => parseSection(line));
  }

  // 按段落标记分段：标记之后、下一个标记之前的内容都属于这一段，支持同段内换行。
  const result: ParsedReviewBlock[] = [];
  let currentId: string | undefined;
  let sectionHasId = false;
  let buffer: string[] = [];
  let sawContent = false;
  const flush = () => {
    if (buffer.some((line) => line.trim())) result.push(...parseSection(buffer.join("\n"), sectionHasId ? currentId : undefined));
    buffer = [];
    sawContent = false;
    sectionHasId = false;
  };
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (REVIEW_HEADER_RE.test(line)) continue;
    const marker = REVIEW_MARKER_RE.exec(line);
    if (marker) {
      flush();
      currentId = marker[1];
      sectionHasId = true;
      continue;
    }
    // 空行结束当前标记分段（带标记的多行段落用单个换行换行，段落间才用空行）。
    if (!line) {
      if (sawContent) flush();
      continue;
    }
    buffer.push(rawLine);
    sawContent = true;
  }
  flush();
  return result;
}

function parseReturnFile(input: string): ParsedReturn {
  const firstLine = input.split(/\r?\n/).map((line) => line.trim()).find(Boolean);
  const headerMatch = firstLine ? REVIEW_HEADER_RE.exec(firstLine) : null;
  return { meta: headerMatch ? decodeMeta(headerMatch[1]) : undefined, blocks: parseReviewBlocks(input) };
}

function assessReturn(input: string, project: ChapterProject): ReturnAssessment {
  const parsedFile = parseReturnFile(input);
  const parsed = parsedFile.blocks;
  const reasons: string[] = [];
  if (!parsed.length) {
    return { matched: false, reasons: ["文件里没有识别到任何段落、标题、图片或链接，可能不是章节回稿文本。"], parsed, ratio: 0 };
  }
  const meta = parsedFile.meta;
  if (meta?.id && meta.id !== project.id) {
    reasons.push(`回稿属于另一章：标记的章节编号为“${meta.id}”，当前草稿是“${project.id}”。`);
    if (meta.t) reasons.push(`回稿的标题是“${meta.t}”，与当前草稿“${project.title}”不一致。`);
    reasons.push("草稿未做任何改动；如确认要处理这份文件，请先打开对应章节，再重新导入。");
    return { matched: false, reasons, parsed, metaTitle: meta.t, ratio: 0 };
  }
  let send: ReviewSendRecord | undefined;
  if (meta) {
    send = project.reviewSends.find((record) => record.projectId === meta.id && record.sentAt === meta.at)
      ?? project.reviewSends.find((record) => record.projectId === meta.id);
  } else {
    send = project.reviewSends[0];
  }
  const reference: BlockLike[] = send?.blocks ?? project.blocks;
  const markerIds = new Set((send?.blocks ?? []).map((block) => block.id));
  const markerHits = parsed.filter((block) => block.id && markerIds.has(block.id)).length;
  const alignment = alignBlocks(reference, parsed, (a, b) => textSimilarity(reviewValueOf(a), reviewValueOf(b)));
  const ratio = parsed.length ? alignment.pairs.length / parsed.length : 0;
  const average = alignment.pairs.length
    ? alignment.pairs.reduce((sum, pair) => sum + pair.score, 0) / alignment.pairs.length
    : 0;

  let matched = true;
  const enoughMarkers = markerHits >= Math.ceil(parsed.length * 0.5);
  if (!enoughMarkers && (ratio < 0.5 || average < 0.45)) {
    matched = false;
    reasons.push(send
      ? `只有约 ${Math.round(ratio * 100)}% 的段落能与送审留档对应（平均相似度 ${Math.round(average * 100)}%），无法按段落可靠对账。`
      : "没有找到这份草稿的送审留档，且回稿段落与当前草稿整体对不上，无法判断每段对应关系。");
    reasons.push("常见原因：这是另一章的回稿、回稿被整体重写，或送审标记在传阅中被清除且改动过大。");
    reasons.push("草稿未做任何改动；请核对文件后重新导入。");
  }
  if (matched && meta?.t && meta.t !== project.title) {
    reasons.push(`提示：回稿标题为“${meta.t}”，与当前草稿标题不同，但章节编号一致，将按段落标记对账。`);
  }
  return { matched, reasons, send, parsed, metaTitle: meta?.t, ratio };
}

function makeMergeRow(
  category: MergeCategory,
  data: {
    order: number;
    blockId?: string;
    baseBlock?: ReviewSendBlock;
    currentBlock?: ContentBlock;
    returnBlock?: ParsedReviewBlock;
    baseValue: string;
    currentValue: string;
    reviewerValue: string;
  },
): MergeRow {
  return {
    key: `${category}-${data.blockId ?? data.returnBlock?.text.slice(0, 12) ?? "x"}-${data.order}`,
    category,
    order: data.order,
    blockId: data.blockId,
    baseBlock: data.baseBlock,
    currentBlock: data.currentBlock,
    returnBlock: data.returnBlock,
    baseValue: data.baseValue,
    currentValue: data.currentValue,
    reviewerValue: data.reviewerValue,
    choice: ["both-edited", "both-added", "reviewer-deleted-editor-edited", "removed-by-editor"].includes(category) ? "current" : undefined,
  };
}

function buildMergeReport(assessment: ReturnAssessment, current: ChapterProject): MergeRow[] {
  const rows: MergeRow[] = [];
  const parsed = assessment.parsed;

  if (!assessment.send) {
    // 没有送审留档：只能做两向比对，差异一律当冲突处理。
    const alignment = alignBlocks(current.blocks, parsed, (a, b) => textSimilarity(reviewValueOf(a), reviewValueOf(b)));
    for (const pair of alignment.pairs) {
      const block = pair.left;
      const incoming = pair.right;
      const category: MergeCategory = sameBlockValues(block, incoming) ? "unchanged" : "both-edited";
      rows.push(makeMergeRow(category, {
        order: pair.bi,
        blockId: block.id,
        currentBlock: block,
        returnBlock: incoming,
        baseValue: "",
        currentValue: reviewValueOf(block),
        reviewerValue: reviewValueOf(incoming),
      }));
    }
    alignment.restRight.forEach(({ item, index }) => {
      rows.push(makeMergeRow("added-by-reviewer", {
        order: index,
        returnBlock: item,
        baseValue: "",
        currentValue: "",
        reviewerValue: reviewValueOf(item),
      }));
    });
    alignment.restLeft.forEach(({ item, index }) => {
      rows.push(makeMergeRow("editor-only", {
        order: 10000 + index,
        blockId: item.id,
        currentBlock: item,
        baseValue: "",
        currentValue: reviewValueOf(item),
        reviewerValue: "",
      }));
    });
    rows.sort((a, b) => a.order - b.order);
    return rows;
  }

  const send = assessment.send;
  const baseById = new Map(send.blocks.map((block) => [block.id, block]));
  const currentById = new Map(current.blocks.map((block) => [block.id, block]));
  const consumedParsed = new Set<number>();
  const consumedCurrent = new Set<string>();

  // 1) 带段落标记的，按标记精确配对。
  parsed.forEach((incoming, index) => {
    if (!incoming.id) return;
    const base = baseById.get(incoming.id);
    if (!base) return;
    consumedParsed.add(index);
    const block = currentById.get(incoming.id);
    if (block) consumedCurrent.add(block.id);
    const category: MergeCategory = !block
      ? "removed-by-editor"
      : sameBlockValues(block, base) && sameBlockValues(incoming, base) ? "unchanged"
      : !sameBlockValues(block, base) && !sameBlockValues(incoming, base) ? "both-edited"
      : sameBlockValues(incoming, base) ? "editor-only"
      : "reviewer-only";
    rows.push(makeMergeRow(category, {
      order: index,
      blockId: block?.id,
      baseBlock: base,
      currentBlock: block,
      returnBlock: incoming,
      baseValue: reviewValueOf(base),
      currentValue: block ? reviewValueOf(block) : "",
      reviewerValue: reviewValueOf(incoming),
    }));
  });

  // 2) 无标记段落：以已识别标记为锚点按区间对齐，区间里没有对应段才算新增。
  //    这样教研组在两段之间插入的新段落不会被相似度错配到其他段。
  const anchorCurrentIds = parsed.map((block) =>
    block.id && baseById.has(block.id) ? block.id : null);
  const restRuns: { parsedIndexes: number[]; before: string | null; after: string | null }[] = [];
  let runStart = -1;
  let lastAnchor: string | null = null;
  const closeRun = (end: number, after: string | null) => {
    if (runStart !== -1) {
      restRuns.push({ parsedIndexes: Array.from({ length: end - runStart }, (_, k) => runStart + k), before: lastAnchor, after });
      runStart = -1;
    }
  };
  parsed.forEach((_, index) => {
    const anchor = anchorCurrentIds[index];
    if (anchor) {
      closeRun(index, anchor);
      lastAnchor = anchor;
    } else if (!consumedParsed.has(index)) {
      if (runStart === -1) runStart = index;
    } else {
      runStart = -1;
    }
  });
  closeRun(parsed.length, null);

  for (const run of restRuns) {
    const runBlocks = run.parsedIndexes.map((index) => ({ block: parsed[index], index }));
    let startPos = 0;
    let endPos = current.blocks.length;
    if (run.before) {
      const p = current.blocks.findIndex((block) => block.id === run.before);
      if (p >= 0) startPos = p + 1;
    }
    if (run.after) {
      const p = current.blocks.findIndex((block) => block.id === run.after);
      if (p >= 0) endPos = p;
    }
    if (run.before && !run.after) endPos = current.blocks.length;
    if (!run.before && run.after) startPos = 0;
    const pool = current.blocks
      .map((block, blockIndex) => ({ block, blockIndex }))
      .filter(({ block, blockIndex }) => !consumedCurrent.has(block.id) && blockIndex >= startPos && blockIndex < endPos);
    const alignment = alignBlocks(pool.map((item) => item.block), runBlocks.map((item) => item.block),
      (a, b) => textSimilarity(reviewValueOf(a), reviewValueOf(b)), 0.6);
    const matchedRunSlots = new Set<number>();
    for (const pair of alignment.pairs) {
      const block = pool[pair.ai].block;
      const { block: incoming, index: parsedIndex } = runBlocks[pair.bi];
      matchedRunSlots.add(pair.bi);
      consumedCurrent.add(block.id);
      const base = baseById.get(block.id);
      let category: MergeCategory;
      if (!base) {
        category = sameBlockValues(block, incoming) ? "editor-only" : "both-added";
      } else if (sameBlockValues(block, base) && sameBlockValues(incoming, base)) {
        category = "unchanged";
      } else if (!sameBlockValues(block, base) && !sameBlockValues(incoming, base)) {
        category = "both-edited";
      } else if (sameBlockValues(incoming, base)) {
        category = "editor-only";
      } else {
        category = "reviewer-only";
      }
      rows.push(makeMergeRow(category, {
        order: parsedIndex,
        blockId: block.id,
        baseBlock: base,
        currentBlock: block,
        returnBlock: incoming,
        baseValue: base ? reviewValueOf(base) : "",
        currentValue: reviewValueOf(block),
        reviewerValue: reviewValueOf(incoming),
      }));
    }
    runBlocks.forEach(({ block, index }, slot) => {
      if (matchedRunSlots.has(slot)) return;
      rows.push(makeMergeRow("added-by-reviewer", {
        order: index,
        returnBlock: block,
        baseValue: "",
        currentValue: "",
        reviewerValue: reviewValueOf(block),
      }));
    });
  }

  // 3) 草稿里剩下的：要么编辑新增，要么教研组删除。
  current.blocks.forEach((block) => {
    if (consumedCurrent.has(block.id)) return;
    const base = baseById.get(block.id);
    const order = 10000 + current.blocks.indexOf(block);
    if (!base) {
      rows.push(makeMergeRow("editor-only", {
        order,
        blockId: block.id,
        currentBlock: block,
        baseValue: "",
        currentValue: reviewValueOf(block),
        reviewerValue: "",
      }));
    } else {
      rows.push(makeMergeRow(sameBlockValues(block, base) ? "deleted-by-reviewer" : "reviewer-deleted-editor-edited", {
        order,
        blockId: block.id,
        baseBlock: base,
        currentBlock: block,
        baseValue: reviewValueOf(base),
        currentValue: reviewValueOf(block),
        reviewerValue: "",
      }));
    }
  });

  rows.sort((a, b) => a.order - b.order);
  return rows;
}

const MERGE_CATEGORY_META: Record<MergeCategory, { label: string; tone: "auto" | "conflict" | "add" | "remove"; hint: string }> = {
  unchanged: { label: "两边一致", tone: "auto", hint: "自动保留，不做改动" },
  "editor-only": { label: "仅编辑改过", tone: "auto", hint: "自动保留当前草稿" },
  "reviewer-only": { label: "仅教研组改过", tone: "add", hint: "自动采用回稿版本，状态转为待审核" },
  "both-edited": { label: "两边都改过 · 冲突", tone: "conflict", hint: "两版都保留，请挑一版" },
  "both-added": { label: "两边都新增了相近段落 · 冲突", tone: "conflict", hint: "两版都保留，请挑一版" },
  "added-by-reviewer": { label: "教研组新增", tone: "add", hint: "自动加入草稿，状态为待审核" },
  "deleted-by-reviewer": { label: "教研组删除（编辑未动）", tone: "remove", hint: "自动从草稿删除" },
  "removed-by-editor": { label: "编辑已删除、教研组又改过 · 冲突", tone: "conflict", hint: "保持删除或采用回稿重新插回" },
  "reviewer-deleted-editor-edited": { label: "教研组删除、编辑改过 · 冲突", tone: "conflict", hint: "保留段落或按回稿删除" },
};

function mergeSummary(rows: MergeRow[]) {
  return {
    conflicts: rows.filter((row) => MERGE_CATEGORY_META[row.category].tone === "conflict").length,
    reviewer: rows.filter((row) => row.category === "reviewer-only").length,
    added: rows.filter((row) => row.category === "added-by-reviewer").length,
    deleted: rows.filter((row) => row.category === "deleted-by-reviewer").length,
    kept: rows.filter((row) => row.category === "editor-only" || row.category === "unchanged").length,
  };
}

function mergeSystemComment(body: string): CommentItem {
  return { id: uid("comment"), author: "系统 · 回稿合并", body, createdAt: new Date().toISOString(), resolved: false, replies: [] };
}

function applyReviewerValues(block: ContentBlock, incoming: ParsedReviewBlock, base?: ReviewSendBlock) {
  if (incoming.type === "image") {
    const alt = incoming.imageAlt ?? "";
    block.imageAlt = alt;
    block.accessibleText = alt;
    if (incoming.text && (!base || incoming.text !== base.text)) block.text = incoming.text;
    if (incoming.imageSrc) block.imageSrc = incoming.imageSrc;
  } else if (incoming.type === "heading") {
    block.text = incoming.text;
    block.accessibleText = incoming.text;
    if (incoming.headingLevel) block.headingLevel = incoming.headingLevel;
  } else if (incoming.type === "link") {
    block.text = incoming.text || block.text;
    block.accessibleText = incoming.accessibleText || incoming.text;
    if (incoming.linkHref) block.linkHref = incoming.linkHref;
  } else {
    block.accessibleText = incoming.accessibleText || incoming.text;
  }
  block.reviewStatus = "pending";
}

function sendBlockToContent(block: ReviewSendBlock): ContentBlock {
  return {
    id: uid("block"),
    type: block.type,
    text: block.text,
    accessibleText: block.accessibleText,
    headingLevel: block.headingLevel,
    imageSrc: block.imageSrc,
    imageAlt: block.imageAlt,
    linkHref: block.linkHref,
    changeReason: "",
    reviewStatus: "pending",
    comments: [],
  };
}

function applyMergeToDraft(draft: ChapterProject, rows: MergeRow[], returnId: string, returnFileName: string) {
  const merged: ContentBlock[] = [];
  for (const row of rows) {
    const current = row.currentBlock ? structuredClone(row.currentBlock) : undefined;

    if (row.category === "unchanged" || row.category === "editor-only") {
      if (current) merged.push(current);
      continue;
    }

    if (row.category === "reviewer-only" && current && row.returnBlock) {
      applyReviewerValues(current, row.returnBlock, row.baseBlock);
      current.mergeConflict = undefined;
      current.comments.push(mergeSystemComment(`本版与《${returnFileName}》对账：仅教研组做了修改，已自动采用回稿版本，请重新审核。`));
      merged.push(current);
      continue;
    }

    if (row.category === "added-by-reviewer" && row.returnBlock) {
      const block = blankBlock(row.returnBlock.type, row.returnBlock.text, {
        headingLevel: row.returnBlock.headingLevel,
        imageSrc: row.returnBlock.imageSrc,
        imageAlt: row.returnBlock.imageAlt,
        linkHref: row.returnBlock.linkHref,
      });
      if (block.type === "image") block.accessibleText = row.returnBlock.imageAlt ?? "";
      block.comments.push(mergeSystemComment(`教研组回稿《${returnFileName}》新增的段落，请审核。`));
      merged.push(block);
      continue;
    }

    if (row.category === "deleted-by-reviewer") {
      continue;
    }

    // 冲突类：按编辑在报告里的选择处理。
    const chooseReviewer = row.choice === "reviewer";
    if (row.category === "reviewer-deleted-editor-edited") {
      if (chooseReviewer) continue;
      if (current) {
        current.mergeConflict = { returnId, returnFileName, reviewerValue: "", baseValue: row.baseValue, deleted: true, resolved: false };
        current.reviewStatus = "needs-work";
        current.comments.push(mergeSystemComment(`教研组在《${returnFileName}》中删除了这段，但编辑此前也改过，两版均已保留。`));
        merged.push(current);
      }
      continue;
    }
    if (row.category === "removed-by-editor") {
      if (chooseReviewer && row.returnBlock) {
        const restored = row.baseBlock ? sendBlockToContent(row.baseBlock) : blankBlock(row.returnBlock.type, row.returnBlock.text);
        applyReviewerValues(restored, row.returnBlock, row.baseBlock);
        restored.comments.push(mergeSystemComment(`教研组在《${returnFileName}》中改了这段，编辑选择采用回稿并重新插回。`));
        merged.push(restored);
      }
      continue;
    }

    if (!current) continue;
    if (chooseReviewer && row.returnBlock) {
      applyReviewerValues(current, row.returnBlock, row.baseBlock);
      current.mergeConflict = undefined;
      current.comments.push(mergeSystemComment(`两边都改过这段，编辑在对账时选择了教研组回稿版本。`));
      merged.push(current);
    } else {
      current.mergeConflict = {
        returnId,
        returnFileName,
        reviewerValue: row.reviewerValue,
        baseValue: row.baseValue,
        deleted: false,
        resolved: false,
      };
      current.reviewStatus = "needs-work";
      current.comments.push(mergeSystemComment(`两边都改过这段，编辑选择保留草稿版本，教研组版本仍保留在冲突记录中。`));
      merged.push(current);
    }
  }

  // 对账行覆盖当前草稿的全部段落（删除类行不产生新块），因此结果以 merged 为准。
  draft.blocks = merged;
}

const rootElement = document.querySelector<HTMLDivElement>("#app");
if (!rootElement) throw new Error("Application root was not found");
const app: HTMLDivElement = rootElement;

let project = loadProject();
let activeBlockId = project.blocks[0]?.id ?? "";
let activeIssueId = "";
let previewMode: "normal" | "assisted" = "normal";
let selectedVersionId = "";
let showGlossary = false;
let reviewDialog: "closed" | "sends" | "report" | "foreign" = "closed";
let pendingReturn: ReviewReturnRecord | undefined;
let mergeRows: MergeRow[] = [];
let mergeMeta = { returnId: "", returnFileName: "", sendId: "" };
let mergeNotice = "";
let undoStack: ChapterProject[] = [];
let redoStack: ChapterProject[] = [];
let saveTimer = 0;

const activeBlock = () => project.blocks.find((block) => block.id === activeBlockId) ?? project.blocks[0];
const issues = () => analyze(project);

function saveSoon() {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ schema: 2, project }));
  }, 320);
}

function commit(label: string, update: (draft: ChapterProject) => void, renderAfter = true) {
  undoStack = [...undoStack.slice(-49), structuredClone(project)];
  redoStack = [];
  const draft = structuredClone(project);
  update(draft);
  draft.updatedAt = new Date().toISOString();
  project = draft;
  document.documentElement.dataset.lastAction = label;
  saveSoon();
  if (renderAfter) render();
}

function undo() {
  const previous = undoStack.pop();
  if (!previous) return;
  redoStack = [structuredClone(project), ...redoStack].slice(0, 50);
  project = previous;
  if (!project.blocks.some((block) => block.id === activeBlockId)) activeBlockId = project.blocks[0]?.id ?? "";
  saveSoon();
  render();
}

function redo() {
  const next = redoStack.shift();
  if (!next) return;
  undoStack = [...undoStack.slice(-49), structuredClone(project)];
  project = next;
  saveSoon();
  render();
}

function updateActiveBlock(update: (block: ContentBlock, draft: ChapterProject) => void, label = "修改无障碍文本", renderAfter = true) {
  commit(label, (draft) => {
    const block = draft.blocks.find((item) => item.id === activeBlockId);
    if (block) update(block, draft);
  }, renderAfter);
}

function safeFileName(value: string) {
  return value.replace(/[\\/:*?"<>|\s]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "章节";
}

function sendReview() {
  const sentAt = new Date().toISOString();
  const content = serializeReviewChapter(project, sentAt);
  const record: ReviewSendRecord = {
    id: uid("send"),
    title: project.title,
    projectId: project.id,
    sentAt,
    content,
    blocks: toReviewSnapshot(project.blocks),
  };
  project.reviewSends = [record, ...project.reviewSends].slice(0, 5);
  saveSoon();
  download(`${safeFileName(project.title)}-送审稿.md`, content, "text/markdown;charset=utf-8");
  mergeNotice = "";
  document.documentElement.dataset.lastAction = "已导出送审稿并留档";
  reviewDialog = "closed";
  render();
}

function importReturnText(fileName: string, input: string) {
  const assessment = assessReturn(input, project);
  const receivedAt = new Date().toISOString();
  const record: ReviewReturnRecord = {
    id: uid("return"),
    fileName,
    receivedAt,
    content: input,
    projectId: assessment.send?.projectId,
    sendId: assessment.send?.id,
    chapterTitle: assessment.metaTitle,
    matched: assessment.matched,
    rejectedReason: assessment.matched ? undefined : assessment.reasons,
  };
  // 回稿原文先留档（无论是否匹配），再展示对账结论；草稿此刻不动。
  project.reviewReturns = [record, ...project.reviewReturns].slice(0, 20);
  saveSoon();
  pendingReturn = record;
  if (assessment.matched) {
    mergeRows = buildMergeReport(assessment, project);
    mergeMeta = { returnId: record.id, returnFileName: fileName, sendId: assessment.send?.id ?? "" };
    reviewDialog = "report";
  } else {
    reviewDialog = "foreign";
  }
  render();
}

function performMerge() {
  const returnId = mergeMeta.returnId;
  const returnFileName = mergeMeta.returnFileName;
  const chosenRows = mergeRows.map((row) => structuredClone(row));
  commit("合并教研组回稿", (draft) => {
    const archive: DraftArchiveRecord = {
      id: uid("archive"),
      label: `合并回稿前：${new Date().toLocaleString()}`,
      createdAt: new Date().toISOString(),
      returnId,
      returnFileName,
      blocks: structuredClone(draft.blocks),
      glossary: structuredClone(draft.glossary),
    };
    draft.draftArchives = [archive, ...draft.draftArchives].slice(0, 10);
    const returnRecord = draft.reviewReturns.find((item) => item.id === returnId);
    if (returnRecord) returnRecord.mergedAt = new Date().toISOString();
    const send = draft.reviewSends.find((item) => item.id === mergeMeta.sendId);
    if (send) {
      send.mergedAt = new Date().toISOString();
      send.returnId = returnId;
    }
    applyMergeToDraft(draft, chosenRows, returnId, returnFileName);
    draft.lastMergeAt = new Date().toISOString();
    activeBlockId = draft.blocks[0]?.id ?? activeBlockId;
  });
  const summary = mergeSummary(chosenRows);
  mergeNotice = summary.conflicts
    ? `回稿已合并：${summary.reviewer} 段采用回稿、${summary.added} 段新增、${summary.deleted} 段删除；另有 ${summary.conflicts} 处冲突保留了两版，等待逐段挑选。`
    : `回稿已按段落合并：${summary.reviewer} 段采用回稿、${summary.added} 段新增、${summary.deleted} 段删除。`;
  reviewDialog = "closed";
  activeIssueId = "";
  render();
}

function undoLastMerge() {
  undo();
  mergeNotice = "";
  render();
}

function resolveActiveConflict(choice: "current" | "reviewer") {
  const block = activeBlock();
  const conflict = block.mergeConflict;
  if (!conflict) return;
  const blockId = block.id;

  // 教研组主张删除且编辑采纳：整段从草稿移除（同样可撤销）。
  if (choice === "reviewer" && conflict.deleted) {
    commit("按回稿删除冲突段落", (draft) => {
      draft.blocks = draft.blocks.filter((item) => item.id !== blockId);
      if (activeBlockId === blockId) activeBlockId = draft.blocks[0]?.id ?? "";
    });
    return;
  }

  updateActiveBlock((current) => {
    if (!current.mergeConflict) return;
    if (choice === "reviewer") {
      current.accessibleText = current.mergeConflict.reviewerValue;
      if (current.type === "image") current.imageAlt = current.mergeConflict.reviewerValue;
      current.comments.push(mergeSystemComment("编辑在段落冲突中改选了教研组回稿版本。"));
    } else {
      current.comments.push(mergeSystemComment("编辑已确认保留当前草稿版本，冲突解决。"));
    }
    current.mergeConflict.resolved = true;
    current.reviewStatus = "pending";
  }, "解决合并冲突");
}

function removeResolvedConflict() {
  updateActiveBlock((block) => {
    if (block.mergeConflict?.resolved) block.mergeConflict = undefined;
  }, "清除已解决的冲突标记");
}

function render() {
  const list = issues();
  const active = activeBlock();
  const activeIssues = list.filter((issue) => issue.blockId === active.id);
  const approved = project.blocks.filter((block) => block.reviewStatus === "approved").length;
  const version = project.versions.find((item) => item.id === selectedVersionId) ?? project.versions[0];

  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div class="brand"><span>无障碍</span><b>1009</b></div>
        <div class="title-block">
          <input id="project-title" aria-label="教材名称" value="${escapeHtml(project.title)}" />
          <div class="meta"><span>${escapeHtml(project.subject)}</span><span>${escapeHtml(project.grade)}</span><span class="save-dot">本地自动保存</span></div>
        </div>
        <div class="top-actions">
          <span class="online-pill">${navigator.onLine ? "在线" : "离线可编辑"}</span>
          <sl-button size="small" variant="default" ${undoStack.length ? "" : "disabled"} data-action="undo">撤销</sl-button>
          <sl-button size="small" variant="default" ${redoStack.length ? "" : "disabled"} data-action="redo">重做</sl-button>
          <sl-button size="small" variant="default" data-action="glossary">术语表</sl-button>
          <sl-button size="small" variant="primary" data-action="save-version">保存版本</sl-button>
          <sl-button size="small" variant="success" data-action="export">导出无障碍 HTML</sl-button>
        </div>
      </header>

      <div class="progress-strip">
        <div class="progress-copy"><b>${approved}/${project.blocks.length}</b><span>内容块已审核通过</span></div>
        <div class="progress-bar"><i style="width:${Math.round((approved / Math.max(1, project.blocks.length)) * 100)}%"></i></div>
        <div class="issue-counts">
          <span class="error">${list.filter((issue) => issue.severity === "error").length} 必须修复</span>
          <span class="warning">${list.filter((issue) => issue.severity === "warning").length} 建议优化</span>
          <span class="info">${list.filter((issue) => issue.severity === "info").length} 术语提醒</span>
        </div>
      </div>

      ${mergeNotice ? `<div class="merge-notice"><span>${escapeHtml(mergeNotice)}</span><div class="merge-notice-actions"><sl-button size="small" variant="default" data-action="dismiss-merge-notice">知道了</sl-button><sl-button size="small" variant="danger" outline data-action="undo-merge">撤回这次合并</sl-button></div></div>` : ""}

      <div class="workspace">
        <aside class="outline-panel">
          <div class="panel-title"><span>章节结构</span><sl-badge>${project.blocks.length} 块</sl-badge></div>
          <div class="block-list">
            ${project.blocks.map((block, index) => {
              const blockIssues = list.filter((issue) => issue.blockId === block.id);
              const conflict = block.mergeConflict;
              return `<button class="block-item ${block.id === active.id ? "active" : ""}" data-action="select-block" data-block-id="${block.id}">
                <span class="block-order">${index + 1}</span>
                <span class="block-copy"><b>${block.type === "heading" ? `H${block.headingLevel}` : blockRole(block)}</b><span>${escapeHtml(block.accessibleText || block.text || "（空）")}</span></span>
                <i class="status-${block.reviewStatus}" title="${statusLabel(block.reviewStatus)}"></i>
                ${conflict ? `<em class="conflict-flag" title="${conflict.resolved ? "冲突已处理" : "回稿冲突待挑选"}">${conflict.resolved ? "✓" : "⚠"}</em>` : ""}
                ${blockIssues.length ? `<em>${blockIssues.length}</em>` : ""}
              </button>`;
            }).join("")}
          </div>
          <input id="chapter-file" type="file" accept=".txt,.md,.markdown" hidden />
          <input id="return-file" type="file" accept=".txt,.md,.markdown" hidden />
          <sl-button class="import-button" variant="default" data-action="import">导入章节文本（整章替换）</sl-button>
          <div class="review-import-row">
            <sl-button variant="primary" outline data-action="send-review">送审导出</sl-button>
            <sl-button variant="warning" outline data-action="import-return">导入回稿对账</sl-button>
          </div>
          <sl-button class="import-button" variant="default" data-action="open-sends">送审与留档（${project.reviewSends.length + project.reviewReturns.length + project.draftArchives.length}）</sl-button>
          <div class="keyboard-note"><b>键盘</b><span><kbd>J</kbd><kbd>K</kbd> 跳转问题</span><span><kbd>E</kbd> 自动改写</span><span><kbd>⌘ Z</kbd> 撤销</span><span><kbd>1</kbd><kbd>2</kbd> 预览模式</span></div>
        </aside>

        <main class="editor-panel">
          <div class="editor-head">
            <div><span class="eyebrow">当前内容块</span><h1>${blockRole(active)}</h1></div>
            <div class="review-actions">
              <sl-button size="small" variant="${active.reviewStatus === "approved" ? "success" : "default"}" data-action="approve">${active.reviewStatus === "approved" ? "✓ 已通过" : "审核通过"}</sl-button>
              <sl-button size="small" variant="${active.reviewStatus === "needs-work" ? "danger" : "default"}" data-action="needs-work">需修改</sl-button>
            </div>
          </div>

          ${activeIssues.length ? `<div class="active-issues">${activeIssues.map((issue) => `
            <div class="issue-card ${issue.severity}">
              <div><sl-badge variant="${issue.severity === "error" ? "danger" : issue.severity === "warning" ? "warning" : "primary"}">${severityLabel(issue.severity)}</sl-badge><strong>${escapeHtml(issue.title)}</strong></div>
              <p>${escapeHtml(issue.detail)}</p><small>${escapeHtml(issue.suggestion)}</small>
            </div>`).join("")}</div>` : `<div class="issue-clear">✓ 当前内容块没有新的无障碍问题</div>`}

          ${active.mergeConflict ? renderConflictCard(active) : ""}

          <section class="edit-card source-card">
            <div class="section-heading"><div><span class="eyebrow">原教材</span><h2>${active.type === "image" ? "图片信息" : active.type === "link" ? "链接信息" : "原文"}</h2></div><sl-badge variant="neutral">${active.type}</sl-badge></div>
            ${renderSourceEditor(active)}
          </section>

          <section class="edit-card rewrite-card">
            <div class="section-heading">
              <div><span class="eyebrow">Accessible rewrite</span><h2>无障碍表达</h2></div>
              <sl-button size="small" variant="primary" outline data-action="generate">生成易读版本</sl-button>
            </div>
            ${renderAccessibleEditor(active)}
            <label class="field-label" for="reason-${active.id}">改写原因（每处改写必须记录）</label>
            <sl-textarea id="reason-${active.id}" data-field="reason" rows="2" value="${escapeHtml(active.changeReason)}" placeholder="例如：拆分长句、替换专业表达、补充链接目的"></sl-textarea>
          </section>

          <section class="edit-card">
            <div class="section-heading"><div><span class="eyebrow">Review discussion</span><h2>批注与回复</h2></div><sl-badge variant="warning">${active.comments.length} 条</sl-badge></div>
            <div class="comment-compose"><sl-textarea id="new-comment" rows="2" placeholder="记录改写依据、审核意见或术语讨论…"></sl-textarea><sl-button size="small" variant="primary" data-action="add-comment">添加批注</sl-button></div>
            <div class="comment-list">
              ${active.comments.length ? active.comments.map((comment) => `
                <article class="comment ${comment.resolved ? "resolved" : ""}">
                  <header><b>${escapeHtml(comment.author)}</b><time>${new Date(comment.createdAt).toLocaleString()}</time></header>
                  <p>${escapeHtml(comment.body)}</p>
                  ${comment.replies.map((reply) => `<div class="reply"><b>${escapeHtml(reply.author)}</b><span>${escapeHtml(reply.body)}</span></div>`).join("")}
                  <div class="reply-row"><sl-input size="small" id="reply-${comment.id}" placeholder="回复…"></sl-input><sl-button size="small" data-action="reply" data-comment-id="${comment.id}">回复</sl-button><sl-button size="small" variant="text" data-action="resolve-comment" data-comment-id="${comment.id}">${comment.resolved ? "重新打开" : "解决"}</sl-button></div>
                </article>`).join("") : `<div class="empty-note">当前内容块还没有批注。</div>`}
            </div>
          </section>
        </main>

        <aside class="review-panel">
          <section class="preview-card">
            <div class="section-heading"><div><span class="eyebrow">Reader preview</span><h2>阅读预览</h2></div><div class="mode-switch"><button class="${previewMode === "normal" ? "active" : ""}" data-action="preview-normal">普通</button><button class="${previewMode === "assisted" ? "active" : ""}" data-action="preview-assisted">辅助</button></div></div>
            <div class="reader-preview mode-${previewMode}">${renderPreview()}</div>
          </section>

          <section class="order-card">
            <div class="section-heading"><div><span class="eyebrow">Screen reader order</span><h2>读屏阅读顺序</h2></div><sl-badge>从上到下</sl-badge></div>
            <ol class="reading-order">
              ${project.blocks.map((block, index) => `<li class="${block.id === active.id ? "active" : ""}"><b>${index + 1}</b><div><strong>${blockRole(block)}</strong><span>${escapeHtml(block.accessibleText || block.text || "（无内容）")}</span></div></li>`).join("")}
            </ol>
          </section>

          <section class="issues-panel">
            <div class="section-heading"><div><span class="eyebrow">All checks</span><h2>全章问题</h2></div><sl-button size="small" variant="default" outline data-action="approve-all">全部通过</sl-button></div>
            <div class="issue-list">
              ${list.length ? list.map((issue) => `<button class="${issue.id === activeIssueId ? "active" : ""} ${issue.severity}" data-action="jump-issue" data-issue-id="${issue.id}" data-block-id="${issue.blockId}"><span>${severityLabel(issue.severity)}</span><b>${escapeHtml(issue.title)}</b><small>段 ${project.blocks.findIndex((block) => block.id === issue.blockId) + 1} · ${escapeHtml(issue.suggestion)}</small></button>`).join("") : `<div class="issue-clear">✓ 全章检查通过</div>`}
            </div>
          </section>

          <section class="version-card">
            <div class="section-heading"><div><span class="eyebrow">Version compare</span><h2>版本比较</h2></div><sl-badge>${project.versions.length} 版</sl-badge></div>
            ${project.versions.length ? `
              <sl-select id="version-select" size="small" value="${version?.id ?? ""}">${project.versions.map((item) => `<sl-option value="${item.id}">${escapeHtml(item.label)} · ${new Date(item.createdAt).toLocaleTimeString()}</sl-option>`).join("")}</sl-select>
              <div class="version-diff">${version ? renderVersionDiff(version, active) : ""}</div>
            ` : `<div class="empty-note">保存版本后，可比较改写前后的无障碍文本。</div>`}
          </section>
        </aside>
      </div>

      <footer class="statusbar"><span>最近操作：${escapeHtml(document.documentElement.dataset.lastAction || "示例章节已载入")}</span><span>${project.blocks.length} 个内容块 · ${list.length} 个待处理问题</span></footer>
    </div>

    <sl-dialog label="全书术语表" ${showGlossary ? "open" : ""} data-dialog="glossary">
      <div class="glossary-editor">
        ${project.glossary.map((term) => `<div class="term-row"><div><b>${escapeHtml(term.source)}</b><sl-input size="small" value="${escapeHtml(term.preferred)}" data-term-id="${term.id}"></sl-input><small>${escapeHtml(term.note)}</small></div><sl-button size="small" variant="danger" outline data-action="remove-term" data-term-id="${term.id}">删除</sl-button></div>`).join("")}
      </div>
      <div class="term-add"><sl-input id="new-term-source" placeholder="原文术语"></sl-input><sl-input id="new-term-preferred" placeholder="统一表达"></sl-input><sl-button variant="primary" data-action="add-term">添加术语</sl-button></div>
      <sl-button slot="footer" variant="primary" data-action="close-glossary">完成</sl-button>
    </sl-dialog>

    ${renderReviewDialog()}`;

  wireLiveFields();
}

function renderConflictCard(block: ContentBlock) {
  const conflict = block.mergeConflict;
  if (!conflict) return "";
  const reviewerVersion = conflict.deleted
    ? "（教研组在回稿中删除了这一段，没有文字版本）"
    : (conflict.reviewerValue || "（空）");
  return `<section class="merge-conflict-card ${conflict.resolved ? "resolved" : ""}">
    <div class="conflict-head">
      <strong>${conflict.resolved ? "✓ 冲突已处理" : "⚠ 回稿冲突：两边都改过，请挑一版"}</strong>
      <sl-badge variant="danger">${conflict.resolved ? "已选" : "待挑选"}</sl-badge>
    </div>
    <div class="conflict-columns">
      <div class="conflict-col current">
        <span>当前草稿版本</span>
        <p>${escapeHtml(block.type === "image" ? (block.imageAlt ?? block.accessibleText) : block.accessibleText || block.text || "（空）")}</p>
      </div>
      <div class="conflict-col reviewer">
        <span>教研组回稿版本 · ${escapeHtml(conflict.returnFileName)}</span>
        <p>${escapeHtml(reviewerVersion)}</p>
      </div>
    </div>
    <div class="conflict-actions">
      <sl-button size="small" variant="success" ${conflict.resolved ? "" : ""} data-action="pick-current">采用当前草稿</sl-button>
      <sl-button size="small" variant="primary" data-action="pick-reviewer">${conflict.deleted ? "按回稿删除本段" : "采用教研组回稿"}</sl-button>
      ${conflict.resolved ? `<sl-button size="small" variant="default" data-action="clear-conflict">清除冲突标记</sl-button>` : ""}
    </div>
    <small>提示：审核状态和批注都保留在本段；采用任一侧后状态转为待审核，请重新复核。</small>
  </section>`;
}

function valuePreview(row: MergeRow) {
  const value = (side: "current" | "reviewer" | "base") => {
    const text = side === "current" ? row.currentValue : side === "reviewer" ? row.reviewerValue : row.baseValue;
    return text.trim() || "（空）";
  };
  const type = row.currentBlock?.type ?? row.returnBlock?.type ?? "paragraph";
  const role = type === "heading" ? "标题" : type === "image" ? "图片替代文本" : type === "link" ? "链接文案" : "正文段落";
  return { role, current: value("current"), reviewer: value("reviewer"), base: value("base") };
}

function renderMergeReport() {
  const summary = mergeSummary(mergeRows);
  const rows = mergeRows.map((row, index) => {
    const meta = MERGE_CATEGORY_META[row.category];
    const preview = valuePreview(row);
    const isConflict = meta.tone === "conflict";
    const showTwoSides = isConflict && row.category !== "deleted-by-reviewer";
    return `<div class="merge-row tone-${meta.tone}">
      <div class="merge-row-head">
        <span class="merge-order">#${index + 1} · ${preview.role}</span>
        <sl-badge variant="${meta.tone === "conflict" ? "danger" : meta.tone === "add" ? "primary" : meta.tone === "remove" ? "warning" : "neutral"}">${meta.label}</sl-badge>
      </div>
      <p class="merge-hint">${escapeHtml(meta.hint)}</p>
      ${showTwoSides ? `<div class="merge-row-sides">
        <label class="merge-option ${row.choice === "current" ? "selected" : ""}">
          <input type="radio" name="choice-${escapeHtml(row.key)}" data-action="merge-choice" data-row-key="${escapeHtml(row.key)}" data-choice="current" ${row.choice === "current" ? "checked" : ""}>
          <span class="side-label">编辑草稿</span>
          <p>${escapeHtml(row.category === "removed-by-editor" ? "（当前草稿已删除这段）" : preview.current)}</p>
        </label>
        <label class="merge-option ${row.choice === "reviewer" ? "selected" : ""}">
          <input type="radio" name="choice-${escapeHtml(row.key)}" data-action="merge-choice" data-row-key="${escapeHtml(row.key)}" data-choice="reviewer" ${row.choice === "reviewer" ? "checked" : ""}>
          <span class="side-label reviewer">教研组回稿</span>
          <p>${escapeHtml(row.category === "reviewer-deleted-editor-edited" ? "（回稿删除了这段）" : preview.reviewer)}</p>
        </label>
      </div>` : `<div class="merge-row-preview"><p>${escapeHtml(preview.reviewer || preview.current)}</p></div>`}
    </div>`;
  }).join("");

  return `<sl-dialog label="回稿按段落对账报告" open data-dialog="review">
    <div class="merge-report">
      <div class="merge-report-summary">
        <p>回稿文件：<b>${escapeHtml(mergeMeta.returnFileName)}</b></p>
        <div class="merge-stat-row">
          <span class="stat conflict">${summary.conflicts} 处冲突待挑选</span>
          <span class="stat add">${summary.reviewer + summary.added} 段采用回稿/新增</span>
          <span class="stat remove">${summary.deleted} 段随回稿删除</span>
          <span class="stat keep">${summary.kept} 段保持草稿</span>
        </div>
        <p class="merge-report-note">合并前会把「当前草稿」和「这份回稿原文」各留档一份；术语表、批注和审核状态不会被覆盖。只有一边改过的段落自动按改动方走。</p>
      </div>
      <div class="merge-rows">${rows || `<div class="empty-note">两份内容完全一致，无需合并。</div>`}</div>
    </div>
    <sl-button slot="footer" variant="default" data-action="close-review">取消</sl-button>
    <sl-button slot="footer" variant="primary" data-action="confirm-merge">确认合并（${summary.conflicts ? `${summary.conflicts} 处冲突保留两版` : "无冲突"}）</sl-button>
  </sl-dialog>`;
}

function renderForeignDialog() {
  const reasons = pendingReturn?.rejectedReason ?? [];
  return `<sl-dialog label="回稿无法与当前章节对账" open data-dialog="review">
    <div class="foreign-report">
      <div class="foreign-warning">
        <strong>⚠ 草稿未做任何改动</strong>
        <p>这份回稿看起来不是当前章节的回稿，为避免整章被顶掉，系统没有修改草稿。原因如下：</p>
      </div>
      <ul>${reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}</ul>
      <div class="foreign-meta">
        <span>文件：${escapeHtml(pendingReturn?.fileName ?? "")}</span>
        <span>接收时间：${pendingReturn ? new Date(pendingReturn.receivedAt).toLocaleString() : ""}</span>
        <span>回稿原文已留档，可在「送审与留档」中查看或重新下载。</span>
      </div>
    </div>
    <sl-button slot="footer" variant="default" data-action="close-review">知道了</sl-button>
    <sl-button slot="footer" variant="primary" data-action="reimport-return">重新选择回稿导入</sl-button>
  </sl-dialog>`;
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString();
}

function renderSendsDialog() {
  const sends = project.reviewSends;
  const returns = project.reviewReturns;
  const archives = project.draftArchives;
  return `<sl-dialog label="送审与回稿留档" open data-dialog="review">
    <div class="archive-dialog">
      <section>
        <div class="archive-section-head"><h3>送审稿</h3><sl-badge>${sends.length}</sl-badge></div>
        ${sends.length ? sends.map((send) => `<div class="archive-row">
          <div><b>${escapeHtml(send.title)}</b><small>${formatDateTime(send.sentAt)} · ${send.blocks.length} 段${send.mergedAt ? ` · 已于 ${formatDateTime(send.mergedAt)} 合并回稿` : ""}</small></div>
          <sl-button size="small" variant="default" data-action="download-send" data-id="${send.id}">下载送审稿</sl-button>
        </div>`).join("") : `<div class="empty-note">还没有导出过送审稿。点击「送审导出」会生成带段落标记的 Markdown 并自动留档。</div>`}
      </section>
      <section>
        <div class="archive-section-head"><h3>回稿原文</h3><sl-badge>${returns.length}</sl-badge></div>
        ${returns.length ? returns.map((record) => `<div class="archive-row ${record.matched ? "" : "rejected"}">
          <div><b>${escapeHtml(record.fileName)}</b><small>${formatDateTime(record.receivedAt)}${record.matched ? (record.mergedAt ? ` · 已合并 ${formatDateTime(record.mergedAt)}` : " · 可对账") : " · 不匹配，未动草稿"}</small></div>
          <div class="archive-row-actions">
            <sl-button size="small" variant="default" data-action="download-return" data-id="${record.id}">下载原文</sl-button>
            ${record.matched && !record.mergedAt ? `<sl-button size="small" variant="primary" data-action="replay-return" data-id="${record.id}">重新对账</sl-button>` : ""}
          </div>
        </div>`).join("") : `<div class="empty-note">还没有导入过回稿。</div>`}
      </section>
      <section>
        <div class="archive-section-head"><h3>合并前草稿留档</h3><sl-badge>${archives.length}</sl-badge></div>
        ${archives.length ? archives.map((archive) => `<div class="archive-row">
          <div><b>${escapeHtml(archive.label)}</b><small>对应回稿：${escapeHtml(archive.returnFileName)} · ${archive.blocks.length} 段</small></div>
          <div class="archive-row-actions">
            <sl-button size="small" variant="default" data-action="download-archive" data-id="${archive.id}">下载草稿</sl-button>
            <sl-button size="small" variant="warning" outline data-action="restore-archive" data-id="${archive.id}">恢复为当前草稿</sl-button>
          </div>
        </div>`).join("") : `<div class="empty-note">每次确认合并前，系统都会在这里保存一份草稿快照，可随时下载或恢复。</div>`}
      </section>
    </div>
    <sl-button slot="footer" variant="primary" data-action="close-review">完成</sl-button>
  </sl-dialog>`;
}

function renderReviewDialog() {
  if (reviewDialog === "report") return renderMergeReport();
  if (reviewDialog === "foreign") return renderForeignDialog();
  if (reviewDialog === "sends") return renderSendsDialog();
  return "";
}

function renderSourceEditor(block: ContentBlock) {
  if (block.type === "image") {
    return `<div class="image-source"><img src="${escapeHtml(block.imageSrc ?? "")}" alt="" /><div><b>图注</b><p>${escapeHtml(block.text)}</p><b>现有替代文本</b><p>${escapeHtml(block.imageAlt || "（空）")}</p></div></div>
      <sl-input id="source-${block.id}" data-field="source" label="图注" value="${escapeHtml(block.text)}"></sl-input>
      <sl-input id="image-alt-${block.id}" data-field="image-alt" label="替代文本" value="${escapeHtml(block.imageAlt ?? "")}" help-text="描述图片传达的信息，不写“图片”二字。"></sl-input>`;
  }
  if (block.type === "link") {
    return `<sl-input id="source-${block.id}" data-field="source" label="原链接文案" value="${escapeHtml(block.text)}"></sl-input><sl-input id="link-href-${block.id}" data-field="link-href" label="链接地址" value="${escapeHtml(block.linkHref ?? "")}"></sl-input>`;
  }
  if (block.type === "heading") {
    return `<div class="heading-edit"><sl-select id="heading-level-${block.id}" data-field="heading-level" label="标题层级" value="${String(block.headingLevel ?? 2)}"><sl-option value="1">H1</sl-option><sl-option value="2">H2</sl-option><sl-option value="3">H3</sl-option><sl-option value="4">H4</sl-option></sl-select><sl-input id="source-${block.id}" data-field="source" label="标题文本" value="${escapeHtml(block.text)}"></sl-input></div>`;
  }
  return `<sl-textarea id="source-${block.id}" data-field="source" rows="4" value="${escapeHtml(block.text)}"></sl-textarea>`;
}

function renderAccessibleEditor(block: ContentBlock) {
  if (block.type === "image") {
    return `<sl-textarea id="accessible-${block.id}" data-field="accessible" rows="3" label="图片替代文本" value="${escapeHtml(block.imageAlt || block.accessibleText)}" help-text="读屏软件会朗读这里的内容。"></sl-textarea>`;
  }
  return `<sl-textarea id="accessible-${block.id}" data-field="accessible" rows="6" value="${escapeHtml(block.accessibleText)}"></sl-textarea>`;
}

function renderPreview() {
  return project.blocks.map((block, index) => {
    const content = escapeHtml(block.accessibleText || block.text);
    if (block.type === "heading") {
      const tag = `h${Math.min(6, Math.max(1, block.headingLevel ?? 2))}`;
      return `<${tag} class="${block.id === activeBlockId ? "active-block" : ""}"><span class="order-marker">${index + 1}</span>${content}</${tag}>`;
    }
    if (block.type === "image") {
      return `<figure class="${block.id === activeBlockId ? "active-block" : ""}"><img src="${escapeHtml(block.imageSrc ?? "")}" alt="${escapeHtml(block.imageAlt || block.accessibleText)}"><figcaption><span class="order-marker">${index + 1}</span>${escapeHtml(block.text)}</figcaption></figure>`;
    }
    if (block.type === "link") {
      return `<p class="${block.id === activeBlockId ? "active-block" : ""}"><span class="order-marker">${index + 1}</span><a href="${escapeHtml(block.linkHref ?? "#")}" onclick="return false">${content}</a><span class="link-role">链接</span></p>`;
    }
    return `<p class="${block.id === activeBlockId ? "active-block" : ""}"><span class="order-marker">${index + 1}</span>${content}</p>`;
  }).join("");
}

function renderVersionDiff(version: VersionSnapshot, current: ContentBlock) {
  const oldBlock = version.blocks.find((block) => block.id === current.id);
  if (!oldBlock) return `<div class="empty-note">当前内容块不在该版本中。</div>`;
  return `<div class="diff-column"><span>旧版</span><p>${escapeHtml(oldBlock.accessibleText || oldBlock.text)}</p></div><div class="diff-column current"><span>当前</span><p>${escapeHtml(current.accessibleText || current.text)}</p></div>`;
}

function wireLiveFields() {
  app.querySelectorAll<HTMLElement>("sl-input[data-field], sl-textarea[data-field], sl-select[data-field]").forEach((element) => {
    element.addEventListener("sl-input", () => {
      const value = (element as HTMLElement & { value: string }).value;
      updateActiveBlock((block) => {
        const field = element.dataset.field;
        if (field === "source") block.text = value;
        if (field === "accessible") {
          block.accessibleText = value;
          if (block.type === "image") block.imageAlt = value;
        }
        if (field === "image-alt") {
          block.imageAlt = value;
          block.accessibleText = value;
        }
        if (field === "link-href") block.linkHref = value;
        if (field === "reason") block.changeReason = value;
        block.reviewStatus = "pending";
      }, "编辑无障碍文本", false);
    });
    element.addEventListener("sl-change", () => render());
  });
}

app.addEventListener("click", (event) => {
  const target = (event.target as HTMLElement).closest<HTMLElement>("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  if (action === "undo") undo();
  if (action === "redo") redo();
  if (action === "select-block") {
    activeBlockId = target.dataset.blockId ?? activeBlockId;
    activeIssueId = "";
    render();
  }
  if (action === "jump-issue") {
    activeIssueId = target.dataset.issueId ?? "";
    activeBlockId = target.dataset.blockId ?? activeBlockId;
    render();
    requestAnimationFrame(() => app.querySelector<HTMLElement>(".editor-panel")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
  if (action === "generate") {
    const block = activeBlock();
    const suggestion = block.type === "link"
      ? "打开水循环互动实验"
      : simplifyText(block.type === "image" ? block.imageAlt || block.text : block.text, project.glossary);
    updateActiveBlock((current) => {
      if (current.type === "image") current.imageAlt = suggestion;
      current.accessibleText = suggestion;
      current.changeReason ||= "拆分长句并替换复杂表达，保留原有知识信息。";
      current.reviewStatus = "pending";
    }, "生成易读版本");
  }
  if (action === "approve") updateActiveBlock((block) => { block.reviewStatus = "approved"; }, "审核通过");
  if (action === "needs-work") updateActiveBlock((block) => { block.reviewStatus = "needs-work"; }, "标记需修改");
  if (action === "add-comment") {
    const input = app.querySelector<HTMLElement & { value: string }>("#new-comment");
    const body = input?.value.trim();
    if (body) updateActiveBlock((block) => {
      block.comments.unshift({ id: uid("comment"), author: "当前编辑", body, createdAt: new Date().toISOString(), resolved: false, replies: [] });
    }, "添加批注");
  }
  if (action === "reply") {
    const commentId = target.dataset.commentId ?? "";
    const input = app.querySelector<HTMLElement & { value: string }>(`#reply-${CSS.escape(commentId)}`);
    const body = input?.value.trim();
    if (body) updateActiveBlock((block) => {
      block.comments.find((comment) => comment.id === commentId)?.replies.push({ id: uid("reply"), author: "当前编辑", body, createdAt: new Date().toISOString() });
    }, "回复批注");
  }
  if (action === "resolve-comment") {
    const commentId = target.dataset.commentId ?? "";
    updateActiveBlock((block) => {
      const comment = block.comments.find((item) => item.id === commentId);
      if (comment) comment.resolved = !comment.resolved;
    }, "更新批注状态");
  }
  if (action === "preview-normal") { previewMode = "normal"; render(); }
  if (action === "preview-assisted") { previewMode = "assisted"; render(); }
  if (action === "glossary") { showGlossary = true; render(); }
  if (action === "close-glossary") { showGlossary = false; render(); }
  if (action === "add-term") {
    const source = app.querySelector<HTMLElement & { value: string }>("#new-term-source");
    const preferred = app.querySelector<HTMLElement & { value: string }>("#new-term-preferred");
    if (source?.value.trim() && preferred?.value.trim()) {
      commit("添加术语", (draft) => { draft.glossary.push({ id: uid("term"), source: source.value.trim(), preferred: preferred.value.trim(), note: "编辑新增术语" }); });
    }
  }
  if (action === "remove-term") {
    const termId = target.dataset.termId;
    commit("删除术语", (draft) => { draft.glossary = draft.glossary.filter((term) => term.id !== termId); });
  }
  if (action === "save-version") {
    const versionId = uid("version");
    commit("保存版本快照", (draft) => {
      draft.versions.unshift({ id: versionId, label: `版本 ${draft.versions.length + 1}`, createdAt: new Date().toISOString(), blocks: structuredClone(draft.blocks), glossary: structuredClone(draft.glossary) });
      draft.versions = draft.versions.slice(0, 10);
    });
    selectedVersionId = versionId;
    render();
  }
  if (action === "approve-all") {
    commit("全部审核通过", (draft) => { draft.blocks.forEach((block) => { block.reviewStatus = "approved"; }); });
  }
  if (action === "export") {
    download(`${project.title}-无障碍版.html`, exportHtml(project));
    document.documentElement.dataset.lastAction = "已导出无障碍 HTML";
    render();
  }
  if (action === "import") app.querySelector<HTMLInputElement>("#chapter-file")?.click();
  if (action === "send-review") sendReview();
  if (action === "import-return") app.querySelector<HTMLInputElement>("#return-file")?.click();
  if (action === "open-sends") { reviewDialog = "sends"; render(); }
  if (action === "close-review") { reviewDialog = "closed"; render(); }
  if (action === "dismiss-merge-notice") { mergeNotice = ""; render(); }
  if (action === "undo-merge") undoLastMerge();
  if (action === "reimport-return") {
    reviewDialog = "closed";
    render();
    app.querySelector<HTMLInputElement>("#return-file")?.click();
  }
  if (action === "confirm-merge") performMerge();
  if (action === "merge-choice") {
    const key = target.dataset.rowKey ?? "";
    const choice = (target.dataset.choice ?? "current") as "current" | "reviewer";
    const row = mergeRows.find((item) => item.key === key);
    if (row) {
      row.choice = choice;
      render();
      // 重新渲染后恢复对话框内滚动位置不必要，但要重新勾选由 checked 保证。
    }
  }
  if (action === "pick-current") resolveActiveConflict("current");
  if (action === "pick-reviewer") resolveActiveConflict("reviewer");
  if (action === "clear-conflict") removeResolvedConflict();
  if (action === "download-send") {
    const record = project.reviewSends.find((item) => item.id === target.dataset.id);
    if (record) download(`${safeFileName(record.title)}-送审稿.md`, record.content, "text/markdown;charset=utf-8");
  }
  if (action === "download-return") {
    const record = project.reviewReturns.find((item) => item.id === target.dataset.id);
    if (record) download(`${safeFileName(record.fileName.replace(/\.[^.]+$/, ""))}-回稿原文.md`, record.content, "text/markdown;charset=utf-8");
  }
  if (action === "download-archive") {
    const record = project.draftArchives.find((item) => item.id === target.dataset.id);
    if (record) download(`${safeFileName(project.title)}-合并前草稿存档.md`, serializePlainArchive(record), "text/markdown;charset=utf-8");
  }
  if (action === "restore-archive") {
    const archive = project.draftArchives.find((item) => item.id === target.dataset.id);
    if (archive && window.confirm("恢复后会用这份留档替换当前全部段落（术语表保留当前版本）。可用撤销恢复，确认继续吗？")) {
      reviewDialog = "closed";
      commit("恢复合并前草稿留档", (draft) => {
        draft.blocks = structuredClone(archive.blocks);
        activeBlockId = draft.blocks[0]?.id ?? "";
      });
    }
  }
  if (action === "replay-return") {
    const record = project.reviewReturns.find((item) => item.id === target.dataset.id);
    if (!record) return;
    const assessment = assessReturn(record.content, project);
    if (!assessment.matched) {
      pendingReturn = record;
      reviewDialog = "foreign";
      render();
      return;
    }
    mergeRows = buildMergeReport(assessment, project);
    mergeMeta = { returnId: record.id, returnFileName: record.fileName, sendId: assessment.send?.id ?? "" };
    reviewDialog = "report";
    render();
  }
});

app.addEventListener("sl-change", (event) => {
  const element = event.target as HTMLElement;
  if (element.id === "chapter-file") return;
  if (element.id.startsWith("heading-level-")) {
    const level = Number((element as HTMLElement & { value: string }).value);
    updateActiveBlock((block) => { block.headingLevel = level; block.reviewStatus = "pending"; }, "修改标题层级");
  }
  if (element.id === "version-select") {
    selectedVersionId = (element as HTMLElement & { value: string }).value;
    render();
  }
  if (element.matches("[data-term-id]")) {
    const termId = element.dataset.termId;
    const value = (element as HTMLElement & { value: string }).value;
    commit("修改术语表", (draft) => { const term = draft.glossary.find((item) => item.id === termId); if (term) term.preferred = value; });
  }
});

app.addEventListener("change", (event) => {
  const input = event.target as HTMLInputElement;
  if (input.id === "chapter-file" && input.files?.[0]) {
    void input.files[0].text().then((text) => {
      commit("导入章节文本", (draft) => {
        draft.blocks = parseImportedChapter(text);
        activeBlockId = draft.blocks[0]?.id ?? "";
        activeIssueId = "";
      });
    });
  }
  if (input.id === "return-file" && input.files?.[0]) {
    const file = input.files[0];
    void file.text().then((text) => importReturnText(file.name, text));
    input.value = "";
  }
});

app.addEventListener("input", (event) => {
  const input = event.target as HTMLInputElement;
  if (input.id === "project-title") {
    project.title = input.value;
    saveSoon();
  }
});

window.addEventListener("online", render);
window.addEventListener("offline", render);
window.addEventListener("keydown", (event) => {
  const target = event.target as HTMLElement;
  if (target.matches("input, textarea, sl-input, sl-textarea, [contenteditable='true']")) return;
  const command = event.metaKey || event.ctrlKey;
  if (command && event.key.toLowerCase() === "z") {
    event.preventDefault();
    event.shiftKey ? redo() : undo();
    return;
  }
  if (command && event.key.toLowerCase() === "s") {
    event.preventDefault();
    const versionId = uid("version");
    commit("键盘保存版本", (draft) => { draft.versions.unshift({ id: versionId, label: `版本 ${draft.versions.length + 1}`, createdAt: new Date().toISOString(), blocks: structuredClone(draft.blocks), glossary: structuredClone(draft.glossary) }); });
    selectedVersionId = versionId;
    return;
  }
  if (event.key.toLowerCase() === "j" || event.key.toLowerCase() === "k") {
    const list = issues();
    if (!list.length) return;
    const current = Math.max(0, list.findIndex((issue) => issue.id === activeIssueId));
    const next = (current + (event.key.toLowerCase() === "j" ? 1 : -1) + list.length) % list.length;
    activeIssueId = list[next].id;
    activeBlockId = list[next].blockId;
    render();
  }
  if (event.key.toLowerCase() === "e") {
    const button = app.querySelector<HTMLElement>('[data-action="generate"]');
    button?.click();
  }
  if (event.key === "1") { previewMode = "normal"; render(); }
  if (event.key === "2") { previewMode = "assisted"; render(); }
});

render();

// 供对账逻辑的自动化测试使用（界面代码不调用）。
export const reviewTestApi = {
  createSeedProject,
  serializeReviewChapter,
  parseReturnFile,
  assessReturn,
  buildMergeReport,
  applyMergeToDraft,
  mergeSummary,
  MERGE_CATEGORY_META,
};
