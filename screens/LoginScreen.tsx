
import React, { useState } from 'react';
import { Mail, ChevronRight, Apple, Chrome, ArrowLeft, Loader2, Heart, ShieldCheck } from 'lucide-react';
import { KidoraLogo } from './HomeScreen';

interface LoginScreenProps {
  onLogin: (email: string) => void;
  onGuest: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onGuest }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      onLogin(email);
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-white px-8 pt-8 pb-6 animate-in fade-in duration-500">
      <div className="flex-1 flex flex-col justify-center">
        {/* Branding */}
        <div className="text-center mb-6">
          <div className="mb-0 flex justify-center">
            <KidoraLogo size={100} />
          </div>
          <h1 className="text-3xl font-black text-[#007d34] tracking-tighter mb-2">KIDORA</h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest px-4">
            Smart Savings • Green Parenting
          </p>
        </div>

        {/* Benefits */}
        <div className="space-y-3 mb-6 px-2">
            <div className="flex items-center gap-4 p-4 rounded-[28px] bg-gray-50 border border-gray-100 shadow-sm">
                <div className="p-3 bg-white rounded-2xl text-[#007d34] shadow-sm">
                    <Heart size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-0.5">Save up to 70%</p>
                    <p className="text-[11px] text-gray-500 font-medium">Verified premium baby brands at a fraction of retail price.</p>
                </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-[28px] bg-gray-50 border border-gray-100 shadow-sm">
                <div className="p-3 bg-white rounded-2xl text-blue-500 shadow-sm">
                    <ShieldCheck size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-0.5">Safe & Secure</p>
                    <p className="text-[11px] text-gray-500 font-medium">Escrow payments and quality checks on all high-impact gear.</p>
                </div>
            </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative group">
            <div className="absolute inset-y-0 left-5 flex items-center text-gray-300 group-focus-within:text-[#007d34] transition-colors">
              <Mail size={18} />
            </div>
            <input 
              type="email" 
              placeholder="Email address"
              className="w-full bg-gray-50 border border-gray-100 rounded-[28px] pl-14 pr-5 py-4 text-sm font-bold outline-none focus:bg-white focus:border-[#007d34] focus:ring-4 focus:ring-green-50 transition-all shadow-sm placeholder-gray-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit"
            disabled={isSubmitting || !email}
            className="w-full bg-[#007d34] text-white py-4 rounded-[28px] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-green-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : (
              <>
                <span>Continue</span>
                <ChevronRight size={16} strokeWidth={4} />
              </>
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em] text-gray-300 bg-white px-6">
            Social Login
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-4 rounded-[28px] border border-gray-100 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
                <Chrome size={20} />
                Google
            </button>
            <button className="flex items-center justify-center gap-3 py-4 rounded-[28px] border border-gray-100 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
                <Apple size={20} />
                Apple
            </button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button 
          onClick={onGuest}
          className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-[#007d34] transition-colors active:scale-90"
        >
          Browse as Guest
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
