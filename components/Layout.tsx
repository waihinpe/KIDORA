
import React from 'react';
import { Screen } from '../types';
import { Home, Search, Leaf, User } from 'lucide-react';
import { PRIMARY_COLOR } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeScreen: Screen;
  setScreen: (screen: Screen) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeScreen, setScreen }) => {
  const navItems = [
    { id: Screen.HOME, label: 'Home', icon: Home },
    { id: Screen.EXPLORE, label: 'Explore', icon: Search },
    { id: Screen.SUSTAINABILITY, label: 'Impact', icon: Leaf },
    { id: Screen.PROFILE, label: 'Profile', icon: User },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-xl relative overflow-hidden">
      <main className="flex-1 overflow-y-auto hide-scrollbar pb-24">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center py-3 px-2 z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className="flex flex-col items-center gap-1 transition-all"
            >
              <Icon 
                size={22} 
                strokeWidth={isActive ? 2.5 : 2} 
                color={isActive ? PRIMARY_COLOR : '#9ca3af'} 
              />
              <span 
                className={`text-[10px] font-medium ${isActive ? 'text-[#007d34]' : 'text-gray-400'}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
