// Vivliostyle 組版設定
// manuscripts/ 配下の章を「本書の並び順」で束ねて 1 冊の PDF を生成する。
// 章を追加・並び替えするときは entry 配列を編集する(ファイル名順ではなくこの配列順が正)。

export default {
  title: 'AWS経験者のためのAzure実践入門【共通基礎編】',
  author: 'y-oga-819',
  language: 'ja',
  size: 'A5',
  theme: './themes/techbook/theme.css',

  // 目次を自動生成する。level 1〜2 の見出し(章・節)を拾う。
  toc: {
    title: '目次',
    htmlPath: 'index.html',
    sectionDepth: 2,
  },

  // 章番号は原稿側の見出し(# 第N章 …)で表現し、CSS の counter でも装飾する。
  entry: [
    'manuscripts/ch00-preface.md',
    'manuscripts/ch01.md',
    'manuscripts/ch02.md',
    'manuscripts/ch03.md',
    'manuscripts/ch04.md',
    'manuscripts/ch05.md',
    'manuscripts/ch06.md',
    'manuscripts/ch07.md',
    'manuscripts/appendix-a.md',
    'manuscripts/appendix-b.md',
    'manuscripts/appendix-c.md',
    'manuscripts/appendix-d.md',
    'manuscripts/appendix-e.md',
    'manuscripts/colophon.md',
  ],

  output: [
    {
      path: 'output/azure-kyotsu-kiso.pdf',
      format: 'pdf',
    },
  ],

  workspaceDir: '.vivliostyle',
};
