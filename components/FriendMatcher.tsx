import React from 'react';
import { UserProfile } from '../types';
import { MapPin, Heart, X } from 'lucide-react';

interface FriendMatcherProps {
  candidates: UserProfile[];
  onDecision: (liked: boolean) => void;
  currentIndex: number;
}

const FriendMatcher: React.FC<FriendMatcherProps> = ({ candidates, onDecision, currentIndex }) => {
  if (currentIndex >= candidates.length) {
    return null; // All candidates have been viewed
  }

  const user = candidates[currentIndex];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gray-50 rounded-3xl animate-in fade-in">
      <div className="relative w-full max-w-sm h-[70vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <img src={user.avatar} alt={user.name} className="w-full h-3/5 object-cover" referrerPolicy="no-referrer" />
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
            <span className="text-xl text-gray-500">{user.age}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 mb-3">
            <MapPin size={16} />
            <span className="font-semibold">{user.region}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {user.interests.map(interest => (
              <span key={interest} className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border border-orange-100">
                {interest}
              </span>
            ))}
          </div>
          <p className="text-gray-600 text-sm leading-relaxed italic">“{user.introduction}”</p>
        </div>
      </div>
      <div className="flex gap-6 mt-6">
        <button onClick={() => onDecision(false)} className="bg-white shadow-xl rounded-full p-5 text-red-500 hover:scale-110 transition-transform">
          <X size={40} strokeWidth={3} />
        </button>
        <button onClick={() => onDecision(true)} className="bg-white shadow-xl rounded-full p-5 text-green-500 hover:scale-110 transition-transform">
          <Heart size={40} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default FriendMatcher;
