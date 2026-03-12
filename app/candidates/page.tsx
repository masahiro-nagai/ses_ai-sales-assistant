'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Candidate } from '@/lib/store';
import { Plus, Search, X, Pencil } from 'lucide-react';

const emptyForm = (): Omit<Candidate, 'id' | 'updatedAt'> => ({
  name: '',
  type: '',
  location: '',
  availableFrom: '',
  conditions: '',
  desiredPrice: '',
  strongArea: '',
  mainSkills: '',
  achievement1: '',
  achievement2: '',
  customerStrength: '',
  aiExperience: '',
  recommendationText: '',
  ngConditions: '',
  skillSheet: '',
  portfolio: '',
  status: '可',
});

const TEXT_FIELDS = [
  { label: '氏名 *', name: 'name' },
  { label: '種別（正社員/フリーランス等）', name: 'type' },
  { label: '所在地', name: 'location' },
  { label: '稼働可能日', name: 'availableFrom' },
  { label: '稼働条件', name: 'conditions' },
  { label: '希望単価', name: 'desiredPrice' },
  { label: '得意領域', name: 'strongArea' },
  { label: '主要スキル', name: 'mainSkills' },
  { label: '実績①', name: 'achievement1' },
  { label: '実績②', name: 'achievement2' },
  { label: '対顧客の強み', name: 'customerStrength' },
  { label: 'AI関連経験', name: 'aiExperience' },
  { label: 'NGな条件', name: 'ngConditions' },
  { label: 'スキルシートURL/情報', name: 'skillSheet' },
  { label: 'ポートフォリオURL/情報', name: 'portfolio' },
];

const TEXTAREA_FIELDS = [
  { label: '推薦テキスト', name: 'recommendationText' },
];

function CandidateForm({
  form,
  onChange,
}: {
  form: Omit<Candidate, 'id' | 'updatedAt'>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="p-6 space-y-4">
      {TEXT_FIELDS.map(({ label, name }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input
            type="text"
            name={name}
            value={(form as Record<string, string>)[name] ?? ''}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      ))}
      {TEXTAREA_FIELDS.map(({ label, name }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <textarea
            name={name}
            value={(form as Record<string, string>)[name] ?? ''}
            onChange={onChange}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      ))}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
        <select
          name="status"
          value={form.status}
          onChange={onChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="可">可</option>
          <option value="保留">保留</option>
          <option value="停止">停止</option>
        </select>
      </div>
    </div>
  );
}

export default function CandidatesPage() {
  const { candidates, addCandidate, updateCandidate } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  // 追加モーダル
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm());
  const [addSaving, setAddSaving] = useState(false);

  // 編集モーダル
  const [editTarget, setEditTarget] = useState<Candidate | null>(null);
  const [editForm, setEditForm] = useState<Omit<Candidate, 'id' | 'updatedAt'>>(emptyForm());
  const [editSaving, setEditSaving] = useState(false);

  const filteredCandidates = candidates.filter(c =>
    c.name.includes(searchTerm) || c.mainSkills.includes(searchTerm) || c.strongArea.includes(searchTerm)
  );

  // ── 追加 ──
  const handleOpenAdd = () => {
    setAddForm(emptyForm());
    setShowAddModal(true);
  };

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setAddForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddSubmit = async () => {
    if (!addForm.name.trim()) return;
    setAddSaving(true);
    await addCandidate({ ...addForm, id: crypto.randomUUID(), updatedAt: new Date().toISOString() });
    setAddSaving(false);
    setShowAddModal(false);
  };

  // ── 編集 ──
  const handleOpenEdit = (candidate: Candidate) => {
    setEditTarget(candidate);
    const { id: _id, updatedAt: _updatedAt, ...rest } = candidate;
    setEditForm(rest);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSubmit = async () => {
    if (!editTarget || !editForm.name.trim()) return;
    setEditSaving(true);
    await updateCandidate(editTarget.id, editForm);
    setEditSaving(false);
    setEditTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">候補者マスター</h1>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
          onClick={handleOpenAdd}
        >
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
                <th className="px-6 py-3">最終更新</th>
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
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {candidate.updatedAt ? new Date(candidate.updatedAt).toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleOpenEdit(candidate)}
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

      {/* ── 候補者追加モーダル ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">候補者を追加</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <CandidateForm form={addForm} onChange={handleAddChange} />
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">キャンセル</button>
              <button onClick={handleAddSubmit} disabled={addSaving || !addForm.name.trim()} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium disabled:opacity-50">
                {addSaving ? '保存中...' : '登録'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 候補者編集モーダル ── */}
      {editTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">候補者を編集</h2>
                <p className="text-xs text-gray-500 mt-0.5">{editTarget.name}</p>
              </div>
              <button onClick={() => setEditTarget(null)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <CandidateForm form={editForm} onChange={handleEditChange} />
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
