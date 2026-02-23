
import React, { useState } from 'react';
import { UserProfile, Activity } from '../types';
import { geminiService } from '../services/geminiService';
import { Sparkles, Loader2, Plus, Calendar, Clock, MapPin, X } from 'lucide-react';

interface ActivityPlannerProps {
  user: UserProfile;
  onPost: (activity: Activity) => void;
  onClose: () => void;
}

const ActivityPlanner: React.FC<ActivityPlannerProps> = ({ user, onPost, onClose }) => {
  const [plans, setPlans] = useState<Partial<Activity>[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Partial<Activity> | null>(null);
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventTime, setEventTime] = useState('10:00');

  const generatePlans = async () => {
    setLoading(true);
    try {
      const suggested = await geminiService.suggestActivityPlans(user);
      setPlans(suggested);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan: Partial<Activity>) => {
    setEditingPlan(plan);
    setEventDate(new Date().toISOString().split('T')[0]);
    setEventTime('10:00');
  };

  const handleConfirmAndPost = () => {
    if (!editingPlan) return;
    const newActivity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      title: editingPlan.title || '社区聚会',
      description: editingPlan.description || '',
      creatorId: user.id,
      creatorName: user.name,
      region: user.region,
      date: eventDate,
      time: eventTime,
      category: editingPlan.category || '社交',
      maxParticipants: editingPlan.maxParticipants || 10,
      participants: [user.id]
    };
    onPost(newActivity);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom-10">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">AI 活动助手</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {plans.length === 0 && !loading && (
            <div className="text-center py-10">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="text-orange-600" size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">想组织一次活动吗？</h3>
              <p className="text-gray-600 mb-8">让 AI 助手根据您的兴趣和地区为您构思精彩的活动方案。</p>
              <button 
                onClick={generatePlans}
                className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all flex items-center gap-2 mx-auto"
              >
                生成方案
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-20">
              <Loader2 className="animate-spin mx-auto text-orange-500 mb-4" size={48} />
              <p className="text-lg font-medium text-gray-600 italic">正在为您构思精彩的活动...</p>
            </div>
          )}

          {plans.length > 0 && !loading && (
            <>
              {editingPlan ? (
                <div className="space-y-4 animate-in fade-in">
                  <p className="text-sm font-bold text-orange-600 uppercase tracking-widest">确认活动详情</p>
                  <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-5 space-y-4">
                    <h4 className="text-xl font-bold text-gray-900">{editingPlan.title}</h4>
                    <p className="text-gray-700">{editingPlan.description}</p>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">活动日期</label>
                      <input 
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full p-3 text-lg border-2 border-orange-100 rounded-xl focus:border-orange-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">活动时间</label>
                      <input 
                        type="time"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        className="w-full p-3 text-lg border-2 border-orange-100 rounded-xl focus:border-orange-500 outline-none"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={handleConfirmAndPost}
                    className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={20} /> 确认并发布
                  </button>
                  <button 
                    onClick={() => setEditingPlan(null)}
                    className="w-full py-3 text-gray-600 font-bold hover:underline"
                  >
                    返回建议列表
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in">
                  <p className="text-sm font-bold text-orange-600 uppercase tracking-widest mb-2">为您推荐的方案</p>
                  {plans.map((plan, idx) => (
                    <div key={idx} className="bg-orange-50/50 border border-orange-100 rounded-2xl p-5 hover:border-orange-300 transition-all">
                      <span className="text-xs font-bold text-orange-600 bg-white px-2 py-1 rounded-md border border-orange-100 mb-2 inline-block uppercase">
                        {plan.category}
                      </span>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{plan.title}</h4>
                      <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                      <button 
                        onClick={() => handleSelectPlan(plan)}
                        className="w-full bg-white text-orange-600 border-2 border-orange-200 py-3 rounded-xl font-bold hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={20} /> 采用该方案
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={generatePlans}
                    className="w-full py-4 text-orange-500 font-bold hover:underline"
                  >
                    换一批建议
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityPlanner;
