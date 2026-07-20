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

> 用語の初出時のみ英語併記します(例:「マネージド ID(Managed Identity)」)。2 回目以降は日本語表記のみで構いません。

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

> 上表の「使ってはいけない表記」はインラインコード(`` `…` ``)で書いています。これは textlint の prh チェックに誤検知させないための措置です。本文中で実際に使う場合はコードにせず、正表記のみを書いてください。
