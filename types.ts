// FIX: Removed circular import of `LawyerProfile` from the same file where it is declared.

export enum View {
  CHAT = 'CHAT',
  LAWYERS = 'LAWYERS',
  LEGAL_HELP = 'LEGAL_HELP',
  PROFILE = 'PROFILE',
}

export enum ChatMode {
  NORMAL = 'NORMAL',
  EMERGENCY = 'EMERGENCY',
  CASE_LAW = 'CASE_LAW',
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
  file?: {
    name: string;
    type: string;
    url: string;
  };
}

export interface ChatSession {
  id: string;
  startTime: number;
  messages: Message[];
}

export type Feedback = 'up' | 'down' | null;
export type FeedbackState = { [messageId: number]: Feedback };

export interface LawyerProfile {
  id: number;
  name: string;
  specialization: string;
  bio: string;
  email: string;
  imageUrl: string;
}

export interface LegalHelpProfile {
  id: number;
  name: string;
  role: 'Consultant' | 'Helper';
  expertise: string[];
  bio: string;
  email: string;
  imageUrl: string;
  rate: number;
}
