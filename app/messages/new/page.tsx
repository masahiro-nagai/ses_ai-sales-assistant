'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { analyzeCompany, evaluateMatch, generateMessage } from '@/lib/gemini';
import { Loader2, Sparkles, PenTool, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NewMessagePage() {
  const router = useRouter();
  const { companies, candidates, updateCompany, addLog } = useAppStore();
  
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [matchResult, setMatchResult] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [humanLine, setHumanLine] = useState('');
  
  const [templateType, setTemplateType] = useState('フォーム営業');

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);
  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);

  const handleAnalyzeCompany = async () => {
    if (!selectedCompany) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeCompany(selectedCompany);
      updateCompany(selectedCompany.id, { aiAnalysis: result });
    } catch (error) {
      console.error(error);
      alert('企業分析に失敗しました。APIキーが設定されているか確認してください。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEvaluateMatch = async () => {
    if (!selectedCompany || !selectedCompany.aiAnalysis || !selectedCandidate) return;
    setIsMatching(true);
    try {
      const result = await evaluateMatch(selectedCompany.aiAnalysis, selectedCandidate);
      setMatchResult(result);
    } catch (error) {
      console.error(error);
      alert('マッチング評価に失敗しました。');
    } finally {
      setIsMatching(false);
    }
  };

  const handleGenerateMessage = async () => {
    if (!selectedCompany || !selectedCompany.aiAnalysis || !selectedCandidate) return;
    setIsGenerating(true);
    try {
      const result = await generateMessage(
        selectedCompany.name,
        selectedCompany.aiAnalysis,
        "AI分析結果に基づく最適な仮説", 
        selectedCandidate,
        templateType
      );
      setGeneratedMessage(result);
    } catch (error) {
      console.error(error);
      alert('メッセージ生成に失敗しました。');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveLog = () => {
    if (!selectedCompany || !selectedCandidate) return;
    
    addLog({
      id: `S-${Date.now()}`,
      date: new Date().toISOString(),
      companyId: selectedCompany.id,
      candidateId: selectedCandidate.id,
      channel: templateType,
      subject: 'ご提案の件',
      hook: '',
      hypothesis: '',
      body: generatedMessage,
      humanLine: humanLine,
      hasReply: false,
      result: '未定',
      reactionReason: '',
      nextAction: '',
      memo: ''
    });
    
    alert('送信ログを保存しました。');
    router.push('/logs');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <h1 className="text-2xl font-bold text-gray-900">パーソナライズ送信文作成</h1>

      {/* Step 1: 企業選択と分析 */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 border-b pb-2">1. 企業選択と分析</h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">送信先企業</label>
            <select 
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
            >
              <option value="">企業を選択してください</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.industry})</option>
              ))}
            </select>
          </div>
          <button 
            onClick={handleAnalyzeCompany}
            disabled={!selectedCompanyId || isAnalyzing}
            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-md font-medium flex items-center disabled:opacity-50"
          >
            {isAnalyzing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            AIで企業分析
          </button>
        </div>

        {selectedCompany?.aiAnalysis && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-2">AI分析結果</h3>
            <div className="text-sm text-gray-600 whitespace-pre-wrap font-mono">
              {selectedCompany.aiAnalysis}
            </div>
          </div>
        )}
      </div>

      {/* Step 2: 候補者選択とマッチング */}
      <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4 ${!selectedCompany?.aiAnalysis ? 'opacity-50 pointer-events-none' : ''}`}>
        <h2 className="text-lg font-bold text-gray-900 border-b pb-2">2. 候補者選択とマッチング</h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">提案候補者</label>
            <select 
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
            >
              <option value="">候補者を選択してください</option>
              {candidates.map(c => (
                <option key={c.id} value={c.id}>{c.name} - {c.strongArea}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={handleEvaluateMatch}
            disabled={!selectedCandidateId || isMatching}
            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-md font-medium flex items-center disabled:opacity-50"
          >
            {isMatching ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            AIでマッチ度評価
          </button>
        </div>

        {matchResult && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-2">マッチング評価</h3>
            <div className="text-sm text-gray-600 whitespace-pre-wrap font-mono">
              {matchResult}
            </div>
          </div>
        )}
      </div>

      {/* Step 3: 送信文生成 */}
      <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4 ${!matchResult ? 'opacity-50 pointer-events-none' : ''}`}>
        <h2 className="text-lg font-bold text-gray-900 border-b pb-2">3. 送信文の生成と調整</h2>
        
        <div className="flex gap-4 items-end mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">送信チャネル/テンプレート</label>
            <select 
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={templateType}
              onChange={(e) => setTemplateType(e.target.value)}
            >
              <option value="フォーム営業">フォーム営業</option>
              <option value="メール送信">メール送信</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="AI/生成AI案件向け">AI/生成AI案件向け</option>
            </select>
          </div>
          <button 
            onClick={handleGenerateMessage}
            disabled={isGenerating}
            className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md font-medium flex items-center disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <PenTool className="h-4 w-4 mr-2" />}
            AIで送信文を生成
          </button>
        </div>

        {generatedMessage && (
          <div className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">AI生成結果（編集可能）</label>
              <textarea 
                className="w-full h-64 border border-gray-300 rounded-md p-3 font-mono text-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={generatedMessage}
                onChange={(e) => setGeneratedMessage(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">人間の追記（最後の1行）</label>
              <input 
                type="text" 
                placeholder="例: 現場に近い姿勢が印象的でした。ぜひ一度お話しさせてください。"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={humanLine}
                onChange={(e) => setHumanLine(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">※AIの文面に人間味を足すための1行です。送信時に末尾に追記してください。</p>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                onClick={handleSaveLog}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md font-medium flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                送信完了としてログに記録
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
