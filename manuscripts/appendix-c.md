# 付録C 命名規則テンプレート(CAF準拠)

第 1 章で決めた命名規則を、**そのまま書き写して使えるシート**にまとめました。命名はリソース作成後に変えられないため、手を動かす前にここで名前を確定させてから作業します。

規則の考え方は第 1 章の「命名規則」節を、実際に作ったリソースの一覧は `shared/state.md` を正とします。本付録はその作業用テンプレートです。

## C-1 命名パターン

本書は CAF(Cloud Adoption Framework)が示す次のパターンを採用します。

```text
{リソース種別}-{ワークロード}-{環境}-{リージョン}-{連番}
   例) rg-foundation-dev / vnet-foundation-dev-001
```

<p class="caption">図C-1 CAF 準拠の命名パターン</p>

- **種別・ワークロード・環境**の 3 つは最低限そろえます。名前を見ただけで「何の・どの環境のリソースか」が分かる状態を目指します。
- リージョン・連番は、同種を複数並べる場合に付けます。1 つしかないうちは省略しても構いません。
- 本書では**ワークロード名を `foundation`(土台)**、環境を `dev` / `prod`、主リージョンを東日本(`japaneast`)としました。

## C-2 構成要素の値

各要素に入れる値をあらかじめ決めておきます。ここを固定しておくと、章をまたいでも名前がぶれません。

| 要素 | 本書での値 | 備考 |
|---|---|---|
| ワークロード | `foundation` | 続巻では編ごとに別のワークロード名を使います |
| 環境 | `dev` / `prod` | 監視用など共通のものは環境を付けない場合があります(`log-foundation`) |
| リージョン(略号) | `jpe`(東日本)/ `jpw`(西日本) | 名前が長くなりすぎる場合のみ略号を使います<!-- 要検証: 公式Doc確認 — CAF のリージョン略号の推奨 --> |
| 連番 | `001` から | 同種を複数並べるときのみ |

<p class="caption">図C-2 命名の構成要素と値</p>

## C-3 リソース種別の略語

先頭に付けるリソース種別の略語です。CAF が公開している推奨略語に従います。図表内のラベルは略語のままで構いませんが、本文の初出では完全形を示します。

| リソース種別 | 略語 | 例 |
|---|---|---|
| 管理グループ | `mg` | `mg-foundation` |
| リソースグループ | `rg` | `rg-foundation-dev` |
| 仮想ネットワーク | `vnet` | `vnet-foundation-dev` |
| サブネット | `snet` | `snet-app-dev` |
| ネットワークセキュリティグループ | `nsg` | `nsg-app-dev` |
| パブリック IP アドレス | `pip` | `pip-bastion-dev` |
| Log Analytics ワークスペース | `log` | `log-foundation` |
| 予算 | `budget` | `budget-foundation-dev` |
| 仮想マシン | `vm` | `vm-nettest-dev` |
| セキュリティグループ(Entra ID) | `grp` | `grp-foundation-admins` |

<p class="caption">図C-3 リソース種別の略語(抜粋)</p>

<!-- 要検証: 公式Doc確認 — CAF のリソース種別略語の最新版(Azure resource abbreviations) -->

> 上表は本書で登場する種別に絞った抜粋です。ここに無い種別は、CAF の「Azure リソースの推奨される略称」を参照して同じ要領で決めます。`AzureBastionSubnet` のように、Azure 側で名前が固定されている特殊なサブネットは、規則の例外としてその名前をそのまま使います。

## C-4 命名シート(記入用)

作業前に、この章で使う名前を書き出すための空欄シートです。コピーして使ってください。

| 種別 | 環境 | 決めた名前 |
|---|---|---|
| リソースグループ | dev | `rg-________-dev` |
| リソースグループ | prod | `rg-________-prod` |
| 仮想ネットワーク | dev | `vnet-________-dev` |
| サブネット(app) | dev | `snet-app-________-dev` |
| NSG(app) | dev | `nsg-app-________-dev` |
| Log Analytics | 共通 | `log-________` |

<p class="caption">図C-4 命名シート(記入用テンプレート)</p>

## C-5 本書で実際に使った名前

参考として、本書のハンズオンで作成した名前の一覧です(`shared/state.md` の抜粋)。続巻もこの命名の延長で進めます。

| 種別 | 名前 |
|---|---|
| 管理グループ | `mg-foundation` |
| リソースグループ | `rg-foundation-dev` / `rg-foundation-prod` / `rg-monitor-foundation` |
| セキュリティグループ(Entra ID) | `grp-foundation-admins` / `grp-foundation-developers` / `grp-foundation-viewers` |
| 仮想ネットワーク | `vnet-foundation-dev` / `vnet-foundation-prod` |
| サブネット | `snet-app-dev` / `snet-data-dev` / `AzureBastionSubnet`(dev・prod 同名) |
| NSG | `nsg-app-dev` / `nsg-data-dev` / `nsg-app-prod` / `nsg-data-prod` |
| Log Analytics ワークスペース | `log-foundation` |
| 予算 | `budget-foundation-dev` / `budget-foundation-prod` |

<p class="caption">図C-5 本書で作成したリソース名の一覧</p>

<div class="column">
<span class="column-title">コラム:タグと命名は役割を分ける</span>

命名にすべての情報を詰め込む必要はありません。名前で表すのは「種別・ワークロード・環境」程度にとどめ、`owner`(持ち主)や `costcenter`(費用負担部門)といった**運用の属性はタグで持たせます**。タグはあとから足せますが、名前は変えられません。名前は最小限に、可変の情報はタグに——と役割を分けると、規則が長持ちします。タグの強制は第 3 章の Azure Policy が担います。

</div>
