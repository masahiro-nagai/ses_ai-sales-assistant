import { Company, Candidate } from './store';

// We no longer instantiate GoogleGenAI here.
// Instead, we call our own backend API endpoint (/api/gemini)

export const analyzeCompany = async (company: Company) => {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'analyze',
      payload: { company }
    })
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to analyze company');
  }

  const data = await res.json();
  return data.text;
};

export const evaluateMatch = async (companyAnalysis: string, candidate: Candidate) => {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'evaluate',
      payload: { companyAnalysis, candidate }
    })
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to evaluate match');
  }

  const data = await res.json();
  return data.text;
};

export const generateMessage = async (
  companyName: string,
  companyAnalysis: string,
  hypothesis: string,
  candidate: Candidate,
  templateType: string
) => {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'generate',
      payload: { companyName, companyAnalysis, hypothesis, candidate, templateType }
    })
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to generate message');
  }

  const data = await res.json();
  return data.text;
};

export const extractCompanyFromUrl = async (url: string) => {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'extractCompany',
      payload: { url }
    })
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to extract company info');
  }

  const data = await res.json();
  return data.extracted;
};

export const generateRecommendationFromInterview = async (interviewText: string, candidateName: string) => {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'generateRecommendation',
      payload: { interviewText, candidateName }
    })
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to generate recommendation');
  }

  const data = await res.json();
  return data.text as string;
};
