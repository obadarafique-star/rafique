import React from 'react';
import { LawyerProfile } from '../types';

interface LawyerCardProps {
  lawyer: LawyerProfile;
}

const LawyerCard: React.FC<LawyerCardProps> = ({ lawyer }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1">
      <img className="w-full h-56 object-cover" src={lawyer.imageUrl} alt={`Portrait of ${lawyer.name}`} />
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{lawyer.name}</h3>
        <p className="text-blue-600 font-semibold text-sm mb-4">{lawyer.specialization}</p>
        <p className="text-gray-600 text-base mb-6 h-24 overflow-hidden">
          {lawyer.bio}
        </p>
        <a 
          href={`mailto:${lawyer.email}?subject=Legal Consultation Inquiry`}
          className="w-full inline-block text-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Book a Meeting
        </a>
      </div>
    </div>
  );
};

export default LawyerCard;