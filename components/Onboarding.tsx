
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { geminiService } from '../services/geminiService';
import { Sparkles, ArrowRight, ArrowLeft, Loader2, Mic, X } from 'lucide-react';
import { COMMON_INTERESTS, HONG_KONG_DISTRICTS } from '../constants';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<UserProfile, 'id' | 'interests' | 'tags' | 'aiSummary' | 'avatar'> & { interests: string }> ({
    name: '',
    gender: 'female', // Default to female
    age: 65,
    region: `香港, ${HONG_KONG_DISTRICTS[0]}`,
    introduction: '',
    interests: '',
  });
  const [selectedDistrict, setSelectedDistrict] = useState(HONG_KONG_DISTRICTS[0]);
  const [isListeningIntro, setIsListeningIntro] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [manualInterestInput, setManualInterestInput] = useState('');

  const handleToggleListening = () => {
    setIsListeningIntro(prev => !prev);
    // In a real app, this would start/stop speech recognition
    // For this demo, it's just visual feedback.
  };

  const handleSelectInterest = (interest: string) => {
    if (!selectedInterests.includes(interest)) {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setSelectedInterests(selectedInterests.filter(i => i !== interest));
  };

  const handleAddManualInterest = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && manualInterestInput.trim() !== '') {
      e.preventDefault();
      const newInterest = manualInterestInput.trim();
      if (!selectedInterests.includes(newInterest)) {
        setSelectedInterests([...selectedInterests, newInterest]);
      }
      setManualInterestInput('');
    }
  };

  const handleFinish = async (e?: any) => {
    if (e) e.preventDefault(); // 定海神针：严厉阻止浏览器刷新！
    setLoading(true);
    try {
      const { tags, summary } = await geminiService.generateProfileAnalysis(
        formData.introduction,
        selectedInterests.join(', '),
        formData.region
      );

      const newProfile: UserProfile = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        interests: selectedInterests,
        tags,
        aiSummary: summary,
        avatar: formData.gender === 'male' ? '/avatar-user-male.jpg' : '/avatar-user-female.jpg'
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
                  className="w-full p-4 text-lg border-2 border-orange-100 rounded-2xl focus:border-orange-500 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">您居住在哪个城市/地区？</label>
                <div className="flex gap-2">
                  <select className="w-1/3 p-4 text-lg border-2 border-orange-100 rounded-2xl focus:border-orange-500 outline-none bg-gray-100" disabled>
                    <option>香港</option>
                  </select>
                  <select 
                    className="w-2/3 p-4 text-lg border-2 border-orange-100 rounded-2xl focus:border-orange-500 outline-none"
                    value={selectedDistrict}
                    onChange={(e) => {
                      setSelectedDistrict(e.target.value);
                      setFormData({...formData, region: `香港, ${e.target.value}`});
                    }}
                  >
                    {HONG_KONG_DISTRICTS.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">您的性别</label>
                <div className="flex gap-4">
                  <label className="flex items-center p-4 border-2 border-orange-100 rounded-2xl flex-1 cursor-pointer transition-all duration-200 has-[:checked]:bg-orange-50 has-[:checked]:border-orange-500">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={(e) => setFormData({...formData, gender: e.target.value as 'female' | 'male' | 'other'})}
                      className="sr-only"
                    />
                    <span className="text-lg font-medium text-gray-800">女士</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-orange-100 rounded-2xl flex-1 cursor-pointer transition-all duration-200 has-[:checked]:bg-orange-50 has-[:checked]:border-orange-500">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={(e) => setFormData({...formData, gender: e.target.value as 'female' | 'male' | 'other'})}
                      className="sr-only"
                    />
                    <span className="text-lg font-medium text-gray-800">先生</span>
                  </label>
                </div>
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
                <div className="relative">
                  <textarea
                    placeholder={isListeningIntro ? '正在聆听您的介绍...' : '分享一下您的生活点滴、爱好，或者想在社区里寻找什么样的伙伴...'}
                    rows={4}
                    className="w-full p-4 pr-12 text-lg border-2 border-orange-100 rounded-2xl focus:border-orange-500 outline-none resize-none"
                    value={formData.introduction}
                    onChange={(e) => setFormData({...formData, introduction: e.target.value})}
                    disabled={isListeningIntro}
                  />
                  <button
                    type="button"
                    onClick={handleToggleListening}
                    className={`absolute right-3 top-3 p-2 rounded-full transition-all ${isListeningIntro ? 'bg-red-500 text-white animate-pulse' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'}`}
                    title={isListeningIntro ? '停止录音' : '语音输入'}
                  >
                    <Mic size={20} />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">您的爱好</label>
                <div className="bg-orange-50/60 border-2 border-orange-100 rounded-2xl p-3 min-h-[8rem]">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedInterests.map(interest => (
                      <div key={interest} className="bg-orange-500 text-white pl-3 pr-2 py-1 rounded-full flex items-center gap-1 text-sm font-bold animate-in fade-in zoom-in-95">
                        <span>{interest}</span>
                        <button onClick={() => handleRemoveInterest(interest)} className="bg-white/20 hover:bg-white/40 rounded-full p-0.5">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <input 
                    type="text"
                    placeholder="输入自定义爱好后按 Enter"
                    className="w-full bg-transparent p-2 text-lg outline-none"
                    value={manualInterestInput}
                    onChange={(e) => setManualInterestInput(e.target.value)}
                    onKeyDown={handleAddManualInterest}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">或从下方选择</label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_INTERESTS.map(interest => (
                    <button 
                      key={interest}
                      onClick={() => handleSelectInterest(interest)}
                      disabled={selectedInterests.includes(interest)}
                      className="px-4 py-2 bg-white border-2 border-orange-100 rounded-full font-bold text-orange-800 hover:bg-orange-50 hover:border-orange-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 space-y-4">
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
            <button 
                onClick={() => setStep(1)}
                className="w-full text-gray-600 p-4 rounded-2xl text-lg font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
            >
                <ArrowLeft size={22} /> 返回上一步
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
