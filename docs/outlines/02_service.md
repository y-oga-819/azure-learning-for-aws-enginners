# AWS経験者のためのAzure実践入門【公開サービス編】
## 〜スケーラビリティと公開セキュリティを備えたSaaSインフラを構築する〜

---

# 0. 本書の位置づけと設計方針

## 前提と読み方(基礎編との接続)

- 前提:【共通基礎編】で構築したミニランディングゾーン(dev/prodサブスクリプション、RBAC、ポリシー、vnet-dev/prod、Log Analyticsワークスペース、Bicepの型)
- **序章に以下を収録(基礎編未読者・経験者向けの緩和策)**:
  1. **「基礎編の到達状態」1枚構成図** — 本書はこの状態から開始する
  2. **最低限の用語ミニ対訳表** — サブスクリプション/RG/NSG/Entra ID/マネージドID など15語程度
  3. **スキップ判定チェックリスト** — 「この10項目が全部わかるなら基礎編を飛ばして本書から読んでよい」(例:リソースグループとタグの違いを説明できる、マネージドIDでキーレス接続を構成できる、NSGとSGの差を言える…)
  4. 基礎編相当を自力で用意する読者向けの最小構築手順(Bicep一式のダウンロード先)

## 題材システム

架空の公開SaaS「タスク管理サービス」

- 構成:Web API(コンテナ)+ RDB + キャッシュ + オブジェクトストレージ + 非同期処理 + 利用者ログイン
- AWSでの相当構成(読者の既存イメージ):ALB/CloudFront + ECS Fargate + RDS + ElastiCache + S3 + SQS/SNS + Cognito
- ゴール:dev環境で一式を動かし、prod環境を閉域化・冗長化・監視・自動デプロイまで仕上げる

## 各章の共通フォーマット(シリーズ共通)

リソース説明 → AWS対比 → 前章までの環境への適用 → 設計の勘所(スケーラビリティ/セキュリティ/コスト) → ハンズオン

## 学習の流れ(3フェーズ・全17章)

| フェーズ | 章 | 到達点 |
|---|---|---|
| Phase 1: 開発環境構築 | 1〜8章 | devにアプリ一式(コンピューティング〜認証基盤)が動く |
| Phase 2: 本番化 | 9〜14章 | 公開の入口・閉域化・監視・セキュリティ運用・CI/CD |
| Phase 3: 運用と完成 | 15〜17章 | IaC本格化・DR・コストで仕上げ |

---

# Phase 1: 開発環境構築 — devにアプリ一式を載せる

## 第1章 コンピューティングの選択肢 — VM / App Service / Functions / コンテナの全体地図

- **説明**:Azureのコンピューティング全体像。VM・VMSS・Bastion(IaaS)、App Service・Functions(PaaS)、Container Apps・AKS(コンテナ)の守備範囲と選定基準
- **AWS対比**:EC2/ASG/Session Manager、Beanstalk/App Runner/Lambda、ECS/EKSとの対応マップ。「ECS相当の独自オーケストレータがなく、Container Apps か AKS の二択になる」構図、「AzureではApp Serviceが主役級」という文化差
- **環境への適用**:題材SaaSの要件(スケール・コンテナ資産・運用体制)で選定プロセスを実演し、**Container Appsを主軸に採用**(App Service案・AKS案の棄却理由も明示)。検証用VM+BastionでIaaSの型も一度だけ体験(パブリックIPを付けない習慣づけ)
- **設計の勘所**:選定デシジョンツリー、Spot/サイズ体系の読み方
- **ハンズオン**:Bastion経由VM接続(体験)→以降のコンテナ路線の宣言
- ※App Serviceの詳説は社内DX編が主担当(参照を明示)。AKS詳細は本シリーズ外(別編推奨)

## 第2章 コンテナ実践 — ACR と Container Apps

- **説明**:Azure Container Registry、Container Apps(リビジョン、スケールルール、KEDA/Dapr内蔵)
- **AWS対比**:ECR/ECS Fargate/App Runnerとの対応。タスク定義⇔リビジョン、サービス⇔アプリの読み替え表
- **環境への適用**:題材APIをコンテナ化し、ACR+Container Appsでdevに配置。**マネージドIDでACRからpull**(基礎編で学んだキーレス原則の最初の実践)
- **設計の勘所**:スケールルール(HTTP同時実行数/キュー長)、最小レプリカ0のコスト効果と冷起動、イメージスキャン
- **ハンズオン**:build→push→デプロイ→スケールルールで負荷時の自動増減を観測

## 第3章 ストレージアカウント — S3と似て非なるもの

- **説明**:ストレージアカウントという「箱」、Blob/File/Queue/Table、アクセス層、SAS、冗長オプション(LRS/ZRS/GRS)
- **AWS対比**:Blob⇔S3、Files⇔EFS/FSx、Queue⇔簡易SQS。最大の違い=バケット単位のS3に対し、冗長性・ネットワーク設定が「アカウント単位」になること。署名付きURL⇔SAS
- **環境への適用**:添付ファイル保存先としてBlobを追加。マネージドID+RBACでアクセスし、アクセスキーを無効化
- **設計の勘所**:冗長オプション選定、パブリックアクセス禁止の徹底、ライフサイクル管理
- **ハンズオン**:Blob作成→アプリからアップロード→SAS発行体験

## 第4章 データベース — Azure SQL / PostgreSQL Flexible Server / Cosmos DB

- **説明**:Azure SQL Database(DTU/vCore・サーバーレス・自動チューニング)、PostgreSQL/MySQL Flexible Server、Cosmos DBの位置づけと概説
- **AWS対比**:RDS/Auroraとの対応、「Azure SQLはRDSよりマネージド度が高い」。Cosmos DB⇔DynamoDBは対応表+概説に留め、パーティション設計等の深掘りはアプリアーキテクチャ編第6章へ(責務分離の明示)
- **環境への適用**:PostgreSQL Flexible ServerをVNet統合でdevに追加。接続文字列は次々章Key Vaultへの伏線
- **設計の勘所**:vCore/DTUの選び方、自動バックアップとPITR、Entra ID認証でのDB接続
- **ハンズオン**:構築→アプリから接続→PITRの動作確認

## 第5章 Key Vault — シークレットと鍵の一元管理

- **説明**:シークレット/キー/証明書、RBACモード、ソフトデリートとパージ保護
- **AWS対比**:Secrets Manager+KMS+ACMを1つに束ねた存在。ローテーション設計の差
- **環境への適用**:DB接続情報等をKey Vaultへ移し、Container Appsからマネージドイ IDで参照。「コードにも環境変数にも生シークレットがない」状態を完成
- **設計の勘所**:RBACモード推奨、監査ログ、prodのパージ保護必須
- **ハンズオン**:シークレット登録→アプリの参照切替→ローテーション演習

## 第6章 キャッシュ — Azure Cache for Redis(新章)

- **説明**:Azure Cache for Redis の階層(Basic/Standard/Premium/Enterprise)と新世代 Azure Managed Redis、VNet統合/Private Endpoint対応、クラスタリング
- **AWS対比**:ElastiCache(Redis OSS/Valkey)との対応。Valkeyフォーク以降のエンジン事情とAzure側の現状(執筆時に最新確認の注記)、ノード/シャード概念の読み替え
- **環境への適用**:題材のセッション・重い集計結果のキャッシュ先としてdevに追加。マネージドID(Entra ID認証)接続
- **設計の勘所**:SKU選定とメモリ見積もり、エビクションポリシー、可用性(レプリカ)
- **ハンズオン**:構築→アプリからcache-asideの最小実装→ヒットの確認
- ※キャッシュ設計パターン(無効化戦略・分散ロック等)の深掘りはアプリアーキテクチャ編第5章へ

## 第7章 メッセージングとイベント — Service Bus / Event Grid / Event Hubs(新章)

- **説明**:Service Bus(キュー/トピック、DLQ、セッション)、Event Grid(イベントルーティング)、Event Hubs(ストリーム)の三兄弟の使い分け、Storage Queue(第3章)との棲み分け
- **AWS対比**:SQS/SNS/EventBridge/Kinesisとの対応表(本書で最も需要の高い対比の一つ)。標準/FIFOキュー⇔Service Busの機能対応
- **環境への適用**:通知送信を同期APIから剥がし、Service Busキュー+**Functionsコンシューマ**に移行(Functionsの実践はここで担当)。マネージドIDで送受信
- **設計の勘所**:三兄弟+Storage Queueの選定デシジョンツリー、DLQ監視、少なくとも1回配信の前提
- **ハンズオン**:キュー構築→Functionsトリガー実装→DLQへの落ち方を観察
- ※Outbox・サーガ等の設計パターンはアプリアーキテクチャ編第8章へ

## 第8章 Entra External ID — サービス利用者の認証基盤(新章)

- **説明**:External ID(旧Azure AD B2C)の位置づけ、**社員用テナントとは別物である**こと(最重要)、サインアップ/サインインフロー、ソーシャルログイン、MFA、カスタムブランディング、MAU課金
- **AWS対比**:Cognito User Poolsとの対応。ユーザープール⇔External IDテナント、Hosted UI⇔ブランディング、料金体系の違い。※B2C→External IDの移行期のため情報流動性に注意(執筆時最新確認の注記)
- **環境への適用**:題材SaaSにログイン機能を追加。APIはトークン検証まで実装
- **設計の勘所**:**トークンを受け取るまでが本書(インフラ)の範囲、その先の認可ロジックはアプリアーキテクチャ編第3章の範囲**という線引きを明示
- **ハンズオン**:テナント作成→サインアップフロー構成→ソーシャルログイン→APIのトークン検証
- **Phase 1完了時点の構成図**:dev一式(Container Apps + PostgreSQL + Redis + Blob + Service Bus + Key Vault + External ID)

---

# Phase 2: 本番化 — 公開・閉域化・監視・運用

## 第9章 負荷分散と配信 — Front Door / Application Gateway / Load Balancer

- **説明**:Load Balancer(L4)、Application Gateway(L7+WAF)、Front Door(グローバルCDN+WAF)、Traffic Manager、Azure DNS
- **AWS対比**:NLB/ALB/CloudFront/Global Accelerator/Route 53との対応。「Front Door ≒ CloudFront+Global Accelerator+WAF」という束ね方、選定デシジョンツリー
- **環境への適用**:prod用構成を構築開始。Front Door(WAF付き)→Container Appsの入口、カスタムドメイン+マネージド証明書。External IDとの関係(認証はアプリ層で行い、Front DoorはWAF・配信に徹する構成)を整理
- **設計の勘所**:WAFポリシー(OWASP/ボット対策)、TLS終端位置、DDoS Protection
- **ハンズオン**:Front Door構成→WAFルールのブロック確認

## 第10章 API Management — APIの公開と統制(新章)

- **説明**:API Management の製品/サブスクリプションキー/ポリシー(レート制限・変換・検証)、開発者ポータル、SKU(Consumption〜Premium)
- **AWS対比**:API Gateway(usage plan/APIキー/ステージ)との対応。「製品」という束ね概念、Consumption⇔HTTP API の対応感覚
- **環境への適用**:公開APIの入口としてAPIMを配置(Front Doorとの役割分担図)。レート制限・サブスクリプションキー発行までを構築
- **設計の勘所**:APIMを入れる/入れない判断基準(コストと規模)、認証の二重化を避ける構成
- **ハンズオン**:API取り込み→レート制限ポリシー→キー発行と疎通
- ※プラン別レート制限などビジネスロジックとしての活用はアプリアーキテクチャ編第4章へ

## 第11章 Private Endpoint — 本番のネットワーク閉域化

- **説明**:Private Endpoint / Private Link、サービスエンドポイントとの違い、プライベートDNSゾーン
- **AWS対比**:VPC Interface/Gateway Endpointとの対応。**AzureのPaaSは既定でパブリックのため、閉域化の重要度がAWS以上に高い**(基礎編第4章で張った伏線の回収。Azure案件のセキュリティ指摘最頻出ポイント)
- **環境への適用**:prodのDB・Redis・Blob・Key Vault・ACR・Service Busをすべて Private Endpoint化し、パブリックアクセス遮断。プライベートDNSゾーンを整理
- **設計の勘所**:DNSゾーンの集約管理、devはどこまでやるかの費用対効果
- **ハンズオン**:Blobを閉域化→パブリック経路遮断の確認→DNS解決の観察

## 第12章 監視の実践 — Application Insights とアラート設計

- **説明**:Application Insights(分散トレース・可用性テスト)、診断設定の総点検、アラートとアクショングループ、KQL実践
- **AWS対比**:CloudWatch Alarms+X-Rayとの対応。基礎編第5章で作ったワークスペースに全prodリソースを載せる「集約文化」の完成形
- **環境への適用**:APIにApp Insights組み込み、SLO的アラート(可用性・レイテンシ・エラー率)、Service Bus DLQ滞留アラート
- **設計の勘所**:サンプリングとコスト、アラート疲れを防ぐしきい値設計
- **ハンズオン**:障害を意図的に起こし、トレースで原因区間を特定→アラート発報
- ※アプリ側の構造化ログ・相関ID設計はアプリアーキテクチャ編第12章へ

## 第13章 セキュリティ運用 — Defender for Cloud と Sentinel

- **説明**:Defender for Cloud(CSPM+ワークロード保護)、セキュアスコア、Sentinel(SIEM/SOAR)概要
- **AWS対比**:Security Hub+GuardDuty+Inspector ≒ Defender for Cloud。Sentinel相当の統合SIEMはAWS標準にない構図
- **環境への適用**:prodにDefenderプランを有効化し、セキュアスコアの指摘に沿って是正(**これまでの全章の設計の答え合わせ**として機能する構成)
- **設計の勘所**:Defenderプランのコスト判断、Sentinel導入の要否基準
- **ハンズオン**:セキュアスコア確認→推奨事項を2〜3件是正

## 第14章 CI/CD — GitHub Actions で dev→prod パイプライン

- **説明**:GitHub ActionsとOIDC連携(フェデレーション資格情報)、環境と承認ゲート、Azure DevOpsの位置づけ
- **AWS対比**:CodePipeline文化との違い(AzureはGitHub/Azure DevOps主流)、OIDC連携はAWSのGitHub OIDCと同じ発想
- **環境への適用**:push→dev自動デプロイ→承認→prodデプロイ。デプロイ用IDは最小権限+シークレットレス
- **設計の勘所**:ブランチ保護、環境承認、コンテナのリビジョン分割による安全なロールアウト
- **ハンズオン**:一連のパイプラインを構築し通しで体験

---

# Phase 3: 運用と完成

## 第15章 IaC本格化 — Bicepモジュールで全環境をコード化

- **説明**:モジュール分割、パラメータによるdev/prod差分表現、what-if運用、CI/CDへの組み込み(基礎編第6章の「型」からの本格化)
- **AWS対比**:CFnネステッドスタック/CDK Constructとの対応
- **環境への適用**:本書で作った全リソースをモジュール化し、「prodはパイプライン経由でのみ変更可」の統制を確立。ポータルで作ったものをIaC化する現実的ワークフローも正面から扱う
- **ハンズオン**:主要モジュール化→what-if→パイプラインからのデプロイ

## 第16章 可用性・DR・バックアップとコスト管理

- **説明**:ゾーン冗長設計の総まとめ、Azure Backup、geo冗長とリージョンペア、Cost Management詳細、予約/節約プラン
- **AWS対比**:Multi-AZ/AWS Backup/RI・Savings Plansとの対応。東日本⇔西日本ペアがDR設計に与える影響(AWSにない制約)
- **環境への適用**:prodをゾーン冗長に見直し、RTO/RPOを定義した簡易DR計画、予約購入の試算
- **設計の勘所**:コストと可用性のトレードオフ表(松竹梅)
- **ハンズオン**:バックアップからのリストア演習、コスト分析とタグ別配賦

## 第17章 総仕上げ — 完成構成とWell-Architectedレビュー

- **説明**:完成した全体構成図(基礎編の土台+本書のワークロード層の二層で描く)、Well-Architected 5本柱でのセルフレビュー
- **AWS対比**:AWS Well-Architectedレビュー経験の読み替えガイド
- **残課題と次の一歩**:AKS本格導入、マルチリージョン展開、そして**アプリアーキテクチャ編へ**(キャッシュ戦略・NoSQL設計・イベント駆動パターンの深掘りが待っている旨の接続)
- **ハンズオン**:構成図作成とセルフアセスメント

---

# 付録

- **付録A:AWS⇔Azureサービス対応表(公開サービス版)** — 本編掲載+未掲載サービスの逆引き
- **付録B:AWS経験者がハマる落とし穴トップ10** — 各章の「決定的な違い」総集編
- **付録C:料金の考え方の違い** — 課金単位・無料枠・見積もりツール比較
- **付録D:資格ロードマップ** — AZ-900/104/204/305 と基礎編・本書の章対応
- **付録E:本書スキップ判定の解答集** — 序章チェックリストの解説(基礎編の該当章へのリンク付き)

---

# 補足:本書の設計判断(トレードオフ)

1. **基礎トピックは基礎編に委ね、本書はワークロード構築に集中する**:全体像・Entra ID・ガバナンス・VNetといった土台は基礎編が担い、本書はRedis/メッセージング/External ID/APIMを核に据えた全17章構成とする。基礎との重複を避け、すべてをワークロード構築に充てる。想定分量350〜400p。
2. **VM/App Service/Functionsを第1章「選択肢の地図」に統合**:App Service詳説は社内DX編、Functions実践は第7章(キューコンシューマ)に分担させ、重複を避けつつ体験は残す。App Serviceの読者価値は、シリーズ全体では社内DX編でより深く回収される。
3. **Cosmos DB・AI Searchは対応表+概説に留める**:設計とプロビジョニングが不可分なため、アプリアーキテクチャ編を主担当とする(第4章・各章に参照を明記)。「本書だけ読むと検索機能が作れない」という穴は、付録Aの対応表と参照導線で明示的に案内。
4. **序章のスキップ判定チェックリスト**:基礎編未読者の離脱防止と、経験者の重複回避を両立する緩和策。判定の解答を付録Eに置き、単なる門前払いにしない。
