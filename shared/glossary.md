# 用語集・表記ルール(単一情報源)

本ファイルはシリーズ全体で参照する **用語の単一情報源(Single Source of Truth)** です。原稿・付録・図版の表記はすべてここに従います。機械チェック用の表記ルールは `prh.yml` にも同じ内容を反映しています(どちらかを更新したら両方を揃えること)。

## AWS ⇔ Azure 対訳表

| 分類 | AWS | Azure | 補足(似て非なる点) |
|---|---|---|---|
| アカウント体系 | アカウント | サブスクリプション | どちらも課金・ポリシー境界。Azure はさらに上位にテナント/管理グループがある |
| 組織管理 | Organizations / OU | 管理グループ | 階層で継承する点は同じ |
| 論理グルーピング | (CFn スタック + タグ) | リソースグループ | AWS に完全な対応物はない |
| ID 基盤 | IAM | Microsoft Entra ID | ID がアカウント内ではなくテナントに存在する |
| 認可 | IAM ポリシー(JSON) | Azure RBAC(ロール + スコープ) | 「組み込みロール + スコープ」で考える |
| 一時権限昇格 | (なし / 都度 AssumeRole) | PIM(Privileged Identity Management) | 特権の JIT 昇格 |
| ワークロード ID | インスタンスプロファイル / IRSA | マネージド ID | 「キー認証を根絶する」文化の中心 |
| ガバナンス | SCP + AWS Config | Azure Policy | SCP は上限設定、Policy は監査・強制・修復まで |
| 仮想ネットワーク | VPC | 仮想ネットワーク(VNet) | パブリック/プライベートサブネットの明確な区別がない |
| サブネット | サブネット | サブネット | — |
| ファイアウォール | セキュリティグループ / NACL | NSG(ネットワークセキュリティグループ) | NSG はサブネットと NIC の両方に付く |
| ルーティング | ルートテーブル | ルートテーブル(UDR) | — |
| ハブ接続 | Transit Gateway | Hub-Spoke + VNet ピアリング | — |
| プライベート接続 | VPC エンドポイント | Private Endpoint | Azure の PaaS は既定でパブリック公開のため重要度が高い |
| メトリック | CloudWatch Metrics | Azure Monitor メトリック | — |
| ログ集約 | CloudWatch Logs | Log Analytics ワークスペース | 「全ログを 1 ワークスペースに集約」する設計文化 |
| 監査証跡 | CloudTrail | アクティビティログ | — |
| ログクエリ | Logs Insights | KQL(Kusto Query Language) | — |
| コスト管理 | Cost Explorer / Budgets | Cost Management + 予算 | — |
| IaC | CloudFormation / CDK | Bicep(ARM テンプレート) | Bicep ≒ CFn の人間に優しい DSL。状態は ARM が持つ |
| 大規模統制 | Control Tower / LZA | ランディングゾーン / LZ Accelerator | — |
| コンテナレジストリ | ECR | Azure Container Registry(ACR) | — |
| コンテナ実行(サーバーレス) | ECS Fargate / App Runner | Container Apps | ECS 相当の独自オーケストレータはなく、Container Apps か AKS の二択 |
| PaaS ホスティング | Elastic Beanstalk | App Service | 詳説は社内DX編が主担当 |
| 関数 | Lambda | Azure Functions | — |
| オブジェクトストレージ | S3 | Blob Storage(ストレージアカウント) | 冗長・ネットワーク設定がバケットではなくアカウント単位 |
| 署名付きアクセス | 署名付き URL(S3) | SAS(Shared Access Signature) | — |
| リレーショナル DB | RDS / Aurora | Azure SQL Database / PostgreSQL Flexible Server | Azure SQL は RDS よりマネージド度が高い |
| NoSQL | DynamoDB | Cosmos DB | 深掘りはアプリアーキテクチャ編が主担当 |
| シークレット管理 | Secrets Manager + KMS + ACM | Key Vault | 3 つを 1 つに束ねた存在 |
| キャッシュ | ElastiCache(Redis / Valkey) | Azure Cache for Redis | 初出は「Azure Cache for Redis」、以降は Redis で可 |
| メッセージキュー | SQS | Service Bus(キュー/トピック) | 標準/FIFO キュー ⇔ Service Bus の機能対応 |
| Pub/Sub・イベント通知 | SNS / EventBridge | Event Grid | — |
| ストリーム | Kinesis | Event Hubs | — |
| 顧客認証(CIAM) | Cognito User Pools | Entra External ID | 社員用テナント(Entra ID)とは別物 |
| グローバル配信 + WAF | CloudFront + Global Accelerator + WAF | Front Door | 「Front Door ≒ CloudFront + Global Accelerator + WAF」 |
| L7 ロードバランサ | ALB | Application Gateway | WAF 付き |
| L4 ロードバランサ | NLB | Load Balancer | — |
| DNS | Route 53 | Azure DNS | — |
| API 管理 | API Gateway | API Management(APIM) | 「製品」で API を束ねる概念 |
| APM・分散トレース | X-Ray | Application Insights | — |
| セキュリティ統合 | Security Hub + GuardDuty + Inspector | Defender for Cloud | — |
| SIEM / SOAR | (標準に相当なし) | Microsoft Sentinel | AWS 標準に統合 SIEM の相当物がない |
| CI/CD | CodePipeline | GitHub Actions / Azure DevOps | Azure は GitHub / Azure DevOps が主流 |
| ゾーン冗長 | Multi-AZ | 可用性ゾーン(ゾーン冗長) | — |
| バックアップ | AWS Backup | Azure Backup | — |
| 割引購入 | RI / Savings Plans | 予約(Reserved)/ 節約プラン(Savings Plan) | — |

> 用語の初出時のみ英語併記します(例:「マネージド ID(Managed Identity)」)。2 回目以降は日本語表記のみで構いません。
> **初出は各章側で行います。まえがき(front-matter)は初出展開の対象に含めません**(まえがきで併記済みでも、各章の初出で改めて完全形を示します)。
> 広く定着した略語(`API` / `URL` / `CPU` / `CI/CD` / `SKU` / `NACL` / `IaaS` / `PaaS` / `SaaS` など)は、完全形の展開を省略できます(任意で展開しても構いません。例:IaaS)。
> 予告的に触れた章と、その用語を実質的に解説する章の両方で再展開しても構いません(再登場時の再提示は読者に親切)。ただし**同一用語の展開形(英語・和訳)は全編で統一**します(例:DR は「ディザスタリカバリ(DR)」で統一)。

## 表記ルール表

正表記に統一し、誤表記は使いません。機械チェックは `prh.yml` が担当します。

| 正表記 | 使ってはいけない表記 | 備考 |
|---|---|---|
| Entra ID | `Azure AD` / `AzureAD` / `Azure Active Directory` | 旧称は使わない |
| リソースグループ | `リソース・グループ` / `リソース グループ` | 中黒・空白を入れない |
| 仮想ネットワーク(VNet) | `バーチャルネットワーク` | 初出は日本語+VNet 併記 |
| NSG | `ネットワークセキュリティグループ(NSG)` を毎回展開 | 初出のみ展開、以降は NSG |
| Log Analytics ワークスペース | `ログアナリティクス` | 製品名は英語表記 |
| Bicep | `bicep` / `BICEP` | 先頭大文字 |
| ハンズオン | `ハンズ・オン` | — |
| ランディングゾーン | `ランディング・ゾーン` | — |
| ロールベースのアクセス制御 | `ロールベースアクセス制御` | RBAC の初出併記の和訳。初出は「RBAC(Role-Based Access Control、ロールベースのアクセス制御)」、以降は RBAC |
| Cosmos DB | `CosmosDB` | 空白を入れる |
| Front Door | `フロントドア` / `FrontDoor` | 製品名は英語表記、空白を入れる |
| Application Insights | `アプリケーションインサイト` / `ApplicationInsights` | 製品名は英語表記 |
| API Management | `APIManagement` | 略記は APIM。初出は「API Management(APIM)」 |
| オーバーセル | `オーバーセール` / `売り越し` / `過剰販売` | 在庫を超えて販売してしまうこと。題材の中心語 |
| 主催者 | `オーガナイザー` | 題材のアクター名(イベントを公開する側) |

> 上表の「使ってはいけない表記」はインラインコード(`` `…` ``)で書いています。これは textlint の prh チェックに誤検知させないための措置です。本文中で実際に使う場合はコードにせず、正表記のみを書いてください。

## 題材システムの用語(公開サービス編・TicketWave)

第2冊【公開サービス編】の題材システム「TicketWave」で使う固有語です。章をまたいで表記と役割をぶらさないための統一です。仕様の詳細は `docs/outlines/02_service_system.md` を参照してください。

| 正表記 | 意味・使い方の統一 |
|---|---|
| TicketWave | 題材システムの名称(仮称)。イベント・チケット販売 SaaS |
| 主催者 | イベントを公開しチケットを売る側のアクター。「`オーガナイザー`」とは書かない。続巻ではテナントの単位になる |
| 購入者 | チケットを買う一般利用者。文脈で必要なとき以外「ユーザー」「お客様」と揺らさない |
| 入場スタッフ | 会場で QR コードをスキャンして入場確認する側のアクター |
| イベント | 主催者が公開する興行の単位(Event) |
| チケット種別 | イベント内の券種(TicketType)。価格と在庫総数を持つ |
| 在庫 | チケット種別が持つ販売可能な総数。購入で減る |
| 残席 | 在庫の残り。購入画面に見せる「在庫の表示上の呼び名」として使う |
| 電子チケット | 購入確定後に発行する QR コード付きのチケット(Blob に保存) |
| 注文 | 購入のトランザクション単位(Order)。pending / paid / failed の状態を持つ |
| オーバーセル | 在庫を超えて販売してしまう事故。本書では Redis の在庫カウンタと分散ロックで防ぐ |
| 分散ロック | 複数レプリカからの同時購入で在庫を正しく減らすための排他。厳密な設計論はアプリアーキテクチャ編 |
