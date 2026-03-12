'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Candidate } from '@/lib/store';
import { generateRecommendationFromInterview } from '@/lib/gemini';
import { Plus, Search, X, Pencil, Sparkles, Loader2, Check, Copy } from 'lucide-react';

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

const formatPrice = (priceType: string, desiredPrice: string) => {
  if (!priceType && !desiredPrice) return '—';
  const num = parseInt(desiredPrice.replace(/[^0-9]/g, ''), 10);
  const formatted = isNaN(num) ? desiredPrice : `¥${num.toLocaleString('ja-JP')}`;
  return priceType ? `${priceType} ${formatted}` : formatted;
};

/** パターンテキストを配列に分割 */
const splitPatterns = (text: string): string[] => {
  const parts = text.split(/【パターン[123]】/).filter(s => s.trim());
  return parts.length === 3 ? parts.map(s => s.trim()) : [text];
};

// ── 推薦文AI生成セクション ──
function RecommendationGenerator({
  candidateName,
  onInsert,
}: {
  candidateName: string;
  onInsert: (text: string) => void;
}) {
  const [interviewText, setInterviewText] = useState('');
  const [generating, setGenerating] = useState(false);
  const [patterns, setPatterns] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!interviewText.trim()) return;
    setGenerating(true);
    setError('');
    setPatterns([]);
    try {
      const result = await generateRecommendationFromInterview(interviewText, candidateName);
      setPatterns(splitPatterns(result));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'AI推薦文の生成に失敗しました');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="border border-indigo-100 rounded-lg bg-indigo-50 p-4 space-y-3">
      <div className="flex items-center gap-2 text-indigo-700 text-sm font-medium">
        <Sparkles className="h-4 w-4" />
        <span>面談議事録からAI推薦文を生成</span>
      </div>
      <textarea
        value={interviewText}
        onChange={(e) => setInterviewText(e.target.value)}
        rows={5}
        placeholder="面談の内容、経歴、スキル、エピソードなどをここに貼り付けてください..."
        className="w-full border border-indigo-200 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        onClick={handleGenerate}
        disabled={generating || !interviewText.trim()}
        className="w-full py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {generating ? <><Loader2 className="h-4 w-4 animate-spin" />生成中...</> : <><Sparkles className="h-4 w-4" />推薦文を生成（3パターン）</>}
      </button>

      {patterns.length > 0 && (
        <div className="space-y-3 mt-2">
          {patterns.map((pat, i) => (
            <div key={i} className="bg-white border border-indigo-200 rounded-md p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-indigo-600">パターン {i + 1}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleCopy(pat, i)} className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                    {copiedIdx === i ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                    {copiedIdx === i ? 'コピー済み' : 'コピー'}
                  </button>
                  <button onClick={() => onInsert(pat)} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                    推薦テキストに使用
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">{pat}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── 候補者フォーム ──
function CandidateForm({
  form,
  onChange,
  onInsertRecommendation,
}: {
  form: Omit<Candidate, 'id' | 'updatedAt'>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onInsertRecommendation: (text: string) => void;
}) {
  const textFields = [
    { label: '種別（正社員/フリーランス等）', name: 'type' },
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

      {/* 稼働可能日 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">稼働可能日</label>
        <input
          type="date"
          name="availableFrom"
          value={form.availableFrom}
          onChange={onChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {form.availableFrom && (
          <p className="text-xs text-gray-400 mt-1">
            {new Date(form.availableFrom).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}
      </div>

      {/* 希望単価 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">希望単価</label>
        <div className="flex gap-2">
          <select name="priceType" value={form.priceType} onChange={onChange}
            className="w-32 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">種別を選択</option>
            <option value="時給">時給</option>
            <option value="月給">月給</option>
          </select>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">¥</span>
            <input type="number" name="desiredPrice" value={form.desiredPrice} onChange={onChange}
              placeholder={form.priceType === '時給' ? '3000' : '500000'}
              min="0"
              className="w-full border border-gray-300 rounded-md pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        {(form.priceType || form.desiredPrice) && (
          <p className="text-xs text-gray-400 mt-1">{formatPrice(form.priceType, form.desiredPrice)}</p>
        )}
      </div>

      {/* その他テキストフィールド */}
      {textFields.map(({ label, name }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input type="text" name={name} value={(form as Record<string, string>)[name] ?? ''} onChange={onChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      ))}

      {/* AI推薦文生成 */}
      <RecommendationGenerator candidateName={form.name} onInsert={onInsertRecommendation} />

      {/* 推薦テキスト */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">推薦テキスト</label>
        <textarea name="recommendationText" value={form.recommendationText} onChange={onChange} rows={5}
          placeholder="AIが生成した推薦文をここに貼り付け・編集できます"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

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

// ── メインページ ──
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

  const makeChangeHandler = (setter: React.Dispatch<React.SetStateAction<Omit<Candidate, 'id' | 'updatedAt'>>>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setter(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleOpenAdd = () => { setAddForm(emptyForm()); setShowAddModal(true); };
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
  const handleEditSubmit = async () => {
    if (!editTarget || !editForm.name.trim()) return;
    setEditSaving(true);
    await updateCandidate(editTarget.id, editForm);
    setEditSaving(false);
    setEditTarget(null);
  };

  const formatAvailableFrom = (v: string) => {
    if (!v) return '—';
    try { return new Date(v).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch { return v; }
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
                <th className="px-6 py-3">希望単価</th>
                <th className="px-6 py-3">稼働可能日</th>
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
                  <td className="px-6 py-4 text-gray-700 text-xs">{candidate.location || '—'}</td>
                  <td className="px-6 py-4 text-gray-700">{candidate.strongArea}</td>
                  <td className="px-6 py-4 text-gray-700 text-xs whitespace-nowrap">
                    {formatPrice(candidate.priceType ?? '', candidate.desiredPrice)}
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-xs whitespace-nowrap">
                    {formatAvailableFrom(candidate.availableFrom)}
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
            <CandidateForm
              form={addForm}
              onChange={makeChangeHandler(setAddForm)}
              onInsertRecommendation={(text) => setAddForm(prev => ({ ...prev, recommendationText: text }))}
            />
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
            <CandidateForm
              form={editForm}
              onChange={makeChangeHandler(setEditForm)}
              onInsertRecommendation={(text) => setEditForm(prev => ({ ...prev, recommendationText: text }))}
            />
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
