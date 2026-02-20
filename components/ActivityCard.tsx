
import React from 'react';
import { Activity } from '../types';
import { MapPin, Calendar, Users, Clock } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  onJoin?: (id: string) => void;
  isJoined?: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onJoin, isJoined }) => {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-full mb-2 uppercase tracking-wider">
            {activity.category}
          </span>
          <h3 className="text-xl font-bold text-gray-900">{activity.title}</h3>
        </div>
        <div className="text-right">
            <span className="text-sm font-medium text-gray-500">发起人</span>
            <p className="text-sm font-bold text-gray-900">{activity.creatorName}</p>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{activity.description}</p>
      
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="flex items-center gap-2 text-gray-500">
          <Calendar size={18} className="text-orange-400" />
          <span className="text-sm font-medium">{activity.date}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Clock size={18} className="text-orange-400" />
          <span className="text-sm font-medium">{activity.time}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <MapPin size={18} className="text-orange-400" />
          <span className="text-sm font-medium truncate">{activity.region}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Users size={18} className="text-orange-400" />
          <span className="text-sm font-medium">已有 {activity.participants.length} / {activity.maxParticipants} 人参加</span>
        </div>
      </div>

      {onJoin && (
        <button
          onClick={() => onJoin(activity.id)}
          disabled={isJoined}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-sm ${
            isJoined 
            ? 'bg-green-50 text-green-600 border border-green-200 cursor-default' 
            : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95'
          }`}
        >
          {isJoined ? '✓ 已报名参加' : '我要报名'}
        </button>
      )}
    </div>
  );
};

export default ActivityCard;
