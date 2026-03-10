'use client';

import { useAppStore } from '@/lib/store';
import { Building2, Users, Send, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const { companies, candidates, logs } = useAppStore();

  const totalSent = logs.length;
  const totalReplies = logs.filter(l => l.hasReply).length;
  const totalMeetings = logs.filter(l => l.result === '商談化').length;
  
  const replyRate = totalSent > 0 ? ((totalReplies / totalSent) * 100).toFixed(1) : '0.0';
  const meetingRate = totalSent > 0 ? ((totalMeetings / totalSent) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">送信数</h3>
            <Send className="h-5 w-5 text-indigo-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{totalSent}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">返信率</h3>
            <CheckCircle className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{replyRate}%</p>
          <p className="text-sm text-gray-500 mt-1">{totalReplies} 件の返信</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">商談化率</h3>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{meetingRate}%</p>
          <p className="text-sm text-gray-500 mt-1">{totalMeetings} 件の商談</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">登録企業数</h3>
            <Building2 className="h-5 w-5 text-orange-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{companies.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">最近の送信ログ</h2>
        {logs.length === 0 ? (
          <p className="text-gray-500 text-sm">送信履歴がありません。</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3">日付</th>
                  <th className="px-4 py-3">企業</th>
                  <th className="px-4 py-3">結果</th>
                  <th className="px-4 py-3">チャネル</th>
                </tr>
              </thead>
              <tbody>
                {logs.slice(-5).reverse().map((log) => {
                  const company = companies.find(c => c.id === log.companyId);
                  return (
                    <tr key={log.id} className="border-b border-gray-100">
                      <td className="px-4 py-3">{new Date(log.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 font-medium">{company?.name || '不明'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          log.result === '商談化' ? 'bg-emerald-100 text-emerald-700' :
                          log.result === '見送り' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {log.result}
                        </span>
                      </td>
                      <td className="px-4 py-3">{log.channel}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
