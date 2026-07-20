# AWS経験者のためのAzure実践入門【共通基礎編】

AWS の知識があるエンジニアが、AWS との比較を交えながら Azure のミニランディングゾーン(ID・ガバナンス・ネットワーク・監視・IaC の土台)をハンズオン形式で構築する技術書の、**原稿・組版リポジトリ**です。技術書典での頒布を想定しています。

- 原稿は Markdown で管理し、[Vivliostyle](https://vivliostyle.org/) で組版して PDF を生成します。
- シリーズ全4冊の第1冊目です(続巻:公開サービス編 / 社内DX編 / アプリケーションアーキテクチャ編)。

## ディレクトリ構成

```
.
├── README.md                 # このファイル
├── CLAUDE.md                 # AI アシスタント向け執筆ルール
├── docs/outlines/            # アウトライン(設計書。凍結扱い)
├── manuscripts/              # 本文(章・付録・まえがき・奥付)
├── shared/                   # glossary / style-guide / state(単一情報源)
├── handson-logs/             # 章ごとの検証ログ・スクショ置き場
├── assets/figures/           # 構成図などの画像
├── themes/techbook/          # CSS 組版テーマ
├── scripts/                  # CI 補助スクリプト(リンク切れ・要検証チェック)
├── vivliostyle.config.js     # 組版設定(章の並び順・出力)
├── prh.yml / .textlintrc.json# 表記ゆれ・文体チェック設定
└── .github/workflows/        # CI(lint / build / PR プレビュー)
```

## セットアップ

Node.js 20 以上を推奨します。

```bash
npm install
```

## よく使うコマンド

| コマンド | 内容 |
|---|---|
| `npm run build` | `manuscripts/` を束ねて `output/azure-kyotsu-kiso.pdf` を生成 |
| `npm run preview` | ブラウザで組版結果をライブプレビュー |
| `npm run lint` | textlint(表記ゆれ・文体・技術文書ルール) |
| `npm run lint:fix` | textlint の自動修正 |
| `npm run check:links` | 原稿内のローカルリンク・画像参照の切れチェック |
| `npm run check:todo` | `<!-- 要検証 -->` マーカーの残存集計 |

## 執筆フロー

1. `docs/outlines/` のアウトライン(凍結)を確認する。
2. アウトラインから詳細プロットを詰める。
3. ハンズオンを自分の Azure 環境で実行し、ログを `handson-logs/chXX/` に保存する。
4. ドラフトを生成する(`CLAUDE.md` のルールが自動適用される)。節単位でレビューする。
5. セルフレビュー・加筆のあと、校正する(表記ゆれ・用語集準拠・前章との整合・`shared/state.md` 更新確認)。
   - レビュー用スキル `chapter-review` / `book-consistency` を活用できます。
6. `npm run lint && npm run check:links && npm run build` が通ることを確認し、PR を作成する。
7. `<!-- 要検証 -->` が残ったままの章はマージしない運用を徹底する。

## CI(GitHub Actions)

`main` への push と PR で、以下が自動実行されます。

| ワークフロー | 内容 | PR を落とすか |
|---|---|---|
| **lint**(`lint.yml`) | textlint、リンク切れチェック、要検証マーカーの集計レポート | textlint / リンク切れは失敗で落とす。要検証はレポートのみ |
| **build-pdf**(`build-pdf.yml`) | Vivliostyle で PDF をビルドし Artifact 保存。PR では PDF(zip)のダウンロード直リンクを PR にコメント | ビルド失敗(リンク切れ・設定エラー)で落とす |

生成された PDF は各実行の **Artifacts** からダウンロードできます。PR では、その PR の PDF(zip)への**ダウンロード直リンク**が自動でコメントされるので、PDF を直接開いてレイアウトを PR 単位で確認できます。

## 執筆ルール

AI・人間ともに、原稿を書くときは [`CLAUDE.md`](./CLAUDE.md) と [`shared/style-guide.md`](./shared/style-guide.md) に従ってください。用語は [`shared/glossary.md`](./shared/glossary.md) が単一情報源です。
