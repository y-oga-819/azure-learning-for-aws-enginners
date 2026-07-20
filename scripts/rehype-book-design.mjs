// rehype-book-design — 組版デザイン用の HAST 変換プラグイン
//
// 原稿(manuscripts/*.md)には一切手を入れず、ビルド時に見出しの構造だけを
// 組み替えて「本としてのデザイン」を作るためのプラグイン。担当は次の3つ。
//
//  1. 節見出し(h2)の2行化
//     「概要 ── テナントから続く4階層とARM」を
//        <span class="sec-label">概要</span>           … 定型ラベル(1行目)
//        <span class="sec-sub">テナントから続く…</span> … 章固有のサブ説明(2行目)
//     に分解する(区切りは全角ダッシュ ──)。見た目の2行組みは theme.css が担当。
//
//  2. 章見出し(h1)の分解
//     「第1章 Azureの全体像 — AWSと何が根本的に違うのか」を
//     章ラベル(第1章)/主題(Azureの全体像)/サブタイトル(— の後ろ)に分ける。
//
//  3. 章扉(オープナー)の生成
//     各章(第N章)の先頭に「この章の流れ」ミニ目次を差し込み、扉ページを作る。
//     章内の節ラベル+サブ説明を一覧化し、その章がどう進むかを1ページで見せる。
//
// 原稿の凍結された構成(5部構成・節見出しの文言)には触れないため、
// CLAUDE.md / style-guide.md の執筆ルールと衝突しない。

const SEC_SEP = /\s*──+\s*/; // 節見出しの区切り(全角ダッシュ ──)
const CHAP_SEP = /\s*[—―]\s*/; // 章見出しの区切り(emダッシュ —)
const CHAP_LABEL = /^\s*(第\d+章|付録[0-9A-Za-z])\s+(.*)$/; // 「第N章 」「付録X 」

function classesOf(node) {
  const c = node && node.properties && node.properties.className;
  if (!c) return [];
  return Array.isArray(c) ? c : String(c).split(/\s+/);
}

function hasClass(node, name) {
  return classesOf(node).includes(name);
}

function textOf(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value;
  if (node.children) return node.children.map(textOf).join('');
  return '';
}

function span(className, value) {
  return {
    type: 'element',
    tagName: 'span',
    properties: { className: [className] },
    children: [{ type: 'text', value }],
  };
}

function sepSpan(value) {
  return {
    type: 'element',
    tagName: 'span',
    properties: { className: ['sec-sep'] },
    children: [{ type: 'text', value }],
  };
}

// 直下の子から最初の該当タグを返す
function firstChild(node, tagName) {
  return (node.children || []).find(
    (c) => c.type === 'element' && c.tagName === tagName
  );
}

// 節見出しテキストを「ラベル / サブ」に分解する
function splitSection(text) {
  const parts = text.split(SEC_SEP);
  return { label: parts[0].trim(), sub: parts.slice(1).join(' ').trim() };
}

// h2 を「ラベル / サブ」の2行に組み替える
function transformH2(h2) {
  const { label, sub } = splitSection(textOf(h2).trim());
  if (!sub) {
    h2.children = [span('sec-label', label)]; // 区切りなし(まえがき等)
    return;
  }
  h2.children = [span('sec-label', label), sepSpan(' ── '), span('sec-sub', sub)];
}

// h1 を「章ラベル / 主題 / サブタイトル」に組み替える
function transformH1(h1) {
  const text = textOf(h1).trim();
  const m = text.match(CHAP_LABEL);
  const numLabel = m ? m[1] : '';
  const rest = m ? m[2] : text;
  const parts = rest.split(CHAP_SEP);
  const title = parts[0].trim();
  const subtitle = parts.slice(1).join(' — ').trim();

  const children = [];
  if (numLabel) children.push(span('chap-num', numLabel));
  children.push(span('chap-title', title));
  if (subtitle) children.push(span('chap-subtitle', subtitle));
  h1.children = children;
  return { numLabel, title, subtitle };
}

// 章内の節見出しからミニ目次(この章の流れ)を組み立てる
function buildChapterOutline(level2Sections) {
  const items = level2Sections
    .map((sec) => firstChild(sec, 'h2'))
    .filter(Boolean)
    .map((h2) => {
      const { label, sub } = splitSection(textOf(h2).trim());
      const li = {
        type: 'element',
        tagName: 'li',
        properties: {},
        children: [span('o-label', label)],
      };
      if (sub) li.children.push(span('o-sub', sub));
      return li;
    });

  return {
    type: 'element',
    tagName: 'nav',
    properties: { className: ['chapter-outline'], 'aria-label': 'この章の流れ' },
    children: [
      {
        type: 'element',
        tagName: 'p',
        properties: { className: ['chapter-outline-caption'] },
        children: [{ type: 'text', value: 'この章の流れ' }],
      },
      { type: 'element', tagName: 'ol', properties: {}, children: items },
    ],
  };
}

function processLevel1(section) {
  const h1 = firstChild(section, 'h1');
  if (!h1) return;
  const info = transformH1(h1);

  const level2Sections = (section.children || []).filter(
    (c) => c.type === 'element' && c.tagName === 'section' && hasClass(c, 'level2')
  );
  level2Sections.forEach((sec) => {
    const h2 = firstChild(sec, 'h2');
    if (h2) transformH2(h2);
  });

  // 「第N章」かつ節を持つものだけ扉を作る(付録・まえがき・奥付は対象外)
  const isChapter = /^第\d+章/.test(info.numLabel);
  if (isChapter && level2Sections.length > 0) {
    section.properties = section.properties || {};
    section.properties.className = [...classesOf(section), 'chapter'];
    const outline = buildChapterOutline(level2Sections);
    const h1Index = section.children.indexOf(h1);
    section.children.splice(h1Index + 1, 0, outline);
  }
}

function visitSections(node) {
  if (!node || !node.children) return;
  for (const child of node.children) {
    if (
      child.type === 'element' &&
      child.tagName === 'section' &&
      hasClass(child, 'level1')
    ) {
      processLevel1(child);
    }
    visitSections(child);
  }
}

export default function rehypeBookDesign() {
  return (tree) => {
    visitSections(tree);
  };
}
