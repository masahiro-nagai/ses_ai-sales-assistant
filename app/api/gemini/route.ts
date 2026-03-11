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
                    model: 'gemini-3.1-pro-preview',
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
                    model: 'gemini-3.1-pro-preview',
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
                    model: 'gemini-3.1-pro-preview',
                    contents: prompt,
                });
                resultText = response.text || '';
                break;
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
