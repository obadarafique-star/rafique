import React from 'react';
import { LEGAL_HELP_PROFILES } from '../constants';
import LegalHelpCard from './LegalHelpCard';

const LegalHelpView: React.FC = () => {
  const consultants = LEGAL_HELP_PROFILES.filter(p => p.role === 'Consultant');
  const helpers = LEGAL_HELP_PROFILES.filter(p => p.role === 'Helper');

  return (
    <div className="animate-fade-in space-y-16">
      <div>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
            Get Practical Legal Assistance in India
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
            Book a session with a consultant for specialized advice or a helper for hands-on procedural support.
          </p>
        </div>
      </div>

      {/* Consultants Section */}
      <section>
        <h3 className="text-3xl font-bold text-gray-900 mb-8 border-b-2 border-blue-500 pb-2">
          Legal Consultants
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {consultants.map((profile) => (
            <LegalHelpCard key={profile.id} profile={profile} />
          ))}
        </div>
      </section>

      {/* Helpers Section */}
      <section>
        <h3 className="text-3xl font-bold text-gray-900 mb-8 border-b-2 border-teal-500 pb-2">
          Procedural Helpers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {helpers.map((profile) => (
            <LegalHelpCard key={profile.id} profile={profile} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default LegalHelpView;