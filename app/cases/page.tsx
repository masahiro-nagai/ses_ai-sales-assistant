'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ProjectCase, Candidate } from '@/lib/store';
import { parseCaseFromText } from '@/lib/gemini';
import { Plus, Search, X, Pencil, Sparkles, Loader2, PenLine, ChevronRight, Users } from 'lucide-react';

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

const formatBudget = (b: string) => {
  const n = parseInt(b, 10);
  return isNaN(n) ? '—' : `¥${n.toLocaleString('ja-JP')}`;
};

// ── 案件サマリーモーダル ──
function SummaryModal({
  caseItem,
  onClose,
  onEdit,
  onPropose,
}: {
  caseItem: ProjectCase;
  onClose: () => void;
  onEdit: () => void;
  onPropose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-start p-6 border-b border-gray-100">
          <div className="flex-1 pr-4">
            <h2 className="text-lg font-bold text-gray-900">{caseItem.title}</h2>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[caseItem.status] || 'bg-gray-100 text-gray-700'}`}>
                {caseItem.status}
              </span>
              {caseItem.workStyle && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">{caseItem.workStyle}</span>
              )}
              {caseItem.startDate && (
                <span className="text-xs text-gray-500">開始: {caseItem.startDate}</span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0"><X className="h-5 w-5" /></button>
        </div>

        {/* サマリー本体 */}
        <div className="p-6 space-y-5">
          {/* 単価・開始時期 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">単価（上限）</div>
              <div className="text-sm font-semibold text-gray-900">{formatBudget(caseItem.budget)}</div>
              {caseItem.settlementRange && <div className="text-xs text-gray-500 mt-0.5">精算: {caseItem.settlementRange}</div>}
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">開始時期</div>
              <div className="text-sm font-semibold text-gray-900">{caseItem.startDate || '—'}</div>
              {caseItem.period && <div className="text-xs text-gray-500 mt-0.5">期間: {caseItem.period}</div>}
            </div>
          </div>

          {/* 業務内容 */}
          {caseItem.description && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">業務内容</div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{caseItem.description}</p>
            </div>
          )}

          {/* 必須スキル */}
          {caseItem.requiredSkills && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">必須スキル</div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{caseItem.requiredSkills}</p>
            </div>
          )}

          {/* 尚可スキル */}
          {caseItem.preferredSkills && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">尚可スキル</div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{caseItem.preferredSkills}</p>
            </div>
          )}

          {/* 開発環境・技術スタック */}
          {caseItem.techStack && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">開発環境・技術スタック</div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{caseItem.techStack}</p>
            </div>
          )}

          {/* 備考 */}
          {caseItem.memo && (
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
              <div className="text-xs font-semibold text-yellow-700 mb-1">備考</div>
              <p className="text-sm text-yellow-800 whitespace-pre-wrap">{caseItem.memo}</p>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="flex justify-between items-center px-6 pb-6 gap-3 flex-wrap">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">閉じる</button>
          <div className="flex items-center gap-2">
            <button
              onClick={onPropose}
              className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium flex items-center gap-2"
            >
              <Users className="h-4 w-4" />人材を提案
            </button>
            <button
              onClick={onEdit}
              className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />案件詳細・編集
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── フォーム ──
function CaseForm({
  form,
  onChange,
}: {
  form: Omit<ProjectCase, 'id' | 'updatedAt'>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">案件名 *</label>
        <input type="text" name="title" value={form.title} onChange={onChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">案件内容</label>
        <textarea name="description" value={form.description} onChange={onChange} rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">必須スキル</label>
        <textarea name="requiredSkills" value={form.requiredSkills} onChange={onChange} rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">尚可スキル</label>
        <textarea name="preferredSkills" value={form.preferredSkills} onChange={onChange} rows={2}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">単価（上限）</label>
        <div className="flex items-center gap-2">
          <input type="number" name="budget" value={form.budget} onChange={onChange} placeholder="800000"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <span className="text-sm text-gray-500">円/月</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">幅がある場合は上限を入力し、下限は備考に記載してください</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">精算幅</label>
        <input type="text" name="settlementRange" value={form.settlementRange} onChange={onChange} placeholder="例: 140h-180h"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">勤務地</label>
        <input type="text" name="workLocation" value={form.workLocation} onChange={onChange} placeholder="例: フルリモート、渋谷区"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">稼働日数</label>
        <input type="text" name="workDays" value={form.workDays} onChange={onChange} placeholder="例: 週5日"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">勤務時間</label>
        <input type="text" name="workHours" value={form.workHours} onChange={onChange} placeholder="例: 9:30〜18:30"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">開始時期</label>
        <input type="text" name="startDate" value={form.startDate} onChange={onChange} placeholder="例: 即日"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">期間</label>
        <input type="text" name="period" value={form.period} onChange={onChange} placeholder="例: 長期、3ヶ月〜"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">開発環境・技術スタック</label>
        <textarea name="techStack" value={form.techStack} onChange={onChange} rows={2} placeholder="例: Ruby on Rails, React, AWS"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">商流</label>
        <input type="text" name="commercialFlow" value={form.commercialFlow} onChange={onChange} placeholder="例: エンド→弊社"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">面談回数</label>
        <input type="text" name="interviewCount" value={form.interviewCount} onChange={onChange} placeholder="例: 1回（弊社同席）"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">募集人数</label>
        <input type="text" name="headcount" value={form.headcount} onChange={onChange} placeholder="例: 1名"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">支払いサイト</label>
        <input type="text" name="paymentTerms" value={form.paymentTerms} onChange={onChange} placeholder="例: 基本45日サイト"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">年齢制限</label>
        <input type="text" name="ageLimit" value={form.ageLimit} onChange={onChange} placeholder="例: 40代前半まで"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">備考</label>
        <textarea name="memo" value={form.memo} onChange={onChange} rows={3}
          placeholder="単価幅など補足情報（例: 単価80〜90万、スキル見合い）"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
    </div>
  );
}

// ── 追加モーダル ──
type AddStep = 'select' | 'text' | 'loading' | 'review';

function AddModal({ onClose, onSave }: { onClose: () => void; onSave: (form: Omit<ProjectCase, 'id' | 'updatedAt'>) => Promise<void> }) {
  const [step, setStep] = useState<AddStep>('select');
  const [summaryText, setSummaryText] = useState('');
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleParse = async () => {
    if (!summaryText.trim()) return;
    setStep('loading');
    setError('');
    try {
      const parsed = await parseCaseFromText(summaryText.trim());
      setForm({ ...emptyForm(), ...parsed, status: '募集中' });
      setStep('review');
    } catch (e: unknown) {
      setStep('text');
      setError(e instanceof Error ? e.message : 'AI解析に失敗しました');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">案件を追加</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {step === 'select' && 'Step 1: 入力方法を選択'}
              {step === 'text' && 'Step 2: 案件サマリーを貼り付け'}
              {step === 'loading' && 'AI が解析中...'}
              {step === 'review' && (summaryText ? 'Step 3: 内容を確認・修正して登録' : '手入力で登録')}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
        </div>

        {step === 'select' && (
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600">案件の登録方法を選択してください。</p>
            <button onClick={() => setStep('text')} className="w-full flex items-center gap-4 p-4 border-2 border-indigo-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-400 transition-colors text-left">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">案件サマリーから自動入力</div>
                <div className="text-xs text-gray-500 mt-0.5">テキストを貼り付けるとAIが各項目を自動入力します</div>
              </div>
            </button>
            <button onClick={() => { setForm(emptyForm()); setStep('review'); }} className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-colors text-left">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <PenLine className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">手入力で登録</div>
                <div className="text-xs text-gray-500 mt-0.5">各項目を自分で入力して登録します</div>
              </div>
            </button>
          </div>
        )}

        {step === 'text' && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">案件サマリーテキスト</label>
              <textarea value={summaryText} onChange={(e) => setSummaryText(e.target.value)} rows={10}
                placeholder="メールや資料から案件情報をそのままコピー＆ペーストしてください..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
            </div>
            <div className="flex justify-between gap-3">
              <button onClick={() => setStep('select')} className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">← 戻る</button>
              <button onClick={handleParse} disabled={!summaryText.trim()} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium flex items-center gap-2 disabled:opacity-50">
                <Sparkles className="h-4 w-4" />AI解析して自動入力
              </button>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-sm font-medium text-gray-700">AIが案件情報を解析中...</p>
          </div>
        )}

        {step === 'review' && (
          <>
            {summaryText && (
              <div className="px-6 pt-4">
                <div className="bg-indigo-50 border border-indigo-100 rounded-md p-3 text-xs text-indigo-700">
                  ✅ AIが案件情報を抽出しました。内容を確認・修正してから登録してください。
                </div>
              </div>
            )}
            <CaseForm form={form} onChange={handleChange} />
            <div className="flex justify-between gap-3 px-6 pb-6">
              <button onClick={() => setStep(summaryText ? 'text' : 'select')} className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">← 戻る</button>
              <div className="flex gap-2">
                <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">キャンセル</button>
                <button onClick={handleSubmit} disabled={saving || !form.title.trim()} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium disabled:opacity-50">
                  {saving ? '保存中...' : '登録'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── メインページ ──
export default function CasesPage() {
  const { cases, candidates, addCase, updateCase, addProposal } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [summaryCase, setSummaryCase] = useState<ProjectCase | null>(null);
  const [editTarget, setEditTarget] = useState<ProjectCase | null>(null);
  const [editForm, setEditForm] = useState<Omit<ProjectCase, 'id' | 'updatedAt'>>(emptyForm());
  const [editSaving, setEditSaving] = useState(false);

  // 提案モーダル用 state
  const [proposeCase, setProposeCase] = useState<ProjectCase | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [proposalMethod, setProposalMethod] = useState('');
  const [proposalAmount, setProposalAmount] = useState('');
  const [proposalMemo, setProposalMemo] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [proposalSaving, setProposalSaving] = useState(false);

  const handleOpenPropose = (c: ProjectCase) => {
    setSummaryCase(null);
    setProposeCase(c);
    setSelectedCandidateId('');
    setProposalMethod('');
    setProposalAmount('');
    setProposalMemo('');
    setGeneratedText('');
  };

  const handleGenerateRecommendation = async () => {
    const candidate = candidates.find(c => c.id === selectedCandidateId);
    if (!candidate || !proposeCase) return;
    setAiGenerating(true);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'proposalRecommendation', payload: { caseItem: proposeCase, candidate } }),
      });
      const data = await res.json();
      setGeneratedText(data.text || '');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleProposalSave = async () => {
    if (!proposeCase || !selectedCandidateId) return;
    setProposalSaving(true);
    await addProposal({
      id: crypto.randomUUID(),
      caseId: proposeCase.id,
      candidateId: selectedCandidateId,
      status: '提案中',
      writer: '',
      proposalMethod,
      proposalAmount,
      recommendationText: generatedText,
      memo: proposalMemo,
      updatedAt: new Date().toISOString(),
    });
    setProposalSaving(false);
    setProposeCase(null);
  };

  const filteredCases = cases.filter(c =>
    c.title.includes(searchTerm) || c.requiredSkills.includes(searchTerm) || c.techStack.includes(searchTerm)
  );

  const handleAddSave = async (form: Omit<ProjectCase, 'id' | 'updatedAt'>) => {
    await addCase({ ...form, id: crypto.randomUUID(), updatedAt: new Date().toISOString() });
    setShowAddModal(false);
  };

  const handleOpenEdit = (c: ProjectCase) => {
    setSummaryCase(null);
    setEditTarget(c);
    const { id: _id, updatedAt: _updatedAt, ...rest } = c;
    setEditForm(rest);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEditSubmit = async () => {
    if (!editTarget || !editForm.title.trim()) return;
    setEditSaving(true);
    await updateCase(editTarget.id, editForm);
    setEditSaving(false);
    setEditTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">案件マスター</h1>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center" onClick={() => setShowAddModal(true)}>
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
              </tr>
            </thead>
            <tbody>
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-sm">
                    登録された案件がありません。「案件を追加」から登録してください。
                  </td>
                </tr>
              ) : filteredCases.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{c.title}</div>
                    {c.commercialFlow && <div className="text-xs text-gray-400 mt-0.5">{c.commercialFlow}</div>}
                    <button
                      type="button"
                      onClick={() => setSummaryCase(c)}
                      className="text-xs text-indigo-600 hover:underline mt-1 block"
                    >
                      詳細を見る
                    </button>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 追加モーダル */}
      {showAddModal && <AddModal onClose={() => setShowAddModal(false)} onSave={handleAddSave} />}

      {/* サマリーモーダル */}
      {summaryCase && (
        <SummaryModal
          caseItem={summaryCase}
          onClose={() => setSummaryCase(null)}
          onEdit={() => handleOpenEdit(summaryCase)}
          onPropose={() => handleOpenPropose(summaryCase)}
        />
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
            <CaseForm form={editForm} onChange={handleEditChange} />
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button onClick={() => setEditTarget(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">キャンセル</button>
              <button onClick={handleEditSubmit} disabled={editSaving || !editForm.title.trim()} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium disabled:opacity-50">
                {editSaving ? '保存中...' : '変更を保存'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 人材提案モーダル */}
      {proposeCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">人材を提案</h2>
                <p className="text-xs text-gray-500 mt-0.5">{proposeCase.title}</p>
              </div>
              <button onClick={() => setProposeCase(null)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* 人材選択 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">人材を選択 *</label>
                <select value={selectedCandidateId} onChange={e => setSelectedCandidateId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">候補者を選択してください</option>
                  {candidates.map(c => <option key={c.id} value={c.id}>{c.name}（{c.type || 'その他'}）</option>)}
                </select>
              </div>

              {/* AI推薦文生成 */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">推薦文</label>
                  <button type="button" onClick={handleGenerateRecommendation}
                    disabled={!selectedCandidateId || aiGenerating}
                    className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md disabled:opacity-50">
                    {aiGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                    {aiGenerating ? 'AI生成中...' : 'AI推薦文を生成'}
                  </button>
                </div>
                {!selectedCandidateId && <p className="text-xs text-gray-400 mb-1">人材を選択するとAI推薦文を生成できます</p>}
                {selectedCandidateId && !generatedText && !aiGenerating && (
                  <p className="text-xs text-amber-600 mb-1">「AI推薦文を生成」ボタンで案件×面談議事録から推薦文を自動生成します</p>
                )}
                <textarea value={generatedText} onChange={e => setGeneratedText(e.target.value)} rows={10}
                  placeholder="AIが生成した推薦文がここに表示されます。直接編集もできます。"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              {/* 提案方法 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">提案方法</label>
                <input type="text" value={proposalMethod} onChange={e => setProposalMethod(e.target.value)} placeholder="例: メール、電話"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              {/* 提案金額 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">提案金額</label>
                <input type="text" value={proposalAmount} onChange={e => setProposalAmount(e.target.value)} placeholder="例: 月80万円"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              {/* メモ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">メモ</label>
                <textarea value={proposalMemo} onChange={e => setProposalMemo(e.target.value)} rows={3}
                  placeholder="補足情報など..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button onClick={() => setProposeCase(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">キャンセル</button>
              <button onClick={handleProposalSave} disabled={proposalSaving || !selectedCandidateId}
                className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium disabled:opacity-50">
                {proposalSaving ? '保存中...' : '提案を登録'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
