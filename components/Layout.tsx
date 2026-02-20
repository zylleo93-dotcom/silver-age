
import React from 'react';
import { Home, Users, Calendar, User, Heart } from 'lucide-react';
import { AppScreen } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeScreen: AppScreen;
  setScreen: (screen: AppScreen) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeScreen, setScreen }) => {
  const navItems = [
    { id: AppScreen.HOME, label: '首页', icon: Home },
    { id: AppScreen.FRIENDS, label: '找朋友', icon: Users },
    { id: AppScreen.ACTIVITIES, label: '社区活动', icon: Calendar },
    { id: AppScreen.PROFILE, label: '我的', icon: User },
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-2xl mx-auto bg-white shadow-xl relative">
      {/* 顶部栏 */}
      <header className="bg-orange-50 p-4 border-b border-orange-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-2 rounded-xl text-white">
            <Heart size={24} fill="white" />
          </div>
          <h1 className="text-2xl font-bold text-orange-900">金秋缘</h1>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>

      {/* 底部导航栏 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-2 max-w-2xl mx-auto flex justify-around items-center z-10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
                isActive ? 'text-orange-600 bg-orange-50' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Icon size={28} />
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
