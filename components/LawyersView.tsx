
import React from 'react';
import { LAWYER_PROFILES } from '../constants';
import LawyerCard from './LawyerCard';

const LawyersView: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
          Connect with Legal Experts in India
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          Find experienced lawyers specializing in various fields of Indian constitutional law to get professional advice.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {LAWYER_PROFILES.map((lawyer) => (
          <LawyerCard key={lawyer.id} lawyer={lawyer} />
        ))}
      </div>
    </div>
  );
};

export default LawyersView;