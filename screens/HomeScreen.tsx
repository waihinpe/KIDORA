
import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, PlusCircle, ShieldCheck, Heart, Leaf, ImageOff, RefreshCw, Loader2, Sparkles, Globe } from 'lucide-react';
import { MOCK_PRODUCTS, PRIMARY_COLOR } from '../constants';
import { Product, User } from '../types';
import { repairBrokenImage } from '../services/geminiService';

export const KidoraLogo = ({ size = 100, showText = false, className = "" }: { size?: number, showText?: boolean, className?: string }) => (
  <div className={`flex flex-col items-center justify-center ${className}`}>
    <img 
      src="/assets/kidora-logo.png" 
      alt="KIDORA Logo" 
      width={size} 
      height={size} 
      className="object-contain"
      style={{ width: size, height: size }}
    />
    {showText && <span className="text-[#007d34] font-black text-xl uppercase tracking-widest mt-2">KIDORA</span>}
  </div>
);

// Added optional key prop to satisfy TypeScript strict prop checking when used in .map()
interface ProductCardProps {
  product: Product;
  onProductClick: (p: Product) => void;
  key?: React.Key;
}

interface HomeScreenProps {
  user: User | null;
  cartCount?: number;
  onProductClick: (product: Product) => void;
  onExploreClick: () => void;
  onSellClick: () => void;
}

const ProductCard = ({ product, onProductClick }: ProductCardProps) => {
  const [imgUrl, setImgUrl] = useState(product.images[0]);
  const [isBroken, setIsBroken] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);
  const [repaired, setRepaired] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [repairMethod, setRepairMethod] = useState<'search' | 'fallback' | null>(null);

  const handleImageError = async () => {
    if (isRepairing || repaired) {
      setIsBroken(true);
      return;
    }
    
    setIsRepairing(true);
    const repairResult = await repairBrokenImage(product.name, product.brand);
    
    if (repairResult?.suggestedUrl) {
      setImgUrl(repairResult.suggestedUrl);
      setRepaired(true);
      setIsBroken(false);
      setRepairMethod(repairResult.explanation?.includes('Rate limit') ? 'fallback' : 'search');
    } else {
      setIsBroken(true);
    }
    setIsRepairing(false);
  };

  return (
    <div 
        onClick={() => onProductClick(product)}
        className="group cursor-pointer flex flex-col"
    >
      <div className="aspect-[4/5] rounded-[32px] overflow-hidden bg-gray-50 mb-4 relative shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:translate-y-[-4px]">
        {/* Shimmer Placeholder */}
        {!isLoaded && !isBroken && !isRepairing && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
        )}

        {isRepairing ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-50 text-[#007d34] gap-3">
            <Loader2 size={24} className="animate-spin" />
            <div className="text-center px-4">
              <span className="text-[8px] font-black uppercase tracking-widest block">AI Sourcing</span>
              <span className="text-[6px] font-bold uppercase tracking-widest opacity-60">
                Finding HD Catalog Image...
              </span>
            </div>
          </div>
        ) : isBroken ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-300 gap-3">
            <ImageOff size={32} strokeWidth={1.5} />
            <button 
              onClick={(e) => { e.stopPropagation(); setIsBroken(false); setRepaired(false); handleImageError(); }}
              className="text-[8px] font-black uppercase tracking-widest text-[#007d34] bg-[#e6f2eb] px-3 py-1.5 rounded-lg border border-green-100"
            >
              Retry AI Search
            </button>
          </div>
        ) : (
          <>
            <img 
              src={imgUrl} 
              alt={product.name} 
              loading="lazy"
              decoding="async"
              onLoad={() => setIsLoaded(true)}
              onError={handleImageError}
              className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-1000 ${repaired ? 'saturate-[1.15] brightness-105' : ''} ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
            />
            {repaired && isLoaded && (
              <div className={`absolute top-4 left-4 flex items-center gap-1.5 ${repairMethod === 'fallback' ? 'bg-orange-500' : 'bg-blue-500'} text-white text-[7px] font-black px-2.5 py-1.5 rounded-xl shadow-xl border border-white/20 animate-in zoom-in-75`}>
                {repairMethod === 'fallback' ? <ShieldCheck size={10} /> : <Globe size={10} />}
                <span>{repairMethod === 'fallback' ? 'VERIFIED PRE-LOVED' : 'GOOGLE SEARCH HD'}</span>
              </div>
            )}
          </>
        )}
        
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
        <h3 className="font-bold text-sm line-clamp-1 text-gray-900 leading-tight"> {product.name}</h3>
        <div className="flex items-center gap-2 pt-1">
            <span className="font-black text-lg text-[#007d34]">{product.currency} {product.price}</span>
            <span className="text-[10px] text-gray-300 line-through font-bold">{product.currency} {product.originalPrice}</span>
        </div>
      </div>
    </div>
  );
};

const HomeScreen: React.FC<HomeScreenProps> = ({ user, cartCount = 0, onProductClick, onExploreClick, onSellClick }) => {
  return (
    <div className="flex flex-col space-y-6">
      {/* Header - Sticky */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
             <KidoraLogo size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-[#007d34]">KIDORA</h1>
            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Give Kids Gear a Second Life</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 text-gray-400 active:scale-95 transition-transform cursor-pointer">
                <Search size={18} />
            </div>
            <div className="relative p-2 bg-gray-50 rounded-xl border border-gray-100 text-gray-400 active:scale-95 transition-transform cursor-pointer">
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#007d34] text-white text-[8px] rounded-full h-4 w-4 flex items-center justify-center font-bold border-2 border-white animate-in zoom-in duration-300">
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
            <ProductCard key={product.id} product={product} onProductClick={onProductClick} />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default HomeScreen;
