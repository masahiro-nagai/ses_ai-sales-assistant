'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Company } from '@/lib/store';
import { extractCompanyFromUrl } from '@/lib/gemini';
import { Plus, Search, ExternalLink, X, Loader2, Globe, Pencil } from 'lucide-react';

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

const TEXT_FIELDS = [
  { label: '企業名 *', name: 'name' },
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
];

const TEXTAREA_FIELDS = [
  { label: '会社概要', name: 'summary' },
  { label: '製品・サービス', name: 'product' },
  { label: '最近のトピック', name: 'recentTopics' },
  { label: '営業メモ', name: 'salesMemo' },
];

type AddStep = 'url' | 'loading' | 'review';

export default function CompaniesPage() {
  const { companies, addCompany, updateCompany } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  // 追加モーダル
  const [showAddModal, setShowAddModal] = useState(false);
  const [addStep, setAddStep] = useState<AddStep>('url');
  const [inputUrl, setInputUrl] = useState('');
  const [addForm, setAddForm] = useState(emptyForm());
  const [addSaving, setAddSaving] = useState(false);
  const [addError, setAddError] = useState('');

  // 編集モーダル
  const [editTarget, setEditTarget] = useState<Company | null>(null);
  const [editForm, setEditForm] = useState<Omit<Company, 'id' | 'updatedAt'>>(emptyForm());
  const [editSaving, setEditSaving] = useState(false);

  const filteredCompanies = companies.filter(c =>
    c.name.includes(searchTerm) || c.industry.includes(searchTerm)
  );

  // ── 追加 ──
  const handleOpenAdd = () => {
    setAddStep('url');
    setInputUrl('');
    setAddForm(emptyForm());
    setAddError('');
    setShowAddModal(true);
  };

  const handleAiSearch = async () => {
    if (!inputUrl.trim()) return;
    setAddError('');
    setAddStep('loading');
    try {
      const extracted = await extractCompanyFromUrl(inputUrl.trim());
      setAddForm({ ...emptyForm(), ...extracted, urlCorporate: inputUrl.trim(), salesMemo: '', priority: 'C' });
      setAddStep('review');
    } catch (e: unknown) {
      setAddStep('url');
      setAddError(e instanceof Error ? e.message : 'AI検索に失敗しました。');
    }
  };

  const handleAddSubmit = async () => {
    if (!addForm.name.trim()) return;
    setAddSaving(true);
    await addCompany({ ...addForm, id: crypto.randomUUID(), updatedAt: new Date().toISOString() });
    setAddSaving(false);
    setShowAddModal(false);
  };

  // ── 編集 ──
  const handleOpenEdit = (company: Company) => {
    setEditTarget(company);
    const { id: _id, updatedAt: _updatedAt, ...rest } = company;
    setEditForm(rest);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSubmit = async () => {
    if (!editTarget || !editForm.name.trim()) return;
    setEditSaving(true);
    await updateCompany(editTarget.id, editForm);
    setEditSaving(false);
    setEditTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">企業マスター</h1>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
          onClick={handleOpenAdd}
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
                    <button
                      onClick={() => handleOpenEdit(company)}
                      className="text-indigo-600 hover:text-indigo-900 font-medium text-sm flex items-center gap-1"
                    >
                      <Pencil className="h-3.5 w-3.5" />詳細・編集
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 企業追加モーダル ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">企業を追加</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {addStep === 'url' && 'Step 1: 企業URLを入力してAI検索 または 手入力'}
                  {addStep === 'loading' && 'Step 2: AI が企業情報を調査中...'}
                  {addStep === 'review' && 'Step 3: 情報を確認・編集して登録'}
                </p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>

            {addStep === 'url' && (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">コーポレートURL <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="url"
                      placeholder="https://example.co.jp"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  {addError && <p className="text-xs text-red-600 mt-2">{addError}</p>}
                  <p className="text-xs text-gray-400 mt-2">URLを入力するとAIがWebを検索して企業情報を自動取得します</p>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">キャンセル</button>
                  <button onClick={handleAiSearch} disabled={!inputUrl.trim()} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium flex items-center disabled:opacity-50">
                    <Globe className="h-4 w-4 mr-2" />AI検索
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <hr className="flex-1 border-gray-200" />
                  <span className="text-xs text-gray-400">または</span>
                  <hr className="flex-1 border-gray-200" />
                </div>
                <button onClick={() => { setAddForm(emptyForm()); setAddStep('review'); }} className="w-full py-2 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">
                  URLなしで手入力する
                </button>
              </div>
            )}

            {addStep === 'loading' && (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
                <p className="text-sm font-medium text-gray-700">AIが企業情報を調査中...</p>
                <p className="text-xs text-gray-400 mt-1">{inputUrl}</p>
              </div>
            )}

            {addStep === 'review' && (
              <>
                <div className="p-6 space-y-4">
                  {inputUrl && <div className="bg-indigo-50 border border-indigo-100 rounded-md p-3 text-xs text-indigo-700">✅ AI が企業情報を取得しました。内容を確認・修正してから登録してください。</div>}
                  {TEXT_FIELDS.map(({ label, name }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <input type="text" name={name} value={(addForm as Record<string, string>)[name]} onChange={(e) => setAddForm(prev => ({ ...prev, [e.target.name]: e.target.value }))} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  ))}
                  {TEXTAREA_FIELDS.map(({ label, name }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <textarea name={name} value={(addForm as Record<string, string>)[name]} onChange={(e) => setAddForm(prev => ({ ...prev, [e.target.name]: e.target.value }))} rows={2} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">優先度</label>
                    <select name="priority" value={addForm.priority} onChange={(e) => setAddForm(prev => ({ ...prev, priority: e.target.value as 'A' | 'B' | 'C' }))} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="A">A（高）</option>
                      <option value="B">B（中）</option>
                      <option value="C">C（低）</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-between gap-3 px-6 pb-6">
                  <button onClick={() => setAddStep('url')} className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">← URLを変更</button>
                  <div className="flex gap-2">
                    <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">キャンセル</button>
                    <button onClick={handleAddSubmit} disabled={addSaving || !addForm.name.trim()} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium disabled:opacity-50">
                      {addSaving ? '保存中...' : '確認して登録'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── 企業編集モーダル ── */}
      {editTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">企業を編集</h2>
                <p className="text-xs text-gray-500 mt-0.5">{editTarget.name}</p>
              </div>
              <button onClick={() => setEditTarget(null)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {TEXT_FIELDS.map(({ label, name }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type="text" name={name} value={(editForm as Record<string, string>)[name]} onChange={handleEditChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              ))}
              {TEXTAREA_FIELDS.map(({ label, name }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <textarea name={name} value={(editForm as Record<string, string>)[name]} onChange={handleEditChange} rows={2} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">優先度</label>
                <select name="priority" value={editForm.priority} onChange={handleEditChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="A">A（高）</option>
                  <option value="B">B（中）</option>
                  <option value="C">C（低）</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button onClick={() => setEditTarget(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">キャンセル</button>
              <button onClick={handleEditSubmit} disabled={editSaving || !editForm.name.trim()} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium disabled:opacity-50">
                {editSaving ? '保存中...' : '変更を保存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
