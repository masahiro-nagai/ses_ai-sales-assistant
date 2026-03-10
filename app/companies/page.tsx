'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Plus, Search, ExternalLink } from 'lucide-react';

export default function CompaniesPage() {
  const { companies } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = companies.filter(c => 
    c.name.includes(searchTerm) || c.industry.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">企業マスター</h1>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          企業を追加
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="企業名や業界で検索..." 
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
                <th className="px-6 py-3">企業名</th>
                <th className="px-6 py-3">業界/規模</th>
                <th className="px-6 py-3">注力領域</th>
                <th className="px-6 py-3">優先度</th>
                <th className="px-6 py-3">アクション</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{company.name}</div>
                    <a href={company.urlCorporate} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center mt-1">
                      サイトを見る <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{company.industry}</div>
                    <div className="text-xs text-gray-500 mt-1">{company.size}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{company.focusArea}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      company.priority === 'A' ? 'bg-red-100 text-red-700' :
                      company.priority === 'B' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {company.priority}
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
