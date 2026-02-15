
import React, { useState } from 'react';
import { Settings, Wallet, Package, Heart, Star, CreditCard, LogOut, ChevronRight, Award, UserPlus, ShieldCheck, Leaf, X, Truck, Plus, CheckCircle2, Clock } from 'lucide-react';
import { User } from '../types';

interface ProfileScreenProps {
  user: User | null;
  onLogout: () => void;
  onLoginPrompt: () => void;
  onNavigateToImpact: () => void;
}

type ModalType = 'buying' | 'selling' | 'payment' | null;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onLogout, onLoginPrompt, onNavigateToImpact }) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  if (!user) {
    return (
      <div className="flex flex-col h-full bg-white px-6 pt-12 animate-in fade-in duration-500">
        <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8">
          <div className="w-24 h-24 bg-[#e6f2eb] rounded-[40px] flex items-center justify-center text-4xl shadow-inner border border-[#007d34]/10">
            👤
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-black text-gray-900">Join the Community</h2>
            <p className="text-sm text-gray-500 font-medium px-10">
              Create an account to track your environmental impact, manage listings, and save your favorites.
            </p>
          </div>

          <div className="w-full space-y-4 px-4">
            <button 
              onClick={onLoginPrompt}
              className="w-full bg-[#007d34] text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-green-900/20 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <UserPlus size={18} strokeWidth={3} />
              Sign In / Sign Up
            </button>
            <div className="flex items-center justify-center gap-6 pt-4">
                <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-blue-50 rounded-2xl text-blue-500">
                        <ShieldCheck size={18} />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Secure</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-green-50 rounded-2xl text-[#007d34]">
                        <Leaf size={18} />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Green</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-orange-50 rounded-2xl text-orange-500">
                        <Award size={18} />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Verified</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderModalContent = () => {
    switch (activeModal) {
      case 'buying':
        return (
          <div className="space-y-4">
            {[
              { id: '1', title: 'Bugaboo Fox 3 Stroller', price: 850, date: 'Oct 12, 2023', status: 'Delivered', img: 'https://images.unsplash.com/photo-1591084728795-1149fb3a288d?auto=format&fit=crop&w=200&q=80' },
              { id: '2', title: 'Lovevery Play Gym', price: 110, date: 'Sep 28, 2023', status: 'Delivered', img: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=200&q=80' }
            ].map(item => (
              <div key={item.id} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-3xl shadow-sm">
                <img src={item.img} className="w-20 h-20 rounded-2xl object-cover bg-gray-50 shrink-0 border border-gray-100" alt={item.title} />
                <div className="flex-1 py-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                  </div>
                  <p className="text-xs font-black text-gray-900 mb-2">SGD {item.price}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-bold">{item.date}</span>
                    <div className="flex items-center gap-1 bg-green-50 text-[#007d34] px-2 py-1 rounded-md">
                      <CheckCircle2 size={10} />
                      <span className="text-[8px] font-black uppercase tracking-widest">{item.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'selling':
        return (
          <div className="space-y-4">
            {[
              { id: '1', title: 'Stokke Tripp Trapp Chair', price: 280, views: 142, status: 'In Transit', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=200&q=80' },
              { id: '2', title: 'Ergobaby Omni 360', price: 95, views: 56, status: 'Listed', img: 'https://images.unsplash.com/photo-1602738328654-51ab2330b8b4?auto=format&fit=crop&w=200&q=80' }
            ].map(item => (
              <div key={item.id} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-3xl shadow-sm">
                <img src={item.img} className="w-20 h-20 rounded-2xl object-cover bg-gray-50 shrink-0 border border-gray-100" alt={item.title} />
                <div className="flex-1 py-1">
                  <h4 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1">{item.title}</h4>
                  <p className="text-xs font-black text-gray-900 mb-2">SGD {item.price}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-bold">{item.views} Views</span>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${item.status === 'In Transit' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                      {item.status === 'In Transit' ? <Truck size={10} /> : <Clock size={10} />}
                      <span className="text-[8px] font-black uppercase tracking-widest">{item.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'payment':
        return (
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M2.004 14.156c0 4.102 3.328 7.422 7.422 7.422 1.953 0 3.828-.781 5.234-2.188l1.5-1.547-1.453-1.453-1.547 1.547c-1.031 1.031-2.438 1.641-3.734 1.641-2.953 0-5.422-2.469-5.422-5.422 0-1.406.562-2.812 1.641-3.844l4.219-4.219c1.031-1.031 2.438-1.594 3.844-1.594 2.953 0 5.422 2.469 5.422 5.422 0 1.266-.469 2.531-1.266 3.516l1.453 1.453c1.078-1.312 1.812-3.047 1.812-4.969 0-4.102-3.328-7.422-7.422-7.422-1.953 0-3.828.781-5.234 2.188l-4.219 4.219c-1.406 1.406-2.25 3.328-2.25 5.25z"/></svg>
              </div>
              <div className="flex justify-between items-center mb-8 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Primary Card</span>
                <span className="text-sm font-bold italic">VISA</span>
              </div>
              <div className="space-y-1 relative z-10">
                <p className="text-xl font-black tracking-[0.2em] font-mono">•••• •••• •••• 4242</p>
                <div className="flex justify-between items-end mt-4 text-[10px] uppercase font-black tracking-widest opacity-80">
                  <span>{user.name}</span>
                  <span>12/25</span>
                </div>
              </div>
            </div>

            <button className="w-full flex flex-col items-center justify-center gap-2 p-6 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-[#007d34] hover:text-[#007d34] hover:bg-green-50 transition-all active:scale-95">
              <Plus size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest">Add New Payment Method</span>
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (activeModal) {
      case 'buying': return 'Buying History';
      case 'selling': return 'Selling Status';
      case 'payment': return 'Payment Methods';
      default: return '';
    }
  };

  const menuItems = [
    { label: 'Buying History', icon: Package, value: '12 orders', action: () => setActiveModal('buying') },
    { label: 'Selling Status', icon: Truck, value: '3 active', action: () => setActiveModal('selling') },
    { label: 'Payment Methods', icon: CreditCard, value: 'Visa ending 4242', action: () => setActiveModal('payment') },
    { label: 'My Impact Report', icon: Award, value: 'Tier 4', action: onNavigateToImpact },
    { label: 'Log Out', icon: LogOut, value: '', danger: true, action: onLogout },
  ];

  return (
    <div className="flex flex-col min-h-full pb-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="pt-10 px-6 pb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        <button className="p-2.5 bg-gray-50 rounded-2xl border border-gray-100">
            <Settings size={20} className="text-gray-500" />
        </button>
      </div>

      {/* User Info */}
      <div className="px-6 mb-8 flex items-center gap-4">
        <div className="relative">
            <img 
                src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`} 
                className="w-20 h-20 rounded-[32px] border-4 border-white shadow-lg object-cover" 
            />
            <div className="absolute -bottom-1 -right-1 bg-[#007d34] p-1.5 rounded-xl border-2 border-white">
                <Award size={14} className="text-white" />
            </div>
        </div>
        <div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">Eco-conscious Mom since {new Date(user.joinedDate).getFullYear()}</p>
            <div className="flex items-center gap-1 mt-1 text-yellow-500 font-bold text-xs">
                <Star size={12} fill="currentColor" />
                <span>{user.rating} ({user.reviewsCount} reviews)</span>
            </div>
        </div>
      </div>

      {/* Wallet Card */}
      <div className="px-6 mb-8">
        <div className="bg-gray-900 rounded-[40px] p-8 text-white flex justify-between items-center">
            <div>
                <p className="text-[10px] uppercase font-bold opacity-60 mb-1">Total Earnings</p>
                <p className="text-3xl font-bold">SGD {user.totalEarnings.toLocaleString()}</p>
            </div>
            <button className="bg-white/10 p-4 rounded-3xl hover:bg-white/20 transition-all">
                <Wallet size={24} />
            </button>
        </div>
      </div>

      {/* Main Actions */}
      <div className="px-6 grid grid-cols-2 gap-4 mb-8">
        <button onClick={() => setActiveModal('selling')} className="bg-gray-50 p-5 rounded-3xl border border-gray-100 flex flex-col items-center gap-2 group hover:bg-[#e6f2eb] transition-all">
            <Package size={24} className="text-gray-400 group-hover:text-[#007d34]" />
            <span className="text-xs font-bold">Active Listings (8)</span>
        </button>
        <button className="bg-gray-50 p-5 rounded-3xl border border-gray-100 flex flex-col items-center gap-2 group hover:bg-[#e6f2eb] transition-all">
            <Heart size={24} className="text-gray-400 group-hover:text-red-500" />
            <span className="text-xs font-bold">Favorites (24)</span>
        </button>
      </div>

      {/* Settings List */}
      <div className="px-6 space-y-2">
        {menuItems.map((item) => (
            <button 
                key={item.label}
                onClick={item.action}
                className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all ${item.danger ? 'text-red-500 hover:bg-red-50' : 'hover:bg-gray-50 border border-transparent hover:border-gray-100'}`}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${item.danger ? 'bg-red-100' : 'bg-gray-100 text-gray-500'}`}>
                        <item.icon size={18} />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-bold">{item.label}</p>
                        {item.value && <p className="text-[10px] text-gray-400 font-medium">{item.value}</p>}
                    </div>
                </div>
                {!item.danger && <ChevronRight size={16} className="text-gray-300" />}
            </button>
        ))}
      </div>

      {/* Interactive Bottom Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
          <div className="relative w-full max-w-md bg-white rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-500 max-h-[85vh] flex flex-col">
            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-6 shrink-0" />
            
            <div className="flex items-center justify-between mb-8 shrink-0">
              <h2 className="text-2xl font-black text-gray-900">{getModalTitle()}</h2>
              <button onClick={() => setActiveModal(null)} className="p-2 text-gray-400 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar">
              {renderModalContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;
