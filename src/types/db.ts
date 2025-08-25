export interface Lead {
  id: string;
  email: string;
  created_at: string;
}

export interface QuizSession {
  id: string;
  lead_id?: string | null;
  started_at: string;
  completed_at?: string | null;
}

export interface QuizAnswer {
  id: string;
  session_id: string;
  question_key: string;
  answer: unknown;
  created_at: string;
}

export interface Event {
  id: string;
  name: string;
  payload: unknown;
  lead_id?: string | null;
  session_id?: string | null;
  created_at: string;
}
