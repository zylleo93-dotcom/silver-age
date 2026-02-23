
import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, Activity, AppScreen, FriendMatch, ChatMessage } from './types';
import { MOCK_USERS, MOCK_ACTIVITIES } from './constants';
import { geminiService } from './services/geminiService';
import Layout from './components/Layout';
import Onboarding from './components/Onboarding';
import ActivityCard from './components/ActivityCard';
import ActivityPlanner from './components/ActivityPlanner';
import ChatRoom from './components/ChatRoom';
import FriendMatcher from './components/FriendMatcher';
import { Plus, Users, Search, Sparkles, MapPin, Loader2, Venus, Mars } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [screen, setScreen] = useState<AppScreen>(AppScreen.ONBOARDING);
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);
  const [matches, setMatches] = useState<FriendMatch[]>([]);
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [showPlanner, setShowPlanner] = useState(false);
  const [matchCandidates, setMatchCandidates] = useState<UserProfile[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [likedMatches, setLikedMatches] = useState<UserProfile[]>([]);
  const [matchingPhase, setMatchingPhase] = useState<'matching' | 'results'>('matching');
  
  // 聊天相关状态
  const [activeChatPartner, setActiveChatPartner] = useState<UserProfile | null>(null);
  const [allMessages, setAllMessages] = useState<Record<string, ChatMessage[]>>({});

  // AI 匹配逻辑
  const refreshMatches = useCallback(async (user?: UserProfile) => {
    const userToMatch = user || currentUser;
    if (!userToMatch) return;

    setMatchingLoading(true);
    try {
      const matched = await geminiService.matchFriends(userToMatch, MOCK_USERS);
      setMatches(matched);
      setMatchCandidates(matched.slice(0, 3).map(m => m.profile));
      setCurrentMatchIndex(0);
      setLikedMatches([]);
      setMatchingPhase('matching');
    } catch (e) {
      console.error("匹配失败", e);
    } finally {
      setMatchingLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && screen === AppScreen.FRIENDS && matches.length === 0) {
      refreshMatches();
    }
  }, [currentUser, screen, matches.length]); // Removed refreshMatches from dependencies to prevent re-triggering

  const handleMatchDecision = (liked: boolean) => {
    if (liked) {
      setLikedMatches(prev => [...prev, matchCandidates[currentMatchIndex]]);
    }
    const nextIndex = currentMatchIndex + 1;
    if (nextIndex >= matchCandidates.length) {
      setMatchingPhase('results');
    } else {
      setCurrentMatchIndex(nextIndex);
    }
  };

  const handleJoinActivity = (id: string) => {
    setActivities(prev => prev.map(a => 
      a.id === id ? { ...a, participants: [...a.participants, currentUser!.id] } : a
    ));
  };

  const handlePostActivity = (activity: Activity) => {
    const newActivityWithRegion = { ...activity, region: currentUser!.region };
    setActivities([newActivityWithRegion, ...activities]);
    setShowPlanner(false);
    setScreen(AppScreen.ACTIVITIES);
  };

  const handleEditProfile = () => {
    // For simplicity, we'll go back to onboarding to re-enter profile details.
    // In a real app, this would navigate to an edit profile screen pre-filled with current data.
    setCurrentUser(null);
    setScreen(AppScreen.ONBOARDING);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setScreen(AppScreen.ONBOARDING);
    setMatches([]); // Clear matches on logout
    setAllMessages({}); // Clear messages on logout
  };

  const handleOpenChat = (partner: UserProfile) => {
    setActiveChatPartner(partner);
    setScreen(AppScreen.CHAT);
  };

  const handleSendMessage = (text: string) => {
    if (!activeChatPartner || !currentUser) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text,
      timestamp: Date.now()
    };

    setAllMessages(prev => ({
      ...prev,
      [activeChatPartner.id]: [...(prev[activeChatPartner.id] || []), newMessage]
    }));

    // 模拟对方自动回复（仅演示用）
    setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: activeChatPartner.id,
        text: "很高兴收到你的消息！我们确实有很多共同话题。",
        timestamp: Date.now()
      };
      setAllMessages(prev => ({
        ...prev,
        [activeChatPartner.id]: [...(prev[activeChatPartner.id] || []), reply]
      }));
    }, 2000);
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    const avatar = profile.gender === 'female' 
      ? 'https://storage.googleapis.com/maker-me-assets/assets/elderly-woman-4.png'
      : 'https://storage.googleapis.com/maker-me-assets/assets/elderly-man-4.png';
    
    const profileWithAvatar = { ...profile, avatar };

    setCurrentUser(profileWithAvatar);
    setScreen(AppScreen.HOME);
    // Immediately call refreshMatches with the new profile to ensure correct gender is used.
    refreshMatches(profileWithAvatar);
  };

  if (!currentUser) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // 渲染聊天室（如果处于聊天屏幕）
  if (screen === AppScreen.CHAT && activeChatPartner) {
    return (
      <ChatRoom
        partner={activeChatPartner}
        currentUser={currentUser}
        messages={allMessages[activeChatPartner.id] || []}
        onSendMessage={handleSendMessage}
        onBack={() => setScreen(AppScreen.FRIENDS)}
      />
    );
  }

  return (
    <Layout activeScreen={screen} setScreen={setScreen}>
      {screen === AppScreen.HOME && (
        <div className="p-5 animate-in fade-in duration-500">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2.5rem] p-8 text-white mb-8 shadow-xl shadow-orange-100 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">您好，{currentUser.name}！</h2>
              <p className="text-orange-100 text-lg opacity-90 mb-6">{currentUser.aiSummary}</p>
              <div className="flex gap-2 flex-wrap">
                {currentUser.tags.map(tag => (
                  <span key={tag} className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <Sparkles className="absolute -right-4 -bottom-4 text-white/10" size={160} />
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-2xl font-bold text-gray-900">为您推荐</h3>
              <button 
                onClick={() => setScreen(AppScreen.ACTIVITIES)}
                className="text-orange-600 font-bold hover:underline"
              >
                查看全部
              </button>
            </div>
            <div className="space-y-4">
              {activities.slice(0, 2).map(activity => (
                <ActivityCard 
                  key={activity.id} 
                  activity={activity} 
                  onJoin={handleJoinActivity}
                  isJoined={activity.participants.includes(currentUser.id)}
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">社区动态</h3>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
                <Users size={40} className="mx-auto text-orange-200 mb-3" />
                <p className="text-gray-600 font-medium text-lg">今天已有 120+ 位邻居在 香港 活跃！</p>
            </div>
          </div>
        </div>
      )}

      {screen === AppScreen.FRIENDS && (
        <div className="p-5 flex flex-col h-full animate-in fade-in duration-500">
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h2 className="text-3xl font-bold text-gray-900">AI 推荐好友</h2>
          </div>

          {matchingLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <Loader2 size={48} className="animate-spin mx-auto text-orange-500 mb-4" />
              <p className="text-xl font-medium text-gray-500 italic">正在向 AI 助手寻找最适合您的朋友...</p>
            </div>
          ) : matchingPhase === 'matching' && matchCandidates.length > 0 ? (
            <FriendMatcher 
              candidates={matchCandidates}
              currentIndex={currentMatchIndex}
              onDecision={handleMatchDecision}
            />
          ) : (
            <div className="flex-1 flex flex-col">
              {likedMatches.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-gray-600 text-lg font-medium">您喜欢了 {likedMatches.length} 位朋友，和他们聊聊吧！</p>
                  {likedMatches.map((profile) => (
                    <div key={profile.id} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                      <img src={profile.avatar} alt={profile.name} className="w-20 h-20 rounded-2xl object-cover shadow-sm" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900">{profile.name}</h4>
                        <p className="text-gray-500">{profile.region}</p>
                      </div>
                      <button 
                        onClick={() => handleOpenChat(profile)}
                        className="bg-orange-500 text-white py-3 px-5 rounded-xl font-bold hover:bg-orange-600 transition-all active:scale-95"
                      >
                        去聊天
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center flex-1 flex flex-col items-center justify-center">
                  <p className="text-xl font-bold text-gray-700 mb-4">暂时没有找到想要的人</p>
                  <button 
                    onClick={refreshMatches}
                    className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all"
                  >
                    再试试
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {screen === AppScreen.ACTIVITIES && (
        <div className="p-5 animate-in fade-in duration-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">社区活动</h2>
            <button 
                onClick={() => setShowPlanner(true)}
                className="bg-orange-600 text-white flex items-center gap-2 px-5 py-3 rounded-2xl font-bold shadow-lg hover:bg-orange-700 active:scale-95 transition-all"
            >
                <Plus size={20} /> 我要发起
            </button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <input 
              type="text" 
              placeholder="搜索爱好或地区..." 
              className="w-full pl-12 pr-6 py-5 bg-gray-100 border-none rounded-2xl text-lg focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <div className="space-y-4">
            {activities
              .filter(activity => activity.region.startsWith('香港'))
              .map(activity => (
              <ActivityCard 
                key={activity.id} 
                activity={activity} 
                onJoin={handleJoinActivity}
                isJoined={activity.participants.includes(currentUser.id)}
              />
            ))}
          </div>
        </div>
      )}

      {screen === AppScreen.PROFILE && (
        <div className="p-5 animate-in fade-in duration-500">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-6">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-32 h-32 rounded-[2.5rem] object-cover ring-8 ring-orange-50 shadow-xl" />
                <div className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-xl border-4 border-white">
                    <Sparkles size={16} />
                </div>
            </div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <h2 className="text-3xl font-bold text-gray-900">{currentUser.name}</h2>
              {currentUser.gender === 'female' && (
                <div className="bg-pink-100 text-pink-600 p-1.5 rounded-full">
                  <Venus size={16} />
                </div>
              )}
              {currentUser.gender === 'male' && (
                <div className="bg-blue-100 text-blue-600 p-1.5 rounded-full">
                  <Mars size={16} />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-gray-500 font-medium mb-4">
                <MapPin size={18} />
                <span>{currentUser.region}</span>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm w-full">
                <p className="text-sm font-black text-orange-600 uppercase tracking-widest mb-3">AI 专属印象</p>
                <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">“{currentUser.aiSummary}”</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {currentUser.tags.map(tag => (
                        <span key={tag} className="bg-orange-50 text-orange-700 px-4 py-1.5 rounded-full text-sm font-bold border border-orange-100">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleEditProfile}
              className="w-full bg-white text-left p-6 rounded-3xl border border-gray-100 font-bold text-lg flex justify-between items-center hover:bg-gray-50"
            >
                <span>修改兴趣爱好</span>
                <span className="text-gray-400">→</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full bg-white text-left p-6 rounded-3xl border border-gray-100 font-bold text-lg flex justify-between items-center hover:bg-gray-50 text-red-500"
            >
                <span>退出登录</span>
            </button>
          </div>
        </div>
      )}

      {showPlanner && (
        <ActivityPlanner 
          user={currentUser} 
          onPost={handlePostActivity} 
          onClose={() => setShowPlanner(false)} 
        />
      )}
    </Layout>
  );
};

export default App;
