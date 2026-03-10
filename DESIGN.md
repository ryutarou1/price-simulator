# 料金シミュレーター UX/UI設計書 v1.0

## 1. 現状分析と課題

### 現在のデモ (`app/page.tsx`)
- 1ページ一覧型：全カテゴリ（基本メニュー/時間/オプション/人数）が縦に並ぶ
- 絵文字ベースのカードUI
- Sticky bottom barで合計金額表示
- 確認モーダルあり
- アニメーションなし、ステップ概念なし

### 課題
1. **認知負荷**: 全選択肢が一度に表示され、初見ユーザーが迷う
2. **進捗感の欠如**: どこまで選んだか、あと何が残っているか不明
3. **没入感の不足**: 選択の楽しさ・インタラクションが薄い
4. **CoCo壱参考との乖離**: クライアントが期待するステップ進行型になっていない

---

## 2. 設計方針

### コアコンセプト: 「選ぶ楽しさ × 迷わない導線」

CoCo壱シミュレーターの良い点（ステップ進行、カード選択、動的価格表示）を踏襲しつつ、以下で差別化する:

- **Motion（Framer Motion）** によるリッチなトランジション
- **モバイルファースト** の設計（thumb zone最適化）
- **shadcn/ui** の洗練されたコンポーネント
- **マイクロインタラクション** で選択の満足感を演出

---

## 3. ステップ構成（4ステップ + 確認）

### なぜ4ステップか
- NNグループの研究: 3-5ステップが最適（少なすぎると情報過多、多すぎると離脱）
- CoCo壱は7ステップだが、メニュー数が多いため。サロン系は4で十分
- 各ステップの選択肢が3-6個 = 1ステップ5-10秒で完了可能

### ステップ定義

```
Step 1: 基本メニュー選択（single select）
  → メインの商品/コースを選ぶ。最も重要な決定
  → カード型UI（画像 or アイコン + 名前 + 説明 + 価格）
  → デフォルト選択あり（最安プラン）

Step 2: ご利用時間（single select）
  → Step 1で選んだメニューに応じた時間帯
  → 横並びピル型ボタン or スライダー
  → 価格差分を明示（+¥2,000）

Step 3: オプション選択（multi select）
  → トッピング的な追加サービス
  → チェックカード型（タップでON/OFF）
  → 「人気」「おすすめ」バッジ表示
  → 選択数のカウンター表示

Step 4: ご利用人数 & 割引（single select）
  → 人数選択と割引の適用
  → 割引額がリアルタイムで見える演出

[確認画面]: 選択内容サマリー + 合計金額 + CTA
  → ステップではなくスライドイン表示
  → 各項目の「変更」リンクで該当ステップに戻れる
```

---

## 4. コンポーネント設計

### ページ構成

```
app/
  page.tsx                    # ステップ進行コントローラー（メインページ）
  layout.tsx                  # 既存のまま

components/
  simulator/
    SimulatorShell.tsx        # 全体のレイアウト枠（ヘッダー+コンテンツ+フッター）
    StepProgressBar.tsx       # 上部のステップインジケーター
    StepContainer.tsx         # AnimatePresenceでステップ切替をラップ
    steps/
      StepBase.tsx            # 各ステップ共通レイアウト（タイトル+説明+選択エリア）
      StepMenu.tsx            # Step 1: 基本メニュー
      StepTime.tsx            # Step 2: 時間
      StepOptions.tsx         # Step 3: オプション
      StepPeople.tsx          # Step 4: 人数
    ConfirmationPanel.tsx     # 確認画面（ボトムシートorフルスクリーン）
    StickyPriceBar.tsx        # 下部固定の金額バー + 次へボタン
  ui/
    SelectionCard.tsx         # 選択カード（single/multi対応）
    PriceBadge.tsx            # 価格バッジ（+¥1,500 / -¥500 / 基本料金内）
    StepDot.tsx               # プログレスドットの1つ分
    AnimatedPrice.tsx         # 金額カウントアップアニメーション

hooks/
  useSimulator.ts             # 状態管理（選択状態、合計計算、ステップ遷移）

lib/
  simulator-config.ts         # カテゴリ/オプションのデータ定義（管理画面と共通化前提）
  price-calculator.ts         # 料金計算ロジック（割引ルール等）
```

### 状態管理 (useSimulator)

```typescript
type SimulatorState = {
  currentStep: number;           // 0-3 (4ステップ)
  selections: {
    menu: string | null;         // 基本メニューID
    time: string | null;         // 時間ID
    options: Set<string>;        // オプションID群
    people: string | null;       // 人数ID
  };
  isConfirmOpen: boolean;
};

// 公開API
type UseSimulator = {
  state: SimulatorState;
  total: number;                 // 算出された合計金額
  canProceed: boolean;           // 現ステップの必須選択が完了しているか
  goNext: () => void;
  goBack: () => void;
  goToStep: (step: number) => void;
  selectOption: (category: string, id: string) => void;
  toggleOption: (id: string) => void;
  openConfirm: () => void;
  closeConfirm: () => void;
  reset: () => void;
};
```

---

## 5. UI詳細設計

### 5.1 StepProgressBar（上部プログレス）

```
[1 メニュー] ─── [2 時間] ─── [3 オプション] ─── [4 人数]
   ●完了         ●現在           ○未              ○未
```

- **位置**: ヘッダー直下、sticky（スクロールしても見える）
- **デザイン**: ドット + ラベル + 接続線
- **状態**: 完了（緑塗り+チェック）/ 現在（緑リング+パルスアニメ）/ 未（グレー）
- **タップ**: 完了済ステップはタップで戻れる（未到達ステップは不可）
- **モバイル**: ラベル省略してドットのみ + 現ステップ名をドット下に表示

### 5.2 SelectionCard（選択カード）

#### Single Select カード（Step 1: メニュー）
```
┌─────────────────────────┐
│  [アイコン/画像]          │
│                          │
│  スタンダード             │
│  全身ケア90分             │
│                          │
│  ¥8,000                  │
│                          │
│  ● 選択中 (or 空白)      │
└─────────────────────────┘
```

- **レイアウト**: 縦長カード、1列2枚（モバイル）/ 1列3枚（デスクトップ）
- **選択時**: border色変化 + 左上にチェックバッジ + 背景色変化 + scale(1.02)
- **未選択hover**: border色薄く変化 + shadow
- **アイコン**: Lucide React（絵文字からの変更。プロ感UP）
  - 基本メニュー: Leaf / Sparkles / Crown
  - 時間: Clock
  - オプション: Flame / Gem / Hand / Footprints / Droplets / Coffee
  - 人数: User / Users / UsersRound

#### Multi Select カード（Step 3: オプション）
```
┌────────────────────────────────────┐
│ [✓]  🕯️ アロマセラピー    +¥1,500  │
│      リラックス効果抜群            │
└────────────────────────────────────┘
```

- **レイアウト**: 横長リストカード（モバイルで片手操作しやすい）
- **左端**: チェックボックス（shadcn Checkbox）
- **右端**: 価格バッジ
- **選択時**: 背景色 + チェックON + 右端にスライドインするチェックマーク
- **「人気」バッジ**: 特定オプションに付与（オレンジ色の小さいピル）

### 5.3 StickyPriceBar（下部固定バー）

```
┌──────────────────────────────────────┐
│  お見積り合計                         │
│  ¥8,000 ──→ ¥11,500                 │
│                                      │
│  [← 戻る]            [次のステップ →] │
└──────────────────────────────────────┘
```

- **位置**: 画面最下部固定
- **背景**: white/95 + backdrop-blur
- **金額**: AnimatedPrice（数値がカウントアップ/ダウンする）
- **ボタン**:
  - Step 1: 「戻る」なし、「次へ」のみ
  - Step 2-3: 「戻る」（テキストボタン）+ 「次へ」（プライマリ）
  - Step 4: 「戻る」+ 「見積もりを確認」（強調CTA）
- **高さ**: max 80px（モバイルの表示領域を圧迫しない）
- **Safe area**: iOS対応で `pb-safe`

### 5.4 ConfirmationPanel（確認画面）

- **表示方法**: ボトムシート（モバイル）/ モーダル（デスクトップ）
- **Motion**: 下からスライドイン（duration: 300ms, ease: easeOut）

```
┌──────────────────────────────────┐
│  ━━━ (ドラッグハンドル)           │
│                                  │
│  📋 お見積り内容                  │
│                                  │
│  基本メニュー                     │
│  └ スタンダード  ¥8,000  [変更]  │
│                                  │
│  ご利用時間                       │
│  └ 90分          +¥2,000 [変更]  │
│                                  │
│  オプション                       │
│  └ アロマセラピー +¥1,500 [変更]  │
│  └ ヘッドスパ    +¥1,800         │
│                                  │
│  ご利用人数                       │
│  └ 2名（ペア割） -¥500   [変更]  │
│                                  │
│  ─────────────────────           │
│  合計  ¥12,800                   │
│  ─────────────────────           │
│                                  │
│  [この内容で問い合わせる]          │
│  [やり直す]                       │
└──────────────────────────────────┘
```

---

## 6. マイクロインタラクション設計

### 6.1 ステップ遷移
- **方向性アニメ**: 次へ=左スライドアウト→右スライドイン / 戻る=逆方向
- **ライブラリ**: Motion (Framer Motion) の `AnimatePresence` + `motion.div`
- **duration**: 300ms
- **easing**: `[0.32, 0.72, 0, 1]`（cubic-bezier、Apple風）

```tsx
// StepContainer.tsx の概念
<AnimatePresence mode="wait" custom={direction}>
  <motion.div
    key={currentStep}
    custom={direction}
    variants={{
      enter: (d) => ({ x: d > 0 ? 200 : -200, opacity: 0 }),
      center: { x: 0, opacity: 1 },
      exit: (d) => ({ x: d > 0 ? -200 : 200, opacity: 0 }),
    }}
    initial="enter"
    animate="center"
    exit="exit"
    transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
  >
    {stepContent}
  </motion.div>
</AnimatePresence>
```

### 6.2 カード選択時
- **scale**: `1.0 → 1.02`（100ms, spring）
- **border**: `gray-200 → primary`（150ms）
- **チェックバッジ**: scale 0→1 + rotate -10°→0°（200ms, spring）
- **背景色**: opacity 0→1（150ms）
- **触覚フィードバック**: `navigator.vibrate(10)` （対応端末のみ）

### 6.3 金額更新
- **AnimatedPrice**: 数値が現在値から新値へカウントアップ/ダウン
  - duration: 400ms
  - ライブラリ: Motion の `useMotionValue` + `useTransform` + `animate`
  - フォーマット: 途中経過も `¥X,XXX` 形式で表示
- **金額バーのパルス**: 金額変更時にバー全体が一瞬ハイライト（boxShadow pulse）

### 6.4 プログレスバー更新
- **完了ドット**: 色変化 + チェックアイコンのスケールイン
- **接続線**: 左から右へ塗りつぶしアニメーション（width transition）
- **現在ドット**: 緩やかなパルスアニメ（CSS `animate-pulse` カスタム）

### 6.5 確認画面
- **ボトムシート**: `y: 100% → 0`（300ms）
- **オーバーレイ**: `opacity: 0 → 0.5`（200ms）
- **各行**: staggered fade-in（50msずつ遅延）
- **合計金額**: 最後にカウントアップで表示

---

## 7. モバイルファースト設計

### レスポンシブブレークポイント
- **~640px（sm未満）**: モバイル（メインターゲット）
- **640px~1024px**: タブレット
- **1024px~**: デスクトップ

### モバイル固有の最適化

| 要素 | モバイル | デスクトップ |
|------|---------|------------|
| カード配置 | 2列グリッド（Step1,4）/ 1列リスト（Step3） | 3列グリッド / 2列リスト |
| プログレス | ドットのみ + 現ステップ名 | ドット + 全ラベル |
| 確認画面 | ボトムシート（ドラッグ可） | 中央モーダル |
| 価格バー | 金額左 + ボタン右 | 金額中央 + ボタン右 |
| ナビゲーション | スワイプでステップ切替可 | ボタンのみ |
| フォントサイズ | 本文14px / 金額24px | 本文16px / 金額32px |

### Thumb Zone最適化
- タップターゲット最小 **44x44px**（WCAG準拠）
- CTA（次へ/見積もり確認）は画面下部の **thumb-friendly zone** に配置
- 「戻る」ボタンは左下（右利き/左利き両対応）

### パフォーマンス
- 画像を使う場合は `next/image` + WebP + lazy loading
- Motion のアニメーションは `transform` と `opacity` のみ（GPU合成レイヤー）
- `will-change: transform` の適切な付与と解除

---

## 8. コンバージョン最適化（CVR向上テクニック）

### 8.1 プログレスバーの心理効果
- 「あと2ステップ」の表示 → 完了バイアスで離脱率低下
- Step 1完了時点で25%達成 → 沈没コスト効果で継続意欲UP

### 8.2 デフォルト選択（アンカリング）
- Step 1: 中間プラン（スタンダード）をデフォルト選択状態にする
  → 松竹梅の法則で中間が選ばれやすい
- Step 4: 1名をデフォルト選択

### 8.3 社会的証明
- 「人気No.1」バッジをスタンダードプランに付与
- 「よく一緒に選ばれています」をオプションステップに表示

### 8.4 損失回避
- ペア割/グループ割の表示を 「-¥500お得」のように「得する」フレーミング
- 赤字ではなく緑のバッジで「割引適用中」と表示

### 8.5 CTA設計
- **最終CTA**: 「この内容で問い合わせる」（具体的なアクション名）
- **色**: プライマリカラーで目立たせる（周囲と異なる色）
- **サイズ**: 幅100%（モバイル）、パディング十分
- **マイクロコピー**: CTA下に「※ 料金は目安です。正式なお見積りは担当者よりご連絡します」

### 8.6 離脱防止
- ブラウザバック/タブ閉じ時: `beforeunload` で確認ダイアログ（選択がある場合のみ）
- Step 1以降で離脱しようとしたら: 「選択内容が失われます」の警告
- **ただし過度な離脱防止はUXを損なうため、確認画面到達後のみに限定推奨**

---

## 9. アクセシビリティ（a11y）

### キーボード操作
- **Tab**: 次の選択カードへフォーカス移動
- **Shift+Tab**: 前の選択カードへ
- **Enter/Space**: カードの選択/解除
- **矢印キー**: 同一ステップ内のカード間移動（roving tabindex）
- **Escape**: 確認画面を閉じる

### ARIA属性
```tsx
// Single Select カード群
<div role="radiogroup" aria-label="基本メニューを選択">
  <div role="radio" aria-checked={isSelected} tabIndex={0}>
    ...
  </div>
</div>

// Multi Select カード群
<div role="group" aria-label="オプションを選択（複数可）">
  <div role="checkbox" aria-checked={isSelected} tabIndex={0}>
    ...
  </div>
</div>

// プログレスバー
<nav aria-label="ステップ進捗">
  <ol>
    <li aria-current={isCurrent ? "step" : undefined}>
      Step 1: 基本メニュー
    </li>
  </ol>
</nav>

// 金額（ライブ更新）
<div aria-live="polite" aria-atomic="true">
  合計金額: ¥{total.toLocaleString()}
</div>
```

### スクリーンリーダー対応
- 選択変更時: `aria-live="polite"` で金額変更を読み上げ
- ステップ遷移時: フォーカスをステップタイトルに移動
- 確認画面: フォーカストラップ（モーダル内に閉じ込め）

### 色・コントラスト
- テキスト/背景のコントラスト比 **4.5:1以上**（WCAG AA）
- 選択状態を色だけに頼らない（チェックマーク + border + 背景の3重表現）
- `prefers-reduced-motion` 対応: アニメーションを無効化/軽減

### フォーカスリング
- shadcn/uiデフォルトの `focus-visible:ring-2` を活用
- カスタムカードにも明確なフォーカスインジケータ

---

## 10. カラーシステム

### 既存（グリーン基調）を洗練させる

```
Primary:    hsl(152, 60%, 40%)   -- メインアクション、選択状態
Primary-fg: hsl(152, 60%, 98%)   -- Primary上のテキスト
Secondary:  hsl(152, 15%, 96%)   -- カード背景、セクション背景
Accent:     hsl(35, 90%, 55%)    -- 人気バッジ、注目要素（オレンジ）
Destructive: hsl(0, 70%, 55%)    -- エラー
Muted:      hsl(210, 10%, 96%)   -- 無効状態
Border:     hsl(210, 10%, 90%)   -- 通常のボーダー
```

### ダークモード
- 本案件では不要（サロン/店舗系は明るいテーマが一般的）
- next-themes は入っているが、ライトモード固定で実装

---

## 11. 追加パッケージ

```bash
npm install motion  # Framer Motion (現在は "motion" パッケージ名)
```

既存の依存関係（shadcn/ui, lucide-react, sonner, next-themes, radix-ui）はそのまま活用。
追加が必要なのは `motion` のみ。

---

## 12. 管理画面との連携（将来拡張）

現在 `app/admin/` に以下のページが存在:
- `/admin/categories` - カテゴリ管理
- `/admin/menus` - メニュー管理
- `/admin/settings` - 設定
- `/admin/inquiries` - 問い合わせ管理

### データフロー設計

```
[管理画面] → DB/API → [simulator-config.ts] → [シミュレーター画面]
```

現段階では `simulator-config.ts` にハードコードし、管理画面からの動的取得は後工程。
ただし型定義を共通化しておくことで、API化した際の改修を最小限にする。

```typescript
// lib/simulator-config.ts
export type SimulatorOption = {
  id: string;
  label: string;
  description?: string;
  price: number;
  icon: string;        // Lucide icon name
  badge?: string;      // "人気" "おすすめ" など
  sortOrder: number;
};

export type SimulatorCategory = {
  id: string;
  title: string;
  description?: string;
  type: "single" | "multi";
  required: boolean;
  options: SimulatorOption[];
};

export type SimulatorConfig = {
  categories: SimulatorCategory[];
  taxIncluded: boolean;
  currency: string;
  branding: {
    primaryColor: string;
    logo?: string;
    headerTitle: string;
    headerSubtitle: string;
  };
};
```

---

## 13. 実装優先順位

### Phase 1（MVP - 納品物）
1. `useSimulator` フック（状態管理+計算ロジック）
2. `StepProgressBar`（プログレス表示）
3. `StepContainer` + 4つのStepコンポーネント
4. `StickyPriceBar`（下部固定バー）
5. `ConfirmationPanel`（確認画面）
6. 基本的なステップ遷移アニメーション（Motion）
7. モバイルレスポンシブ対応

### Phase 2（UX強化）
8. AnimatedPrice（金額カウントアップ）
9. カード選択のマイクロインタラクション強化
10. スワイプでのステップ切替（モバイル）
11. 「人気」「おすすめ」バッジ
12. `prefers-reduced-motion` 対応

### Phase 3（管理画面連携）
13. 管理画面からのデータ取得API
14. カテゴリ/オプションのCRUD連携
15. 問い合わせ送信機能の実装
16. 分析用イベントトラッキング

---

## 14. パフォーマンス目標

| 指標 | 目標値 |
|------|-------|
| LCP | < 1.5s |
| FID | < 100ms |
| CLS | < 0.05 |
| Bundle size (page.tsx) | < 50KB gzip |
| ステップ遷移 | < 16ms/frame (60fps) |
| TTI | < 2.0s |

---

## 参考リソース

- [CoCo壱シミュレーター](https://www.ichibanya.co.jp/cp/simulator/) - クライアント参考
- [Wizard UI Pattern (Eleken)](https://www.eleken.co/blog-posts/wizard-ui-pattern-explained)
- [Wizard Design (NN/g)](https://www.nngroup.com/articles/wizards/)
- [Multi-Step Form Best Practices (Webstacks)](https://www.webstacks.com/blog/multi-step-form)
- [Wizard UI Design (Lollypop)](https://lollypop.design/blog/2026/january/wizard-ui-design/)
- [Micro-interactions Guide (Webflow)](https://webflow.com/blog/microinteractions)
- [Sticky CTA Pattern (GoodUI)](https://goodui.org/patterns/41/)
- [Motion docs (Framer Motion)](https://motion.dev/docs/react-animation)
- [shadcn/ui Multi-Step Form](https://shadcnstudio.com/blocks/dashboard-and-application/multi-step-form)
