'use client';

import { useAppStore } from '@/lib/store';

export default function LogsPage() {
  const { logs, companies, candidates } = useAppStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">送信ログ</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">送信日</th>
                <th className="px-6 py-3">企業</th>
                <th className="px-6 py-3">候補者</th>
                <th className="px-6 py-3">チャネル</th>
                <th className="px-6 py-3">結果</th>
                <th className="px-6 py-3">アクション</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    送信履歴がありません。
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const company = companies.find(c => c.id === log.companyId);
                  const candidate = candidates.find(c => c.id === log.candidateId);
                  return (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4">{new Date(log.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{company?.name || '不明'}</td>
                      <td className="px-6 py-4 text-gray-700">{candidate?.name || '不明'}</td>
                      <td className="px-6 py-4 text-gray-700">{log.channel}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          log.result === '商談化' ? 'bg-emerald-100 text-emerald-700' :
                          log.result === '見送り' ? 'bg-red-100 text-red-700' :
                          log.result === '保留' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {log.result}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">
                          詳細
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
