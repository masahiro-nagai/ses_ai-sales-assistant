export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">設定</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">APIキーとデータベース連携</h2>
        <div className="space-y-4 text-sm text-gray-600">
          <p>このアプリケーションはAI分析にGemini APIを、データ保存にCloud Firestoreを使用しています。</p>
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-100 flex items-start">
            <div>
              <p className="font-bold mb-1">セキュア接続が有効です</p>
              <p>APIキーやデータベースの接続情報は、サーバーサイドの環境変数にて安全に管理されており、ブラウザ上には露出していません。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
