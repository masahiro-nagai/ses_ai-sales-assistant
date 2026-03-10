import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Company = {
  id: string;
  name: string;
  urlCorporate: string;
  urlRecruit: string;
  urlService: string;
  urlNews: string;
  industry: string;
  size: string;
  location: string;
  summary: string;
  product: string;
  focusArea: string;
  recruitingRoles: string;
  techStack: string;
  recentTopics: string;
  keyPerson: string;
  salesMemo: string;
  aiAnalysis?: string;
  hypothesis1?: string;
  hypothesis2?: string;
  hookKeyword?: string;
  priority: 'A' | 'B' | 'C';
  updatedAt: string;
};

export type Candidate = {
  id: string;
  name: string;
  type: string;
  location: string;
  availableFrom: string;
  conditions: string;
  desiredPrice: string;
  strongArea: string;
  mainSkills: string;
  achievement1: string;
  achievement2: string;
  customerStrength: string;
  aiExperience: string;
  recommendationText: string;
  ngConditions: string;
  status: '可' | '保留' | '停止';
  skillSheet?: string;
  portfolio?: string;
  updatedAt: string;
};

export type SendLog = {
  id: string;
  date: string;
  companyId: string;
  candidateId: string;
  channel: string;
  subject: string;
  hook: string;
  hypothesis: string;
  body: string;
  humanLine: string;
  hasReply: boolean;
  replyDate?: string;
  result: '商談化' | '見送り' | '保留' | '不達' | '未定';
  reactionReason: string;
  nextAction: string;
  memo: string;
};

interface AppState {
  companies: Company[];
  candidates: Candidate[];
  logs: SendLog[];
  addCompany: (company: Company) => void;
  updateCompany: (id: string, company: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  addCandidate: (candidate: Candidate) => void;
  updateCandidate: (id: string, candidate: Partial<Candidate>) => void;
  deleteCandidate: (id: string) => void;
  addLog: (log: SendLog) => void;
  updateLog: (id: string, log: Partial<SendLog>) => void;
  deleteLog: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      companies: [
        {
          id: 'C-001',
          name: '株式会社テックイノベーション',
          urlCorporate: 'https://example.com',
          urlRecruit: 'https://example.com/recruit',
          urlService: 'https://example.com/service',
          urlNews: 'https://example.com/news',
          industry: 'SaaS',
          size: '80名、シリーズA',
          location: '東京都渋谷区',
          summary: '建設業向けSaaS開発',
          product: 'BuildCloud',
          focusArea: '生成AI活用、業務自動化',
          recruitingRoles: 'Python、PM、データ基盤',
          techStack: 'Python, AWS, React',
          recentTopics: '新機能リリース、CTO登壇',
          keyPerson: 'CTO 山田太郎',
          salesMemo: '現場寄りでスピード重視そう',
          priority: 'A',
          updatedAt: new Date().toISOString(),
        }
      ],
      candidates: [
        {
          id: 'T-001',
          name: 'W.Y',
          type: 'プロパー',
          location: '東京都',
          availableFrom: '即日',
          conditions: 'リモート中心、週1出社可',
          desiredPrice: '80万',
          strongArea: 'CS運用改善×DX推進',
          mainSkills: 'Python, AWS, React, LangChain',
          achievement1: '業務改善PJで運用設計',
          achievement2: '問い合わせ一次対応改善',
          customerStrength: '現場整理、型化、定着化',
          aiExperience: '生成AI検証、RAG構築',
          recommendationText: '現場対応と業務改善を両立できるAIエンジニアです。',
          ngConditions: 'フル常駐不可',
          status: '可',
          skillSheet: '',
          portfolio: '',
          updatedAt: new Date().toISOString(),
        }
      ],
      logs: [],
      addCompany: (company) => set((state) => ({ companies: [...state.companies, company] })),
      updateCompany: (id, company) => set((state) => ({
        companies: state.companies.map((c) => c.id === id ? { ...c, ...company } : c)
      })),
      deleteCompany: (id) => set((state) => ({ companies: state.companies.filter((c) => c.id !== id) })),
      addCandidate: (candidate) => set((state) => ({ candidates: [...state.candidates, candidate] })),
      updateCandidate: (id, candidate) => set((state) => ({
        candidates: state.candidates.map((c) => c.id === id ? { ...c, ...candidate } : c)
      })),
      deleteCandidate: (id) => set((state) => ({ candidates: state.candidates.filter((c) => c.id !== id) })),
      addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
      updateLog: (id, log) => set((state) => ({
        logs: state.logs.map((l) => l.id === id ? { ...l, ...log } : l)
      })),
      deleteLog: (id) => set((state) => ({ logs: state.logs.filter((l) => l.id !== id) })),
    }),
    {
      name: 'ses-ai-sales-storage',
    }
  )
);
