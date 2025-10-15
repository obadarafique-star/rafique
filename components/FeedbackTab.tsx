import React, { useState, FormEvent } from 'react';
import { FeedbackIcon } from './icons/FeedbackIcon';

const FeedbackTab: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const handleFeedbackSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (feedbackText.trim()) {
      alert('Thank you for your feedback!');
      setFeedbackText('');
      setIsOpen(false);
    } else {
      alert('Please enter your feedback before submitting.');
    }
  };

  return (
    <div className="fixed top-1/2 right-0 transform -translate-y-1/2 z-50 flex items-center">
      {/* Feedback Panel */}
      <div
        className={`bg-white shadow-2xl rounded-l-lg border-l border-t border-b border-gray-200 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: '320px' }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Share Your Feedback</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition"
              aria-label="Close feedback form"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Tell us how we can improve..."
              className="w-full h-32 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800 placeholder-gray-400"
              aria-label="Feedback input"
              rows={5}
            />
            <button
              type="submit"
              className="w-full px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-300"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
      
      {/* Tab Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white font-semibold py-4 px-2 rounded-l-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:-translate-x-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        style={{ writingMode: 'vertical-rl' }}
        aria-label="Toggle feedback form"
      >
        <div className="flex items-center gap-2">
            <FeedbackIcon className="w-5 h-5 transform rotate-90" />
            <span>Feedback</span>
        </div>
      </button>
    </div>
  );
};

export default FeedbackTab;