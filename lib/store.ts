import { create } from 'zustand';
import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query
} from 'firebase/firestore';

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
  priceType: '時給' | '月給' | '準委任' | '';
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
  isInitialized: boolean;
  initializeListeners: () => void;
  addCompany: (company: Company) => Promise<void>;
  updateCompany: (id: string, company: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  addCandidate: (candidate: Candidate) => Promise<void>;
  updateCandidate: (id: string, candidate: Partial<Candidate>) => Promise<void>;
  deleteCandidate: (id: string) => Promise<void>;
  addLog: (log: SendLog) => Promise<void>;
  updateLog: (id: string, log: Partial<SendLog>) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
}

export const useAppStore = create<AppState>()((set, get) => ({
  companies: [],
  candidates: [],
  logs: [],
  isInitialized: false,

  initializeListeners: () => {
    if (get().isInitialized) return;

    try {
      const companiesQuery = query(collection(db, 'companies'));
      onSnapshot(companiesQuery, (snapshot) => {
        const companies = snapshot.docs.map(doc => doc.data() as Company);
        set({ companies });
      });

      const candidatesQuery = query(collection(db, 'candidates'));
      onSnapshot(candidatesQuery, (snapshot) => {
        const candidates = snapshot.docs.map(doc => doc.data() as Candidate);
        set({ candidates });
      });

      const logsQuery = query(collection(db, 'logs'));
      onSnapshot(logsQuery, (snapshot) => {
        const logs = snapshot.docs.map(doc => doc.data() as SendLog);
        set({ logs });
      });

      set({ isInitialized: true });
    } catch (error) {
      console.error('Firebase Initialization Error:', error);
      // Fallback for SSR or when Firebase is not yet configured
    }
  },

  addCompany: async (company) => {
    try {
      await setDoc(doc(db, 'companies', company.id), company);
    } catch (error) {
      console.error('Error adding company:', error);
      // Optimistic update fallback
      set((state) => ({ companies: [...state.companies, company] }));
    }
  },

  updateCompany: async (id, companyUpdate) => {
    try {
      const currentState = get().companies.find(c => c.id === id);
      if (!currentState) return;
      const updatedCompany = { ...currentState, ...companyUpdate, updatedAt: new Date().toISOString() };
      await setDoc(doc(db, 'companies', id), updatedCompany, { merge: true });
    } catch (error) {
      console.error('Error updating company:', error);
      set((state) => ({
        companies: state.companies.map((c) => c.id === id ? { ...c, ...companyUpdate } : c)
      }));
    }
  },

  deleteCompany: async (id) => {
    try {
      await deleteDoc(doc(db, 'companies', id));
    } catch (error) {
      console.error('Error deleting company:', error);
      set((state) => ({ companies: state.companies.filter((c) => c.id !== id) }));
    }
  },

  addCandidate: async (candidate) => {
    try {
      await setDoc(doc(db, 'candidates', candidate.id), candidate);
    } catch (error) {
      console.error('Error adding candidate:', error);
      set((state) => ({ candidates: [...state.candidates, candidate] }));
    }
  },

  updateCandidate: async (id, candidateUpdate) => {
    try {
      const currentState = get().candidates.find(c => c.id === id);
      if (!currentState) return;
      const updatedCandidate = { ...currentState, ...candidateUpdate, updatedAt: new Date().toISOString() };
      await setDoc(doc(db, 'candidates', id), updatedCandidate, { merge: true });
    } catch (error) {
      console.error('Error updating candidate:', error);
      set((state) => ({
        candidates: state.candidates.map((c) => c.id === id ? { ...c, ...candidateUpdate } : c)
      }));
    }
  },

  deleteCandidate: async (id) => {
    try {
      await deleteDoc(doc(db, 'candidates', id));
    } catch (error) {
      console.error('Error deleting candidate:', error);
      set((state) => ({ candidates: state.candidates.filter((c) => c.id !== id) }));
    }
  },

  addLog: async (log) => {
    try {
      await setDoc(doc(db, 'logs', log.id), log);
    } catch (error) {
      console.error('Error adding log:', error);
      set((state) => ({ logs: [...state.logs, log] }));
    }
  },

  updateLog: async (id, logUpdate) => {
    try {
      const currentState = get().logs.find(l => l.id === id);
      if (!currentState) return;
      const updatedLog = { ...currentState, ...logUpdate };
      await setDoc(doc(db, 'logs', id), updatedLog, { merge: true });
    } catch (error) {
      console.error('Error updating log:', error);
      set((state) => ({
        logs: state.logs.map((l) => l.id === id ? { ...l, ...logUpdate } : l)
      }));
    }
  },

  deleteLog: async (id) => {
    try {
      await deleteDoc(doc(db, 'logs', id));
    } catch (error) {
      console.error('Error deleting log:', error);
      set((state) => ({ logs: state.logs.filter((l) => l.id !== id) }));
    }
  },
}));
