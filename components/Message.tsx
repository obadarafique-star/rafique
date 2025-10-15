import React, { useEffect } from 'react';
import { Message as MessageType, Feedback } from '../types';
import { UserIcon } from './icons/UserIcon';
import { GavelIcon } from './icons/GavelIcon';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { ThumbsDownIcon } from './icons/ThumbsDownIcon';

interface MessageProps {
  message: MessageType;
  feedback: Feedback | undefined;
  onFeedback: (messageId: number, feedback: 'up' | 'down') => void;
}

const Message: React.FC<MessageProps> = ({ message, feedback, onFeedback }) => {
  const isUser = message.sender === 'user';

  useEffect(() => {
    // Clean up the object URL to avoid memory leaks when the component unmounts
    return () => {
      if (message.file && message.file.url.startsWith('blob:')) {
        URL.revokeObjectURL(message.file.url);
      }
    };
  }, [message.file]);

  return (
    <div className="animate-fade-in-up">
      <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
            <GavelIcon className="w-6 h-6 text-white" />
          </div>
        )}
        <div
          className={`max-w-xl rounded-lg p-4 shadow-sm ${
            isUser
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-800 rounded-bl-none'
          }`}
        >
          {message.file && (
            <div className="mb-2 border-b border-gray-300 pb-2">
              {message.file.type.startsWith('image/') ? (
                <img 
                  src={message.file.url} 
                  alt={message.file.name} 
                  className="max-w-xs max-h-64 rounded-lg border border-gray-200" 
                />
              ) : message.file.type === 'application/pdf' ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 p-2">
                    <p className="text-sm font-semibold text-gray-700 mb-2">PDF Preview:</p>
                    <embed src={message.file.url} type="application/pdf" width="100%" height="200px" />
                </div>
              ) : null}
            </div>
          )}
          <div className="prose prose-sm max-w-none text-inherit whitespace-pre-wrap">
            {message.text}
          </div>
        </div>
        {isUser && (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
            <UserIcon className="w-6 h-6 text-gray-600" />
          </div>
        )}
      </div>

      {!isUser && !message.file && (
        <div className="flex items-center space-x-1 mt-2 ml-14">
          <button
            onClick={() => onFeedback(message.id, 'up')}
            aria-label="Like response"
            className="p-1 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
          >
            <ThumbsUpIcon className={`w-5 h-5 transition-colors ${feedback === 'up' ? 'text-blue-600' : 'text-gray-400'}`} />
          </button>
          <button
            onClick={() => onFeedback(message.id, 'down')}
            aria-label="Dislike response"
            className="p-1 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500"
          >
            <ThumbsDownIcon className={`w-5 h-5 transition-colors ${feedback === 'down' ? 'text-red-600' : 'text-gray-400'}`} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Message;