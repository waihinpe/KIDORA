
import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, MapPin, ChevronDown, Star, Globe, Loader2, ImageOff, Navigation, Heart, Sparkles } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';
import { Product } from '../types';
import { repairBrokenImage } from '../services/geminiService';

interface ExploreScreenProps {
  onProductClick: (product: Product) => void;
}

const ProductCard = ({ product, onProductClick }: { product: Product, onProductClick: (p: Product) => void }) => {
  const [imgUrl, setImgUrl] = useState(product.images[0]);
  const [isBroken, setIsBroken] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);
  const [repaired, setRepaired] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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
    } else {
      setIsBroken(true);
    }
    setIsRepairing(false);
  };

  return (
    <div 
        onClick={() => onProductClick(product)}
        className="group cursor-pointer flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="aspect-[4/5] rounded-[32px] overflow-hidden bg-gray-50 mb-4 relative shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:translate-y-[-4px]">
        {/* Shimmer Placeholder */}
        {!isLoaded && !isBroken && !isRepairing && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />
        )}

        {isRepairing ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-50 text-[#007d34] gap-3">
            <Loader2 size={24} className="animate-spin" />
            <div className="text-center">
              <span className="text-[8px] font-black uppercase tracking-widest block">AI Sourcing</span>
              <span className="text-[6px] font-bold uppercase tracking-widest opacity-60">Sourcing HD Assets</span>
            </div>
          </div>
        ) : isBroken ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-300 gap-2">
            <ImageOff size={32} strokeWidth={1.5} />
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Image Unavailable</span>
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
              className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ${repaired ? 'saturate-125 brightness-105' : ''} ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
            />
            {repaired && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-blue-500 text-white text-[7px] font-black px-2 py-1 rounded-lg shadow-lg border border-white/20 animate-in zoom-in-75">
                <Sparkles size={10} fill="currentColor" />
                <span>AI REPAIRED HD</span>
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
      </div>
      <div className="space-y-0.5 px-1">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.brand}</p>
        <h3 className="font-bold text-sm line-clamp-1 text-gray-900 leading-tight">{product.name}</h3>
        <div className="flex items-center gap-2 pt-1">
            <span className="font-black text-lg text-[#007d34]">{product.currency} {product.price}</span>
            <span className="text-[10px] text-gray-300 line-through font-bold">{product.currency} {product.originalPrice}</span>
        </div>
      </div>
    </div>
  );
};

const ExploreScreen: React.FC<ExploreScreenProps> = ({ onProductClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All SEA');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [locationSearch] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const countries = [
    { name: 'Singapore', icon: '🇸🇬', cities: ['All Singapore', 'Orchard', 'Jurong', 'Tampines', 'Sentosa'] },
    { name: 'Thailand', icon: '🇹🇭', cities: ['All Thailand', 'Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya'] },
    { name: 'Indonesia', icon: '🇮🇩', cities: ['All Indonesia', 'Jakarta', 'Bali', 'Surabaya', 'Bandung'] },
    { name: 'Malaysia', icon: '🇲🇾', cities: ['All Malaysia', 'Kuala Lumpur', 'Penang', 'Johor Bahru', 'Malacca'] },
    { name: 'Vietnam', icon: '🇻🇳', cities: ['All Vietnam', 'Ho Chi Minh', 'Hanoi', 'Da Nang'] },
    { name: 'Philippines', icon: '🇵🇭', cities: ['All Philippines', 'Manila', 'Cebu', 'Davao'] },
  ];

  const conditions = [
    { label: 'All', value: 'All' },
    { label: 'Premium', value: 'Like New', icon: <Star size={14} fill="currentColor" /> },
    { label: 'Good', value: 'Good' },
    { label: 'Fair', value: 'Fair' },
  ];

  const useCurrentLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(() => {
        setTimeout(() => {
          setSelectedLocation('Orchard, Singapore');
          setIsLocating(false);
          setIsLocationModalOpen(false);
        }, 1200);
      }, () => {
        setIsLocating(false);
        alert("Could not access location.");
      });
    } else {
      setIsLocating(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCondition = selectedCondition === 'All' || product.condition === selectedCondition;
      let matchesLocation = true;
      if (selectedLocation !== 'All SEA') {
        const normalizedLocation = selectedLocation.replace('All ', '').toLowerCase();
        matchesLocation = product.location.toLowerCase().includes(normalizedLocation);
      }
      return matchesSearch && matchesCondition && matchesLocation;
    });
  }, [searchQuery, selectedCondition, selectedLocation]);

  const filteredCountryList = countries.filter(c => 
    c.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
    c.cities.some(city => city.toLowerCase().includes(locationSearch.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-full">
      {/* Search Header */}
      <div className="sticky top-0 bg-white z-40 pt-8 pb-4 px-6 border-b border-gray-50 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-2 text-[#007d34] text-xs font-black bg-[#e6f2eb] px-4 py-3 rounded-2xl border border-green-100/50 shadow-sm active:scale-95 transition-all"
          >
            <MapPin size={14} fill="currentColor" fillOpacity={0.2} />
            <span className="uppercase tracking-widest">{selectedLocation}</span>
            <ChevronDown size={14} />
          </button>
          <button className="p-2.5 rounded-2xl bg-white border border-gray-100 text-gray-500 shadow-sm active:scale-95 transition-all">
            <SlidersHorizontal size={18} />
          </button>
        </div>

        <div className="bg-gray-50 rounded-2xl flex items-center px-4 py-3.5 border border-gray-100 focus-within:border-[#007d34] focus-within:bg-white transition-all shadow-sm mb-5">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search brands, items..." 
            className="bg-transparent border-none focus:ring-0 ml-2 text-sm w-full outline-none font-semibold text-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
          {conditions.map((condition) => (
            <button 
              key={condition.value}
              onClick={() => setSelectedCondition(condition.value)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${selectedCondition === condition.value ? 'bg-[#007d34] text-white border-[#007d34]' : 'bg-white text-gray-400 border-gray-100'}`}
            >
              {condition.icon}
              {condition.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="p-6">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onProductClick={onProductClick} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-400">
            <Search size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-black uppercase tracking-widest text-[10px]">No results found</p>
          </div>
        )}
      </div>

      {/* Modals (Location) */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsLocationModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-500 flex flex-col max-h-[85vh] overflow-hidden">
            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-6 shrink-0" />
            <h2 className="text-2xl font-black text-gray-900 mb-6">Location</h2>
            <button 
              onClick={useCurrentLocation}
              className="w-full flex items-center justify-between bg-[#e6f2eb] p-5 rounded-[24px] mb-6 border border-[#007d34]/20"
            >
              <div className="flex items-center gap-4">
                <Navigation size={20} className="text-[#007d34]" />
                <span className="text-sm font-black text-[#007d34] uppercase tracking-wider">{isLocating ? 'Locating...' : 'Use Current Location'}</span>
              </div>
            </button>
            <div className="flex-1 overflow-y-auto hide-scrollbar space-y-6">
               <button 
                  onClick={() => { setSelectedLocation('All SEA'); setIsLocationModalOpen(false); }}
                  className="w-full text-left p-4 rounded-2xl bg-gray-50 text-xs font-black uppercase tracking-widest"
               >
                 🌏 All Southeast Asia
               </button>
               {filteredCountryList.map(c => (
                 <div key={c.name} className="space-y-2">
                   <p className="text-[10px] font-black text-gray-400 uppercase ml-2">{c.name}</p>
                   <div className="grid grid-cols-2 gap-2">
                     {c.cities.map(city => (
                       <button 
                        key={city}
                        onClick={() => { setSelectedLocation(city); setIsLocationModalOpen(false); }}
                        className="p-3 border border-gray-100 rounded-xl text-[10px] font-black uppercase text-gray-600 hover:bg-gray-50"
                       >
                         {city}
                       </button>
                     ))}
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreScreen;
