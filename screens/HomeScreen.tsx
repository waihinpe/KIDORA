
import React from 'react';
import { Search, ShoppingBag, PlusCircle, ShieldCheck, Heart, Leaf } from 'lucide-react';
import { MOCK_PRODUCTS, PRIMARY_COLOR } from '../constants';
import { Product, User } from '../types';

interface HomeScreenProps {
  user: User | null;
  cartCount?: number;
  onProductClick: (product: Product) => void;
  onExploreClick: () => void;
  onSellClick: () => void;
}

export const KidoraLogo = ({ size = 40, showText = false, className = "" }: { size?: number, showText?: boolean, className?: string }) => (
  <div className={`flex flex-col items-center justify-center ${className}`}>
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hand 1: Orange (Top) */}
      <g transform="rotate(0 50 50)">
        <path d="M55 25C65 25 75 35 75 45" stroke="#f58220" strokeWidth="8" strokeLinecap="round" />
        <path d="M55 25C50 25 45 30 43 35M47 32C42 32 37 37 35 42M51 28C46 28 41 33 39 38M59 28C59 23 54 18 49 18" stroke="#f58220" strokeWidth="4" strokeLinecap="round" />
      </g>
      {/* Hand 2: Blue (Bottom Right) */}
      <g transform="rotate(120 50 50)">
        <path d="M55 25C65 25 75 35 75 45" stroke="#00aeef" strokeWidth="8" strokeLinecap="round" />
        <path d="M55 25C50 25 45 30 43 35M47 32C42 32 37 37 35 42M51 28C46 28 41 33 39 38M59 28C59 23 54 18 49 18" stroke="#00aeef" strokeWidth="4" strokeLinecap="round" />
      </g>
      {/* Hand 3: Green (Bottom Left) */}
      <g transform="rotate(240 50 50)">
        <path d="M55 25C65 25 75 35 75 45" stroke="#007d34" strokeWidth="8" strokeLinecap="round" />
        <path d="M55 25C50 25 45 30 43 35M47 32C42 32 37 37 35 42M51 28C46 28 41 33 39 38M59 28C59 23 54 18 49 18" stroke="#007d34" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
    {showText && <span className="text-[#007d34] font-black text-xl uppercase tracking-widest mt-2">KIDORA</span>}
  </div>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ user, cartCount = 0, onProductClick, onExploreClick, onSellClick }) => {
  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div className="px-6 pt-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
             <KidoraLogo size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-[#007d34]">KIDORA</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Give Kids Gear a Second Life</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <div className="p-2.5 bg-gray-50 rounded-2xl border border-gray-100 text-gray-400 active:scale-95 transition-transform cursor-pointer">
                <Search size={20} />
            </div>
            <div className="relative p-2.5 bg-gray-50 rounded-2xl border border-gray-100 text-gray-400 active:scale-95 transition-transform cursor-pointer">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#007d34] text-white text-[8px] rounded-full h-4 w-4 flex items-center justify-center font-bold border-2 border-white animate-in zoom-in duration-300">
                    {cartCount}
                  </span>
                )}
            </div>
        </div>
      </div>

      {/* Sustainability Highlight */}
      <div className="px-6">
        <div className="bg-[#e6f2eb] rounded-[32px] p-6 flex items-center justify-between border border-[#007d34]/10 shadow-sm relative overflow-hidden group">
          <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
          <div className="space-y-1 relative z-10">
            <div className="flex items-center gap-1 text-[10px] font-black uppercase text-[#007d34] tracking-widest opacity-60">
              <Leaf size={10} fill="currentColor" />
              <span>Community Impact</span>
            </div>
            <h3 className="text-[#007d34] font-black text-xl leading-tight">12k Moms in SEA<br/>saving the planet</h3>
            <p className="text-[#007d34] text-[10px] font-bold opacity-60">Circular economy for modern families</p>
          </div>
          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg border border-[#007d34]/5 transform -rotate-12 group-hover:rotate-0 transition-transform overflow-hidden">
            <KidoraLogo size={40} />
          </div>
        </div>
      </div>

      {/* Sell CTA */}
      <div className="px-6">
        <button 
          onClick={onSellClick}
          className="w-full bg-[#007d34] text-white rounded-[24px] py-4.5 flex items-center justify-center gap-3 font-black shadow-2xl shadow-green-900/20 active:scale-95 transition-all"
        >
          <div className="bg-white/20 p-1.5 rounded-xl">
            <PlusCircle size={20} />
          </div>
          <span className="uppercase tracking-widest text-[11px]">List your pre-loved gear</span>
        </button>
      </div>

      {/* Categories */}
      <div className="px-6">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-lg font-black text-gray-900">Browse Gear</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Quality checked</p>
          </div>
          <button onClick={onExploreClick} className="text-[#007d34] text-xs font-black uppercase tracking-widest active:scale-90 transition-transform">See All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
          {['Strollers', 'Toys', 'Clothing', 'Feeding', 'Nursery'].map((cat) => (
            <div key={cat} className="flex flex-col items-center gap-3 min-w-[76px] group cursor-pointer">
              <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center border border-gray-100 shadow-sm group-hover:shadow-md group-hover:border-[#007d34]/20 group-active:scale-95 transition-all">
                <span className="text-2xl transition-transform group-hover:scale-110">
                  {cat === 'Strollers' ? '🛒' : cat === 'Toys' ? '🧸' : cat === 'Clothing' ? '👕' : cat === 'Feeding' ? '🍼' : '🛏️'}
                </span>
              </div>
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-tighter group-hover:text-[#007d34] transition-colors">{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="px-6 flex justify-between gap-3">
        <div className="flex flex-col items-center gap-2 bg-white border border-gray-100 p-4 rounded-[24px] flex-1 shadow-sm">
            <div className="p-2 bg-green-50 rounded-xl text-[#007d34]">
                <ShieldCheck size={18} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-tighter text-gray-400 text-center">Secure Escrow</span>
        </div>
        <div className="flex flex-col items-center gap-2 bg-white border border-gray-100 p-4 rounded-[24px] flex-1 shadow-sm">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-500">
                <ShieldCheck size={18} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-tighter text-gray-400 text-center">Mom-Verified</span>
        </div>
      </div>

      {/* Recommended Items */}
      <div className="px-6 pb-10">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-lg font-black text-gray-900">Fresh Pre-loved</h2>
          <p className="text-[10px] text-[#007d34] font-black uppercase tracking-widest">Just Added</p>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10">
          {MOCK_PRODUCTS.slice(0, 4).map((product) => (
            <div 
                key={product.id} 
                onClick={() => onProductClick(product)}
                className="group cursor-pointer flex flex-col"
            >
              <div className="aspect-[4/5] rounded-[32px] overflow-hidden bg-gray-100 mb-4 relative shadow-sm border border-gray-100 transition-shadow hover:shadow-xl">
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm text-gray-400 hover:text-red-500 transition-colors z-10">
                  <Heart size={16} />
                </button>
                <div className="absolute bottom-4 left-4 bg-[#007d34] text-white text-[8px] font-black px-2.5 py-1 rounded-lg shadow-lg uppercase tracking-wider z-10">
                    {product.condition}
                </div>
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="space-y-0.5 px-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.brand}</p>
                <h3 className="font-bold text-sm line-clamp-1 text-gray-900"> {product.name}</h3>
                <div className="flex items-center gap-2 pt-1">
                    <span className="font-black text-lg text-[#007d34]">{product.currency} {product.price}</span>
                    <span className="text-[10px] text-gray-300 line-through font-bold">{product.currency} {product.originalPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
