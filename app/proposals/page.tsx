'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Proposal, ProjectCase, Candidate } from '@/lib/store';
import { Plus, Search, X, Pencil, ChevronRight, Briefcase, User } from 'lucide-react';

// ── ステータス色 ──
const STATUS_COLORS: Record<string, string> = {
  '提案中': 'bg-blue-100 text-blue-700',
  '面談調整中': 'bg-yellow-100 text-yellow-700',
  '面談済み': 'bg-purple-100 text-purple-700',
  '内内決定': 'bg-emerald-100 text-emerald-700',
  '不合格': 'bg-red-100 text-red-700',
  '取り下げ': 'bg-gray-100 text-gray-500',
};

const STATUSES = ['提案中', '面談調整中', '面談済み', '内内決定', '不合格', '取り下げ'] as const;

const emptyForm = (): Omit<Proposal, 'id' | 'updatedAt'> => ({
  caseId: '',
  candidateId: '',
  status: '提案中',
  writer: '',
  proposalMethod: '',
  proposalAmount: '',
  recommendationText: '',
  memo: '',
});

// ── 案件サマリーミニモーダル ──
function CaseMiniModal({ caseItem, onClose }: { caseItem: ProjectCase; onClose: () => void }) {
  const formatBudget = (b: string) => { const n = parseInt(b, 10); return isNaN(n) ? '—' : `¥${n.toLocaleString('ja-JP')}`; };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-start p-5 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="h-4 w-4 text-indigo-500" />
              <span className="text-xs text-indigo-500 font-medium">案件詳細</span>
            </div>
            <h2 className="text-base font-bold text-gray-900">{caseItem.title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">単価（上限）</div>
              <div className="text-sm font-semibold">{formatBudget(caseItem.budget)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">開始時期</div>
              <div className="text-sm font-semibold">{caseItem.startDate || '—'}</div>
            </div>
          </div>
          {caseItem.description && (
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-1">業務内容</div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{caseItem.description}</p>
            </div>
          )}
          {caseItem.requiredSkills && (
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-1">必須スキル</div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{caseItem.requiredSkills}</p>
            </div>
          )}
          {caseItem.techStack && (
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-1">開発環境・技術スタック</div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{caseItem.techStack}</p>
            </div>
          )}
        </div>
        <div className="px-5 pb-5">
          <button onClick={onClose} className="w-full py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">閉じる</button>
        </div>
      </div>
    </div>
  );
}

// ── 候補者サマリーミニモーダル ──
function CandidateMiniModal({ candidate, onClose }: { candidate: Candidate; onClose: () => void }) {
  const formatPrice = (priceType: string, desiredPrice: string) => {
    if (!priceType && !desiredPrice) return '—';
    const num = parseInt(desiredPrice.replace(/[^0-9]/g, ''), 10);
    const formatted = isNaN(num) ? desiredPrice : `¥${num.toLocaleString('ja-JP')}`;
    return priceType ? `${priceType} ${formatted}` : formatted;
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-start p-5 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-indigo-500" />
              <span className="text-xs text-indigo-500 font-medium">候補者詳細</span>
            </div>
            <h2 className="text-base font-bold text-gray-900">{candidate.name}</h2>
            {candidate.type && <p className="text-xs text-gray-500 mt-0.5">{candidate.type}</p>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">希望単価</div>
              <div className="text-sm font-semibold">{formatPrice(candidate.priceType ?? '', candidate.desiredPrice)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">居住地</div>
              <div className="text-sm font-semibold">{candidate.location || '—'}</div>
            </div>
          </div>
          {candidate.strongArea && (
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-1">得意領域</div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{candidate.strongArea}</p>
            </div>
          )}
          {candidate.mainSkills && (
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-1">主要スキル</div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{candidate.mainSkills}</p>
            </div>
          )}
          {candidate.recommendationText && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3">
              <div className="text-xs font-semibold text-indigo-600 mb-1">推薦テキスト</div>
              <p className="text-sm text-indigo-900 whitespace-pre-wrap leading-relaxed">{candidate.recommendationText}</p>
            </div>
          )}
        </div>
        <div className="px-5 pb-5">
          <button onClick={onClose} className="w-full py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">閉じる</button>
        </div>
      </div>
    </div>
  );
}

// ── 提案フォーム ──
function ProposalForm({
  form,
  cases,
  candidates,
  onChange,
}: {
  form: Omit<Proposal, 'id' | 'updatedAt'>;
  cases: ProjectCase[];
  candidates: Candidate[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="p-6 space-y-4">
      {/* 案件選択 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">案件 *</label>
        <select name="caseId" value={form.caseId} onChange={onChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">案件を選択してください</option>
          {cases.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      {/* 人材選択 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">人材 *</label>
        <select name="candidateId" value={form.candidateId} onChange={onChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">候補者を選択してください</option>
          {candidates.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* ステータス */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
        <select name="status" value={form.status} onChange={onChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* 記入者 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">記入者</label>
        <input type="text" name="writer" value={form.writer} onChange={onChange} placeholder="例: 山田太郎"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* 提案方法 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">提案方法</label>
        <input type="text" name="proposalMethod" value={form.proposalMethod} onChange={onChange} placeholder="例: メール、電話、営業訪問"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* 提案金額 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">提案金額</label>
        <input type="text" name="proposalAmount" value={form.proposalAmount} onChange={onChange} placeholder="例: 月80万円、時給5,000円"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* 推薦文 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">推薦文</label>
        <textarea name="recommendationText" value={form.recommendationText} onChange={onChange} rows={6}
          placeholder="この提案に使用した推薦文を記録しておきましょう"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* メモ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">メモ</label>
        <textarea name="memo" value={form.memo} onChange={onChange} rows={3}
          placeholder="提案の補足情報、1次面談の感触など..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
    </div>
  );
}

// ── メインページ ──
export default function ProposalsPage() {
  const { proposals, cases, candidates, addProposal, updateProposal } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm());
  const [addSaving, setAddSaving] = useState(false);

  const [editTarget, setEditTarget] = useState<Proposal | null>(null);
  const [editForm, setEditForm] = useState<Omit<Proposal, 'id' | 'updatedAt'>>(emptyForm());
  const [editSaving, setEditSaving] = useState(false);

  // サマリー表示用
  const [previewCase, setPreviewCase] = useState<ProjectCase | null>(null);
  const [previewCandidate, setPreviewCandidate] = useState<Candidate | null>(null);

  const getCaseName = (id: string) => cases.find(c => c.id === id)?.title ?? '（削除済み）';
  const getCandidateName = (id: string) => candidates.find(c => c.id === id)?.name ?? '（削除済み）';

  const filtered = proposals.filter(p => {
    const caseName = getCaseName(p.caseId);
    const candidateName = getCandidateName(p.candidateId);
    return caseName.includes(searchTerm) || candidateName.includes(searchTerm) || p.writer.includes(searchTerm) || p.status.includes(searchTerm);
  }).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const makeChangeHandler = (setter: React.Dispatch<React.SetStateAction<Omit<Proposal, 'id' | 'updatedAt'>>>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setter(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAddSubmit = async () => {
    if (!addForm.caseId || !addForm.candidateId) return;
    setAddSaving(true);
    await addProposal({ ...addForm, id: crypto.randomUUID(), updatedAt: new Date().toISOString() });
    setAddSaving(false);
    setShowAddModal(false);
    setAddForm(emptyForm());
  };

  const handleOpenEdit = (p: Proposal) => {
    setEditTarget(p);
    const { id: _id, updatedAt: _updatedAt, ...rest } = p;
    setEditForm(rest);
  };

  const handleEditSubmit = async () => {
    if (!editTarget) return;
    setEditSaving(true);
    await updateProposal(editTarget.id, editForm);
    setEditSaving(false);
    setEditTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">提案マスター</h1>
        <button onClick={() => { setAddForm(emptyForm()); setShowAddModal(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center">
          <Plus className="h-4 w-4 mr-2" />提案を追加
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="案件名・人材名・記入者・ステータスで検索..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">案件名</th>
                <th className="px-6 py-3">人材名</th>
                <th className="px-6 py-3">ステータス</th>
                <th className="px-6 py-3">記入者</th>
                <th className="px-6 py-3">提案方法</th>
                <th className="px-6 py-3">提案金額</th>
                <th className="px-6 py-3">最終更新</th>
                <th className="px-6 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400 text-sm">
                    提案が登録されていません。「提案を追加」から登録してください。
                  </td>
                </tr>
              ) : filtered.map((p) => {
                const caseItem = cases.find(c => c.id === p.caseId);
                const candidateItem = candidates.find(c => c.id === p.candidateId);
                return (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                    {/* 案件名 */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 text-sm">{getCaseName(p.caseId)}</div>
                      {caseItem && (
                        <button type="button" onClick={() => setPreviewCase(caseItem)}
                          className="text-xs text-indigo-600 hover:underline mt-0.5 block">
                          詳細を見る
                        </button>
                      )}
                    </td>
                    {/* 人材名 */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 text-sm">{getCandidateName(p.candidateId)}</div>
                      {candidateItem && (
                        <button type="button" onClick={() => setPreviewCandidate(candidateItem)}
                          className="text-xs text-indigo-600 hover:underline mt-0.5 block">
                          詳細を見る
                        </button>
                      )}
                    </td>
                    {/* ステータス */}
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[p.status] || 'bg-gray-100 text-gray-600'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-xs">{p.writer || '—'}</td>
                    <td className="px-6 py-4 text-gray-700 text-xs">{p.proposalMethod || '—'}</td>
                    <td className="px-6 py-4 text-gray-700 text-xs whitespace-nowrap">{p.proposalAmount || '—'}</td>
                    <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {p.updatedAt ? new Date(p.updatedAt).toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <button type="button" onClick={() => handleOpenEdit(p)}
                        className="text-indigo-600 hover:text-indigo-900 font-medium text-sm flex items-center gap-1">
                        <Pencil className="h-3.5 w-3.5" />編集
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 案件サマリーモーダル */}
      {previewCase && <CaseMiniModal caseItem={previewCase} onClose={() => setPreviewCase(null)} />}

      {/* 候補者サマリーモーダル */}
      {previewCandidate && <CandidateMiniModal candidate={previewCandidate} onClose={() => setPreviewCandidate(null)} />}

      {/* 追加モーダル */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">提案を追加</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <ProposalForm form={addForm} cases={cases} candidates={candidates} onChange={makeChangeHandler(setAddForm)} />
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">キャンセル</button>
              <button onClick={handleAddSubmit} disabled={addSaving || !addForm.caseId || !addForm.candidateId}
                className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium disabled:opacity-50">
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
                <h2 className="text-lg font-bold text-gray-900">提案を編集</h2>
                <p className="text-xs text-gray-500 mt-0.5">{getCaseName(editTarget.caseId)} × {getCandidateName(editTarget.candidateId)}</p>
              </div>
              <button onClick={() => setEditTarget(null)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <ProposalForm form={editForm} cases={cases} candidates={candidates} onChange={makeChangeHandler(setEditForm)} />
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button onClick={() => setEditTarget(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">キャンセル</button>
              <button onClick={handleEditSubmit} disabled={editSaving}
                className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium disabled:opacity-50">
                {editSaving ? '保存中...' : '変更を保存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
