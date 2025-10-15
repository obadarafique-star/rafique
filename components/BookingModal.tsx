import React, { useState, useEffect, useRef } from 'react';
import { LegalHelpProfile } from '../types';
import { CalendarIcon } from './icons/CalendarIcon';
import { ClockIcon } from './icons/ClockIcon';

interface BookingModalProps {
  profile: LegalHelpProfile;
  isOpen: boolean;
  onClose: () => void;
}

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
];

const BookingModal: React.FC<BookingModalProps> = ({ profile, isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const accentColor = profile.role === 'Consultant' ? 'blue' : 'teal';

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && selectedTime) {
      setIsConfirmed(true);
      setTimeout(() => {
        onClose();
        setIsConfirmed(false);
        setSelectedDate('');
        setSelectedTime('');
      }, 3000);
    } else {
      alert('Please select a date and time.');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 animate-fade-in-up"
      >
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 id="booking-modal-title" className="text-2xl font-bold text-gray-800">Book a Session</h2>
              <p className="text-gray-600 mt-1">with {profile.name}</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {isConfirmed ? (
            <div className="text-center py-12">
              <svg className={`w-16 h-16 text-green-500 mx-auto mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <h3 className="text-xl font-semibold text-gray-800">Booking Confirmed!</h3>
              <p className="text-gray-600 mt-2">
                Your session with {profile.name} on {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {selectedTime} is confirmed.
              </p>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="mt-6 space-y-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Select a Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 text-gray-800"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Select a Time</label>
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <ClockIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      required
                      className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 text-gray-800 appearance-none"
                    >
                      <option value="" disabled>Select a time slot</option>
                      {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                    </select>
                 </div>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className={`w-full text-center bg-${accentColor}-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-${accentColor}-700 transition-colors duration-300 disabled:bg-gray-400`}
                  disabled={!selectedDate || !selectedTime}
                >
                  Confirm Booking (₹{profile.rate.toLocaleString('en-IN')}/hr)
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;