import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import Header from './components/Header';
import ChatView from './components/ChatView';
import LawyersView from './components/LawyersView';
import LegalHelpView from './components/LegalHelpView';
import ProfileView from './components/ProfileView';
import { View, Message, ChatMode, ChatSession } from './types';
import FeedbackTab from './components/FeedbackTab';
import { createChatSession, sendMessageToAI } from './services/geminiService';
import * as chatHistoryService from './services/chatHistoryService';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.CHAT);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const nextId = useRef(1);
  const isCancelledRef = useRef(false);

  useEffect(() => {
    chatSessionRef.current = createChatSession();
    const loadedSessions = chatHistoryService.getSessions();
    let currentSessionId = chatHistoryService.getActiveSessionId();

    if (loadedSessions.length === 0) {
      const initialMessage: Message = {
        id: nextId.current++,
        text: 'Hello! I am your Indian Constitutional AI assistant. How can I help you today? Please note, I am not a lawyer and this is not legal advice.',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const newSession = chatHistoryService.createNewSession([initialMessage]);
      setSessions([newSession]);
      setActiveSessionId(newSession.id);
    } else {
      setSessions(loadedSessions);
      if (!currentSessionId || !loadedSessions.some(s => s.id === currentSessionId)) {
        currentSessionId = loadedSessions[loadedSessions.length - 1].id;
        chatHistoryService.setActiveSessionId(currentSessionId);
      }
      setActiveSessionId(currentSessionId);
    }
  }, []);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const messages = activeSession ? activeSession.messages : [];

  const updateMessagesInSession = (newMessages: Message[]) => {
    if (!activeSessionId) return;

    const updatedSessions = sessions.map(session =>
      session.id === activeSessionId ? { ...session, messages: newMessages } : session
    );
    setSessions(updatedSessions);
    const activeSession = updatedSessions.find(s => s.id === activeSessionId);
    if (activeSession) {
      chatHistoryService.updateSession(activeSession);
    }
  };

  const handleNewChat = () => {
    chatSessionRef.current = createChatSession();
    const initialMessage: Message = {
      id: nextId.current++,
      text: 'Hello! I am your Indian Constitutional AI assistant. How can I help you today? Please note, I am not a lawyer and this is not legal advice.',
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const newSession = chatHistoryService.createNewSession([initialMessage]);
    setSessions(prev => [...prev, newSession]);
    setActiveSessionId(newSession.id);
    setActiveView(View.CHAT);
  };
  
  const handleSelectSession = (sessionId: string) => {
    chatSessionRef.current = createChatSession();
    chatHistoryService.setActiveSessionId(sessionId);
    setActiveSessionId(sessionId);
    setActiveView(View.CHAT);
  };

  const handleStop = () => {
    isCancelledRef.current = true;
    setIsLoading(false);
    const stopMessage: Message = {
      id: nextId.current++,
      text: "Generation stopped.",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    updateMessagesInSession([...messages, stopMessage]);
  };

  const handleSend = async (message: string, chatMode: ChatMode) => {
    if (!chatSessionRef.current || !activeSessionId) return;

    isCancelledRef.current = false;

    const userMessage: Message = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const updatedMessagesWithUser = [...messages, userMessage];
    updateMessagesInSession(updatedMessagesWithUser);
    setIsLoading(true);

    try {
      const aiResponseText = await sendMessageToAI(chatSessionRef.current, message, chatMode);

      if (isCancelledRef.current) return;

      const aiMessage: Message = {
        id: Date.now() + 1,
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      updateMessagesInSession([...updatedMessagesWithUser, aiMessage]);
    } catch (error) {
      if (isCancelledRef.current) return;

      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      updateMessagesInSession([...updatedMessagesWithUser, errorMessage]);
    } finally {
      if (!isCancelledRef.current) {
        setIsLoading(false);
      }
    }
  };

  const handleFileUpload = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    const fileUploadMessage: Message = {
      id: nextId.current++,
      text: `Analyzing document: "${file.name}"...`,
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      file: { name: file.name, type: file.type, url: fileUrl },
    };
    updateMessagesInSession([...messages, fileUploadMessage]);
    // This is where file processing logic would be initiated.
  };

  return (
    <div className="min-h-screen font-sans flex flex-col">
      <FeedbackTab />
      <div className="relative z-10 flex flex-col flex-grow">
        <Header activeView={activeView} setActiveView={setActiveView} onNewChat={handleNewChat} />
        <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
          {activeView === View.CHAT && (
            <ChatView
              messages={messages}
              isLoading={isLoading}
              onSend={handleSend}
              onStop={handleStop}
              onFileUpload={handleFileUpload}
            />
          )}
          {activeView === View.LAWYERS && <LawyersView />}
          {activeView === View.LEGAL_HELP && <LegalHelpView />}
          {activeView === View.PROFILE && (
            <ProfileView 
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={handleSelectSession}
              onNewChat={handleNewChat}
            />
          )}
        </main>
        <footer className="bg-white border-t border-gray-200 mt-auto py-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
              <h2 className="text-xl font-bold text-gray-800 mb-1">Indian Constitutional AI</h2>
              <p className="text-sm">
                &copy; 2024 Indian Constitutional AI. All rights reserved. 
                <br />
                For informational purposes only. This is not legal advice.
              </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
