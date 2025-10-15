import React, { useState, useEffect, useRef } from 'react';
import { ChatMode } from '../types';
import { SendIcon } from './icons/SendIcon';
import { BoltIcon } from './icons/BoltIcon';
import { BookIcon } from './icons/BookIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { StopIcon } from './icons/StopIcon';
import { PaperclipIcon } from './icons/PaperclipIcon';
import { ScaleIcon } from './icons/ScaleIcon';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  chatMode: ChatMode;
  setChatMode: (mode: ChatMode) => void;
  onStop: () => void;
  onFileUpload: (file: File) => void;
}

// Add SpeechRecognition to window type for browsers that support it
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, chatMode, setChatMode, onStop, onFileUpload }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false; // Stop listening when user pauses
      recognition.interimResults = true; // Show results as they are recognized
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
        setInput(transcript);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleMicClick = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
      e.target.value = ''; // Reset file input
    }
  };

  const getPlaceholderText = () => {
    switch(chatMode) {
      case ChatMode.NORMAL:
        return "Ask a question about the Indian Constitution...";
      case ChatMode.EMERGENCY:
        return "Describe your urgent situation briefly...";
      case ChatMode.CASE_LAW:
        return "Search for a case by name or keyword...";
      default:
        return "Type or click the mic to speak...";
    }
  };

  const baseButtonClasses = "flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all duration-300 transform";
  const inactiveButtonClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300";
  
  const normalModeClasses = `${baseButtonClasses} rounded-l-md ${
    chatMode === ChatMode.NORMAL ? 'scale-105 bg-blue-600 text-white shadow-md' : inactiveButtonClasses
  }`;
  
  const caseLawModeClasses = `${baseButtonClasses} ${
    chatMode === ChatMode.CASE_LAW ? 'scale-105 bg-purple-600 text-white shadow-md' : inactiveButtonClasses
  }`;

  const emergencyModeClasses = `${baseButtonClasses} rounded-r-md ${
    chatMode === ChatMode.EMERGENCY ? 'scale-105 bg-red-600 text-white shadow-md' : inactiveButtonClasses
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-center">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setChatMode(ChatMode.NORMAL)}
            className={normalModeClasses}
          >
            <BookIcon className="h-4 w-4" />
            Normal
          </button>
          <button
            type="button"
            onClick={() => setChatMode(ChatMode.CASE_LAW)}
            className={caseLawModeClasses}
          >
            <ScaleIcon className="h-4 w-4" />
            Case Law
          </button>
          <button
            type="button"
            onClick={() => setChatMode(ChatMode.EMERGENCY)}
            className={emergencyModeClasses}
          >
            <BoltIcon className="h-4 w-4" />
            Emergency
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={getPlaceholderText()}
          disabled={isLoading}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 text-gray-800 placeholder-gray-400"
        />
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
          disabled={isLoading}
          accept="image/*,application/pdf"
        />
        <label
          htmlFor="file-upload"
          aria-label="Attach a file"
          className={`flex-shrink-0 p-3 rounded-full transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${
            isLoading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-blue-500 cursor-pointer'
          }`}
        >
          <PaperclipIcon className="h-6 w-6" />
        </label>
        {isSpeechSupported && (
          <button
            type="button"
            onClick={handleMicClick}
            disabled={isLoading}
            aria-label={isListening ? 'Stop recording' : 'Start recording'}
            className={`flex-shrink-0 p-3 rounded-full transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${
              isListening
                ? 'bg-red-600 text-white animate-pulse focus:ring-red-500'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-blue-500'
            }`}
          >
            <MicrophoneIcon className="h-6 w-6" />
          </button>
        )}
        {isLoading ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop generating"
            className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-red-500"
          >
            <StopIcon className="h-6 w-6" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-500"
          >
            <SendIcon className="h-6 w-6" />
          </button>
        )}
      </div>
    </form>
  );
};

export default ChatInput;