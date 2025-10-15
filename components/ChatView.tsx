import React, { useState, useEffect, useRef } from 'react';
import { ChatMode, Message as MessageType, FeedbackState, Feedback } from '../types';
import Message from './Message';
import ChatInput from './ChatInput';

interface ChatViewProps {
  messages: MessageType[];
  isLoading: boolean;
  onSend: (message: string, mode: ChatMode) => void;
  onStop: () => void;
  onFileUpload: (file: File) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ messages, isLoading, onSend, onStop, onFileUpload }) => {
  const [chatMode, setChatMode] = useState<ChatMode>(ChatMode.EMERGENCY);
  const [feedback, setFeedback] = useState<FeedbackState>({});
  // FIX: Corrected typo from HTMLDivDivElement to HTMLDivElement for the ref type.
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const storedFeedback = localStorage.getItem('chatFeedback');
      if (storedFeedback) {
        setFeedback(JSON.parse(storedFeedback));
      }
    } catch (error) {
      console.error("Failed to parse feedback from localStorage", error);
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('chatFeedback', JSON.stringify(feedback));
  }, [feedback]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (message: string) => {
    onSend(message, chatMode);
  };
  
  const handleFeedback = (messageId: number, newFeedback: 'up' | 'down') => {
    setFeedback(prev => {
      const currentFeedback = prev[messageId];
      const updatedFeedback = currentFeedback === newFeedback ? null : newFeedback;
      return { ...prev, [messageId]: updatedFeedback };
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto bg-white rounded-lg shadow-xl border border-gray-200 animate-fade-in">
      <div className="flex-grow p-6 space-y-6 overflow-y-auto">
        {messages.map((msg) => (
          <Message 
            key={msg.id} 
            message={msg}
            feedback={feedback[msg.id]}
            onFeedback={handleFeedback}
          />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
              <div className="bg-gray-200 rounded-lg p-4 text-gray-800 animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <ChatInput
          onSend={handleSend}
          isLoading={isLoading}
          chatMode={chatMode}
          setChatMode={setChatMode}
          onStop={onStop}
          onFileUpload={onFileUpload}
        />
        <p className="text-center text-xs text-gray-500 mt-3">
          This is not legal advice and does not create an attorney-client relationship.
        </p>
      </div>
    </div>
  );
};

export default ChatView;