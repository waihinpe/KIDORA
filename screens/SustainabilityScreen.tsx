
import React, { useState } from 'react';
import { Leaf, Globe, Users, Trophy, Sprout, Droplets, Wind, ChevronRight, Receipt, Share2, X, ShieldCheck, Download, Sparkles } from 'lucide-react';

const SustainabilityScreen: React.FC = () => {
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const myStats = [
    { label: 'CO2 Offset', value: '42.8 kg', icon: Wind, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Water Saved', value: '1.2k L', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Items Reused', value: '14', icon: Sprout, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Tree Credits', value: '3.5', icon: Leaf, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  const receiptData = {
    id: "KID-2024-88392",
    date: new Date().toLocaleDateString('en-SG', { day: '2-digit', month: 'short', year: 'numeric' }),
    items: [
      { name: "Landfill Diversion", qty: "14 Units", impact: "High" },
      { name: "CO2 Sequestration", qty: "42.8 kg", impact: "Significant" },
      { name: "Water Conservation", qty: "1,240 L", impact: "Major" },
      { name: "Tree Equivalent", qty: "3.5 Trees", impact: "Growing" }
    ],
    totalImpact: "4.8/5.0",
    tier: "Earth Hero"
  };

  return (
    <div className="flex flex-col space-y-8 px-6 pt-10 pb-24">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Impact</h1>
        <p className="text-sm text-gray-500 font-medium">Every choice counts for a greener future.</p>
      </div>

      {/* Impact Score Card */}
      <div className="bg-[#007d34] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-green-900/20 group">
        <div className="relative z-10">
            <p className="text-[10px] uppercase font-black tracking-widest opacity-70 mb-2">Sustainability Tier</p>
            <h2 className="text-4xl font-black mb-6 flex items-baseline gap-2">
                Earth Hero <span className="text-sm font-bold opacity-80">Lv. 4</span>
            </h2>
            <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                    <span>Next: Planet Guardian</span>
                    <span>750/1000 pts</span>
                </div>
                <div className="h-2.5 bg-white/20 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-white w-3/4 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.5)] transition-all duration-1000" />
                </div>
            </div>
            
            <button 
              onClick={() => setIsReceiptOpen(true)}
              className="mt-8 w-full bg-white/10 backdrop-blur-md border border-white/20 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/20 transition-all active:scale-95"
            >
              <Receipt size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">View Impact Receipt</span>
            </button>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-[#00ff6a]/10 rounded-full blur-2xl" />
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-2 gap-4">
        {myStats.map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
                <stat.icon size={24} />
            </div>
            <p className="text-xl font-black text-gray-900 tracking-tight">{stat.value}</p>
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.15em] mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Community Milestones */}
      <div>
        <div className="flex items-center justify-between mb-5 px-1">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <Users size={16} className="text-[#007d34]" />
                Community Milestones
            </h3>
            <span className="text-[10px] font-black text-[#007d34] uppercase tracking-widest bg-green-50 px-2 py-1 rounded-lg">LIVE</span>
        </div>
        <div className="space-y-4">
            <div className="bg-white p-5 rounded-[32px] border border-gray-100 flex items-center gap-4 shadow-sm hover:border-[#007d34]/20 transition-all cursor-pointer group">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl shadow-inner flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🌏</div>
                <div className="flex-1">
                    <p className="text-sm font-black text-gray-900">1 Million Items Reused</p>
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">Community is 85% through this goal!</p>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-[#007d34] group-hover:translate-x-1 transition-all" />
            </div>
            <div className="bg-white p-5 rounded-[32px] border border-gray-100 flex items-center gap-4 shadow-sm opacity-60">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl shadow-inner flex items-center justify-center text-3xl">🌳</div>
                <div className="flex-1">
                    <p className="text-sm font-black text-gray-900">Eco-Forest Initiative</p>
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">10,000 trees planted in SEA mangroves.</p>
                </div>
                <div className="p-2 bg-yellow-50 rounded-xl text-yellow-600">
                    <Trophy size={16} fill="currentColor" />
                </div>
            </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-br from-[#e6f2eb] to-green-50 rounded-[32px] p-6 border border-[#007d34]/10 shadow-sm relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-5%] text-[#007d34]/5 rotate-12">
            <Leaf size={100} fill="currentColor" />
        </div>
        <h4 className="text-[#007d34] font-black text-[10px] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
            <Sparkles size={12} fill="currentColor" />
            Green Tip of the Day
        </h4>
        <p className="text-[#007d34] text-xs leading-relaxed font-bold italic opacity-80">
          "Wooden toys are not only biodegradable but often more durable than plastic ones, lasting through multiple generations."
        </p>
      </div>

      {/* Impact Receipt Modal */}
      {isReceiptOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setIsReceiptOpen(false)} />
          
          <div className="relative w-full max-w-sm animate-in zoom-in-95 duration-500">
            {/* The Receipt Body */}
            <div className="bg-white rounded-t-3xl pt-10 pb-8 px-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-gray-100 to-transparent opacity-20" />
              
              {/* Receipt Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-[#e6f2eb] rounded-full flex items-center justify-center">
                    <Leaf size={32} className="text-[#007d34]" />
                  </div>
                </div>
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-[0.2em]">Impact Receipt</h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Verified by Kidora Global</p>
              </div>

              {/* Monospace Data Section */}
              <div className="font-mono text-[10px] text-gray-600 space-y-4 mb-8">
                <div className="flex justify-between border-b border-dashed border-gray-200 pb-2">
                  <span>RECEIPT ID:</span>
                  <span className="font-bold text-gray-900">{receiptData.id}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-gray-200 pb-2">
                  <span>DATE:</span>
                  <span className="font-bold text-gray-900">{receiptData.date}</span>
                </div>
                
                <div className="py-2 space-y-3">
                  {receiptData.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{item.name}</span>
                        <span className="text-[8px] opacity-60">IMPACT: {item.impact}</span>
                      </div>
                      <span className="font-black text-sm text-gray-900">{item.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-black pt-4 flex justify-between items-baseline">
                  <span className="text-xs font-black">TOTAL IMPACT SCORE:</span>
                  <span className="text-2xl font-black text-[#007d34]">{receiptData.totalImpact}</span>
                </div>
              </div>

              {/* Watermark/Stamp */}
              <div className="absolute bottom-12 right-6 rotate-[-15deg] opacity-10 pointer-events-none">
                 <div className="border-4 border-[#007d34] rounded-full p-4 flex flex-col items-center">
                    <ShieldCheck size={48} className="text-[#007d34]" />
                    <span className="text-[10px] font-black uppercase tracking-tighter text-[#007d34]">VERIFIED</span>
                 </div>
              </div>

              <div className="text-center space-y-2 relative z-10">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Status</p>
                <div className="inline-flex items-center gap-2 bg-[#007d34] text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-green-900/20">
                  <Trophy size={14} />
                  {receiptData.tier}
                </div>
              </div>
            </div>

            {/* Jagged Bottom Edge */}
            <div className="h-6 w-full flex overflow-hidden shrink-0">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="w-1/15 h-6 bg-white shrink-0 rotate-45 transform origin-top-left -translate-y-3 shadow-2xl" style={{ width: '6.66%' }} />
              ))}
            </div>

            {/* Modal Actions */}
            <div className="mt-8 flex flex-col gap-3">
              <button 
                onClick={() => console.log("Sharing impact...")}
                className="w-full bg-white text-[#007d34] py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                <Share2 size={18} strokeWidth={3} />
                Share Impact
              </button>
              <button 
                onClick={() => setIsReceiptOpen(false)}
                className="w-full bg-white/10 backdrop-blur-md text-white border border-white/20 py-4 rounded-[24px] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <X size={16} strokeWidth={3} />
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SustainabilityScreen;
