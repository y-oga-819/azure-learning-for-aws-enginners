# 要検証ホットスポット 見積もり(第2冊【公開サービス編】)

本書はまだ原稿がないため、`<!-- 要検証 -->` の実マーカー棚卸し(→ 1巻の `verification-inventory.md`)はまだ作れません。本書は**執筆前の見積もり**として、「どの章が製品情報の陳腐化リスクを多く抱えるか」を先に洗い出したものです。ねらいは、章を書き始めるときに **handson-logs の取得と公式Doc確認の優先順位**を即決できるようにすることです。

- 分類は 1 巻と共通:**A. 公式Doc確認型** / **B. handson-logs 実機検証型** / **C. 発行時確定型**。
- 原稿が育ったら、本ファイルは 1 巻同様の**行番号つき実マーカー棚卸し**へ差し替えます。
- リスク級は、製品の SKU 再編・GA/プレビュー・移行期・料金改定など「執筆時点と発行時点でズレやすい度合い」です。

## 章別ホットスポット一覧

| 章 | リスク級 | 主な陳腐化ポイント(執筆時に公式Docで要確認) | 主な型 |
|---|:---:|---|:---:|
| 第1章 コンピューティング選択 | 中 | 各コンピューティングの位置づけ・SKU 体系、Container Apps/AKS の最新の守備範囲 | A |
| 第2章 ACR / Container Apps | 中 | スケールルール仕様、最小レプリカ 0 の課金・冷起動、KEDA/Dapr 同梱状況 | A/B |
| 第3章 ストレージ(Blob) | 低〜中 | 冗長オプション名(LRS/ZRS/GRS)、アクセス層、SAS の推奨 | A |
| 第4章 PostgreSQL Flexible Server | 中 | vCore/SKU 階層、対応 PostgreSQL バージョン、Entra ID 認証の対応状況 | A/B |
| 第5章 Key Vault | 低 | RBAC モード推奨、パージ保護(比較的安定) | A |
| **第6章 Azure Cache for Redis** | **高** | **Azure Managed Redis の GA/SKU、Valkey・エンジン事情、階層再編、Entra ID 認証接続** | A/B |
| 第7章 メッセージング三兄弟 | 中 | 各サービスの SKU/クォータ、Functions の実行モデル(Flex Consumption 等)と課金 | A/B |
| **第8章 Entra External ID** | **高** | **B2C → External ID の移行状況、MAU 課金、機能パリティ、GA/プレビュー** | A/B |
| 第9章 Front Door / AppGW / LB | 中〜高 | Front Door の SKU(Standard/Premium)、WAF ルールセット版、DDoS Protection の課金 | A |
| **第10章 API Management** | **高** | **SKU 再編(Consumption〜Premium、v2 階層)、課金、SKU 別の機能差** | A |
| 第11章 Private Endpoint | 低〜中 | Private Endpoint 対応サービスの範囲、プライベート DNS ゾーン名の一覧 | A/B |
| 第12章 Application Insights | 中 | ワークスペースベースの課金・サンプリング、可用性テストの現行仕様 | A/B |
| 第13章 Defender / Sentinel | 中〜高 | Defender プラン構成と課金、Sentinel の課金モデル(統合の動きに注意) | A |
| 第14章 CI/CD(GitHub Actions) | 中 | フェデレーション資格情報(OIDC)の手順、環境・承認ゲートの現行仕様 | A/B |
| 第15章 IaC(Bicep) | 低〜中 | Bicep 最小バージョン、what-if の出力、デプロイスタックの GA 状況 | A/B |
| 第16章 可用性・DR・バックアップ | 中 | ゾーン冗長の対応サービス、リージョンペア方針、Azure Backup 対応範囲 | A |
| 第17章 コスト管理 | 中〜高 | 予約(Reserved)/節約プランの対象・条件、無料枠、各リソースの料金 | A |
| 第18章 総仕上げ | 低 | Well-Architected 5 本柱の最新表記(発行直前の最終確認) | A/C |

## 特に重い 3 章(先に裏取り計画を立てる)

以下は「執筆時点と発行時点でズレる」事故が起きやすい最重要ホットスポットです。**本文を書く前に最新の公式Docと GA/プレビュー状況を確認**し、該当箇所に必ず `<!-- 要検証: 公式Doc確認 -->` を付けてください。

1. **第6章 Redis** — Azure Managed Redis という新世代が登場し、従来の Basic/Standard/Premium/Enterprise との関係・GA 状況・推奨が動いています。「どれを勧めるか」を執筆時点で断定せず、最新確認の注記を厚めに。
2. **第8章 External ID** — Azure AD B2C から Entra External ID への移行期で、名称・機能・課金(MAU)・GA 状況の情報が流動的です。**社員テナントとは別物**という本書の最重要ポイントも、UI/用語が変わりやすいので実機で確認。
3. **第10章 API Management** — SKU 体系(Consumption〜Premium、v2 階層)と課金・機能差が改定されやすい領域です。「APIM を入れる/入れない」の判断基準がコスト前提に依存するため、料金の裏取りが本文の説得力に直結します。

## handson-logs 取得の推奨順序

B 型(実機検証)は章の構築手順を 1 周流せばまとめて潰れます。題材(TicketWave)を dev に積み上げる **Phase 1(第2〜8章)の順に実機ログを取る**のが、依存関係とも一致して最短です。

1. **第2章**(ACR + Container Apps)— 以降すべての土台。ここが動かないと後続が取れない
2. **第4章**(PostgreSQL)→ **第3章**(Blob)→ **第5章**(Key Vault)— データとシークレットの基盤
3. **第6章**(Redis)→ **第7章**(メッセージング)— 在庫・決済の実機挙動(DLQ の落ち方など実文言が要る)
4. **第8章**(External ID)— サインアップ/トークン検証フローの実機スクショ
5. Phase 2 以降は prod 構成の実機ログ(第9・11章の閉域化まわりは DNS 解決の実出力が要る)
