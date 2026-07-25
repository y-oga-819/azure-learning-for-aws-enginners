# 付録A AWS⇔Azure対応表(基礎リソース版)

本書で扱った土台(ミニランディングゾーン)の範囲——アカウント体系・ID・ネットワーク・監視・課金・IaC——について、AWS の用語から Azure の用語を引けるようにまとめた早見表です。

用語の**単一情報源(Single Source of Truth)は `shared/glossary.md`** です。本付録はそこからカテゴリ別に再掲し、「対応はするが決定的に違う点」を一言ずつ添えたものです。表記や対応関係に迷ったときは、必ず用語集を正としてください。

<div class="note">
<span class="note-title">注意:対応表は「そっくり同じ」を意味しません</span>

対応表は「AWS のこれを探すなら Azure ではここを見る」という**引き当ての地図**です。名前が並んでいても、境界の引き方・課金の単位・既定の安全度は異なります。各行の「決定的に違う点」を、対応そのものと同じくらい重視してください。

</div>

## A-1 アカウント体系・組織管理

| AWS | Azure | 決定的に違う点 |
|---|---|---|
| アカウント | サブスクリプション | どちらも課金・ポリシーの境界。Azure はさらに上位に**テナント**と**管理グループ**があり、ID は個々のサブスクリプションではなくテナントに属します |
| Organizations / OU(Organizational Unit) | 管理グループ | 階層で継承する考え方は同じ。Azure では管理グループにポリシーと RBAC を付け、配下のサブスクリプションへ継承させます |
| (CloudFormation スタック + タグ) | リソースグループ | AWS に完全な対応物はありません。ライフサイクルを共にするリソースの入れ物で、まとめて削除できる単位です |
| ルート OU 直下にアカウントを置かない運用 | ルート管理グループ直下にリソース/サブスクリプションを置かない | 統制の効かない場所に資産が漏れるのを防ぐ考え方は共通です |

<p class="caption">図A-1 アカウント体系・組織管理の対応</p>

## A-2 ID・認可(IAM 相当)

| AWS | Azure | 決定的に違う点 |
|---|---|---|
| IAM | Microsoft Entra ID | ID がアカウント内ではなく**テナント**に存在します。IAM ユーザーの発想から「テナントのディレクトリにいる人・グループ」へ切り替えます |
| IAM ポリシー(JSON) | Azure RBAC(ロール + スコープ) | JSON で細粒度に許可を書く発想から、「**組み込みロール**を**スコープ**に割り当てる」発想へ変わります |
| IAM グループ | セキュリティグループ(Entra ID) | 権限は個人へ直接ではなく**グループ経由**で付与するのが原則です |
| IAM ロール(AssumeRole) | Azure RBAC のロール割り当て | Azure では「ロールを引き受ける」のではなく、プリンシパルにロールを割り当てます |
| インスタンスプロファイル / IRSA | マネージド ID(Managed Identity) | 適用範囲が広く、「キー認証を根絶する」文化の中心にあります |
| (都度 AssumeRole で昇格) | PIM(Privileged Identity Management) | 特権を常時持たせず、必要なときだけ一時昇格(JIT、Just-In-Time)します。P2 ライセンス前提です |

<p class="caption">図A-2 ID・認可の対応</p>

## A-3 ガバナンス・統制

| AWS | Azure | 決定的に違う点 |
|---|---|---|
| SCP(Service Control Policy) | Azure Policy(の拒否効果) | SCP は「できることの上限」を絞ります。Azure Policy は監査・強制(拒否)・修復まで一つの仕組みで扱います |
| AWS Config | Azure Policy(の監査効果) | 準拠状況の可視化にあたります。Azure では同じ Policy が監査と強制を兼ねます |
| Control Tower / LZA(Landing Zone Accelerator) | ランディングゾーン / LZ Accelerator | 大規模統制の型。本書はこの縮小版(ミニランディングゾーン)を作りました |

<p class="caption">図A-3 ガバナンス・統制の対応</p>

## A-4 ネットワーク

| AWS | Azure | 決定的に違う点 |
|---|---|---|
| VPC | 仮想ネットワーク(VNet) | パブリック/プライベートサブネットという**明確な区別がありません**。公開可否はルーティングと NSG、PaaS 側の設定で決まります |
| サブネット | サブネット | 概念はほぼ同じです |
| セキュリティグループ / NACL | NSG(ネットワークセキュリティグループ) | NSG は**サブネットと NIC の両方**に付けられます。本書はサブネット単位に寄せました |
| ルートテーブル | ルートテーブル(UDR、User Defined Route) | 概念はほぼ同じです |
| Transit Gateway | Hub-Spoke + VNet ピアリング | ハブを VNet として自分で持ち、ピアリングで結びます |
| VPC エンドポイント | Private Endpoint | Azure の PaaS は既定でパブリック公開のため、閉域化の重要度が高くなります |

<p class="caption">図A-4 ネットワークの対応</p>

## A-5 監視・ログ

| AWS | Azure | 決定的に違う点 |
|---|---|---|
| CloudWatch Metrics | Azure Monitor メトリック | 概念はほぼ同じです |
| CloudWatch Logs | Log Analytics ワークスペース | 「全ログを 1 ワークスペースに集約する」という設計文化が強くあります |
| CloudTrail | アクティビティログ | 「誰が何をしたか」の操作証跡です。診断設定でワークスペースへ送れます |
| Logs Insights | KQL(Kusto Query Language) | クエリ言語が異なります。KQL はパイプ(`|`)で絞り込みを繋ぎます |

<p class="caption">図A-5 監視・ログの対応</p>

## A-6 コスト・IaC

| AWS | Azure | 決定的に違う点 |
|---|---|---|
| Cost Explorer / Budgets | Cost Management + 予算 | 予算としきい値通知の考え方は同じです |
| CloudFormation / CDK | Bicep(ARM テンプレート) | Bicep は ARM の人に優しい DSL。**状態は ARM(スコープの実物)が持ち**、外部の状態ファイルを持ちません |
| CloudFormation スタックの一括削除 | リソースグループの削除 | 「まとめて消す」単位が、Azure ではリソースグループになります |

<p class="caption">図A-6 コスト・IaC の対応</p>

---

より広い範囲(サービス名のフルの対訳)は続巻の各編でも順次追記します。紛らわしい**用語そのものの意味の違い**は、付録B にまとめています。
