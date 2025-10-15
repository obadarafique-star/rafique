import { ChatSession, Message } from '../types';

const SESSIONS_KEY = 'chatSessions';
const ACTIVE_SESSION_ID_KEY = 'activeChatSessionId';

export const getSessions = (): ChatSession[] => {
  try {
    const sessionsJson = localStorage.getItem(SESSIONS_KEY);
    if (sessionsJson) {
      const parsed = JSON.parse(sessionsJson);
      // Basic validation
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    return [];
  } catch (error) {
    console.error("Failed to parse sessions from localStorage", error);
    return [];
  }
};

export const saveSessions = (sessions: ChatSession[]): void => {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error("Failed to save sessions to localStorage", error);
  }
};

export const createNewSession = (initialMessages: Message[]): ChatSession => {
  const newSession: ChatSession = {
    id: `session_${Date.now()}`,
    startTime: Date.now(),
    messages: initialMessages,
  };
  
  const sessions = getSessions();
  const updatedSessions = [...sessions, newSession];
  saveSessions(updatedSessions);
  setActiveSessionId(newSession.id);

  return newSession;
};

export const updateSession = (updatedSession: ChatSession): void => {
    const sessions = getSessions();
    const sessionIndex = sessions.findIndex(s => s.id === updatedSession.id);
    if (sessionIndex !== -1) {
        sessions[sessionIndex] = updatedSession;
        saveSessions(sessions);
    } else {
        // If for some reason the session doesn't exist, add it.
        const newSessions = [...sessions, updatedSession];
        saveSessions(newSessions);
    }
};

export const getActiveSessionId = (): string | null => {
  return localStorage.getItem(ACTIVE_SESSION_ID_KEY);
};

export const setActiveSessionId = (id: string): void => {
  localStorage.setItem(ACTIVE_SESSION_ID_KEY, id);
};
