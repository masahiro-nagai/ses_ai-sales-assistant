'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ProjectCase } from '@/lib/store';
import { Plus, Search, X, Pencil } from 'lucide-react';

const emptyForm = (): Omit<ProjectCase, 'id' | 'updatedAt'> => ({
  title: '',
  description: '',
  requiredSkills: '',
  preferredSkills: '',
  budget: '',
  settlementRange: '',
  workLocation: '',
  workStyle: '',
  workDays: '',
  workHours: '',
  startDate: '',
  period: '',
  techStack: '',
  commercialFlow: '',
  interviewCount: '',
  headcount: '',
  paymentTerms: '',
  ageLimit: '',
  foreignOk: '',
  memo: '',
  status: '募集中',
});

const STATUS_COLORS: Record<string, string> = {
  '募集中': 'bg-emerald-100 text-emerald-700',
  '商談中': 'bg-blue-100 text-blue-700',
  '提案済み': 'bg-yellow-100 text-yellow-700',
  '終了': 'bg-gray-100 text-gray-500',
};

function CaseForm({
  form,
  onChange,
}: {
  form: Omit<ProjectCase, 'id' | 'updatedAt'>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="p-6 space-y-4">
      {/* 案件名 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">案件名 *</label>
        <input type="text" name="title" value={form.title} onChange={onChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* 案件内容 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">案件内容</label>
        <textarea name="description" value={form.description} onChange={onChange} rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* 必須スキル */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">必須スキル</label>
        <textarea name="requiredSkills" value={form.requiredSkills} onChange={onChange} rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* 尚可スキル */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">尚可スキル</label>
        <textarea name="preferredSkills" value={form.preferredSkills} onChange={onChange} rows={2}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* 単価 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">単価（上限）</label>
        <div className="flex items-center gap-2">
          <input type="number" name="budget" value={form.budget} onChange={onChange}
            placeholder="800000"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <span className="text-sm text-gray-500">円/月</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">幅がある場合は上限を入力し、下限は備考に記載してください</p>
      </div>

      {/* 精算幅 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">精算幅</label>
        <input type="text" name="settlementRange" value={form.settlementRange} onChange={onChange}
          placeholder="例: 140h-180h"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* 稼働形態 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">稼働形態</label>
        <select name="workStyle" value={form.workStyle} onChange={onChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">選択してください</option>
          <option value="フルリモート">フルリモート</option>
          <option value="一部リモート">一部リモート</option>
          <option value="常駐">常駐</option>
        </select>
      </div>

      {/* 勤務地 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">勤務地</label>
        <input type="text" name="workLocation" value={form.workLocation} onChange={onChange}
          placeholder="例: フルリモート、渋谷区"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* 稼働日数 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">稼働日数</label>
        <input type="text" name="workDays" value={form.workDays} onChange={onChange}
          placeholder="例: 週5日、週3〜5日"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* 勤務時間 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">勤務時間</label>
        <input type="text" name="workHours" value={form.workHours} onChange={onChange}
          placeholder="例: 9:30〜18:30"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* 開始時期 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">開始時期</label>
        <input type="text" name="startDate" value={form.startDate} onChange={onChange}
          placeholder="例: 即日、2025年4月〜"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* 期間 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">期間</label>
        <input type="text" name="period" value={form.period} onChange={onChange}
          placeholder="例: 長期、3ヶ月〜"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* 技術スタック */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">開発環境・技術スタック</label>
        <textarea name="techStack" value={form.techStack} onChange={onChange} rows={2}
          placeholder="例: Ruby on Rails, React, AWS, PostgreSQL"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* 商流 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">商流</label>
        <input type="text" name="commercialFlow" value={form.commercialFlow} onChange={onChange}
          placeholder="例: エンド→弊社"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* 面談回数 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">面談回数</label>
        <input type="text" name="interviewCount" value={form.interviewCount} onChange={onChange}
          placeholder="例: 1回（弊社同席）"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* 募集人数 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">募集人数</label>
        <input type="text" name="headcount" value={form.headcount} onChange={onChange}
          placeholder="例: 1名、2名"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* 支払いサイト */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">支払いサイト</label>
        <input type="text" name="paymentTerms" value={form.paymentTerms} onChange={onChange}
          placeholder="例: 基本45日サイト"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* 年齢制限 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">年齢制限</label>
        <input type="text" name="ageLimit" value={form.ageLimit} onChange={onChange}
          placeholder="例: 40代前半まで"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* 外国籍 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">外国籍</label>
        <select name="foreignOk" value={form.foreignOk} onChange={onChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">選択してください</option>
          <option value="可">可</option>
          <option value="不可">不可</option>
          <option value="条件付き">条件付き（詳細は備考）</option>
        </select>
      </div>

      {/* ステータス */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
        <select name="status" value={form.status} onChange={onChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="募集中">募集中</option>
          <option value="商談中">商談中</option>
          <option value="提案済み">提案済み</option>
          <option value="終了">終了</option>
        </select>
      </div>

      {/* 備考 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">備考</label>
        <textarea name="memo" value={form.memo} onChange={onChange} rows={3}
          placeholder="単価幅など補足情報を記載（例: 単価80〜90万、スキル見合い）"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
    </div>
  );
}

export default function CasesPage() {
  const { cases, addCase, updateCase } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm());
  const [addSaving, setAddSaving] = useState(false);

  const [editTarget, setEditTarget] = useState<ProjectCase | null>(null);
  const [editForm, setEditForm] = useState<Omit<ProjectCase, 'id' | 'updatedAt'>>(emptyForm());
  const [editSaving, setEditSaving] = useState(false);

  const filteredCases = cases.filter(c =>
    c.title.includes(searchTerm) ||
    c.requiredSkills.includes(searchTerm) ||
    c.techStack.includes(searchTerm)
  );

  const makeChangeHandler = (setter: React.Dispatch<React.SetStateAction<Omit<ProjectCase, 'id' | 'updatedAt'>>>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setter(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleOpenAdd = () => { setAddForm(emptyForm()); setShowAddModal(true); };
  const handleAddSubmit = async () => {
    if (!addForm.title.trim()) return;
    setAddSaving(true);
    await addCase({ ...addForm, id: crypto.randomUUID(), updatedAt: new Date().toISOString() });
    setAddSaving(false);
    setShowAddModal(false);
  };

  const handleOpenEdit = (c: ProjectCase) => {
    setEditTarget(c);
    const { id: _id, updatedAt: _updatedAt, ...rest } = c;
    setEditForm(rest);
  };
  const handleEditSubmit = async () => {
    if (!editTarget || !editForm.title.trim()) return;
    setEditSaving(true);
    await updateCase(editTarget.id, editForm);
    setEditSaving(false);
    setEditTarget(null);
  };

  const formatBudget = (b: string) => {
    const n = parseInt(b, 10);
    return isNaN(n) ? '—' : `¥${n.toLocaleString('ja-JP')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">案件マスター</h1>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center" onClick={handleOpenAdd}>
          <Plus className="h-4 w-4 mr-2" />案件を追加
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="案件名・スキルで検索..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">案件名</th>
                <th className="px-6 py-3">単価（上限）</th>
                <th className="px-6 py-3">稼働形態</th>
                <th className="px-6 py-3">必須スキル</th>
                <th className="px-6 py-3">開始時期</th>
                <th className="px-6 py-3">ステータス</th>
                <th className="px-6 py-3">最終更新</th>
                <th className="px-6 py-3">アクション</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400 text-sm">
                    登録された案件がありません。「案件を追加」から登録してください。
                  </td>
                </tr>
              ) : filteredCases.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{c.title}</div>
                    {c.commercialFlow && <div className="text-xs text-gray-400 mt-1">{c.commercialFlow}</div>}
                  </td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{formatBudget(c.budget)}</td>
                  <td className="px-6 py-4 text-gray-700 text-xs">{c.workStyle || '—'}</td>
                  <td className="px-6 py-4 text-gray-600 text-xs max-w-xs truncate">{c.requiredSkills || '—'}</td>
                  <td className="px-6 py-4 text-gray-700 text-xs whitespace-nowrap">{c.startDate || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[c.status] || 'bg-gray-100 text-gray-700'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                    {c.updatedAt ? new Date(c.updatedAt).toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleOpenEdit(c)} className="text-indigo-600 hover:text-indigo-900 font-medium text-sm flex items-center gap-1">
                      <Pencil className="h-3.5 w-3.5" />詳細・編集
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 追加モーダル */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">案件を追加</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <CaseForm form={addForm} onChange={makeChangeHandler(setAddForm)} />
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">キャンセル</button>
              <button onClick={handleAddSubmit} disabled={addSaving || !addForm.title.trim()} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium disabled:opacity-50">
                {addSaving ? '保存中...' : '登録'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 編集モーダル */}
      {editTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">案件を編集</h2>
                <p className="text-xs text-gray-500 mt-0.5">{editTarget.title}</p>
              </div>
              <button onClick={() => setEditTarget(null)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <CaseForm form={editForm} onChange={makeChangeHandler(setEditForm)} />
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button onClick={() => setEditTarget(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">キャンセル</button>
              <button onClick={handleEditSubmit} disabled={editSaving || !editForm.title.trim()} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium disabled:opacity-50">
                {editSaving ? '保存中...' : '変更を保存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
