import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini client on the server side
const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY; // Using the backend-only variable
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not set on the server');
    }
    return new GoogleGenAI({ apiKey });
};

export async function POST(req: Request) {
    try {
        const { action, payload } = await req.json();
        const ai = getGeminiClient();

        let resultText = '';

        switch (action) {
            case 'analyze': {
                const { company } = payload;
                const prompt = `
あなたはSES/AI人材営業のための企業分析アシスタントです。
以下のURL群や企業情報を参考に、この企業に対する営業仮説を整理してください。

【目的】
企業ごとのパーソナライズ送信文を作る前提情報をまとめたい。

【入力情報】
- 企業名：${company.name}
- 業界：${company.industry}
- URL一覧：
  - コーポレート: ${company.urlCorporate}
  - 採用: ${company.urlRecruit}
  - サービス: ${company.urlService}
  - ニュース: ${company.urlNews}

【出力ルール】
以下の形式で整理してください。

1. 事業概要
- この企業は何をしている会社かを2〜3行で要約

2. 現在注力していそうな領域
- サービス、採用、組織、技術、営業などの観点で3点まで

3. 直近トピック
- ニュース、採用強化、機能追加、登壇、発信など
- URLや検索で確認できた事実ベースで書く

4. 採用・開発体制の課題仮説
- 確認できる事実
- そこから考えられる仮説
を分けて書く

5. この企業にSES/AI人材提案をするなら刺さりそうな切り口を3つ
- 切り口ごとに「なぜ刺さるか」を添える

6. 最も有望な切り口を1つ選ぶ
- 理由を簡潔に書く

7. 送信文に入れるべき固有情報
- その会社にしかない要素を3つ

【制約】
- 事実と推測を分ける
- 営業文に使える表現でまとめる
`;

                const response = await ai.models.generateContent({
                    model: 'gemini-3.1-flash-lite-preview',
                    contents: prompt,
                    config: {
                        tools: [{ googleSearch: {} }],
                    }
                });
                resultText = response.text || '';
                break;
            }

            case 'evaluate': {
                const { companyAnalysis, candidate } = payload;
                const prompt = `
あなたはSES/AI人材営業のマッチング支援アシスタントです。
以下の企業仮説に対して、この候補者がどの程度マッチするかを評価してください。

【企業情報】
${companyAnalysis}

【候補者情報】
- 氏名/イニシャル: ${candidate.name}
- 得意領域: ${candidate.strongArea}
- 主要スキル: ${candidate.mainSkills}
- 実績1: ${candidate.achievement1}
- 実績2: ${candidate.achievement2}
- 対顧客強み: ${candidate.customerStrength}
- AI関連経験: ${candidate.aiExperience}
- 推薦ポイント短文: ${candidate.recommendationText}
${candidate.skillSheet ? `- スキルシート情報: ${candidate.skillSheet}` : ''}
${candidate.portfolio ? `- ポートフォリオ情報: ${candidate.portfolio}` : ''}

【出力ルール】
以下の形式で出してください。

1. 総合マッチ度
- A / B / C の3段階

2. マッチする理由
- 最大3点

3. 懸念点
- スキル、条件、業界経験、温度感など

4. この候補者を提案する場合の勝ち筋
- どの実績を前面に出すべきか
- 何を言いすぎない方が良いか

5. 提案文で使うべき訴求ポイント
- 80字以内で3案

【制約】
- 候補者情報にない経験は盛らない
- 強みと懸念点を両方出す
- 営業でそのまま使える言葉で出す
`;

                const response = await ai.models.generateContent({
                    model: 'gemini-3.1-flash-lite-preview',
                    contents: prompt,
                });
                resultText = response.text || '';
                break;
            }

            case 'generate': {
                const { companyName, companyAnalysis, hypothesis, candidate, templateType } = payload;
                const prompt = `
あなたはSES/AI人材営業の文面作成アシスタントです。
以下の情報をもとに、企業ごとにパーソナライズされた送信文を作成してください。

【企業名】
${companyName}

【企業分析】
${companyAnalysis}

【提案仮説】
${hypothesis}

【候補者情報】
- 氏名/イニシャル: ${candidate.name}
- 得意領域: ${candidate.strongArea}
- 主要スキル: ${candidate.mainSkills}
- 実績1: ${candidate.achievement1}
- 実績2: ${candidate.achievement2}
- 対顧客強み: ${candidate.customerStrength}
- AI関連経験: ${candidate.aiExperience}
${candidate.skillSheet ? `- スキルシート情報: ${candidate.skillSheet}` : ''}
${candidate.portfolio ? `- ポートフォリオ情報: ${candidate.portfolio}` : ''}

【ルール】
- 冒頭1文で「なぜ御社にご連絡したのか」を具体的に書く
- 相手企業の固有情報に必ず触れる
- 候補者の紹介は1〜2点に絞る
- 長い会社紹介は書かない
- テンプレ感の強い表現は禁止
- 全体は250字以内
- 最後は「ご興味があればご返信ください」で締める
- 送信手段はフォーム営業またはメールを想定
- テンプレートタイプ: ${templateType} (これに沿ったトーン＆マナーで作成)

【出力】
1. 本文案
2. 件名案を3つ
3. 人間が最後に追記する1行候補を3つ
4. NGになりやすい表現があれば注意点
`;

                const response = await ai.models.generateContent({
                    model: 'gemini-3.1-flash-lite-preview',
                    contents: prompt,
                });
                resultText = response.text || '';
                break;
            }

            case 'extractCompany': {
                const { url } = payload;
                const prompt = `
あなたはSES/AI人材営業のための企業情報収集アシスタントです。
以下のURLの企業について、GoogleSearchを使ってWebサイトを調査し、企業情報を収集してください。

【企業URL】
${url}

【出力ルール】
必ず以下のキーを持つJSONのみを返してください。説明文やMarkdownは不要です。JSONのみ出力してください。

{
  "name": "企業名",
  "industry": "業界（例：IT・SaaS, 製造業, 金融 など）",
  "size": "従業員規模（例：50名, 300名, 1000名以上 など）",
  "location": "本社所在地（例：東京都渋谷区）",
  "summary": "事業概要を2〜3文で",
  "product": "主なサービス・製品を簡潔に",
  "focusArea": "現在注力している領域（例：AI活用, グローバル展開, DX推進）",
  "recruitingRoles": "採用中の職種（例：エンジニア, 営業, PM）",
  "techStack": "技術スタック（例：React, Python, AWS）",
  "recentTopics": "最近のニュースや動向を1〜2点",
  "keyPerson": "代表者名や担当者名（分かれば）",
  "urlRecruit": "採用ページURL（分かれば）",
  "urlService": "サービスページURL（分かれば）",
  "urlNews": "ニュース・プレスリリースページURL（分かれば）"
}

不明な項目は空文字列にしてください。JSONのみ返してください。
`;
                const response = await ai.models.generateContent({
                    model: 'gemini-3.1-flash-lite-preview',
                    contents: prompt,
                    config: {
                        tools: [{ googleSearch: {} }],
                    }
                });
                const raw = response.text || '';
                // JSON部分だけ抽出
                const jsonMatch = raw.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    return NextResponse.json({ error: 'AIからJSON形式の回答が得られませんでした' }, { status: 500 });
                }
                const extracted = JSON.parse(jsonMatch[0]);
                return NextResponse.json({ extracted });
            }

            case 'generateRecommendation': {
                const { interviewText, candidateName } = payload;
                const prompt = `
あなたはSES/AI人材営業のエキスパートです。
候補者との面談議事録をもとに、企業への推薦文を3パターン作成してください。

【候補者名】
${candidateName || '（名前未設定）'}

【面談議事録】
${interviewText}

【推薦文の参考スタイル】

▼ スタイル1（箇条書き詳細型）
・飲食店店長および営業主任として4年以上にわたり培った「中小企業の真の課題」を見抜くビジネス洞察力を基盤に、直近2年間はDXコンサルタントとして目覚ましい実績を上げてこられました。
・ビジネスと技術を融合させたDXの推進。Dify, n8n, Google Apps Script (GAS) といった最新のノーコード・AIツールを自在に操り、中小企業の現場課題を解決するアプリケーションの量産を主導してきました。
・一気通貫のプロジェクト実行能力。顧客ヒアリングによる課題特定から、要件定義、開発、導入後の運用定着化支援までを一気通貫で担当されてきました。

▼ スタイル2（ストーリー型）
弊社所属のテックリード経験ありのエンジニアをご紹介させていただきます。

新卒でメガベンチャー・ベンチャー企業の開発案件を多く抱える会社に入社し、リクルート様、スタートアップ企業の立ち上げに関わっておりました。

入社2年目でテックリード・開発マネージャーに最年少で任命され、開発をリードする立場として、要件定義、経営陣に技術の戦略の共有、プロダクト・コード品質のレビューを行い顧客折衝〜開発・採用まで、幅広くコミットしておりました。

▼ スタイル3（アピールポイント型）
・Ruby on Railsを用いたSaaS開発経験が豊富で、上流工程からリリース・運用まで一貫した開発推進が可能です。
・技術的負債を最小化するテーブル設計やパフォーマンスを考慮したクエリ作成など、高度なDBスキルを有しています。

【アピールポイント】
HR Tech SaaSにおける開発経験：物流DXの自社サービス開発と親和性が高く、即戦力として貢献できます。

【出力ルール】
- 3パターンをそれぞれ以下の形式で出力してください。各パターンは必ず【パターン1】【パターン2】【パターン3】のヘッダーから始めてください。
- 各パターンはスタイルを参考にしながら、議事録の内容に合わせて完全にオリジナルの文を作成してください
- パターン1: 箇条書き詳細型（・で始まる箇条書き、3〜5項目）
- パターン2: ストーリー型（段落形式、候補者の経歴の流れを自然に語る）
- パターン3: アピールポイント型（箇条書き＋【アピールポイント】セクション）
- 議事録にない情報は盛らない
- 営業文として実際に使えるクオリティで作成する
`;
                const response = await ai.models.generateContent({
                    model: 'gemini-3.1-flash-lite-preview',
                    contents: prompt,
                });
                resultText = response.text || '';
                break;
            }

            case 'parseCase': {
                const { summaryText } = payload;
                const prompt = `
あなたはSES/IT人材エージェントの営業アシスタントです。
以下の案件サマリーテキストを読み解き、各項目に当てはまる情報を抽出してJSONで返してください。

【案件サマリー】
${summaryText}

【抽出するフィールドと説明】
- title: 案件名・役職名（例: "ソフトウェアエンジニア", "Ruby on Railsエンジニア"）
- description: 案件内容・業務詳細
- requiredSkills: 必須スキル（箇条書きやテキストそのまま）
- preferredSkills: 尚可スキル・歓迎スキル
- budget: 単価の上限金額（数値のみ、円単位。例: 900000。範囲がある場合は上限のみ）
- settlementRange: 精算幅（例: "140h-180h"）
- workLocation: 勤務地
- workStyle: 稼働形態。"フルリモート"・"一部リモート"・"常駐" のいずれか、不明なら空文字
- workDays: 稼働日数（例: "週5日"、"週3〜5日"）
- workHours: 勤務時間（例: "9:30〜18:30"）
- startDate: 開始時期（例: "即日"、"相談可能"）
- period: 期間（例: "長期"、"3ヶ月〜"）
- techStack: 開発環境・技術スタック（テキストそのまま）
- commercialFlow: 商流（例: "エンド→弊社"）
- interviewCount: 面談回数（例: "1回"、"1回（上位同席）"）
- headcount: 募集人数（例: "1名"、"2名"）
- paymentTerms: 支払いサイト
- ageLimit: 年齢制限（例: "40代前半まで"）
- foreignOk: 外国籍可否。"可"・"不可"・"条件付き" のいずれか、不明なら空文字
- memo: 備考・補足（単価の下限、特記事項など。単価幅がある場合は "単価80〜90万円（スキル見合い）" のように記載）

【出力ルール】
- 必ずJSONのみを返してください（マークダウンコードブロックなし）
- 情報がない項目は空文字列 "" にしてください
- budgetは数値文字列（例: "900000"）、その他はすべてstring
`;
                const response = await ai.models.generateContent({
                    model: 'gemini-3.1-flash-lite-preview',
                    contents: prompt,
                });
                const rawText = response.text || '';
                const jsonMatch = rawText.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    return NextResponse.json({ error: 'AI response did not contain valid JSON' }, { status: 500 });
                }
                const parsed = JSON.parse(jsonMatch[0]);
                return NextResponse.json({ parsed });
            }

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        return NextResponse.json({ text: resultText });

    } catch (error: any) {
        console.error('Gemini API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
