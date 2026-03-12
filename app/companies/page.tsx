'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Company } from '@/lib/store';
import { Plus, Search, ExternalLink, X } from 'lucide-react';

const emptyForm = (): Omit<Company, 'id' | 'updatedAt'> => ({
  name: '',
  urlCorporate: '',
  urlRecruit: '',
  urlService: '',
  urlNews: '',
  industry: '',
  size: '',
  location: '',
  summary: '',
  product: '',
  focusArea: '',
  recruitingRoles: '',
  techStack: '',
  recentTopics: '',
  keyPerson: '',
  salesMemo: '',
  priority: 'C',
});

export default function CompaniesPage() {
  const { companies, addCompany } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const newCompany: Company = {
      ...form,
      id: crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
    };
    await addCompany(newCompany);
    setSaving(false);
    setShowModal(false);
    setForm(emptyForm());
  };

  const filteredCompanies = companies.filter(c => 
    c.name.includes(searchTerm) || c.industry.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">企業マスター</h1>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
          onClick={() => setShowModal(true)}
        >
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

      {/* 企業追加モーダル */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">企業を追加</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: '企業名 *', name: 'name', required: true },
                { label: '業界', name: 'industry' },
                { label: '規模', name: 'size' },
                { label: '所在地', name: 'location' },
                { label: '注力領域', name: 'focusArea' },
                { label: 'コーポレートURL', name: 'urlCorporate' },
                { label: '採用ページURL', name: 'urlRecruit' },
                { label: 'サービスページURL', name: 'urlService' },
                { label: 'ニュースURL', name: 'urlNews' },
                { label: '採用職種', name: 'recruitingRoles' },
                { label: '技術スタック', name: 'techStack' },
                { label: 'キーパーソン', name: 'keyPerson' },
              ].map(({ label, name }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type="text"
                    name={name}
                    value={(form as Record<string, string>)[name]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
              {[
                { label: '会社概要', name: 'summary' },
                { label: '製品・サービス', name: 'product' },
                { label: '最近のトピック', name: 'recentTopics' },
                { label: '営業メモ', name: 'salesMemo' },
              ].map(({ label, name }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <textarea
                    name={name}
                    value={(form as Record<string, string>)[name]}
                    onChange={handleChange}
                    rows={2}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">優先度</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="A">A（高）</option>
                  <option value="B">B（中）</option>
                  <option value="C">C（低）</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving || !form.name.trim()}
                className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium disabled:opacity-50"
              >
                {saving ? '保存中...' : '登録'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

