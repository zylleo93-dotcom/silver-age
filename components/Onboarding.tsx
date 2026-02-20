
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { geminiService } from '../services/geminiService';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: 65,
    region: '',
    introduction: '',
    interests: '',
  });

  const handleFinish = async () => {
    setLoading(true);
    try {
      const { tags, summary } = await geminiService.generateProfileAnalysis(
        formData.introduction,
        formData.interests,
        formData.region
      );

      const newProfile: UserProfile = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        interests: formData.interests.split(/[,，]/).map(i => i.trim()),
        tags,
        aiSummary: summary,
        avatar: `https://picsum.photos/seed/${formData.name}/200`
      };
      onComplete(newProfile);
    } catch (error) {
      console.error("AI 分析失败", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50 p-6 text-center">
      {step === 1 && (
        <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-orange-100">
            <h2 className="text-3xl font-bold text-orange-900 mb-4">欢迎来到金秋缘！</h2>
            <p className="text-lg text-orange-700 mb-8">让我们一起创建您的专属档案，AI 助手将帮您寻找志同道合的老朋友。</p>
            
            <div className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">您的姓名/昵称</label>
                <input
                  type="text"
                  placeholder="例如：王奶奶"
                  className="w-full p-4 text-lg border-2 border-orange-100 rounded-2xl focus:border-orange-500 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">您居住在哪个城市/地区？</label>
                <input
                  type="text"
                  placeholder="例如：上海市浦东新区"
                  className="w-full p-4 text-lg border-2 border-orange-100 rounded-2xl focus:border-orange-500 outline-none"
                  value={formData.region}
                  onChange={(e) => setFormData({...formData, region: e.target.value})}
                />
              </div>
            </div>
            
            <button
              disabled={!formData.name || !formData.region}
              onClick={() => setStep(2)}
              className="w-full mt-8 bg-orange-500 text-white p-5 rounded-2xl text-xl font-bold hover:bg-orange-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
            >
              下一步 <ArrowRight size={24} />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-orange-100">
            <h2 className="text-2xl font-bold text-orange-900 mb-4">聊聊您自己</h2>
            <p className="text-gray-600 mb-6">写下几句您喜欢做的事情。我们的 AI 将根据这些信息为您推荐邻居好友！</p>
            
            <div className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">一段简单的自我介绍</label>
                <textarea
                  placeholder="分享一下您的生活点滴、爱好，或者想在社区里寻找什么样的伙伴..."
                  rows={4}
                  className="w-full p-4 text-lg border-2 border-orange-100 rounded-2xl focus:border-orange-500 outline-none"
                  value={formData.introduction}
                  onChange={(e) => setFormData({...formData, introduction: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">您的爱好 (请用逗号隔开)</label>
                <input
                  type="text"
                  placeholder="例如：书法，做饭，下棋，晨练"
                  className="w-full p-4 text-lg border-2 border-orange-100 rounded-2xl focus:border-orange-500 outline-none"
                  value={formData.interests}
                  onChange={(e) => setFormData({...formData, interests: e.target.value})}
                />
              </div>
            </div>

            <button
              disabled={loading || !formData.introduction}
              onClick={handleFinish}
              className="w-full mt-8 bg-orange-600 text-white p-5 rounded-2xl text-xl font-bold hover:bg-orange-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  AI 正在为您生成个性化主页...
                </>
              ) : (
                <>
                  创建我的主页 <Sparkles size={24} />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
