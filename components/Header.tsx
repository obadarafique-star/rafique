import React from 'react';
import { View } from '../types';
import { AppIcon } from './icons/AppIcon';
import { ProfileIcon } from './icons/ProfileIcon';
import { PlusIcon } from './icons/PlusIcon';

interface HeaderProps {
  activeView: View;
  setActiveView: (view: View) => void;
  onNewChat: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView, onNewChat }) => {
  const navItemClasses = (view: View) =>
    `px-3 py-2 text-sm md:text-base font-medium rounded-md transition-colors duration-300 flex items-center gap-2 ${
      activeView === view
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
    }`;
    
  const newChatButtonClasses = 'px-3 py-2 text-sm md:text-base font-medium rounded-md transition-colors duration-300 flex items-center gap-2 text-gray-600 hover:bg-gray-200 hover:text-gray-900';

  const iconButtonClasses = (view: View) =>
    `p-2 rounded-full transition-colors duration-300 ${
      activeView === view
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
    }`;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center gap-3">
            <AppIcon className="h-8 w-8 text-blue-500" />
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Indian Constitutional AI</h1>
        </div>
        <div className="flex items-center space-x-1 md:space-x-2">
          <button
            onClick={() => setActiveView(View.CHAT)}
            className={navItemClasses(View.CHAT)}
          >
            AI Assistant
          </button>
          <button
            onClick={() => setActiveView(View.LAWYERS)}
            className={navItemClasses(View.LAWYERS)}
          >
            Find a Lawyer
          </button>
          <button
            onClick={() => setActiveView(View.LEGAL_HELP)}
            className={navItemClasses(View.LEGAL_HELP)}
          >
            Legal Help
          </button>
          <button
            onClick={onNewChat}
            className={newChatButtonClasses}
            aria-label="Start a new chat"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
          <button
            onClick={() => setActiveView(View.PROFILE)}
            className={iconButtonClasses(View.PROFILE)}
            aria-label="View Profile"
          >
            <ProfileIcon className="h-6 w-6" />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
