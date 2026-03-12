'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Candidate } from '@/lib/store';
import { Plus, Search, X, Pencil } from 'lucide-react';

const PREFECTURES = [
  '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県',
  '茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
  '新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県',
  '静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県',
  '奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県',
  '徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県',
  '熊本県','大分県','宮崎県','鹿児島県','沖縄県','海外',
];

const emptyForm = (): Omit<Candidate, 'id' | 'updatedAt'> => ({
  name: '',
  type: '',
  location: '',
  availableFrom: '',
  conditions: '',
  priceType: '',
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

/** ¥1,000,000 形式でフォーマット */
const formatPrice = (priceType: string, desiredPrice: string) => {
  if (!priceType && !desiredPrice) return '—';
  const num = parseInt(desiredPrice.replace(/[^0-9]/g, ''), 10);
  const formatted = isNaN(num) ? desiredPrice : `¥${num.toLocaleString('ja-JP')}`;
  return priceType ? `${priceType} ${formatted}` : formatted;
};

const TEXT_FIELDS: { label: string; name: string }[] = [
  { label: '種別（正社員/フリーランス等）', name: 'type' },
  { label: '稼働可能日', name: 'availableFrom' },
  { label: '稼働条件', name: 'conditions' },
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

const TEXTAREA_FIELDS: { label: string; name: string }[] = [
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
      {/* 氏名 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">氏名 *</label>
        <input type="text" name="name" value={form.name} onChange={onChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* 種別 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">種別（正社員/フリーランス等）</label>
        <input type="text" name="type" value={form.type} onChange={onChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* 居住地（都道府県） */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">居住地</label>
        <select name="location" value={form.location} onChange={onChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">選択してください</option>
          {PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* 希望単価（種別＋金額） */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">希望単価</label>
        <div className="flex gap-2">
          <select name="priceType" value={form.priceType} onChange={onChange}
            className="w-36 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">種別を選択</option>
            <option value="時給">時給</option>
            <option value="月給">月給</option>
            <option value="準委任">準委任</option>
          </select>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">¥</span>
            <input
              type="number"
              name="desiredPrice"
              value={form.desiredPrice}
              onChange={onChange}
              placeholder={form.priceType === '時給' ? '3000' : '500000'}
              min="0"
              className="w-full border border-gray-300 rounded-md pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {form.priceType === '時給' ? '例: 3000（時給3,000円）' : form.priceType === '月給' ? '例: 500000（月給50万円）' : '種別を選択すると入力例が表示されます'}
        </p>
      </div>

      {/* その他テキストフィールド */}
      {TEXT_FIELDS.filter(f => f.name !== 'name' && f.name !== 'type').map(({ label, name }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input type="text" name={name} value={(form as Record<string, string>)[name] ?? ''} onChange={onChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      ))}

      {/* テキストエリア */}
      {TEXTAREA_FIELDS.map(({ label, name }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <textarea name={name} value={(form as Record<string, string>)[name] ?? ''} onChange={onChange} rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      ))}

      {/* ステータス */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
        <select name="status" value={form.status} onChange={onChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
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

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm());
  const [addSaving, setAddSaving] = useState(false);

  const [editTarget, setEditTarget] = useState<Candidate | null>(null);
  const [editForm, setEditForm] = useState<Omit<Candidate, 'id' | 'updatedAt'>>(emptyForm());
  const [editSaving, setEditSaving] = useState(false);

  const filteredCandidates = candidates.filter(c =>
    c.name.includes(searchTerm) || c.mainSkills.includes(searchTerm) || c.strongArea.includes(searchTerm)
  );

  const handleOpenAdd = () => { setAddForm(emptyForm()); setShowAddModal(true); };
  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setAddForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleAddSubmit = async () => {
    if (!addForm.name.trim()) return;
    setAddSaving(true);
    await addCandidate({ ...addForm, id: crypto.randomUUID(), updatedAt: new Date().toISOString() });
    setAddSaving(false);
    setShowAddModal(false);
  };

  const handleOpenEdit = (candidate: Candidate) => {
    setEditTarget(candidate);
    const { id: _id, updatedAt: _updatedAt, ...rest } = candidate;
    setEditForm({ ...rest, priceType: rest.priceType ?? '' });
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center" onClick={handleOpenAdd}>
          <Plus className="h-4 w-4 mr-2" />候補者を追加
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="名前やスキルで検索..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">氏名</th>
                <th className="px-6 py-3">居住地</th>
                <th className="px-6 py-3">得意領域</th>
                <th className="px-6 py-3">主要スキル</th>
                <th className="px-6 py-3">希望単価</th>
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
                  <td className="px-6 py-4 text-gray-700">{candidate.location || '—'}</td>
                  <td className="px-6 py-4 text-gray-700">{candidate.strongArea}</td>
                  <td className="px-6 py-4 text-gray-700">{candidate.mainSkills}</td>
                  <td className="px-6 py-4 text-gray-700 text-xs whitespace-nowrap">
                    {formatPrice(candidate.priceType ?? '', candidate.desiredPrice)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      candidate.status === '可' ? 'bg-emerald-100 text-emerald-700' :
                      candidate.status === '保留' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'}`}>
                      {candidate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {candidate.updatedAt ? new Date(candidate.updatedAt).toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleOpenEdit(candidate)} className="text-indigo-600 hover:text-indigo-900 font-medium text-sm flex items-center gap-1">
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

      {/* 編集モーダル */}
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
