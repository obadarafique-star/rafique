import React, { useState } from 'react';
import { LegalHelpProfile } from '../types';
import BookingModal from './BookingModal';

interface LegalHelpCardProps {
  profile: LegalHelpProfile;
}

const LegalHelpCard: React.FC<LegalHelpCardProps> = ({ profile }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isConsultant = profile.role === 'Consultant';
  const accentColor = isConsultant ? 'blue' : 'teal';

  return (
    <>
      <div className={`bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-${accentColor}-500/20 transition-all duration-300 transform hover:-translate-y-1 flex flex-col`}>
        <img className="w-full h-56 object-cover" src={profile.imageUrl} alt={`Portrait of ${profile.name}`} />
        <div className="p-6 flex flex-col flex-grow">
          <p className={`font-semibold text-sm mb-2 text-${accentColor}-600`}>{profile.role}</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{profile.name}</h3>
          <div className="mb-4">
            {profile.expertise.map(skill => (
              <span key={skill} className={`inline-block bg-${accentColor}-100 text-${accentColor}-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full`}>
                {skill}
              </span>
            ))}
          </div>
          <p className="text-gray-600 text-base mb-4 flex-grow">
            {profile.bio}
          </p>
          <div className="flex justify-between items-center mb-6">
              <p className="text-lg font-bold text-gray-800">₹{profile.rate.toLocaleString('en-IN')}<span className="text-sm font-normal text-gray-500">/hr</span></p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className={`w-full inline-block text-center bg-${accentColor}-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-${accentColor}-700 transition-colors duration-300`}
          >
            Book a Session
          </button>
        </div>
      </div>
      
      {isModalOpen && (
        <BookingModal 
          profile={profile}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default LegalHelpCard;