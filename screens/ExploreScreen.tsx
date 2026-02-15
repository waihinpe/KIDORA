
import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, MapPin, ChevronDown, Check, Star, X, Map as MapIcon, Globe, Info, Eye, ShoppingCart, ArrowRight, Wand2, Sparkles, Loader2, Zap, ImageOff, Navigation, ChevronRight } from 'lucide-react';
import { MOCK_PRODUCTS, PRIMARY_COLOR } from '../constants';
import { Product } from '../types';
import { enhanceProductPhoto } from '../services/geminiService';

interface ExploreScreenProps {
  onProductClick: (product: Product) => void;
}

const ExploreScreen: React.FC<ExploreScreenProps> = ({ onProductClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All SEA');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [locationSearch, setLocationSearch] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  
  // States for enhanced image tracking and loading
  const [enhancedImages, setEnhancedImages] = useState<Record<string, string>>({});
  const [enhancingIds, setEnhancingIds] = useState<Set<string>>(new Set());
  const [imageStatus, setImageStatus] = useState<Record<string, 'loading' | 'loaded' | 'error'>>({});

  const countries = [
    { name: 'Singapore', icon: '🇸🇬', cities: ['All Singapore', 'Orchard', 'Jurong', 'Tampines', 'Sentosa'] },
    { name: 'Thailand', icon: '🇹🇭', cities: ['All Thailand', 'Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya'] },
    { name: 'Indonesia', icon: '🇮🇩', cities: ['All Indonesia', 'Jakarta', 'Bali', 'Surabaya', 'Bandung'] },
    { name: 'Malaysia', icon: '🇲🇾', cities: ['All Malaysia', 'Kuala Lumpur', 'Penang', 'Johor Bahru', 'Malacca'] },
    { name: 'Vietnam', icon: '🇻🇳', cities: ['All Vietnam', 'Ho Chi Minh', 'Hanoi', 'Da Nang'] },
    { name: 'Philippines', icon: '🇵🇭', cities: ['All Philippines', 'Manila', 'Cebu', 'Davao'] },
  ];

  const categories = ['All', 'Strollers', 'Toys', 'Clothing', 'Feeding', 'Nursery'];

  const conditions = [
    { label: 'All', value: 'All', desc: 'Show all items' },
    { label: 'Premium', value: 'Like New', desc: 'Looks and feels brand new', icon: <Star size={14} fill="currentColor" /> },
    { label: 'Good', value: 'Good', desc: 'Slightly used, well maintained' },
    { label: 'Fair', value: 'Fair', desc: 'Visible wear but fully functional' },
  ];

  const handleImageLoad = (id: string) => {
    setImageStatus(prev => ({ ...prev, [id]: 'loaded' }));
  };

  const handleImageError = (id: string) => {
    setImageStatus(prev => ({ ...prev, [id]: 'error' }));
  };

  const useCurrentLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Mocking the resolution of lat/lng to a city name for the prototype experience
        setTimeout(() => {
          setSelectedLocation('Orchard, Singapore');
          setIsLocating(false);
          setIsLocationModalOpen(false);
        }, 1200);
      }, (error) => {
        console.error("Geolocation error:", error);
        setIsLocating(false);
        alert("Could not access location. Please select manually.");
      });
    } else {
      setIsLocating(false);
      alert("Geolocation is not supported by your browser.");
    }
  };

  const blobToBase64 = (url: string): Promise<{ data: string, mimeType: string }> => {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(res => res.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve({ data: base64String, mimeType: blob.type });
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(reject);
    });
  };

  const handleAIDetailEnhance = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (enhancingIds.has(product.id) || enhancedImages[product.id]) return;

    setEnhancingIds(prev => new Set(prev).add(product.id));
    try {
      const { data, mimeType } = await blobToBase64(product.images[0]);
      const enhancedUrl = await enhanceProductPhoto(data, mimeType);
      setEnhancedImages(prev => ({ ...prev, [product.id]: enhancedUrl }));
    } catch (err) {
      console.error("AI Explore Enhancement failed", err);
    } finally {
      setEnhancingIds(prev => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
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
      {/* Search Bar & Location Trigger */}
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
          
          <button 
            onClick={() => setIsFilterModalOpen(true)}
            className={`p-2.5 rounded-2xl border transition-all active:scale-95 shadow-sm ${selectedCondition !== 'All' || selectedCategory !== 'All' ? 'bg-[#007d34] text-white border-[#007d34]' : 'bg-white text-gray-500 border-gray-100'}`}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>

        <div className="flex gap-3 mb-5">
          <div className="flex-1 bg-gray-50 rounded-2xl flex items-center px-4 py-3.5 border border-gray-100 focus-within:border-[#007d34] focus-within:bg-white transition-all shadow-sm">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search items, brands..." 
              className="bg-transparent border-none focus:ring-0 ml-2 text-sm w-full outline-none font-semibold text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-gray-300 hover:text-gray-500">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Condition Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] shrink-0 mr-1">Condition</span>
          {conditions.map((condition) => (
            <button 
              key={condition.value}
              onClick={() => setSelectedCondition(condition.value)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${selectedCondition === condition.value ? 'bg-[#007d34] text-white border-[#007d34] shadow-md shadow-green-900/10' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}
            >
              {condition.icon}
              {condition.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
            <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Results</p>
                <h2 className="text-sm font-black text-gray-900">
                  {filteredProducts.length} Items found
                </h2>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#007d34] bg-green-50 px-3 py-1.5 rounded-lg border border-green-100/50">
                <span>Newest</span>
                <ChevronDown size={12} strokeWidth={3} />
            </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10">
            {filteredProducts.map((product) => {
              const displayImg = enhancedImages[product.id] || product.images[0];
              const status = imageStatus[product.id] || 'loading';

              return (
                <div 
                    key={product.id} 
                    className="cursor-pointer group flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  <div 
                    className="aspect-[4/5] rounded-[32px] overflow-hidden bg-gray-100 mb-4 relative shadow-sm border border-gray-100/50"
                    onClick={() => onProductClick(product)}
                  >
                    {status === 'loading' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />
                    )}

                    {status === 'error' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 gap-2 bg-gray-50">
                        <ImageOff size={24} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Image Failed</span>
                      </div>
                    )}

                    <img 
                      src={displayImg} 
                      alt={product.name} 
                      loading="lazy"
                      onLoad={() => handleImageLoad(product.id)}
                      onError={() => handleImageError(product.id)}
                      className={`w-full h-full object-cover transition-all duration-700 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'} ${enhancingIds.has(product.id) ? 'blur-sm scale-110 opacity-70' : 'group-hover:scale-105'}`} 
                    />
                    
                    <button 
                      onClick={(e) => handleAIDetailEnhance(product, e)}
                      disabled={enhancingIds.has(product.id)}
                      className={`absolute bottom-4 right-4 p-2 rounded-xl shadow-lg border border-white/20 transition-all z-20 ${enhancedImages[product.id] ? 'bg-[#007d34] text-white' : 'bg-white/90 backdrop-blur text-[#007d34] hover:bg-white active:scale-90'}`}
                    >
                      {enhancingIds.has(product.id) ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : enhancedImages[product.id] ? (
                        <Sparkles size={14} />
                      ) : (
                        <Wand2 size={14} strokeWidth={3} />
                      )}
                    </button>

                    {enhancedImages[product.id] && (
                      <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#007d34]/90 backdrop-blur text-white text-[7px] font-black px-2 py-1 rounded-lg shadow-lg border border-white/10 animate-in zoom-in-75">
                          <Zap size={8} fill="white" />
                          <span>AI ENHANCED VIEW</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuickViewProduct(product);
                        }}
                        className="bg-white/90 backdrop-blur-md text-[#007d34] px-4 py-2 rounded-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-xl border border-white pointer-events-auto transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                      >
                        <Eye size={14} strokeWidth={3} />
                        Quick View
                      </button>
                    </div>

                    <div className={`absolute top-4 right-4 text-[8px] font-black px-2.5 py-1.5 rounded-xl shadow-sm uppercase tracking-widest ${product.condition === 'Like New' ? 'bg-[#007d34] text-white' : 'bg-white/95 text-gray-700'}`}>
                        {product.condition === 'Like New' ? 'Premium' : product.condition}
                    </div>
                  </div>
                  <div className="space-y-1 px-1" onClick={() => onProductClick(product)}>
                    <div className="flex justify-between items-center">
                        <p className="text-[10px] font-black text-[#007d34] uppercase tracking-widest">{product.brand}</p>
                        <div className="flex items-center gap-0.5">
                            <Check size={10} className="text-blue-500" strokeWidth={3} />
                            <span className="text-[8px] font-bold text-gray-400 uppercase">Verified</span>
                        </div>
                    </div>
                    <h3 className="font-bold text-sm line-clamp-1 text-gray-900 leading-snug">{product.name}</h3>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="font-black text-lg text-gray-900">{product.currency} {product.price}</span>
                      <span className="text-[10px] text-gray-300 line-through font-bold">{product.currency} {product.originalPrice}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-[40px] flex items-center justify-center mx-auto border border-gray-100">
               <Search size={32} className="text-gray-200" />
            </div>
            <div>
                <h3 className="text-lg font-black text-gray-900">No items found</h3>
                <p className="text-sm text-gray-400 font-medium px-10">Try adjusting your filters or searching for something else.</p>
            </div>
            <button 
                onClick={() => {
                    setSearchQuery('');
                    setSelectedCondition('All');
                    setSelectedLocation('All SEA');
                }}
                className="text-[#007d34] font-black text-xs uppercase tracking-widest py-2 px-6 border border-[#007d34] rounded-2xl hover:bg-green-50 transition-colors"
            >
                Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsLocationModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-500 flex flex-col max-h-[85vh]">
            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-6 shrink-0" />
            
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-black text-gray-900">Select Region</h2>
              <button onClick={() => setIsLocationModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-6 font-medium">Browse items nearby or across SEA.</p>

            <button 
              onClick={useCurrentLocation}
              disabled={isLocating}
              className="w-full flex items-center justify-between bg-[#e6f2eb] p-5 rounded-[24px] mb-6 border border-[#007d34]/20 active:scale-95 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl text-[#007d34]">
                  {isLocating ? <Loader2 size={20} className="animate-spin" /> : <Navigation size={20} />}
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-[#007d34] uppercase tracking-wider">Use Current Location</p>
                  <p className="text-[10px] text-[#007d34]/60 font-bold uppercase tracking-widest mt-0.5">Find items nearby</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-[#007d34]/40" />
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-4 flex items-center text-gray-400 pointer-events-none">
                <Search size={18} />
              </div>
              <input 
                type="text"
                placeholder="Search country or city..."
                className="w-full bg-gray-50 border border-gray-100 rounded-[24px] pl-11 pr-4 py-4 text-sm font-semibold focus:bg-white focus:border-[#007d34] outline-none"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
              />
            </div>

            <div className="overflow-y-auto hide-scrollbar space-y-6 pb-6">
              <button 
                onClick={() => {
                  setSelectedLocation('All SEA');
                  setIsLocationModalOpen(false);
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-[24px] border transition-all ${selectedLocation === 'All SEA' ? 'bg-[#007d34] border-[#007d34] text-white' : 'bg-gray-50 border-gray-100 text-gray-600'}`}
              >
                <div className={`p-2 rounded-xl ${selectedLocation === 'All SEA' ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                  <Globe size={18} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">All Southeast Asia</span>
              </button>

              {filteredCountryList.map((country) => (
                <div key={country.name} className="space-y-3">
                  <div className="flex items-center gap-2 px-2">
                    <span className="text-lg">{country.icon}</span>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{country.name}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {country.cities.map(city => (
                      <button 
                        key={city}
                        onClick={() => {
                          setSelectedLocation(city);
                          setIsLocationModalOpen(false);
                        }}
                        className={`text-left p-4 rounded-[24px] text-[11px] font-black uppercase tracking-wider transition-all border ${selectedLocation === city ? 'bg-[#007d34] border-[#007d34] text-white' : 'bg-white text-gray-600 border-gray-100'}`}
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

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsFilterModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-500 max-h-[85vh] flex flex-col">
            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-6" />
            
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-gray-900">Filters</h2>
              <button 
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedCondition('All');
                }}
                className="text-[10px] font-black text-[#007d34] uppercase tracking-widest"
              >
                Reset All
              </button>
            </div>

            <div className="overflow-y-auto hide-scrollbar space-y-8 pb-32">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-5 py-3 rounded-2xl text-xs font-bold border transition-all ${selectedCategory === cat ? 'bg-gray-900 text-white border-gray-900 shadow-lg' : 'bg-white text-gray-500 border-gray-100'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price Range</label>
                <div className="px-2 space-y-6">
                  <div className="h-1.5 bg-gray-100 rounded-full relative">
                    <div className="absolute left-[10%] right-[30%] h-full bg-[#007d34] rounded-full" />
                    <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-[#007d34] rounded-full shadow-lg" />
                    <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-[#007d34] rounded-full shadow-lg" />
                  </div>
                  <div className="flex justify-between">
                    <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Min</span>
                      <span className="text-xs font-black">SGD 0</span>
                    </div>
                    <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Max</span>
                      <span className="text-xs font-black">SGD 500+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              <button 
                onClick={() => setIsFilterModalOpen(false)}
                className="w-full bg-[#007d34] text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-green-900/20 active:scale-95 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setQuickViewProduct(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-[48px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
            <button 
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-6 right-6 z-10 p-2.5 bg-white/90 backdrop-blur rounded-2xl border border-gray-100 text-gray-400"
            >
              <X size={20} />
            </button>
            <div className="aspect-square bg-gray-50">
              <img src={enhancedImages[quickViewProduct.id] || quickViewProduct.images[0]} className="w-full h-full object-cover" alt={quickViewProduct.name} />
            </div>
            <div className="p-10 space-y-6">
              <div className="space-y-1">
                <p className="text-[11px] font-black text-[#007d34] uppercase tracking-[0.2em]">{quickViewProduct.brand}</p>
                <h3 className="text-2xl font-black text-gray-900 leading-tight">{quickViewProduct.name}</h3>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-gray-900">{quickViewProduct.currency} {quickViewProduct.price}</span>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => {
                    onProductClick(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="flex-1 bg-white text-gray-900 border-2 border-gray-100 py-4.5 rounded-[24px] font-black uppercase tracking-widest text-[10px]"
                >
                  Details
                </button>
                <button 
                  onClick={() => setQuickViewProduct(null)}
                  className="flex-[2] bg-[#007d34] text-white py-4.5 rounded-[24px] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-green-900/20"
                >
                  Add to Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreScreen;
