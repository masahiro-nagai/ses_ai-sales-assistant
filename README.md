# SES AI Sales Assistant

営業活動を効率化するための Next.js + Gemini AI Webアプリケーションです。  
企業分析・候補者マッチング・パーソナライズ送信文の自動生成を一気通貫でサポートします。

---

## 主な機能

| 機能 | 説明 |
|------|------|
| **ダッシュボード** | 送信数・返信率・商談化率・登録企業数をリアルタイム集計 |
| **企業管理** | 営業先企業の登録・編集・AI分析（業界・URL・採用情報をもとに仮説生成） |
| **候補者管理** | 提案人材の登録・スキルシート情報管理・マッチ度評価 |
| **送信文生成** | 企業×候補者の組み合わせでパーソナライズされた送信文を Gemini が自動生成 |
| **送信ログ** | 送信履歴・返信有無・結果（商談化 / 見送り等）・ネクストアクション管理 |
| **設定** | アプリ設定（テンプレートタイプ等） |

---

## 技術スタック

- **フレームワーク**: [Next.js 15](https://nextjs.org/) (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4
- **状態管理**: [Zustand](https://zustand-demo.pmnd.rs/)（localStorage 永続化）
- **AI**: [Google Gemini API](https://ai.google.dev/) (`@google/genai`) — 企業分析・マッチング評価・送信文生成
- **アニメーション**: [Motion](https://motion.dev/)
- **アイコン**: [Lucide React](https://lucide.dev/)

---

## ディレクトリ構成

```
ses_ai-sales-assistant/
├── app/                     # Next.js App Router ページ
│   ├── page.tsx             # ダッシュボード（送信統計・送信ログ一覧）
│   ├── companies/           # 企業管理ページ
│   ├── candidates/          # 候補者管理ページ
│   ├── messages/new/        # 送信文生成ページ
│   ├── logs/                # 送信ログ管理ページ
│   ├── settings/            # 設定ページ
│   ├── help/                # ヘルプページ
│   ├── layout.tsx           # グローバルレイアウト（サイドバー含む）
│   └── globals.css          # グローバルスタイル
├── components/
│   └── sidebar.tsx          # ナビゲーションサイドバー
├── hooks/
│   └── use-mobile.ts        # モバイル判定カスタムフック
├── lib/
│   ├── gemini.ts            # Gemini API クライアント・プロンプト定義
│   │                        # （analyzeCompany / evaluateMatch / generateMessage）
│   ├── store.ts             # Zustand グローバルストア
│   │                        # （Company / Candidate / SendLog 型定義 + CRUD）
│   └── utils.ts             # ユーティリティ関数
├── .env.example             # 環境変数サンプル
├── next.config.ts           # Next.js 設定
├── package.json
└── tsconfig.json
```

---

## セットアップ

### 前提条件

- Node.js 20 以上
- [Google Gemini API キー](https://aistudio.google.com/apikey)

### 手順

```bash
# 1. 依存関係のインストール
npm install

# 2. 環境変数の設定
cp .env.example .env.local
# .env.local を開き NEXT_PUBLIC_GEMINI_API_KEY に取得した API キーを設定

# 3. 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

---

## 環境変数

| 変数名 | 説明 |
|--------|------|
| `NEXT_PUBLIC_GEMINI_API_KEY` | Google Gemini API キー（必須） |

---

## Gemini AI の利用箇所

`lib/gemini.ts` に以下の3つの関数が定義されています。

| 関数 | 用途 | モデル |
|------|------|--------|
| `analyzeCompany` | 企業URLをもとに営業仮説・切り口を分析 | `gemini-3.1-pro-preview` + Google検索 |
| `evaluateMatch` | 企業分析×候補者情報でマッチ度をA/B/C評価 | `gemini-3.1-pro-preview` |
| `generateMessage` | パーソナライズ送信文・件名案を自動生成 | `gemini-3.1-pro-preview` |

---

## データ永続化

- 企業・候補者・送信ログはすべてブラウザの `localStorage` に保存されます（Zustand `persist` ミドルウェア）
- サーバー側 DB は使用していません

---

## 利用可能なスクリプト

```bash
npm run dev    # 開発サーバー起動
npm run build  # 本番ビルド
npm run start  # 本番サーバー起動
npm run lint   # ESLint 実行
npm run clean  # Next.js キャッシュクリア
```

---

## ライセンス

Private — 社内利用限定
