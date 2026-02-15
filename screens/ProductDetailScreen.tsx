
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Heart, Star, Shield, Leaf, Zap, Loader2, ChevronRight, CheckCircle2, ShoppingBag, Image as ImageIcon, Store, MessageCircle } from 'lucide-react';
import { Product } from '../types';
import { getAIPricingSuggestion } from '../services/geminiService';

interface ProductDetailScreenProps {
  product: Product;
  onBack: () => void;
  onBuyNow?: () => void;
  onAddToBag?: (quantity: number) => void;
}

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ product, onBack, onBuyNow, onAddToBag }) => {
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(true);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAI = async () => {
      setLoadingAI(true);
      const suggestion = await getAIPricingSuggestion({
        name: product.name,
        brand: product.brand,
        originalPrice: product.originalPrice,
        condition: product.condition
      });
      setAiSuggestion(suggestion);
      setLoadingAI(false);
    };
    fetchAI();
  }, [product]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== currentImgIndex) {
      setCurrentImgIndex(newIndex);
    }
  };

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  return (
    <div className="bg-white flex flex-col min-h-screen animate-in fade-in duration-500">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>

      {/* Header Overlay */}
      <div className="fixed top-0 left-0 right-0 max-w-md mx-auto p-6 flex justify-between items-center z-50 pointer-events-none pt-10">
        <button 
          onClick={onBack}
          className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-sm pointer-events-auto border border-white/50 active:scale-90 transition-transform text-gray-900"
        >
          <ChevronLeft size={20} />
        </button>
        <button className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-sm pointer-events-auto border border-white/50 active:scale-90 transition-transform text-red-500">
          <Heart size={20} />
        </button>
      </div>

      {/* Immersive Hero Image Slider */}
      <div className="w-full h-[55vh] bg-gray-50 relative group">
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar"
        >
          {product.images.map((img, idx) => {
            const isLoaded = loadedImages.has(idx);
            return (
              <div key={idx} className="w-full h-full shrink-0 snap-center relative">
                {/* Shimmer Placeholder */}
                {!isLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                )}
                
                {/* Icon Placeholder */}
                {!isLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon size={48} className="text-gray-200" />
                  </div>
                )}

                <img 
                  src={img} 
                  alt={`${product.name} ${idx + 1}`} 
                  onLoad={() => handleImageLoad(idx)}
                  className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
                />
              </div>
            );
          })}
        </div>

        {/* Indicators */}
        <div className="absolute bottom-14 left-0 right-0 flex justify-center gap-2 z-20">
            {product.images.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImgIndex ? 'w-6 bg-white shadow-sm' : 'w-1.5 bg-white/50'}`} 
                />
            ))}
        </div>
      </div>

      {/* Content Sheet */}
      <div className="flex-1 bg-white rounded-t-[40px] -mt-10 relative z-20 px-6 pt-8 pb-32 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 absolute top-4 left-1/2 -translate-x-1/2" />
        
        <div className="flex justify-between items-start mb-3 pt-2">
          <div className="flex items-center gap-2">
            <p className="text-xs font-black text-[#007d34] uppercase tracking-[0.2em]">{product.brand}</p>
            <div className="w-1 h-1 bg-gray-200 rounded-full" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.location.split(',')[0]}</p>
          </div>
        </div>
        
        <h1 className="text-2xl font-black text-gray-900 mb-4 leading-tight">{product.name}</h1>
        
        <div className="flex items-center gap-4 mb-8">
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-900">{product.currency} {product.price}</span>
                <span className="text-sm text-gray-300 font-bold line-through">{product.currency} {product.originalPrice}</span>
            </div>
            <div className="bg-[#e6f2eb] text-[#007d34] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                Save {Math.round((1 - product.price/product.originalPrice)*100)}%
            </div>
        </div>

        {/* Sleek AI Pricing Banner */}
        <div className="bg-gradient-to-r from-[#e6f2eb] to-green-50/50 border border-[#007d34]/10 rounded-3xl p-4 mb-8 flex items-center gap-4 shadow-sm animate-in slide-in-from-bottom-4 duration-500 delay-100">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#007d34] shadow-sm shrink-0 border border-green-50">
            <Zap size={20} className={loadingAI ? "animate-pulse" : ""} fill={loadingAI ? "none" : "currentColor"} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="text-[10px] font-black text-[#007d34] uppercase tracking-widest">AI Market Value</h4>
              {!loadingAI && <span className="text-[8px] font-bold text-white bg-[#007d34] px-1.5 py-0.5 rounded-md">{aiSuggestion?.confidence}% Match</span>}
            </div>
            {loadingAI ? (
              <p className="text-xs font-bold text-gray-500">Analyzing market...</p>
            ) : (
              <p className="text-sm font-bold text-gray-900">Est. {product.currency} {aiSuggestion?.suggestedPrice}</p>
            )}
          </div>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-[24px] p-4 flex items-center gap-3 border border-gray-100">
                <div className="p-2 bg-white rounded-full shadow-sm text-gray-500">
                    <Shield size={16} />
                </div>
                <div>
                    <p className="text-[9px] uppercase font-black text-gray-400 tracking-widest">Condition</p>
                    <p className="text-xs font-black text-gray-900">{product.condition}</p>
                </div>
            </div>
            <div className="bg-gray-50 rounded-[24px] p-4 flex items-center gap-3 border border-gray-100">
                <div className="p-2 bg-white rounded-full shadow-sm text-gray-500">
                    <CheckCircle2 size={16} />
                </div>
                <div>
                    <p className="text-[9px] uppercase font-black text-gray-400 tracking-widest">Ideal For</p>
                    <p className="text-xs font-black text-gray-900">{product.age}</p>
                </div>
            </div>
        </div>

        {/* Sustainability Stats */}
        <div className="flex justify-between items-center bg-white rounded-[28px] border border-gray-100 p-5 mb-8 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-[#007d34]">
                    <Leaf size={18} />
                </div>
                <div>
                    <p className="text-sm font-black text-gray-900">{product.impact.co2Saved}kg</p>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">CO2 Saved</p>
                </div>
            </div>
            <div className="w-px h-8 bg-gray-100" />
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                </div>
                <div>
                    <p className="text-sm font-black text-gray-900">{product.impact.waterSaved}L</p>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Water Saved</p>
                </div>
            </div>
        </div>

        <div className="mb-10">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Item Story</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">{product.description}</p>
        </div>

        {/* Enhanced Seller Section */}
        <div className="mb-10">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">Seller Information</h3>
            <div className="bg-white rounded-[40px] border border-gray-100 p-6 shadow-xl shadow-gray-200/40">
                <div className="flex items-center gap-5 mb-6">
                    <div className="relative shrink-0">
                        <img 
                            src={`https://i.pravatar.cc/150?u=${product.sellerName}`} 
                            className="w-20 h-20 rounded-[32px] object-cover border-4 border-white shadow-lg" 
                        />
                        <div className="absolute -bottom-1 -right-1 bg-[#007d34] p-1.5 rounded-xl border-2 border-white shadow-md">
                            <CheckCircle2 size={14} className="text-white" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-lg font-black text-gray-900">{product.sellerName}</h4>
                            <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-lg border border-green-100/50">
                                <Shield size={10} className="text-[#007d34]" />
                                <span className="text-[8px] font-black text-[#007d34] uppercase tracking-widest">Verified</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star size={14} fill="currentColor" />
                                <span className="text-xs font-black text-gray-900">{product.sellerRating}</span>
                            </div>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">124 Reviews</span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Member since Aug 2021</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={() => console.log("Navigate to hypothetical shop page for", product.sellerName)}
                        className="flex-1 bg-white border-2 border-gray-100 text-gray-900 py-4 rounded-[22px] font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all hover:bg-gray-50 flex items-center justify-center gap-2 shadow-sm"
                    >
                        <Store size={14} strokeWidth={3} />
                        View Shop
                    </button>
                    <button className="flex-1 bg-[#e6f2eb] text-[#007d34] py-4 rounded-[22px] font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-[#d9ede1]">
                        <MessageCircle size={14} strokeWidth={3} />
                        Chat
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-6 pt-4 pb-8 z-50">
        <div className="flex gap-4">
          <button 
            onClick={() => onAddToBag?.(1)}
            className="w-14 h-14 shrink-0 rounded-full border border-gray-200 flex items-center justify-center text-gray-900 active:scale-90 transition-all bg-white shadow-sm hover:bg-gray-50"
          >
            <ShoppingBag size={22} />
          </button>
          <button 
            onClick={onBuyNow}
            className="flex-1 bg-[#007d34] text-white h-14 rounded-full font-black text-sm uppercase tracking-widest shadow-xl shadow-green-900/20 active:scale-[0.98] transition-all flex items-center justify-center"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailScreen;
