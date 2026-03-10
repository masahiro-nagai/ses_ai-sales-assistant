'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Plus, Search } from 'lucide-react';

export default function CandidatesPage() {
  const { candidates } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCandidates = candidates.filter(c => 
    c.name.includes(searchTerm) || c.mainSkills.includes(searchTerm) || c.strongArea.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">候補者マスター</h1>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          候補者を追加
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="名前やスキルで検索..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">氏名</th>
                <th className="px-6 py-3">得意領域</th>
                <th className="px-6 py-3">主要スキル</th>
                <th className="px-6 py-3">添付資料</th>
                <th className="px-6 py-3">状態</th>
                <th className="px-6 py-3">アクション</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{candidate.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{candidate.type}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{candidate.strongArea}</td>
                  <td className="px-6 py-4 text-gray-700">{candidate.mainSkills}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {candidate.skillSheet ? (
                        <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md inline-block w-max">スキルシート有</span>
                      ) : (
                        <span className="text-xs text-gray-400">スキルシート無</span>
                      )}
                      {candidate.portfolio ? (
                        <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md inline-block w-max">ポートフォリオ有</span>
                      ) : (
                        <span className="text-xs text-gray-400">ポートフォリオ無</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      candidate.status === '可' ? 'bg-emerald-100 text-emerald-700' :
                      candidate.status === '保留' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {candidate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">
                      詳細・編集
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
