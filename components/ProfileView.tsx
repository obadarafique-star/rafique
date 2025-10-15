import React from 'react';
import { ChatSession } from '../types';
import { UserIcon } from './icons/UserIcon';
import { PlusIcon } from './icons/PlusIcon';
import { GavelIcon } from './icons/GavelIcon';


interface ProfileViewProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ sessions, activeSessionId, onSelectSession, onNewChat }) => {
  return (
    <div className="animate-fade-in max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Personal Details Card */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-gray-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Rohan Sharma</h2>
              <p className="text-gray-500">rohan.sharma@example.com</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name</label>
              <p className="text-lg text-gray-800">Rohan Sharma</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email Address</label>
              <p className="text-lg text-gray-800">rohan.sharma@example.com</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Member Since</label>
              <p className="text-lg text-gray-800">July 2024</p>
            </div>
          </div>
          <button className="mt-6 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Session History Card */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
             <h2 className="text-2xl font-bold text-gray-800">
                Session History
             </h2>
             <button
                onClick={onNewChat}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Start New Chat
              </button>
          </div>
          <div className="h-[calc(100vh-22rem)] overflow-y-auto">
            {sessions.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {sessions.slice().reverse().map((session) => (
                  <li key={session.id}>
                    <button
                      onClick={() => onSelectSession(session.id)}
                      className={`w-full text-left p-6 hover:bg-gray-50 focus:outline-none focus:bg-blue-50 transition-colors ${
                        session.id === activeSessionId ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-semibold text-blue-600">
                          Session from {new Date(session.startTime).toLocaleString('en-IN')}
                        </p>
                        {session.id === activeSessionId && (
                           <span className="text-xs font-bold text-blue-700 bg-blue-200 px-2 py-1 rounded-full">Active</span>
                        )}
                      </div>
                      <p className="text-gray-600 truncate">
                        {session.messages[1]?.text || 'New session...'}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 py-10">No chat history yet. Start a conversation with the AI Assistant!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
