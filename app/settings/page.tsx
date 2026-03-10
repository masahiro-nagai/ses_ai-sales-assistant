export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">設定</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">APIキーの設定</h2>
        <p className="text-sm text-gray-600 mb-4">
          このアプリケーションはAI分析にGemini APIを使用します。
          AI Studioの「Secrets」パネルから <code>GEMINI_API_KEY</code> を設定してください。
        </p>
        <div className="p-4 bg-gray-50 rounded-md border border-gray-200 font-mono text-sm text-gray-700">
          GEMINI_API_KEY="AIzaSy..."
        </div>
      </div>
    </div>
  );
}
