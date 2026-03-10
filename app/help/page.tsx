export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <h1 className="text-2xl font-bold text-gray-900">使い方・運用ガイド</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-10">
        <section>
          <h2 className="text-xl font-bold text-indigo-700 border-b pb-2 mb-4">1. 全体フロー</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li><strong>企業マスター</strong>に送信先企業を登録する（URLや基本情報）</li>
            <li><strong>候補者マスター</strong>に提案する人材を登録する（スキルシートやポートフォリオも可）</li>
            <li><strong>メッセージ作成</strong>画面を開く</li>
            <li>企業を選び、<strong>AIで企業分析</strong>を実行する</li>
            <li>候補者を選び、<strong>AIでマッチ度評価</strong>を実行する</li>
            <li><strong>AIで送信文を生成</strong>し、最後に人間が1行追記して送信する</li>
            <li>送信後、<strong>送信完了としてログに記録</strong>する</li>
            <li><strong>ダッシュボード</strong>や<strong>送信ログ</strong>で反応を分析し、次の改善に活かす</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-bold text-indigo-700 border-b pb-2 mb-4">2. 実務で一番大事なこと</h2>
          <p className="text-gray-700 leading-relaxed">
            この運用で重要なのは、<strong>「企業分析を頑張ること」ではなく、「どの仮説で送るかを絞ること」</strong>です。<br/><br/>
            たとえば同じ会社でも、
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700 ml-4 bg-gray-50 p-4 rounded-md">
            <li>AI人材が足りない</li>
            <li>DX推進人材が足りない</li>
            <li>顧客折衝できるPMが足りない</li>
            <li>業務整理できる人が足りない</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            のどれを切るかで返信率が変わります。<br/>
            AIは材料整理まで、人間は論点選定までやるのが勝ち筋です。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-indigo-700 border-b pb-2 mb-4">3. 文面作成ルール</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>1社につき提案仮説は1つに絞る</li>
            <li>相手固有情報を最低1つは入れる</li>
            <li>候補者の強みは最大2つまで</li>
            <li>長い自社紹介は禁止</li>
            <li>最後の1行は人間が書く</li>
            <li>AIの推測は、送信前に必ず元URLを1回確認する</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-indigo-700 border-b pb-2 mb-4">4. 評価指標</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="border p-3">指標</th>
                  <th className="border p-3">意味</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="border p-3 font-medium">送信数</td>
                  <td className="border p-3">どれだけ打ったか</td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium">返信率</td>
                  <td className="border p-3">文面の質</td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium">商談化率</td>
                  <td className="border p-3">仮説の質</td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium">候補者提示後の通過率</td>
                  <td className="border p-3">マッチの質</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
